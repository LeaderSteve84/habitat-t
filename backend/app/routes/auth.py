#!/usr/bin/env python3
"""All routes for tenant CRUD operations"""
from flask import Blueprint, request, jsonify, url_for, current_app
from flask_jwt_extended import create_access_token, jwt_required, set_access_cookies, unset_jwt_cookies, get_jwt
from flask_mail import Message
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
import uuid
from itsdangerous import URLSafeTimedSerializer
from app.routes.tenant import generate_reset_token

auth_bp = Blueprint('auth_bp', __name__)
revoked_tokens = set()  # Move this to a shared location if needed

logger = current_app.logger
mail = current_app.mail
tenantsCollection = current_app.tenantsCollection
adminsCollection = current_app.adminsCollection

# function to authenticate
def authenticate(email, password, role):
    # email = email.strip().lower()
    # logger.debug(f"Authenticating user with email: {email} and role: {role}")
    
    if role == 'admin':
        user = adminsCollection.find_one({"contact_details.email": email})
    elif role == 'tenant':
        user = tenantsCollection.find_one({"contact_details.email": email})
    else:
        # logger.debug("Invalid role provided")
        return None
    
    if user and check_password_hash(user["password"], password):
        # logger.debug("Password match!")
        return user
    # logger.debug("Authentication failed!")
    return None

# function to verify reset token
def verify_reset_token(token, expiration=259200):
    """to verify reset token"""
    s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = s.loads(token, salt="password-reset-salt", max_age=expiration)
    except Exception as e:
        return None
    return email

@auth_bp.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if not request.is_json:
        # logger.debug("Request missing JSON")
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()

    email = data.get('email').strip().lower() if data.get('email') else None
    password = data.get('password')
    role = data.get('role')
    remember_me = data.get('remember_me', False)
    
    if not email or not password or not role:
        # logger.debug("Missing email, password, or role")
        return jsonify({"error": "Missing email, password, or role"}), 400
    
    user = authenticate(email, password, role)
    
    if not user:
        # logger.debug("Authentication failed")
        return jsonify({"msg": "Invalid email, password, or role"}), 401
    
    if user['role'] == 'tenant' and not user.get('active', False):
        # logger.debug("Tenant account is not active")
        return jsonify({"msg": "Account is not active"}), 403
    
    expires = datetime.timedelta(days=7) if remember_me else datetime.timedelta(hours=1)
    access_token = create_access_token(identity={"email": email, "role": role}, expires_delta=expires)
    response = jsonify(msg="You have successfully logged in", access_token=access_token)
    set_access_cookies(response, access_token)

    logger.debug("User authenticated successfully")
    return response


@auth_bp.route('/api/forgot_password', methods=['POST', 'OPTIONS'])
def forgot_password():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Missing email"}), 400
    
    user = tenantsCollection.find_one({"contact_details.email": email}) or adminsCollection.find_one({"contact_details.email": email})
    if not user:
        return jsonify({"msg": "Email not found or wrong email"}), 404
    
    token = generate_reset_token(email)
    reset_url = f"{current_app.config['FRONTEND_URL']}/reset_password/{token}"

    msg = Message(
            subject="Password Reset Request",
            recipients=[email],
            body=f'Reset your password using the following link: \
                    {reset_url} Please ignore if you did not \
                    initiate this request'
            )

    try:
        mail.send(msg)
        return jsonify({"msg": "Password Reset email sent"}), 200
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return jsonify({"error": f"Failed to send email: {str(e)}"}), 500

@auth_bp.route('/api/reset_password/<token>', methods=['POST', 'OPTIONS'])
def reset_password(token):
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    new_password = data.get('newPassword')
    confirm_password = data.get('confirmPassword')

    if not new_password or not confirm_password:
        return jsonify({"error": "Missing new password or confirm password"}), 400

    if new_password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    email = verify_reset_token(token)
    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = tenantsCollection.find_one({"contact_details.email": email}) or adminsCollection.find_one({"contact_details.email": email})
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    new_hashed_password = generate_password_hash(new_password)
    user_role = user.get('role')  # check user role

    logger.debug(f"Resseting password for user with role: {user_role}")

    if user_role not in ['tenant', 'admin']:
        return jsonify({"error": "Invalid user role"}), 400

    collection = tenantsCollection if user.get('role') == 'tenant' else adminsCollection
    result = collection.update_one(
            {"contact_details.email": email},
            {"$set": {"password": new_hashed_password}}
            )

    if result.modified_count == 1:
        return jsonify({"msg": "Password has been reset"}), 200
        logger.debug("Password updated successfully")
    else:
        return jsonify({"error": "Password reset failed, try again"}), 400
        logger.debug("Password update failed")


@auth_bp.route('/api/logout', methods=['POST'])
# @jwt_required()
def logout():
    jti = get_jwt()['jti']
    revoked_tokens.add(jti)
    response = jsonify({"msg": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response
