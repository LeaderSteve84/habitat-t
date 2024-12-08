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
from bson.errors import InvalidId

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

# Get a Specific company cluster Details
@cluster_bp.route('/api/cluster/<company_id>/<cluster_id>', methods=['GET', 'OPTIONS'])
def get_specific_company_cluster(company_id, cluster_id):
    try:
        cluster = clusterCollection.find_one(
            {"_id": ObjectId(cluster_id), "company_id": ObjectId(company_id), "active": True}
        )
        if cluster:
            return jsonify({
                "clusterId": str(cluster['_id']),
                "dateCreated": cluster['date_created'],
                "dateUpdated": cluster['date_updated'],
                "companyId": str(cluster['company_id']),
                "clusterName": cluster['cluster_name'],
                "clusterLocation": cluster['cluster_location'],
                "numberOfProperties": cluster['number_of_properties'],
                "numberOfUnits": cluster.get('number_of_units', ""),
                "active": cluster['active']
            }), 200
        else:
            return jsonify({"error": "company cluster not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid company ID or cluster ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Update Specific company cluster Details
@cluster_bp.route('/api/cluster/<company_id>/<cluster_id>', methods=['PUT', 'OPTIONS'])
def update_specific_company_cluster(company_id, cluster_id):
    """update a specific company cluster with a company_id and cluster_id.
    Args:
        company_id  (str): company unique id
    """
    data = request.json
    try:
        update_data = {
            "cluster_name": data['clusterName'],
            "cluster_location": data['clusterLocation'],
            "number_of_properties": data['numberOfProperties'],
            "number_of_units": data['numberOfUnits']
        }
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        result = clusterCollection.update_one(
                {"_id": ObjectId(cluster_id), "company_id": ObjectId(company_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "company cluster not found"}), 404
        return jsonify({"msg": "company cluster updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid company ID or cluster ID format"}), 400
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Deactiavte company cluster
@cluster_bp.route('/api/cluster/<cluster_id>/delete', methods=['DELETE', 'OPTIONS'])
# @jwt_required()
def delete_company_cluster(cluster_id):
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
