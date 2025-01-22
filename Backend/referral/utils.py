import random
import string
import os
from extensions import db
from models import User, Referral
from datetime import datetime, timedelta
import pytz
from winner_notifier import send_winner_email

# Constants
DAILY_WINNER_FILE = "winner/daily_winner.txt"
WEEKLY_WINNER_FILE = "winner/weekly_winner.txt"
LAST_DAILY_WINNER_LOG = "winner/last_daily_winner_log.txt"
LAST_WEEKLY_WINNER_LOG = "winner/last_weekly_winner_log.txt"

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

def save_winner_to_file(winner_name, referral_count, prize, timeframe, file_path):
    """Append the winner's name, referrals, and prize to a text file."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    os.makedirs(os.path.dirname(file_path), exist_ok=True)  # Ensure folder exists
    with open(file_path, "a") as file:
        file.write(f"{timestamp} - Winner: {winner_name}, Referrals: {referral_count}, Prize: {prize} ({timeframe})\n")

def get_last_winner_date(log_file):
    """Retrieve the last winner email sent date from the specified log file."""
    if os.path.exists(log_file):
        with open(log_file, "r") as file:
            return file.read().strip()
    return None

def set_last_winner_date(log_file, date):
    """Set the last winner email sent date in the specified log file."""
    os.makedirs(os.path.dirname(log_file), exist_ok=True)
    with open(log_file, "w") as file:
        file.write(date)

def get_daily_leaderboard():
    """Fetch the daily leaderboard and notify the winner."""
    today_date = get_us_time().strftime("%Y-%m-%d")
    last_daily_winner_date = get_last_winner_date(LAST_DAILY_WINNER_LOG)

    start_of_day = get_start_of_day()
    end_of_day = start_of_day + timedelta(days=1) - timedelta(seconds=1)  # End of the current day

    # Fetch referrals for the leaderboard
    referrals = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_day)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
        .all()
    )

    # Check if the daily winner email was already sent
    if last_daily_winner_date == today_date:
        print("Daily winner email already sent today.")
    else:
        # Find the winner (must have 20+ referrals)
        winner = next((user for user in referrals if user[1] >= 20), None)

        if winner:
            user, referral_count = winner
            prize = "$1"
            timeframe = "Today"
            save_winner_to_file(user.name, referral_count, prize, timeframe, DAILY_WINNER_FILE)

            # Increment the total_earned field
            user.total_earned += 1
            db.session.commit()

            # Send email
            send_winner_email(
                receiver_email=user.email,
                name=user.name,
                referral_count=referral_count,
                prize=prize,
                timeframe="daily",
                date=end_of_day.strftime("%B %d, %Y"),
                referral_code=user.referral_code
            )

            # Log the winner details
            set_last_winner_date(LAST_DAILY_WINNER_LOG, today_date)
            print(f"Daily winner email sent: {user.name} with {referral_count} referrals.")

    # Return the leaderboard as a list of dictionaries
    return [
        {
            "rank": index + 1,
            "name": user.name,
            "profilePicture": user.profile_picture,
            "score": referral_count
        }
        for index, (user, referral_count) in enumerate(referrals)
    ]


def get_weekly_leaderboard():
    """Fetch the weekly leaderboard and notify the winner."""
    today_date = get_us_time().strftime("%Y-%m-%d")
    last_weekly_winner_date = get_last_winner_date(LAST_WEEKLY_WINNER_LOG)

    # Only process if the winner email hasn't been sent for this week
    start_of_week = get_start_of_week()
    end_of_week = start_of_week + timedelta(days=6, hours=23, minutes=59, seconds=59)

    if last_weekly_winner_date == end_of_week.strftime("%Y-%m-%d"):
        print("Weekly winner email already sent this week.")
        return []

    referrals = (
        db.session.query(User, db.func.count(Referral.id).label('referrals_count'))
        .join(Referral, User.id == Referral.referrer_id)
        .filter(Referral.created_at >= start_of_week)
        .group_by(User.id)
        .order_by(db.desc('referrals_count'))
        .all()
    )

    print("Weekly referrals:", referrals)  # Debugging

    # Find the winner (must have 100+ referrals)
    winner = next((user for user in referrals if user[1] >= 100), None)

    if winner:
        user, referral_count = winner
        prize = "$5"
        timeframe = "This Week"
        save_winner_to_file(user.name, referral_count, prize, timeframe, WEEKLY_WINNER_FILE)

        # Increment the total_earned field
        user.total_earned += 5
        db.session.commit()

        # Send email
        send_winner_email(
            receiver_email=user.email,
            name=user.name,
            referral_count=referral_count,
            prize=prize,
            timeframe="weekly",
            date=end_of_week.strftime("%B %d, %Y"),
            referral_code=user.referral_code
        )

        # Log the winner details
        set_last_winner_date(LAST_WEEKLY_WINNER_LOG, end_of_week.strftime("%Y-%m-%d"))
        print(f"Weekly winner email sent: {user.name} with {referral_count} referrals.")
    else:
        print("No weekly winner this week (minimum 100 referrals not met).")

    return [
        {
            "rank": index + 1,
            "name": user.name,
            "profilePicture": user.profile_picture,
            "score": referral_count
        }
        for index, (user, referral_count) in enumerate(referrals)
    ]