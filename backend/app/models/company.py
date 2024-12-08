#!/usr/bin/env python3
"""model for admins"""
from bson.objectid import ObjectId
from datetime import datetime


class Company:
    """class of the company instance"""
    def __init__(
        self, name, email, phone, password, company_name, position, business_location, role, company_id=None,
        active=True
    ):
        """Initializer/object constructor.
        Args:
            name (str): full name
            active  (bool): Status of Tenancy. True by default
        """
        self.company_id = company_id if company_id else ObjectId()
        self.date_created = datetime.now()
        self.name = name
        self.email = email
        self.phone = phone
        self.password = password  # hashed password
        self.company_name = company_name
        self.position = position
        self.business_location = business_location
        self.role = role
        self.active = active

    def to_dict(self):
        """returns the dictionary of all the admin attributes"""
        return {
            "_id": self.company_id,
            "date_created": self.date_created,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "password": self.password,
            "company_name": self.company_name,
            "position": self.position,
            "business_location": self.business_location,
            "role": self.role,
            "active": self.active
        }
