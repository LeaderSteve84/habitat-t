#!/usr/bin/env python3
"""All routes for admin CRUD operations"""
from flask import Blueprint, request, jsonify, url_for, current_app
from bson.objectid import ObjectId
# from app import mail - use current_app instead
from app.models.cluster import Cluster
from pymongo.errors import PyMongoError
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message  # Mail - no need to import Mail
import uuid

cluster_bp = Blueprint('cluster', __name__)
logger = current_app.logger
mail = current_app.mail
clusterCollection = current_app.clusterCollection

# In-memory store for reset tokens
reset_tokens = {}

def send_email(subject, recipients, body):
    msg = Message(subject=subject, recipients=recipients, body=body)
    try:
        mail.send(msg)
        logger.debug(f"Email sent to {recipients}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipients}: {e}")

# Create a properties cluster
@cluster_bp.route('/api/cluster', methods=['POST', 'OPTIONS'])
def create_cluster():
    """create cluster as instance of Cluster.
       post cluster to mongodb database.
       Return: "msg": "company created successfully"
       and success status
    """
    data = request.json

    try:
        cluster = Cluster(
            cluster_name=data['clusterName'],
            cluster_location=data['clusterLocation'],
            number_of_properties=data['numberOfProperties'],
            number_of_units=data['numberOfUnits'],
            company_id=ObjectId(data['companyId'])
        )
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        insert_result = clusterCollection.insert_one(cluster.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    cluster_id = insert_result.inserted_id

    return jsonify({"msg": "Cluster created successfully", "clusterId": str(cluster_id)}), 201

# Get all clusters
@cluster_bp.route('/api/clusters/<company_id>', methods=['GET', 'OPTIONS'])
def get_all_clusters(company_id):
    """find all cluster fron mongodb and
    return list of all the clusters
    """
    try:
        clusters = clusterCollection.find({"company_id": ObjectId(company_id), "active": True})
        cluster_list = [{
            "clusterId": str(cluster['_id']),
            "dateCreated": cluster['date_created'],
            "dateUpdated": cluster['date_updated'],
            "companyId": str(cluster['company_id']),
            "clusterName": cluster['cluster_name'],
            "clusterLocation": cluster['cluster_location'],
            "numberOfProperties": cluster['number_of_properties'],
            "numberOfUnits": cluster.get('number_of_units', ""),
            "active": cluster['active']
        } for cluster in clusters]
        return jsonify(cluster_list), 200
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
'''
# Get a Specific cluster Details
@cluster_bp.route('/api/clusters/<company_id>/<cluster_id>', methods=['GET', 'OPTIONS'])
def get_company(company_id, cluster_id):
    try:
        cluster = clusterCollection.find_one(
            {"_id": ObjectId(cluster_id), "company_id": ObjectId(company_id), "active": True}
        )
        if cluster:
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
'''

# Delete company cluster
@cluster_bp.route('/api/companies/cluster/<cluster_id>/delete', methods=['DELETE', 'OPTIONS'])
# @jwt_required()
def delete_company(cluster_id):
    """deactivate a specific cluster with a cluster_id.
    setting the active attribute to False
    Args:
        cluster_id  (str): cluster unique id
    """
    try:
        result = clusterCollection.update_one(
            {"_id": ObjectId(cluster_id)}, {"$set": {"active": False}}
        )
        if result.matched_count:
            return jsonify({"msg": "properties cluster deactivated"}), 204
        return jsonify({"error": "cluster not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid cluster ID format"}), 400
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
