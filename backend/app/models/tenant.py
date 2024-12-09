#!/usr/bin/env python3
"""model for tenants"""
from bson.objectid import ObjectId
from datetime import datetime


class Tenant:
    """class of the tenant instance"""
    def __init__(
        self, email, password, clusters, role, date_updated=None, \
        tenant_id=None, active=True
    ):
        """Initializer/object constructor.
        Args:
            email (str): email
            lease_agreement_details (str): url of leease agreement
            role (str): user as tenant
            active  (bool): Status of Tenancy. True by default
        """
        self.tenant_id = tenant_id if tenant_id else ObjectId()
        self.date_created = datetime.now()
        self.date_updated = date_updated if date_updated else datetime.now()
        self.email = email
        self.password = password  # hashed password
        self.active = active
        self.role = role
        self.clusters = clusters

    def to_dict(self):
        """returns the dictionary of all the Tenant attributes"""
        return {
            "_id": self.tenant_id,
            "date_created": self.date_created,
            "date_updated": self.date_updated,
            "email": self.email,
            "password": self.password,
            "active": self.active,
            "role": self.role,
            "clusters": self.clusters
        }
