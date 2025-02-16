"""
test_script.py

This script sets up a test database, inserts dummy data,
and runs the daily and weekly winner functions to verify that everything works.
"""

from datetime import datetime
from extensions import db
from models import User, Referral, Winner
from referral.utils import get_daily_leaderboard, handle_daily_winner, get_weekly_leaderboard, handle_weekly_winner
# Replace 'your_module' with the actual module name where your functions are defined.

# Import your Flask app (adjust the import as needed)
from app import app  # assumes your Flask app is in app.py


def setup_database():
    """Drops and creates all tables for a clean test database."""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Database setup complete.")


def insert_test_data():
    """Inserts dummy data for daily and weekly winners."""
    with app.app_context():
        # --- Daily Winner Test Data ---
        # Create a test user named Alice who qualifies for daily winner (>= 20 referrals)
        alice = User(
            name='Alice',
            email='alice@example.com',
            password='pass',
            referral_code='ALICE01',
            total_earned=0
        )
        db.session.add(alice)
        db.session.commit()
        print("Added user: Alice")

        # Add 21 referrals for Alice
        for i in range(21):
            referral = Referral(
                referrer_id=alice.id,
                referred_email=f'ref{i}@example.com',
                created_at=datetime.utcnow()  # Using UTC for simplicity
            )
            db.session.add(referral)
        db.session.commit()
        print("Added 21 referrals for Alice.")

        # --- Weekly Winner Test Data ---
        # Create a test user named Bob who qualifies for weekly winner (>= 100 referrals)
        bob = User(
            name='Bob',
            email='bob@example.com',
            password='pass',
            referral_code='BOB01',
            total_earned=0
        )
        db.session.add(bob)
        db.session.commit()
        print("Added user: Bob")

        # Add 101 referrals for Bob
        for i in range(101):
            referral = Referral(
                referrer_id=bob.id,
                referred_email=f'bob_ref{i}@example.com',
                created_at=datetime.utcnow()
            )
            db.session.add(referral)
        db.session.commit()
        print("Added 101 referrals for Bob.")


def test_daily_winner():
    """Tests the daily winner processing and prints the results."""
    with app.app_context():
        print("\n--- Daily Winner Test ---")
        # Print the daily leaderboard
        leaderboard = get_daily_leaderboard()
        print("Daily Leaderboard:")
        for entry in leaderboard:
            print(entry)
        
        # Process the daily winner
        handle_daily_winner()
        
        # Check Winner table for daily winner record
        daily_winner = Winner.query.filter_by(type='daily').first()
        if daily_winner:
            print(f"Daily Winner Record: User ID {daily_winner.user_id}, Amount: {daily_winner.amount}")
        else:
            print("No daily winner record found.")
        
        # Check Alice's total earned
        alice = User.query.filter_by(name='Alice').first()
        print(f"Alice's total earned: {alice.total_earned}")


def test_weekly_winner():
    """Tests the weekly winner processing and prints the results."""
    with app.app_context():
        print("\n--- Weekly Winner Test ---")
        # Print the weekly leaderboard
        leaderboard = get_weekly_leaderboard()
        print("Weekly Leaderboard:")
        for entry in leaderboard:
            print(entry)
        
        # Process the weekly winner
        handle_weekly_winner()
        
        # Check Winner table for weekly winner record
        weekly_winner = Winner.query.filter_by(type='weekly').first()
        if weekly_winner:
            print(f"Weekly Winner Record: User ID {weekly_winner.user_id}, Amount: {weekly_winner.amount}")
        else:
            print("No weekly winner record found.")
        
        # Check Bob's total earned
        bob = User.query.filter_by(name='Bob').first()
        print(f"Bob's total earned: {bob.total_earned}")


def main():
    setup_database()
    insert_test_data()
    test_daily_winner()
    test_weekly_winner()


if __name__ == "__main__":
    main()
