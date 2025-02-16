from flask import Flask
from extensions import db, migrate, cache
from auth.routes import auth_bp
from referral.routes import referral_bp
from base.routes import base_bp  # Import base routes
from flask_cors import CORS
from flask_apscheduler import APScheduler
from referral.utils import handle_daily_winner, handle_weekly_winner
from datetime import datetime
from extensions import cache
import os
from profile.routes import profile_bp
from trivia.routes import trivia_bp


app = Flask(__name__)
application = app
CORS(app, resources={r"/*": {"origins": ["*"]}})

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
app.register_blueprint(profile_bp, url_prefix='/profile')
app.register_blueprint(trivia_bp, url_prefix='/trivia')  # Trivia routes


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


# Add this after your app initialization
if __name__ == "__main__":
    # Configure the scheduler
    app.config['SCHEDULER_API_ENABLED'] = True
    scheduler.init_app(app)

    # Add daily leaderboard refresh job
    scheduler.add_job(
        id='daily_refresh',
        func=handle_daily_winner,
        trigger='cron',
        hour=23,
        minute=55,
        timezone='US/Eastern'
    )

    # Add weekly leaderboard refresh job
    scheduler.add_job(
        id='weekly_refresh',
        func=handle_weekly_winner,
        trigger='cron',
        day_of_week='sat',
        hour=23,
        minute=55,
        timezone='US/Eastern'
    )

    scheduler.start()
    app.run(debug=True)