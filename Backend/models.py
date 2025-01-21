from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(100), nullable=False)
    referral_code = db.Column(db.String(10), unique=True, nullable=False)
    referrals_count = db.Column(db.Integer, default=0)
    profile_picture = db.Column(db.String(255), default='')  # Default profile picture
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship with Referral table
    referrals = db.relationship('Referral', backref='referrer', lazy=True)

class Referral(db.Model):
    __tablename__ = 'referrals'

    id = db.Column(db.Integer, primary_key=True)
    referrer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    referred_email = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)