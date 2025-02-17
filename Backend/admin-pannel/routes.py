"""
Admin Panel API Endpoints
-------------------------
This API provides endpoints for managing system data including users, referrals, winners, and analytics.

Routes:
--------
User Management:
   - GET    /admin/users
            Retrieve a paginated list of users with optional filters (e.g., name, email).
   - GET    /admin/users/<id>
            Retrieve detailed information for a specific user.
   - PUT    /admin/users/<id>
            Update a specific user's details.
   - DELETE /admin/users/<id>
            Delete a user from the system.

Referral Management:
   - GET    /admin/referrals
            Retrieve a paginated list of referral records with optional filters (e.g., referrer_id, date range).
   - GET    /admin/referrals/<id>
            Retrieve details for a specific referral record.

Winner Management:
   - GET    /admin/winners
            Retrieve a paginated list of winners with optional filters (e.g., user_id, type).
   - GET    /admin/winners/<id>
            Retrieve details for a specific winner record.
   - POST   /admin/winners
            Create a new winner record.
   - DELETE /admin/winners/<id>
            Delete a winner record.

Analytics/Dashboard:
   - GET    /admin/dashboard
            Retrieve aggregated statistics including total counts (users, referrals, winners), total earned amount, and top referrers.
   - GET    /admin/stats
            Retrieve detailed analytics data (e.g., daily new users and referrals for the past 30 days).

Why:
----
These endpoints facilitate efficient administration of the system by enabling CRUD operations and providing insightful analytics. The API is designed with features like pagination, filtering, and robust error handling to ensure a secure and user-friendly management experience for the admin panel.
"""

from flask import Blueprint, request, jsonify
from models import User, Winner, Referral  # Adjust the import based on your project structure
from extensions import db  # Your SQLAlchemy db instance

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/users', methods=['GET'])
def get_users():
    """
    Retrieve a paginated list of users.
    Optional Query Params:
      - page: The page number (default: 1)
      - limit: Number of items per page (default: 10)
      - name: Filter by user name (partial match)
      - email: Filter by user email (partial match)
    """
    # Get query parameters with defaults
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    # Build the base query
    query = User.query

    # Optional filtering by name
    name_filter = request.args.get('name')
    if name_filter:
        query = query.filter(User.name.ilike(f"%{name_filter}%"))

    # Optional filtering by email
    email_filter = request.args.get('email')
    if email_filter:
        query = query.filter(User.email.ilike(f"%{email_filter}%"))
    
    # Apply pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    # Serialize the user data
    users = [{
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "referral_code": user.referral_code,
        "referrals_count": user.referrals_count,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at.isoformat(),
        "total_earned": user.total_earned,
        "total_points": user.total_points,
        "last_trivia_attempt": user.last_trivia_attempt.isoformat() if user.last_trivia_attempt else None
    } for user in pagination.items]
    
    return jsonify({
        "users": users,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """
    Retrieve details for a specific user by ID.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "referral_code": user.referral_code,
        "referrals_count": user.referrals_count,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at.isoformat(),
        "total_earned": user.total_earned,
        "total_points": user.total_points,
        "last_trivia_attempt": user.last_trivia_attempt.isoformat() if user.last_trivia_attempt else None
    }
    return jsonify(user_data), 200


@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    """
    Update a specific user's information.
    Expected JSON payload may include:
      - name
      - email
      - profile_picture
      - total_earned
      - total_points
      - referrals_count
      - last_trivia_attempt (ISO formatted string)
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    # Update fields if they exist in the payload
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'profile_picture' in data:
        user.profile_picture = data['profile_picture']
    if 'total_earned' in data:
        user.total_earned = data['total_earned']
    if 'total_points' in data:
        user.total_points = data['total_points']
    if 'referrals_count' in data:
        user.referrals_count = data['referrals_count']
    if 'last_trivia_attempt' in data:
        # Expecting an ISO formatted date string or None
        if data['last_trivia_attempt']:
            try:
                user.last_trivia_attempt = datetime.fromisoformat(data['last_trivia_attempt'])
            except ValueError:
                return jsonify({"message": "Invalid date format for last_trivia_attempt"}), 400
        else:
            user.last_trivia_attempt = None

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating user", "error": str(e)}), 500

    updated_user = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "referral_code": user.referral_code,
        "referrals_count": user.referrals_count,
        "profile_picture": user.profile_picture,
        "created_at": user.created_at.isoformat(),
        "total_earned": user.total_earned,
        "total_points": user.total_points,
        "last_trivia_attempt": user.last_trivia_attempt.isoformat() if user.last_trivia_attempt else None
    }
    return jsonify(updated_user), 200



@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    """
    Delete a specific user by ID.
    """
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    try:
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting user", "error": str(e)}), 500

    return jsonify({"message": "User deleted successfully"}), 200


@admin_bp.route('/referrals', methods=['GET'])
def get_referrals():
    """
    Retrieve all referral records.
    Optional Query Params:
      - referrer_id: Filter by the referrer's user ID.
      - date_from: Filter referrals created on/after this date (ISO format).
      - date_to: Filter referrals created on/before this date (ISO format).
      - page: The page number (default: 1).
      - limit: Number of items per page (default: 10).
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)

    query = Referral.query

    # Filter by referrer_id if provided
    referrer_id = request.args.get('referrer_id', type=int)
    if referrer_id is not None:
        query = query.filter(Referral.referrer_id == referrer_id)

    # Filter by date_from if provided
    date_from = request.args.get('date_from')
    if date_from:
        try:
            dt_from = datetime.fromisoformat(date_from)
            query = query.filter(Referral.created_at >= dt_from)
        except ValueError:
            return jsonify({"message": "Invalid date_from format. Please use ISO format."}), 400

    # Filter by date_to if provided
    date_to = request.args.get('date_to')
    if date_to:
        try:
            dt_to = datetime.fromisoformat(date_to)
            query = query.filter(Referral.created_at <= dt_to)
        except ValueError:
            return jsonify({"message": "Invalid date_to format. Please use ISO format."}), 400

    # Apply pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)

    referrals = [{
        "id": referral.id,
        "referrer_id": referral.referrer_id,
        "referred_email": referral.referred_email,
        "created_at": referral.created_at.isoformat()
    } for referral in pagination.items]

    return jsonify({
        "referrals": referrals,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200

@admin_bp.route('/referrals/<int:referral_id>', methods=['GET'])
def get_referral(referral_id):
    """
    Retrieve details for a specific referral record by ID.
    """
    referral = Referral.query.get(referral_id)
    if not referral:
        return jsonify({"message": "Referral not found"}), 404

    referral_data = {
        "id": referral.id,
        "referrer_id": referral.referrer_id,
        "referred_email": referral.referred_email,
        "created_at": referral.created_at.isoformat()
    }
    return jsonify(referral_data), 200



@admin_bp.route('/winners', methods=['GET'])
def get_winners():
    """
    Retrieve a paginated list of winner records.
    Optional Query Params:
      - page: The page number (default: 1)
      - limit: Number of items per page (default: 10)
      - user_id: Filter winners by the user's ID
      - type: Filter winners by type (partial match)
    """
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = Winner.query

    # Optional filtering by user_id
    user_id = request.args.get('user_id', type=int)
    if user_id is not None:
        query = query.filter(Winner.user_id == user_id)

    # Optional filtering by type
    winner_type = request.args.get('type')
    if winner_type:
        query = query.filter(Winner.type.ilike(f"%{winner_type}%"))
    
    # Apply pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
    winners = [{
        "id": winner.id,
        "user_id": winner.user_id,
        "date": winner.date.isoformat(),
        "type": winner.type,
        "amount": winner.amount
    } for winner in pagination.items]
    
    return jsonify({
        "winners": winners,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200

@admin_bp.route('/winners/<int:winner_id>', methods=['GET'])
def get_winner(winner_id):
    """
    Retrieve details for a specific winner record by ID.
    """
    winner = Winner.query.get(winner_id)
    if not winner:
        return jsonify({"message": "Winner not found"}), 404

    winner_data = {
        "id": winner.id,
        "user_id": winner.user_id,
        "date": winner.date.isoformat(),
        "type": winner.type,
        "amount": winner.amount
    }
    return jsonify(winner_data), 200


@admin_bp.route('/winners', methods=['POST'])
def create_winner():
    """
    Create a new winner record.
    Expected JSON payload:
    {
      "user_id": <int>,
      "type": <str>,
      "amount": <float>
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    # Validate required fields
    user_id = data.get('user_id')
    win_type = data.get('type')
    amount = data.get('amount')

    if user_id is None or win_type is None or amount is None:
        return jsonify({"message": "Missing required fields: user_id, type, and amount"}), 400

    try:
        # Optionally, verify that the user exists
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        # Create the new winner record
        winner = Winner(user_id=user_id, type=win_type, amount=amount)
        db.session.add(winner)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating winner record", "error": str(e)}), 500

    # Return the created winner record
    return jsonify({
        "id": winner.id,
        "user_id": winner.user_id,
        "date": winner.date.isoformat(),
        "type": winner.type,
        "amount": winner.amount
    }), 201


@admin_bp.route('/winners/<int:winner_id>', methods=['DELETE'])
def delete_winner(winner_id):
    """
    Delete a specific winner record by ID.
    """
    winner = Winner.query.get(winner_id)
    if not winner:
        return jsonify({"message": "Winner not found"}), 404

    try:
        db.session.delete(winner)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting winner", "error": str(e)}), 500

    return jsonify({"message": "Winner deleted successfully"}), 200


@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    """
    Retrieve aggregated statistics for the admin dashboard.
    This includes total users, referrals, winners, total earned amount,
    and a list of top referrers.
    """
    # Count total users, referrals, and winners
    total_users = User.query.count()
    total_referrals = Referral.query.count()
    total_winners = Winner.query.count()

    # Sum of amounts from all winners (or 0.0 if there are none)
    total_earned = db.session.query(db.func.sum(Winner.amount)).scalar() or 0.0

    # Retrieve top 5 users with the highest referrals_count
    top_referrers = User.query.order_by(User.referrals_count.desc()).limit(5).all()
    top_referrers_data = [
        {
            "id": user.id,
            "name": user.name,
            "referrals_count": user.referrals_count
        }
        for user in top_referrers
    ]

    dashboard_data = {
        "total_users": total_users,
        "total_referrals": total_referrals,
        "total_winners": total_winners,
        "total_earned": total_earned,
        "top_referrers": top_referrers_data
    }
    
    return jsonify(dashboard_data), 200

from datetime import timedelta, datetime

@admin_bp.route('/stats', methods=['GET'])
def get_stats():
    """
    Retrieve detailed analytics for the admin panel.
    Returns data such as daily new users and referrals for the past 30 days.
    """
    # Define the time period for the stats (last 30 days)
    today = datetime.utcnow().date()
    thirty_days_ago = today - timedelta(days=30)

    # Query daily new users count for the last 30 days.
    daily_new_users = db.session.query(
        db.func.date(User.created_at).label('date'),
        db.func.count(User.id).label('count')
    ).filter(User.created_at >= thirty_days_ago).group_by(db.func.date(User.created_at)).order_by(db.func.date(User.created_at)).all()

    # Query daily new referrals count for the last 30 days.
    daily_new_referrals = db.session.query(
        db.func.date(Referral.created_at).label('date'),
        db.func.count(Referral.id).label('count')
    ).filter(Referral.created_at >= thirty_days_ago).group_by(db.func.date(Referral.created_at)).order_by(db.func.date(Referral.created_at)).all()

    # Format data as a list of dictionaries for easier consumption
    users_stats = [{"date": date.isoformat(), "count": count} for date, count in daily_new_users]
    referrals_stats = [{"date": date.isoformat(), "count": count} for date, count in daily_new_referrals]

    stats_data = {
        "daily_new_users": users_stats,
        "daily_new_referrals": referrals_stats
    }

    return jsonify(stats_data), 200
