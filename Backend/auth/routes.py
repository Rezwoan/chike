from flask import Blueprint, request, jsonify, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from extensions import db
from models import User
from referral.routes import process_referral
from referral.utils import generate_referral_code
from auth.utils import generate_token
from email_sender import send_email  # Ensure these functions are defined
from password_email import send_password_reset_email

auth_bp = Blueprint('auth', __name__)

# 1. Define the handle_preflight function.
def handle_preflight():
    response = make_response()  # Or jsonify if you prefer a JSON body
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Origin, Access-Control-Allow-Methods"
    )
    response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    return response

@auth_bp.route('/signup', methods=['OPTIONS', 'POST'])
def signup():
    """Signup route with referral processing."""
    if request.method == 'OPTIONS':
        # 2. Just return the handle_preflight here
        return handle_preflight()

    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password', None)
        referral_code = data.get('referral_code', None)

        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400

        if User.query.filter_by(email=email).first():
            return jsonify({'error': 'Email is already registered'}), 400

        hashed_password = generate_password_hash(password or 'default_password')

        new_referral_code = generate_referral_code()
        while User.query.filter_by(referral_code=new_referral_code).first():
            new_referral_code = generate_referral_code()

        password_token = generate_token()
        while User.query.filter_by(pass_token=password_token).first():
            password_token = generate_token()

        if referral_code:
            referral_response, referral_status = process_referral({
                'email': email,
                'referrer_code': referral_code
            })
            if referral_status != 200:
                return referral_response, referral_status

        user = User(
            name=name,
            email=email,
            password=hashed_password,
            referral_code=new_referral_code,
            pass_token=password_token
        )
        db.session.add(user)
        db.session.commit()

        send_email(email, name, new_referral_code)
        send_password_reset_email(email, name, password_token)

        return jsonify({
            'message': 'Signup successful!',
            'referral_code': new_referral_code
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@auth_bp.route('/set-password', methods=['OPTIONS', 'POST'])
def setPassword():
    """Sets a new password for a user."""
    if request.method == 'OPTIONS':
        return handle_preflight()

    try:
        data = request.get_json()
        pass_token = data.get('pass_token')
        new_password = data.get('new_password')

        if not pass_token or not new_password:
            return jsonify({"error": "pass_token and new_password are required"}), 400

        user = User.query.filter_by(pass_token=pass_token).first()
        if not user:
            return jsonify({"error": "Invalid pass_token"}), 404

        user.password = generate_password_hash(new_password)
        user.pass_token = None
        db.session.commit()

        response = jsonify({"message": "Password has been set successfully"})
        response.headers.add("Access-Control-Allow-Origin", "*")  # Or restrict to specific origin
        return response, 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route('/reset-password-request', methods=['POST'])
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
            send_password_reset_email(user.email, user.name, reset_token)
        except Exception as e:
            return jsonify({"error": "Failed to send email"}), 500

    # Always return this response for security reasons
    return jsonify({"message": "If this email is attached to an account, you will receive a password reset email shortly."}), 200


@auth_bp.route('/login', methods=['OPTIONS', 'POST'])
def login():
    if request.method == 'OPTIONS':
        return handle_preflight()

    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not check_password_hash(user.password, password):
            return jsonify({"error": "Invalid email or password"}), 401

        return jsonify({
            "message": "Login successful",
            "user": {"id": user.id, "email": user.email, "name": user.name}
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
