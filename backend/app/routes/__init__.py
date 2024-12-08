#!/usr/bin/env python3
"""routes package init"""
from flask import Blueprint
from app.routes import tenant, auth, admin_message, \
    unit, listing, log_request, admin, communication, \
    profile, company, cluster, cluster_announcement

bp = Blueprint('main', __name__)

# Register the sub_blueprints to the main blueprint
bp.register_blueprint(tenant.tenant_bp)
bp.register_blueprint(admin.admin_bp)
bp.register_blueprint(auth.auth_bp)
bp.register_blueprint(admin_message.admin_message_bp)
bp.register_blueprint(unit.unit_bp)
bp.register_blueprint(listing.listing_bp)
bp.register_blueprint(log_request.log_request_bp)
bp.register_blueprint(communication.communication_bp)
bp.register_blueprint(profile.profile_bp)
bp.register_blueprint(company.company_bp)
bp.register_blueprint(cluster.cluster_bp)
bp.register_blueprint(cluster_announcement.cluster_announcement_bp)
