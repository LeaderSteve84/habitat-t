#!/usr/bin/env python3
"""Model for properties"""


from bson.objectid import ObjectId
from datetime import datetime


class Unit:
    """Class representing a property instance"""
    def __init__(
        self, address, unit_type, unit_availability,
        rental_fees, company_id, cluster_id, cluster_name, unit_id=None
    ):
        """
        Initializer/object constructor.
        Args:
            address (str): Address of the property
            unit_type (str): Type of the property
            unit_availability  (bool): Availability of units in the property
            rental_fees  (float): Rental fees for the property
        """
        self.unit_id = unit_id if unit_id else ObjectId()
        self.date_created = datetime.now()
        self.company_id = company_id
        self.cluster_id = cluster_id
        self.cluster_name = cluster_name
        self.address = address
        self.unit_type = unit_type
        self.unit_availability = unit_availability
        self.rental_fees = rental_fees

    def to_dict(self):
        """Returns the dictionary of all the property attributes"""
        return {
            "_id": self.unit_id,
            "date_created": self.date_created,
            "company_id": self.company_id,
            "cluster_id": self.cluster_id,
            "cluster_name": self.cluster_name,
            "address": self.address,
            "unit_type": self.unit_type,
            "unit_availability": self.unit_availability,
            "rental_fees": self.rental_fees
        }
