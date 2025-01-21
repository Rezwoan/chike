from app import app  # Import the Flask app
from referral.utils import get_daily_leaderboard, get_weekly_leaderboard

if __name__ == "__main__":
    # Activate the app context
    with app.app_context():
        print("Daily Leaderboard:")
        print(get_daily_leaderboard())

        print("\nWeekly Leaderboard:")
        print(get_weekly_leaderboard())
