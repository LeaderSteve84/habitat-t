#!/usr/bin/env python3
"""module for tenants profile"""
from bson.objectid import ObjectId
from datetime import datetime


class Profile:
    """class of the profile instance"""
    def __init__(
        self, tenant_id, name, dob, sex, contact_details, emergency_contact,
        date_updated=None, profile_id=None, active=False, \
        lease_agreement="disagreed"
    ):
        """Initializer/object constructor.
        Args:
            name (dict): dictionary containing the fname and lname
            dob  (time): date of birth
            sex  (str):  sex
            contact_details (dict): dict of phone, email, and address.
            emergency_contact (dict): dict name, phone, address
            active  (bool): Status of Tenancy. True by default
            lease_agreement: agreed or disagreed
        """
        self.profile_id = profile_id if profile_id else ObjectId()
        self.date_created = datetime.now()
        self.date_updated = date_updated if date_updated else datetime.now()
        self.tenant_id = tenant_id
        self.name = name
        self.dob = dob
        self.sex = sex
        self.contact_details = contact_details
        self.emergency_contact = emergency_contact
        self.active = active
        self.lease_agreement = lease_agreement

    def to_dict(self):
        """returns the dictionary of all the Tenant attributes"""
        return {
            "_id": self.profile_id,
            "date_created": self.date_created,
            "date_updated": self.date_updated,
            "tenant_id": self.tenant_id,
            "name": self.name,
            "dob": self.dob,
            "sex": self.sex,
            "contact_details": self.contact_details,
            "emergency_contact": self.emergency_contact,
            "active": self.active,
            "lease_agreement": self.lease_agreement
        }
