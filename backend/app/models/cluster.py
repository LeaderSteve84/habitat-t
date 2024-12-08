#!/usr/bin/env python3
"""model for cluster"""
from bson.objectid import ObjectId
from datetime import datetime


class Cluster:
    """class of the cluster instance"""
    def __init__(
        self, cluster_name, cluster_location, number_of_properties, \
        number_of_units, company_id, date_updated=None, cluster_id=None, \
        active=True
    ):
        """Initializer/object constructor.
        Args:
            name (str): Full Name
            active  (bool): Status of Tenancy. True by default
        """
        self.cluster_id = cluster_id if cluster_id else ObjectId()
        self.date_created = datetime.now()
        self.date_updated = date_updated if date_updated else datetime.now()
        self.company_id = company_id
        self.cluster_name = cluster_name
        self.cluster_location = cluster_location
        self.number_of_properties = number_of_properties
        self.number_of_units = number_of_units
        self.active = active

    def to_dict(self):
        """returns the dictionary of all the cluster attributes"""
        return {
            "_id": self.cluster_id,
            "date_created": self.date_created,
            "date_updated": self.date_updated,
            "company_id": self.company_id,
            "cluster_name": self.cluster_name,
            "cluster_location": self.cluster_location,
            "number_of_properties": self.number_of_properties,
            "number_of_units": self.number_of_units,
            "active": self.active
        }
