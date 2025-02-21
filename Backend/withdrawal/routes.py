from flask import Blueprint, request, jsonify, render_template
from extensions import db, cache
from models import User, Withdrawal
from referral.utils import increment_referrals_count
from referral.utils import get_daily_leaderboard, get_weekly_leaderboard
import json


user_withdrawals_bp = Blueprint('user_withdrawals', __name__)



MIN_WITHDRAWAL_AMOUNT = 100.0  # example

@user_withdrawals_bp.route('/withdrawals', methods=['POST'])
def request_withdrawal():
    """
    User requests a new withdrawal.
    Expects JSON:
    {
      "user_id": <int>,
      "amount": <float>,
      "payment_info": <dict or string>
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"message": "No input data provided"}), 400

    user_id = data.get('user_id')
    amount = data.get('amount')
    payment_info = data.get('payment_info')  # could be string or dict

    if not user_id or not amount:
        return jsonify({"message": "user_id and amount are required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    if amount < MIN_WITHDRAWAL_AMOUNT:
        return jsonify({
            "message": f"Minimum withdrawal amount is {MIN_WITHDRAWAL_AMOUNT}"
        }), 400

    if user.total_earned < amount:
        return jsonify({"message": "Insufficient balance"}), 400

    # Convert payment_info to text
    if isinstance(payment_info, dict):
        payment_info_str = json.dumps(payment_info)
    else:
        payment_info_str = str(payment_info) if payment_info else None

    # Create the pending withdrawal
    new_withdrawal = Withdrawal(
        user_id=user_id,
        amount=amount,
        user_payment_info=payment_info_str,
        status='pending'
    )

    try:
        db.session.add(new_withdrawal)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error creating withdrawal", "error": str(e)}), 500

    return jsonify({
        "message": "Withdrawal request created",
        "withdrawal_id": new_withdrawal.id,
        "status": new_withdrawal.status
    }), 201


@user_withdrawals_bp.route('/withdrawals', methods=['GET'])
def get_user_withdrawals():
    """
    User checks their withdrawal requests.
    Must provide 'user_id' as a query param: /withdrawals?user_id=42
    Optional: status filter, e.g. /withdrawals?user_id=42&status=pending
    """
    user_id = request.args.get('user_id', type=int)
    if not user_id:
        return jsonify({"message": "user_id is required"}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    status_filter = request.args.get('status')  # optional

    query = Withdrawal.query.filter_by(user_id=user_id)
    if status_filter:
        query = query.filter_by(status=status_filter)

    withdrawals = query.order_by(Withdrawal.created_at.desc()).all()

    results = []
    for w in withdrawals:
        results.append({
            "id": w.id,
            "user_id": w.user_id,
            "amount": w.amount,
            "status": w.status,
            "user_payment_info": w.user_payment_info,
            "created_at": w.created_at.isoformat(),
            "processed_at": w.processed_at.isoformat() if w.processed_at else None,
            "completed_at": w.completed_at.isoformat() if w.completed_at else None
        })

    return jsonify({"withdrawals": results}), 200

