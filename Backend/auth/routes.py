from flask import Blueprint, request, jsonify
from sqlalchemy import null
from werkzeug.security import generate_password_hash
from werkzeug.security import check_password_hash
from extensions import db
from models import User
from referral.routes import process_referral  # Import referral route logic
from referral.utils import generate_referral_code
from auth.utils import generate_token
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
    # check if referral exits
    while User.query.filter_by(referral_code=new_referral_code).first():
        new_referral_code = generate_referral_code()

    password_Token = generate_token()
    # check if Token exist
    while User.query.filter_by(pass_token=password_Token).first():
        new_referral_code = generate_token()
    
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
    
    ###need to add the Token to send the Email"


    return jsonify({
        'message': 'Signup successful!',
        'referral_code': new_referral_code
    }), 201


@auth_bp.route('/auth/set-password', methods=['POST'])
def set_password():
    # Get JSON data from the request
    data = request.get_json()

    # Extract pass_token and new_password from the request
    pass_token = data.get('pass_token')
    new_password = data.get('new_password')

    # Validate input
    if not pass_token or not new_password:
        return jsonify({"error": "pass_token and new_password are required"}), 400

    # Find the user associated with the pass_token
    user = User.query.filter_by(pass_token=pass_token).first()

    if not user:
        return jsonify({"error": "Invalid pass_token"}), 404

    # Set the user's password
    user.password = generate_password_hash(new_password)  # Hash the new password
    user.pass_token = null  # invalidate the token after use

    # Commit the changes to the database
    db.session.commit()

    return jsonify({"message": "Password has been set successfully"}), 200



@auth_bp.route('/auth/reset-password-request', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    # Check if the email exists
    user = User.query.filter_by(email=email).first()
    if user:
        # Generate a unique token
        reset_token = generate_token()
        user.pass_token = reset_token

        # Commit the token to the database
        db.session.commit()

        # Call the separate function to send the email
        try:
            ###
            send_reset_email(user.email, user.name, reset_token)
        
        except Exception as e:
            return jsonify({"error": "Failed to send email"}), 500

    # Always return this response for security reasons
    return jsonify({"message": "If this email is attached to an account, you will receive a password reset email shortly."}), 200

@auth_bp.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()

    # Extract email and password from the request
    email = data.get("email")
    password = data.get("password")

    # Validate input
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Find the user in the database
    user = User.query.filter_by(email=email).first()

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    # Verify the password
    if not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Generate a response (e.g., return a success message or token)
    # In production, you would generate and return a JWT or session token here
    return jsonify({"message": "Login successful", "user": {"id": user.id, "email": user.email, "name": user.name}}), 200
