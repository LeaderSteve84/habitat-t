#!/usr/bin/env python3
"""All routes for tenant CRUD operations"""
from flask import Blueprint, request, jsonify, url_for, current_app
from flask_jwt_extended import create_access_token, \
    jwt_required, set_access_cookies, unset_jwt_cookies, get_jwt
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
companyCollection = current_app.companyCollection


# function to authenticate
def authenticate(email, password, role):
    """to authenticate the user"""
    if role == 'admin':
        user = adminsCollection.find_one({"email": email})
    elif role == 'company':
        user = companyCollection.find_one({"email": email})
    elif role == 'tenant':
        user = tenantsCollection.find_one({"email": email})
    else:
        return None

    if user and check_password_hash(user["password"], password):
        return user
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
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()

    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    remember_me = data.get('remember_me', False)

    if not email or not password or not role:
        return jsonify({"error": "Missing email, password, or role"}), 400

    user = authenticate(email, password, role)

    if not user:
        return jsonify({"error": "Invalid email, password, or role"}), 401

    if user['role'] == 'tenant' and not user.get('active', False):
        return jsonify({"error": "Account is not active, contact admin"}), 403

    expires = datetime.timedelta(
        days=7
    ) if remember_me else datetime.timedelta(hours=1)

    access_token = create_access_token(
        identity={"email": email, "role": role, "id": str(user["_id"])},
        expires_delta=expires
    )
    response = jsonify(msg="Login successful", id=str(user["_id"]))
    set_access_cookies(response, access_token)

    return response


@auth_bp.route('/api/forgot_password', methods=['POST', 'OPTIONS'])
def forgot_password():
    if not request.is_json:
        return jsonify({"error": "Missing JSON in request"}), 400

    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Missing email"}), 400

    user = tenantsCollection.find_one(
        {"email": email}
    ) or adminsCollection.find_one(
        {"email": email}
    ) or companyCollection.find_one(
        {"email": email}
    )

    if not user:
        return jsonify({"error": "Email not found or wrong email"}), 404

    token = generate_reset_token(email)
    reset_url = f"{current_app.config['FRONTEND_URL']}/reset_password/{token}"

    msg = Message(
            subject="Password Reset Request",
            recipients=[email],
            body=(
                f'Reset your password using the following link:\n'
                f'{reset_url}\n'
                'Please ignore if you did not initiate this request'
                )
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
        return jsonify(
            {"error": "Missing new password or confirm password"}
        ), 400

    if new_password != confirm_password:
        return jsonify({"error": "Passwords do not match"}), 400

    email = verify_reset_token(token)
    if not email:
        return jsonify({"error": "Invalid or expired token"}), 400

    user = tenantsCollection.find_one(
        {"email": email}
    ) or adminsCollection.find_one(
        {"email": email}
    ) or companyCollection.find_one(
        {"email": email}
    )

    if not user:
        return jsonify({"error": "User not found"}), 404
    new_hashed_password = generate_password_hash(new_password)
    user_role = user.get('role')  # check user role

    logger.debug(f"Resseting password for user with role: {user_role}")

    if user_role not in ['tenant', 'admin', 'company']:
        return jsonify({"error": "Invalid user role"}), 400

    collections = {
        "tenant": tenantsCollection,
        "admin": adminsCollection
    }

    collection = collections.get(
        user.get('role'),
        companyCollection
    )

    result = collection.update_one(
        {"email": email},
        {"$set": {"password": new_hashed_password}}
    )

    if result.modified_count == 1 and user.get('role') == 'tenant':
        logger.debug("Password updated successfully")
        return jsonify(
            {
                "msg": "Password has been reset",
                "email": email,
                "role": user.get('role'),
                "tenantId": str(user.get('_id')),
                "address": user.get(
                    'tenancy_info', 'No, in estate'
                ).get(
                    'address', 'No, in estate'
                )
            }), 200
    elif result.modified_count == 1 and user.get('role') == 'admin':
        return jsonify({"msg": "Password has been reset", "role": user.get('role')}), 200

    elif result.modified_count == 1 and user.get('role') == 'company':
        return jsonify({"msg": "Password has been reset", "role": user.get('role')}), 200

    else:
        logger.debug("Password update failed")
        return jsonify({"error": "Password reset failed, try again"}), 400


@auth_bp.route('/api/logout', methods=['POST'])
# @jwt_required()
def logout():
    jti = get_jwt()['jti']
    revoked_tokens.add(jti)
    response = jsonify({"msg": "Successfully logged out"})
    unset_jwt_cookies(response)
    return response
