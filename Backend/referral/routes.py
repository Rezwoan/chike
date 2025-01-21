from flask import Blueprint, request, jsonify, render_template
from extensions import db, cache
from models import User, Referral
from referral.utils import increment_referrals_count
from referral.utils import get_daily_leaderboard, get_weekly_leaderboard

referral_bp = Blueprint('referral', __name__)

@referral_bp.route('/process_referral', methods=['POST'])
def process_referral_route():
    """Route wrapper for process_referral."""
    data = request.get_json()
    return process_referral(data)


def process_referral(data):
    """Handles referral logic for a new user signup."""
    referred_email = data.get('email')
    referrer_code = data.get('referrer_code')

    # Validate input
    if not referred_email or not referrer_code:
        return jsonify({'error': 'Email and referral code are required'}), 400

    # Find the referrer
    referrer = User.query.filter_by(referral_code=referrer_code).first()
    if not referrer:
        return jsonify({'error': 'Invalid referral code'}), 404

    # Check if the email is already referred
    existing_referral = Referral.query.filter_by(referred_email=referred_email).first()
    if existing_referral:
        return jsonify({'error': 'This email has already been referred'}), 400

    # Add a referral record
    referral = Referral(referrer_id=referrer.id, referred_email=referred_email)
    db.session.add(referral)

    # Increment the referrer’s referral count
    referrer.referrals_count += 1
    db.session.add(referrer)
    db.session.commit()

    return jsonify({'message': 'Referral processed successfully'}), 200



@referral_bp.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    """Fetches and returns the leaderboard data as JSON."""
    # Fetch top 7 users by referrals_count in descending order
    users = User.query.order_by(User.referrals_count.desc()).limit(7).all()

    # Format the leaderboard data
    leaderboard = [
        {
            "rank": index + 1,
            "name": user.name,
            "profilePicture": user.profile_picture,
            "score": user.referrals_count
        }
        for index, user in enumerate(users)
    ]
    return jsonify(leaderboard)

from extensions import cache

@referral_bp.route('/leaderboard/daily', methods=['GET'])
def daily_leaderboard():
    """Fetch the cached daily leaderboard."""
    leaderboard = cache.get('daily_leaderboard')
    if leaderboard is None:
        leaderboard = get_daily_leaderboard()  # Fallback if cache is empty
        cache.set('daily_leaderboard', leaderboard, timeout=86400)
    return jsonify(leaderboard)

@referral_bp.route('/leaderboard/weekly', methods=['GET'])
def weekly_leaderboard():
    """Fetch the cached weekly leaderboard."""
    leaderboard = cache.get('weekly_leaderboard')
    if leaderboard is None:
        leaderboard = get_weekly_leaderboard()  # Fallback if cache is empty
        cache.set('weekly_leaderboard', leaderboard, timeout=604800)
    return jsonify(leaderboard)
