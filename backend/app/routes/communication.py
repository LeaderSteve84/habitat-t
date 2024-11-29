#!/usr/bin/env python3
"""Communication routes module"""
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request, decode_token
from datetime import datetime
from bson import ObjectId
# from app import socketio
from app.models.communication import CommunicationModel
from flask_socketio import emit

communication_bp = Blueprint('communication', __name__)

# tenantsCollection = current_app.tenantsCollection
# adminsCollection = current_app.adminsCollection
# messagesCollection = current_app.messagesCollection

socketio = current_app.socketio
logger = current_app.logger

@socketio.on('receive_message', namespace="/chat")
def receive_message(data):
    """receive message from clients"""
    if not data:
        logger.info('received empty message')
        return
    emit("sent_message", data, namespace="/chat", broadcast=True)
