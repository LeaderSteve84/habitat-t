#!/usr/bin/env python3
"""All routes for admin CRUD operations"""
from flask import Blueprint, request, jsonify, url_for, current_app
from bson.objectid import ObjectId
# from app import mail - use current_app instead
from app.models.company import Company
from pymongo.errors import PyMongoError
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message  # Mail - no need to import Mail
import uuid

company_bp = Blueprint('company', __name__)
logger = current_app.logger
mail = current_app.mail
companyCollection = current_app.companyCollection

# In-memory store for reset tokens
reset_tokens = {}

def send_email(subject, recipients, body):
    msg = Message(subject=subject, recipients=recipients, body=body)
    try:
        mail.send(msg)
        logger.debug(f"Email sent to {recipients}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipients}: {e}")

# Create a company Account
@company_bp.route('/api/company', methods=['POST', 'OPTIONS'])
def create_company():
    """create company as instance of company.
       post company to mongodb database.
       Return: "msg": "company created successfully"
       and success status
    """
    data = request.json

    if data.get('password') != data.get('confirmPassword'):
        return jsonify({"error": "Passwords do not matched"}), 400

    try:
        company = Company(
            name=data['fullname'],
            email=data['email'],
            phone=data['phone'],
            password=generate_password_hash(data['password']),
            company_name=data['companyName'],
            position=data['position'],
            business_location=data['businessLocation'],
            role=data['role']
        )
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        insert_result = companyCollection.insert_one(company.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    company_id = insert_result.inserted_id

    # Send notification email
    email = data['email']
    email_body = (
        f"Dear {data['fullname']},\n"
        f"Your Company account has been created successfully.\n"
        f"We look forward to your feedbacks.\n"
        f"Kindly use our feedback channel for feedbacks.\n"
        "Thank you."
        )
    send_email("Company Account Created", [email], email_body)

    return jsonify({"msg": "Company account created successfully", "companyId": str(company_id)}), 201

# Get all companies
@company_bp.route('/api/companies', methods=['GET', 'OPTIONS'])
def get_all_companies():
    """find all companies fron mongodb and
    return list of all the admins
    """
    try:
        companies = companyCollection.find({"active": True})
        company_list = [{
            "companyId": str(company['_id']),
            "dateCreated": company['date_created'],
            "name": company['name'],
            "email": company['email'],
            "phone": company['phone'],
            "companyName": company['company_name'],
            "position": company['position'],
            "businessLocation": company['business_location'],
            "role": company['role'],
            "active": company['active']
        } for company in companies]
        return jsonify(company_list), 200
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500

# Get a Specific company Details
@company_bp.route('/api/companies/<company_id>', methods=['GET', 'OPTIONS'])
def get_company(company_id):
    try:
        company = companyCollection.find_one(
            {"_id": ObjectId(company_id), "active": True}
        )
        if company:
            return jsonify({
                "companyId": str(company['_id']),
                "dateCreated": company['date_created'],
                "name": company['name'],
                "email": company['email'],
                "phone": company['phone'],
                "companyName": company['company_name'],
                "position": company['position'],
                "businessLocation": company['business_location'],
                "role": company['role'],
                "active": company['active']
            }), 200
        else:
            return jsonify({"error": "comapny not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid company ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Update Specific company Details
@company_bp.route('/api/companies/<company_id>', methods=['PUT', 'OPTIONS'])
def update_company(company_id):
    """update a specific company with a company_id.
    Args:
        company_id  (str): company unique id
    """
    data = request.json
    try:
        update_data = {
            "name": data['name'],
            "email": data['email'],
            "phone": company['phone'],
            "companyName": company['company_name'],
            "position": company['position'],
            "businessLocation": company['business_location']
        }
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        result = companyCollection.update_one(
            {"_id": ObjectId(company_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "company not found"}), 404
        return jsonify({"msg": "company updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid company ID format"}), 400
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500

# Deactivate/Delete company Account
@company_bp.route('/api/companies/<company_id>', methods=['DELETE', 'OPTIONS'])
# @jwt_required()
def delete_company(company_id):
    """update a specific company with a company_id.
    setting the active attribute to False
    Args:
        company_id  (str): company unique id
    """
    try:
        result = companyCollection.update_one(
            {"_id": ObjectId(company_id)}, {"$set": {"active": False}}
        )
        if result.matched_count:
            return jsonify({"msg": "company deactivated"}), 204
        return jsonify({"error": "company not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid company ID format"}), 400
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500

"""
# Forgot Password
@company_bp.route('/api/companies/forgot_password', methods=['POST', 'OPTIONS'])
def forgot_password():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    data = request.get_json()
    email = data.get('email')
    
    if not email:
        return jsonify({"msg": "Missing email"}), 400
    
    user = companyCollection.find_one({"email": email})
    if not user:
        return jsonify({"msg": "Email not found"}), 404
    
    reset_token = str(uuid.uuid4())
    reset_tokens[reset_token] = email
    reset_url = url_for('admin.reset_password', token=reset_token, _external=True)
    
    msg = Message(subject="Password Reset Request",
                  recipients=[email],
                  body=f'Reset your password using the following link: {reset_url}')
    try:
        mail.send(msg)
        return jsonify({"msg": "Password Reset email sent"}), 200
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return jsonify({"msg": f"Failed to send email: {str(e)}"}), 500

# Reset Password
@company_bp.route('/api/companies/reset_password/<token>', methods=['POST', 'OPTIONS'])
def reset_password(token):
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400
    
    data = request.get_json()
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not new_password or not confirm_password:
        return jsonify({"msg": "Missing new password or confirmation"}), 400
    
    if new_password != confirm_password:
        return jsonify({"msg": "Passwords do not match"}), 400
    
    email = reset_tokens.get(token)
    if not email:
        return jsonify({"msg": "Invalid or expired token"}), 400
    
    user = companiesCollection.find_one({"email": email})
    if not user:
        return jsonify({"msg": "User not found"}), 404
    
    new_hashed_password = generate_password_hash(new_password)
    companyCollection.update_one({"email": email}, {"$set": {"password": new_hashed_password}})
    
    del reset_tokens[token]  # Invalidate the token after use
    
    return jsonify({"msg": "Password has been reset"}), 200
"""
