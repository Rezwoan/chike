from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
from extensions import db
from models import User
from referral.routes import process_referral  # Import referral route logic
from referral.utils import generate_referral_code
from email_sender import send_email

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Signup route that optionally processes referral codes."""
    # Parse JSON data from the request
    data = request.get_json()

    # Extract fields
    name = data.get('name')
    email = data.get('email')
    password = data.get('password', None)  # Password is optional
    referral_code = data.get('referral_code', None)  # Optional referral code

    # Validate required fields
    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    # Check if the email is already registered
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email is already registered'}), 400

    # Hash the password if provided; otherwise, set a placeholder
    hashed_password = generate_password_hash(password) if password else generate_password_hash('default_password')

    # Generate a unique referral code for the new user
    new_referral_code = generate_referral_code()

    # Process referral if referral_code is provided
    if referral_code:   
        # Call the process_referral function directly
        referral_response, referral_status = process_referral({
            'email': email,
            'referrer_code': referral_code
        })
        if referral_status != 200:
            return referral_response, referral_status  # Return error if referral processing fails

    # Create the new user
    user = User(
        name=name,
        email=email,
        password=hashed_password,
        referral_code=new_referral_code
    )
    
    db.session.add(user)
    db.session.commit()
    
    #sent email to user
    send_email(email, name, new_referral_code)

    return jsonify({
        'message': 'Signup successful!',
        'referral_code': new_referral_code
    }), 201

@auth_bp.route('/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Check if the email exists (but don't expose whether it does)
    user = User.query.filter_by(email=email).first()
    if user:
        # Logic to send a reset email goes here
        pass

    # Always return this response for security reasons
    return jsonify({"message": "If this email is attached to an account, you will receive a password reset email shortly."}), 200
