#!/usr/bin/env python3
"""All routes for property CRUD operations"""
from flask import Blueprint, request, jsonify, current_app
from bson.objectid import ObjectId
from app.models.unit import Unit
from pymongo.errors import PyMongoError
from bson.errors import InvalidId


unit_bp = Blueprint('unit', __name__)

unitCollection = current_app.unitCollection

# Create Property unit
@unit_bp.route('/api/cluster/unit', methods=['POST', 'OPTIONS'])
def create_property_unit():
    """Create a new property unit instance and store it in the database.
       Return: "msg": "Property created successfully"
       and success status
    """
    data = request.json
    try:
        unit = Unit(
            address=data['address'],
            company_id=ObjectId(data['companyId']),
            cluster_id=ObjectId(data['clusterId']),
            unit_type=data['type'],
            unit_availability=data['unitAvailability'],
            rental_fees=data['rentalFees']
        )
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        insert_result = unitCollection.insert_one(unit.to_dict())
    except Exception as e:
        return jsonify({"eror": str(e)}), 500

    unit_id = insert_result.inserted_id
    return jsonify(
        {"msg": "property unit entered successfully", "unit_Id": str(unit_id)}
    ), 201


# Get All Properties units of a cluster 
@unit_bp.route('/api/cluster/units/<cluster_id>', methods=['GET', 'OPTIONS'])
def get_all_properties_unit(cluster_id):
    """Retrieve all properties unit from the database.
    Return: List of properties units
    """

    try:
        units = unitCollection.find({"cluster_id": ObjectId(cluster_id)})
        print(units)
        units_list = [{
            "unitId": str(unit['_id']),
            "dateCreated": unit['date_created'],
            "companyId": str(unit['company_id']),
            "clusterId": str(unit['cluster_id']),
            "tenantId": str(unit.get('tenant_id', '')),
            "address": unit['address'],
            "type": unit['unit_type'],
            "unitAvailability": unit['unit_availability'],
            "rentalFees": unit['rental_fees']
        } for unit in units]
        return jsonify(units_list), 200
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Get Specific Property unit Details
@unit_bp.route('/api/cluster/unit/<unit_id>', methods=['GET', 'OPTIONS'])
def get_specific_property_unit(unit_id):
    """Retrieve details of a specific property unit by ID.
    """
    try:
        unit = unitCollection.find_one(
            {"_id": ObjectId(unit_id)}
        )
        if unit:
            return jsonify({
                "unitId": str(unit['_id']),
                "dateCreated": unit['date_created'],
                "companyId": str(unit['company_id']),
                "clusterId": str(unit['cluster_id']),
                "tenantId": str(unit.get('tenant_id', '')),
                "address": unit['address'],
                "type": unit['unit_type'],
                "unitAvailability": unit['unit_availability'],
                "rentalFees": unit['rental_fees']
            }), 200
        else:
          

            return jsonify({"error": "Property unit not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid unit ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Update Property unit Details
@unit_bp.route('/api/cluster/unit/<unit_id>', methods=['PUT', 'OPTIONS'])
def update_unit(unit_id):
    """Update a specific property unit by ID."""
    data = request.json
    try:
        update_data = {
            "address": data['address'],
            "unit_type": data['type'],
            "unit_availability": data['unitAvailability'],
            "rental_fees": data['rentalFees']
        }
    except KeyError as e:
        return jsonify({"error": f"Missing field {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        result = unitCollection.update_one(
            {"_id": ObjectId(unit_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Property unit not found"}), 404
        return jsonify({"msg": "Property unit updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid unit ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Update Property unit unit_ availability
@unit_bp.route('/api/cluster/unit/<unit_id>/availability', methods=['PUT', 'OPTIONS'])
def update_unit_unit_availability(unit_id):
    """Update Only the unitAvailability attribte of a specific property unit."""
    data = request.json

    try:
        # Extract and validate unitAvailability from request data
        tenant_id = data.get('tenantId', "")
        current_app.logger.info(tenant_id)
        tenId = ObjectId(tenant_id) if tenant_id else tenant_id
        update_data = {
            "unit_availability": data.get('unitAvailability'),
            "tenant_id": tenId
        }
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    try:
        # Perform the update in the database
        result = unitCollection.update_one(
          {"_id": ObjectId(unit_id)}, {"$set": update_data}
        )
        if result.matched_count == 0:
            return jsonify({"msg": "Property unit not found"}), 404

        return jsonify({"msg": "unitAvailability and tenantId updated successfully"}), 200
    except InvalidId:
        return jsonify({"error": "Invalid unit Id format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500


# Delete A Specific Property unit
@unit_bp.route('/api/cluster/unit/<unit_id>', methods=['DELETE', 'OPTIONS'])
def delete_property_unit(unit_id):
    """Delete a specific property unit by ID."""
    try:
        result = unitCollection.delete_one(
            {"_id": ObjectId(unit_id)}
        )
        if result.deleted_count:
            return jsonify({"msg": "Property unit deleted successfully"}), 204
        return jsonify({"error": "Property unit not found"}), 404
    except InvalidId:
        return jsonify({"error": "Invalid unit ID format"}), 404
    except PyMongoError as e:
        return jsonify({"error": str(e)}), 500
