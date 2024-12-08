#!/usr/bin/env python3
"""model for admin messages"""
from bson.objectid import ObjectId
from datetime import datetime


class ClusterAnnouncement:
    """Class of the cluster announcement instance"""
    def __init__(
        self, message, title, company_id, cluster_id, cluster_name, announcement_id=None
    ):
        """Initializer/object constructor.
        Args:
            message (str): The message content
            title  (str): The title of the message
            date  (str): The date of the message
        """

        self.announcement_id = announcement_id if announcement_id else ObjectId()
        self.date_created = datetime.now()
        self.company_id = company_id
        self.cluster_id = cluster_id
        self.message = message
        self.title = title
        self.cluster_name = cluster_name

    def to_dict(self):
        """returns the dictionary of all
        the cluster announcement attributes
        """
        return {
            "_id": self.announcement_id,
            "date_created": self.date_created,
            "company_id": self.company_id,
            "cluster_id": self.cluster_id,
            "message": self.message,
            "title": self.title,
            "cluster_name": self.cluster_name
        }
