#!/usr/bin/env python3
"""All routes for admin message CRUD operations"""
from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from app.models.cluster_announcement import ClusterAnnouncement
from pymongo.errors import PyMongoError
from bson.errors import InvalidId


cluster_announcement_bp = Blueprint('cluster_announcement', __name__)

clusterAnnouncementCollection = current_app.clusterAnnouncementCollection

# Create cluster Message
@cluster_announcement_bp.route('/api/cluster/announcement', methods=['POST', 'OPTIONS'])
def create_cluster_announcement():
    """Create an cluster announcements.
       POST announcement to MongoDB database.
       Return: "msg": "announcement created successfully" and success status
    """
    data = request.json
    try:
        announcement = ClusterAnnouncement(
            company_id=ObjectId(data['companyId']),
            cluster_id=ObjectId(data['clusterId']),
            message=data['message'],
            title=data['title'],
            cluster_name=data['clusterName']
        )
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        insert_result = clusterAnnouncementCollection.insert_one(announcement.to_dict())
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    announcement_id = insert_result.inserted_id
    return jsonify(
        {
            "msg": "Announcement created successfully",
            "announcementId": str(announcement_id)
        }
    ), 201


# Get all cluster announcements
@cluster_announcement_bp.route('/api/cluster/announcements/<company_id>/<cluster_id>', methods=['GET', 'OPTIONS'])
def get_all_cluster_announcement(company_id, cluster_id):
    """Find all cluster announcements from MongoDB and return list of all the announ."""
    try:
        announcements = clusterAnnouncementCollection.find(
            {"company_id": ObjectId(company_id), "cluster_id": ObjectId(cluster_id)}
        )
        announcement_list = [{
            "announcementId": str(announcement['_id']),
            "dateCreated": announcement['date_created'],
            "message": announcement['message'],
            "title": announcement['title'],
            "companyId": str(announcement['company_id']),
            "clusterId": str(announcement['cluster_id']),
            "clusterName": announcement['cluster_name']
        } for announcement in announcements]
        return jsonify(announcement_list), 200
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Get a specific cluster announcements
@cluster_announcement_bp.route(
    '/api/cluster/announcement/<announcement_id>/update',
    methods=['GET', 'OPTIONS']
)
def get_a_cluster_announcement(announcement_id):
    """Find a specific cluster announcement from MongoDB and return list of all the announ."""
    try:
        announcement = clusterAnnouncementCollection.find_one(
            {"_id": ObjectId(announcement_id)}
        )
        announcement_data = {
            "message": announcement['message'],
            "title": announcement['title']
        }
        return jsonify(announcement_data), 200
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Update Specific Cluster Announcement
@cluster_announcement_bp.route(
    '/api/cluster/announcement/<announcement_id>/update',
    methods=['PUT', 'OPTIONS']
)
def update_cluster_announcement(announcement_id):
    """Update a specific cluster announcement with a announcement_id.
    Args:
        announcement_id  (str): announcement unique id
    """
    data = request.json
    try:
        update_data = {
            "message": data['message'],
            "title": data['title']
        }
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        result = clusterAnnouncementCollection.update_one(
            {"_id": ObjectId(announcement_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Cluster announcement not found"}), 404
        return jsonify({"msg": "Cluster announcement updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid cluster announcement ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Delete a cluster announcement
@cluster_announcement_bp.route(
    '/api/cluster/announcement/<announcement_id>/delete',
    methods=['DELETE', 'OPTIONS']
)
def delete_cluster_announcement(announcement_id):
    """Delete a specific cluster announcement with a announcement_id
    Args:
    announcement_id  (str): announcement unique id
    """
    try:
        result = clusterAnnouncementCollection.delete_one(
            {"_id": ObjectId(announcement_id)}
        )
        if result.deleted_count == 0:
            return jsonify({"error": "Cluster announcement not found"}), 404
        return jsonify({"msg": "Cluster announcement deleted successfully"}), 204
    except InvalidId:
        return jsonify({"error": "Invalid announcement ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
