import random
import string
from extensions import db
from models import User, Referral, Winner
from datetime import datetime, timedelta
import pytz
from winner_notifier import send_winner_email


def generate_referral_code(length=8):
    """Generates a unique referral code."""
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


def increment_referrals_count(referrer_id):
    """Increments the referrals count for the specified user."""
    referrer = User.query.filter_by(id=referrer_id).first()
    if referrer:
        referrer.referrals_count += 1
        db.session.commit()


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
    start_of_week = now - timedelta(days=(now.weekday() + 1) % 7)
    return datetime(start_of_week.year, start_of_week.month, start_of_week.day, 0, 0, 0)


def process_winner(user, referral_count, prize, winner_type, end_date, earned_amount):
    """
    Process a winner by:
      - Saving their details to the Winner table.
      - Incrementing the user's total_earned.
      - Sending a notification email.
    
    :param user: The winning User object.
    :param referral_count: Number of referrals.
    :param prize: Prize string (e.g., "$1").
    :param winner_type: 'daily' or 'weekly'.
    :param end_date: Datetime representing the end of the period.
    :param earned_amount: Numeric amount to add to total_earned.
    """
    # Create and add a new Winner record in the database
    new_winner = Winner(
        user_id=user.id,
        date=end_date,
        type=winner_type,
        amount=earned_amount
    )
    db.session.add(new_winner)

    # Update the user's total earned amount
    user.total_earned += earned_amount

    # Commit changes to the database
    db.session.commit()

    # Send winner notification email
    send_winner_email(
        receiver_email=user.email,
        name=user.name,
        referral_count=referral_count,
        prize=prize,
        timeframe=winner_type,
        date=end_date.strftime("%B %d, %Y"),
        referral_code=user.referral_code
    )

    print(f"{winner_type.capitalize()} winner processed: {user.name} with {referral_count} referrals.")


def get_daily_leaderboard():
    """
    Return the daily leaderboard data without processing the daily winner.
    """
    start_of_day = get_start_of_day()
    referrals = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_day)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
        .all()
    )
    leaderboard = [
        {
            "rank": index + 1,
            "name": user.name,
            "profilePicture": user.profile_picture,
            "score": referral_count
        }
        for index, (user, referral_count) in enumerate(referrals)
    ]
    return leaderboard


def handle_daily_winner():
    """
    Select and process the daily winner.
    A daily winner must have at least 20 referrals.
    Winner duplicate-checking is now done via the Winner table.
    """
    start_of_day = get_start_of_day()
    end_of_day = start_of_day + timedelta(days=1) - timedelta(seconds=1)

    # Check if a daily winner already exists for today
    existing_daily_winner = Winner.query.filter(
        Winner.type == 'daily',
        Winner.date >= start_of_day,
        Winner.date <= end_of_day
    ).first()
    if existing_daily_winner:
        print("Daily winner already processed today.")
        return

    # Retrieve daily referrals for leaderboard
    referrals = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_day)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
        .all()
    )

    # Choose the winner: first user with at least 20 referrals
    winner = next((user for user in referrals if user[1] >= 20), None)
    if winner:
        user, referral_count = winner
        process_winner(
            user=user,
            referral_count=referral_count,
            prize="$1",
            winner_type="daily",
            end_date=end_of_day,
            earned_amount=1.0
        )
    else:
        print("No daily winner found (minimum 20 referrals not met).")


def get_weekly_leaderboard():
    """
    Return the weekly leaderboard data.
    """
    start_of_week = get_start_of_week()
    referrals = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_week)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
        .all()
    )
    leaderboard = [
        {
            "rank": index + 1,
            "name": user.name,
            "profilePicture": user.profile_picture,
            "score": referral_count
        }
        for index, (user, referral_count) in enumerate(referrals)
    ]
    return leaderboard


def handle_weekly_winner():
    """
    Select and process the weekly winner.
    A weekly winner must have at least 100 referrals.
    Winner duplicate-checking is now done via the Winner table.
    """
    start_of_week = get_start_of_week()
    end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

    # Check if a weekly winner already exists for this week
    existing_weekly_winner = Winner.query.filter(
        Winner.type == 'weekly',
        Winner.date >= start_of_week,
        Winner.date <= end_of_week
    ).first()
    if existing_weekly_winner:
        print("Weekly winner already processed this week.")
        return

    # Retrieve weekly referrals for leaderboard
    referrals = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_week)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
        .all()
    )

    # Choose the winner: first user with at least 100 referrals
    winner = next((user for user in referrals if user[1] >= 100), None)
    if winner:
        user, referral_count = winner
        process_winner(
            user=user,
            referral_count=referral_count,
            prize="$5",
            winner_type="weekly",
            end_date=end_of_week,
            earned_amount=5.0
        )
    else:
        print("No weekly winner found (minimum 100 referrals not met).")
