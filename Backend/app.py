from flask import Flask
from extensions import db, migrate, cache
from auth.routes import auth_bp
from referral.routes import referral_bp
from base.routes import base_bp  # Import base routes
from flask_cors import CORS
from flask_apscheduler import APScheduler
from referral.utils import get_daily_leaderboard, get_weekly_leaderboard
from datetime import datetime
from extensions import cache
import os

app = Flask(__name__)
application = app
CORS(app)

# Load configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['CACHE_TYPE'] = 'SimpleCache'

# Initialize extensions
db.init_app(app)
migrate.init_app(app, db)
cache.init_app(app)

# Register blueprints
app.register_blueprint(base_bp)  # Base routes
app.register_blueprint(auth_bp, url_prefix='/auth')  # Auth routes
app.register_blueprint(referral_bp, url_prefix='/referral')  # Referral routes

WINNER_DIR = "winner"
DAILY_WINNER_FILE = os.path.join(WINNER_DIR, "daily_winner.txt")
WEEKLY_WINNER_FILE = os.path.join(WINNER_DIR, "weekly_winner.txt")
def ensure_winner_dir():
    """Ensure the winner directory exists."""
    if not os.path.exists(WINNER_DIR):
        os.makedirs(WINNER_DIR)

# **Add a simple '/' route for debugging**
@app.route('/')
def home():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Flask Backend Home</title>
    </head>
    <body>
        <h1>Welcome to the Flask Backend!</h1>
        <p>This is a simple HTML page for debugging purposes.</p>
    </body>
    </html>
    """
    return html_content

with app.app_context():
    db.create_all()


scheduler = APScheduler()


def save_winner_to_file(winner, file_path):
    """Append the winner's name to a text file."""
    ensure_winner_dir()  # Ensure the directory exists
    with open(file_path, "a") as file:  # Append mode
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        file.write(f"{timestamp} - Winner: {winner}\n")

def refresh_daily_leaderboard():
    """Refresh and cache the daily leaderboard."""
    daily_leaderboard = get_daily_leaderboard()
    cache.set('daily_leaderboard', daily_leaderboard, timeout=86400)  # Cache for 24 hours
    if daily_leaderboard:
        daily_winner = daily_leaderboard[0]["name"]  # Get the top winner
        save_winner_to_file(daily_winner, DAILY_WINNER_FILE)
    print(f"Daily leaderboard refreshed and winner saved at {datetime.now()}")

def refresh_weekly_leaderboard():
    """Refresh and cache the weekly leaderboard."""
    weekly_leaderboard = get_weekly_leaderboard()
    cache.set('weekly_leaderboard', weekly_leaderboard, timeout=604800)  # Cache for 7 days
    if weekly_leaderboard:
        weekly_winner = weekly_leaderboard[0]["name"]  # Get the top winner
        save_winner_to_file(weekly_winner, WEEKLY_WINNER_FILE)
    print(f"Weekly leaderboard refreshed and winner saved at {datetime.now()}")


# Add this after your app initialization
if __name__ == "__main__":
    # Configure the scheduler
    app.config['SCHEDULER_API_ENABLED'] = True
    scheduler.init_app(app)

    # Add daily leaderboard refresh job
    scheduler.add_job(
        id='daily_refresh',
        func=refresh_daily_leaderboard,
        trigger='cron',
        hour=0,
        minute=0,
        timezone='US/Eastern'
    )

    # Add weekly leaderboard refresh job
    scheduler.add_job(
        id='weekly_refresh',
        func=refresh_weekly_leaderboard,
        trigger='cron',
        day_of_week='sun',
        hour=0,
        minute=0,
        timezone='US/Eastern'
    )

    scheduler.start()
    app.run(debug=True)