from app import app, db  # Import app and db from app.py
from models import User  # Adjust the import path based on your project structure
from email_sender import send_email

def process_referrals():
    try:
        users = User.query.all()

        for user in users:
            receiver_email = user.email
            name = user.name
            referral_code = user.referral_code

            send_email(receiver_email, name, referral_code)

            print(f"Email sent to {receiver_email} with referral code {referral_code}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    with app.app_context():
        process_referrals()
