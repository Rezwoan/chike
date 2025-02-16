from flask import Blueprint, request, jsonify
import json, random
from datetime import datetime, timedelta
from extensions import db
from models import User  # Import User model

trivia_bp = Blueprint('trivia', __name__)

# Load and parse questions from the JSON file
def load_questions():
    with open("questions.json", "r", encoding="utf-8") as file:
        questions = json.load(file)  # Read entire JSON file as a list of dictionaries
    
    question_map = {q["id"]: q for q in questions}  # Store full question data by ID
    return question_map

question_map = load_questions()

@trivia_bp.route("/get_questions", methods=["POST"])
def get_questions():
    """Retrieve 10 random trivia questions, ensuring user cooldown."""
    data = request.get_json()
    user_id = data.get("user_id")  # User must provide an ID

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Fetch user from database
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    now = datetime.utcnow()

    # Check if user has played within the last hour
    if user.last_trivia_attempt and now - user.last_trivia_attempt < timedelta(minutes=1):
        remaining_time = timedelta(hours=1) - (now - user.last_trivia_attempt)
        minutes_left = remaining_time.total_seconds() // 60
        return jsonify({"error": f"Please wait {int(minutes_left)} more minutes before playing again."}), 403

    # If eligible, return 10 random questions
    random_questions = random.sample(list(question_map.values()), 10)
    return jsonify({"questions": random_questions})

@trivia_bp.route("/check_results", methods=["POST"])
def check_results():
    """Check user's answers and update points."""
    data = request.get_json()
    user_id = data.get("user_id")  # Ensure the request includes user ID
    user_answers = data.get("answers", {})

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Fetch user from database
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    now = datetime.utcnow()

    # Calculate score
    score = 0
    results = {}
    for question_id, answer in user_answers.items():
        question_data = question_map.get(question_id, {})
        correct_answer = question_data.get("correct_answer", "")
        is_correct = answer == correct_answer
        results[question_id] = {
            "question": question_data.get("question", ""),
            "your_answer": answer,
            "correct_answer": correct_answer,
            "is_correct": is_correct,
            "subject": question_data.get("subject", ""),
            "difficulty": question_data.get("difficulty", "")
        }
        if is_correct:
            score += 1  # Increase score for each correct answer

    # Update user data
    user.last_trivia_attempt = now
    points_earned = score * 10  # Each correct answer gives 10 points
    user.total_points += points_earned
    db.session.commit()

    return jsonify({
        "score": score,
        "points_earned": points_earned,
        "total_points": user.total_points,
        "results": results
    })
