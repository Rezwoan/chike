from flask import Blueprint, request, jsonify, make_response
from extensions import db
from models import User, Referral
from datetime import datetime, timedelta
import pytz

profile_bp = Blueprint('profile', __name__)

def get_us_time():
    """Get the current time in US timezone (e.g., EST)."""
    us_timezone = pytz.timezone('US/Eastern')
    return datetime.now(us_timezone)

def get_start_of_day():
    """Get the start of the current day in US timezone."""
    now = get_us_time()
    return datetime(now.year, now.month, now.day, 0, 0, 0)

def get_start_of_week():
    """Get the start of the current week (Sunday) in US timezone."""
    now = get_us_time()
    start_of_week = now - timedelta(days=now.weekday() + 1)
    return datetime(start_of_week.year, start_of_week.month, start_of_week.day, 0, 0, 0)



def handle_preflight():
    """Handle CORS preflight (OPTIONS) requests."""
    response = make_response()
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Methods"
    )
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response

@profile_bp.route('/profile', methods=['OPTIONS', 'POST'])
def get_profile():
    """Fetch user profile data via JSON body (POST)."""
    # If the request method is OPTIONS, immediately return the preflight response
    if request.method == 'OPTIONS':
        return handle_preflight()
    """Fetch user profile data via JSON body (POST)."""
    data = request.get_json()
    user_id = data.get("userID")  # Must match what your React code sends
    print(user_id)
    if not user_id:
        return jsonify({'error': 'userID not provided'}), 400

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    # Total referrals
    total_referrals = user.referrals_count

    # Daily referrals
    start_of_day = get_start_of_day()
    daily_referrals = Referral.query.filter(
        Referral.referrer_id == user.id,
        Referral.created_at >= start_of_day
    ).count()

    # Weekly referrals
    start_of_week = get_start_of_week()
    weekly_referrals = Referral.query.filter(
        Referral.referrer_id == user.id,
        Referral.created_at >= start_of_week
    ).count()

    # Calculate total rank
    #  - The rank is 1 plus how many users have a referral count above this user's count
    total_rank = (
        db.session.query(User)
        .filter(User.referrals_count > user.referrals_count)
        .count()
        + 1
    )

    # Daily rank
    daily_rank_query = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_day)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
    )
    daily_rank = next(
        (index + 1 for index, (u, count) in enumerate(daily_rank_query) if u.id == user.id),
        None
    )

    # Weekly rank
    weekly_rank_query = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_week)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
    )
    weekly_rank = next(
        (index + 1 for index, (u, count) in enumerate(weekly_rank_query) if u.id == user.id),
        None
    )

    # Dummy trivia points today (replace with your own logic if needed)
    trivia_points_today = 50

    # Build response
    response = {
        'name': user.name,
        'email': user.email,
        'totalReferrals': total_referrals,
        'dailyReferrals': daily_referrals,
        'weeklyReferrals': weekly_referrals,
        'totalRank': total_rank,
        'dailyRank': daily_rank or "N/A",
        'weeklyRank': weekly_rank or "N/A",
        'triviaPointsToday': trivia_points_today,
        'referralLink': f"https://example.com/signup?ref={user.referral_code}",
        'total_earned' : user.total_earned
    }

    return jsonify(response), 200
