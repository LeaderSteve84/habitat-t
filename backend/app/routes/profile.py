#!/usr/bin/env python3
"""All routes for tenant CRUD operations"""
from flask import Blueprint, request, jsonify, url_for, current_app
from bson.objectid import ObjectId
from flask_mail import Message
from app.models.profile import Profile
from pymongo.errors import PyMongoError
from bson.errors import InvalidId
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity

profile_bp = Blueprint('profile', __name__)
logger = current_app.logger
mail = current_app.mail
reset_tokens = {}
profileCollection = current_app.profileCollection

def send_email(subject, recipients, body):
    msg = Message(subject=subject, recipients=recipients, body=body)
    try:
        mail.send(msg)
        logger.debug(f"Email sent to {recipients}")
    except Exception as e:
        logger.error(f"Failed to send email to {recipients}: {e}")

# Create tenant profile
@profile_bp.route('/api/tenant/profile', methods=['POST', 'OPTIONS'])
def tenant_profile():
    """Create tenant as instance of Tenant, post tenant to MongoDB database,
       and send notification email with a reset password link.
    """
    data = request.json
    try:
        profile = Profile(
            tenant_id=ObjectId(data['tenantId']),
            name=data['name'],
            dob=data['DoB'],
            sex=data['sex'],
            contact_details=data['contactDetails'],
            emergency_contact=data['emergencyContact'],
        )
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        insert_result = profileCollection.insert_one(profile.to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    profile_id = insert_result.inserted_id

    # Send notification email with a reset password link
    """
    email = data['contactDetails']['email']
    token = generate_reset_token(email)
    reset_url = f"{current_app.config['FRONTEND_URL']}/reset_password/{token}"
    emiail_body = (
        f"Dear {data['name']['fname']},\n"
        f"Your tenant account has been created successfully.\n"
        f"Please use the following link to set your password:\n"
        f"{reset_url}\n"
        "Thank you."
        )
    send_email("Tenant Account Created", [email], email_body)
    """

    return jsonify({"msg": "Profile created successfully", "profileId": str(profile_id)}), 201

"""
# Get all tenants
@tenant_bp.route('/api/admin/tenants', methods=['GET', 'OPTIONS'])
# @jwt_required()
def get_all_tenants():
    '''Find all tenants from MongoDB and return a list of all the tenants.'''
    try:
        tenants = tenantsCollection.find({"active": True})
        tenants_list = [{
            "tenantId": str(tenant['_id']),
            "dateCreated": tenant['date_created'],
            "lastUpdated": tenant['date_updated'],
            "fname": tenant['name']['fname'],
            "lname": tenant['name']['lname'],
            "sex": tenant['sex'],
            "DoB": tenant['dob'],
            "phone": tenant['contact_details']['phone'],
            "email": tenant['contact_details']['email'],
            "address": tenant['contact_details']['address'],
            "rentageType": tenant['tenancy_info']['type'],
            "rentageFee": tenant['tenancy_info']['fees'],
            "rentagePaid": tenant['tenancy_info']['paid'],
            "datePaid": tenant['tenancy_info']['datePaid'],
            "rantageStarted": tenant['tenancy_info']['start'],
            "rantageExpires": tenant['tenancy_info']['expires'],
            "rentageArrears": tenant['tenancy_info']['arrears'],
            "emergencyContactName": tenant['emergency_contact']['name'],
            "emergencyContactPhone": tenant['emergency_contact']['phone'],
            "emergencyContactAddress": tenant['emergency_contact']['address'],
            "role": tenant['role'],
            "leaseAgreementDetails": tenant['lease_agreement_details']
        } for tenant in tenants]
        return jsonify(tenants_list), 200
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
"""


# Get a Specific tenant profile
@profile_bp.route('/api/tenant/profile/<tenant_id>', methods=['GET', 'OPTIONS'])
def get_tenant_profile(tenant_id):
    """get specific tenant profile"""
    try:
        profile = profileCollection.find_one(
            {"tenant_id": ObjectId(tenant_id), "active": True}
        )
        if profile:
            logger.info(profile)
            return jsonify({
                "profileId": str(profile['_id']),
                "dateCreated": profile['date_created'],
                "lastUpdated": profile['date_updated'],
                "tenantId": str(profile['tenant_id']),
                "fname": profile['name']['fname'],
                "lname": profile['name']['lname'],
                "sex": profile['sex'],
                "DoB": profile['dob'],
                "phone": profile['contact_details']['phone'],
                "email": profile['contact_details']['email'],
                "address": profile['contact_details']['address'],
                "emergencyContactName": profile['emergency_contact']['name'],
                "emergencyContactPhone": profile['emergency_contact']['phone'],
                "emergencyContactAddress": profile['emergency_contact']['address'],
                "active": profile['active'],
                "leaseAgreement": profile['lease_agreement']
            }), 200
        else:
            return jsonify({"error": "Tenant profile not found or inactive"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid tenant ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Update Specific Tenant profile Details
@profile_bp.route('/api/tenant/profile/<profile_id>/update', methods=['GET', 'PUT', 'OPTIONS'])
# @jwt_required()
def update_tenant_profile(profile_id):
    """Update a specific tenant profile with a profile_id.
    Args:
        profile_id (str): profile unique id
    """
    print(f"Request Type: {request.content_type}")
    print(f"Request URL: {request.url}")
    print(f"Request Method: {request.method}")
    print(f"Request Args: {request.args}")
    if request.method == 'GET':
        print(f"Received profile_id: {profile_id}")
        try:
            obj_id = ObjectId("673f4aa038ac7d2cb2d35457")
            print(f"Converted to Obj_id: {obj_id}")
        except Exception as e:
            print(f"Error converting profile id: {e}")
            return jsonify({"error": "Invalid profile_id"}), 400

        profile = profileCollection.find_one({"_id": ObjectId(profile_id)})
        print(profile)
        if profile:
            return jsonify({
                "tenantId": str(profile['tenant_id']),
                "name": profile['name'],
                "DoB": profile['dob'],
                "sex": profile['sex'],
                "contactDetails": profile['contact_details'],
                "emergencyContact": profile['emergency_contact'],
                "leaseAgreement": profile['lease_agreement']
            }), 200
        return jsonify({"error": "profile not found"}), 404

    if request.method == 'PUT':
        data = request.json
        try:
            update_data = {
                # "date_updated": data['lastUpdated'],
                "name": data['name'],
                "dob": data['DoB'],
                "sex": data['sex'],
                "contact_details": data['contactDetails'],
                "emergency_contact": data['emergencyContact'],
                "lease_agreement": data['leaseAgreement']
            }
        except KeyError as e:
            return jsonify({"error": f"Missing field {str(e)}"}), 400
        except Exception as e:
            return jsonify({"error": str(e)}), 400

        try:
            if (data['leaseAgreement'] == "agreed"):
                update_data['active'] = True
                result = profileCollection.update_one(
                    {"_id": ObjectId(profile_id)}, {"$set": update_data}
                )
                if result.matched_count == 0:
                    return jsonify({"error": "profile not found"}), 404
                return jsonify({"msg": "profile updated successfully"}), 200
            return jsonify({"error": "You rejected our terms. Contact the Property Manager"}), 401
        except InvalidId:
            return jsonify({"error": "Invalid profile ID format"}), 400
        except PyMongoError as e:
            return jsonify({"error": str(e)}), 500


# Deactivate Tenant profile
@profile_bp.route('/api/tenant/profile/deactivate/<profile_id>', methods=['DELETE', 'OPTIONS'])
# @jwt_required()
def deactivate_tenant_profile(profile_id):
    """Deactivate a specific tenant profile with a profile_id, updating/setting
    the active attribute to False.
    Args:
        profile_id (str): tenant unique id
    """
    try:
        result = profileCollection.update_one(
            {"_id": ObjectId(profile_id)}, {"$set": {"active": False}}
        )
        if result.matched_count:
            return jsonify({"msg": "Tenant profile deactivated"}), 204
        return jsonify({"error": "profile not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid profile ID format"}), 400
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500

"""
# Update Tenant Contact Information
@profile_bp.route(
    '/api/tenants/<tenant_id>/emergencycontacts', methods=['PUT', 'OPTIONS']
)
def update_tenant_contact(tenant_id):
    '''Update contact information for a specific tenant'''
    data = request.json
    try:
        update_data = {
            "emergency_contact": data['emergencyContact'],
        }
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        result = tenantsCollection.update_one(
            {"_id": ObjectId(tenant_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Tenant not found"}), 404
        return jsonify(
            {"msg": "Tenant contact information updated successfully"}
        ), 200
    except InvalidId:
        return jsonify({"error": "Invalid tenant ID format"}), 400
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
"""
"""
# Get Lease Agreements
@profile_bp.route('/api/tenants/<profile_id>/lease-agreements', methods=['GET', 'OPTIONS'])
def get_lease_agreements(profile_id):
    '''Get lease agreements for a specific tenant'''
    try:
        tenant = profileCollection.find_one(
            {"_id": ObjectId(tenant_id), "active": True}
        )
        if tenant:
            return jsonify({
                "leaseAgreementDetails": tenant['lease_agreement_details']
            }), 200
        else:
            return jsonify({"error": "Tenant not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid tenant ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400
"""
