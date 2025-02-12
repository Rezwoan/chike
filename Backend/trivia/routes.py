from flask import Blueprint, request, jsonify, render_template
import json , random

trivia_bp = Blueprint('trivia', __name__)

# Load and parse questions from the JSON file
def load_questions():
    with open("questions.json", "r", encoding="utf-8") as file:
        questions = json.load(file)  # Read entire JSON file as a list of dictionaries
    
    question_map = {q["id"]: q for q in questions}  # Store full question data by ID
    return question_map

question_map = load_questions()


@trivia_bp.route("/get_questions", methods=["GET"])
def get_questions():
    load_questions()
    random_questions = random.sample(list(question_map.values()), 10)  # Pick 10 random questions
    return jsonify({"questions": random_questions})

@trivia_bp.route("/check_results", methods=["POST"])
def check_results():
    data = request.get_json()
    user_answers = data.get("answers", {})
    
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
            score += 1
    
    return jsonify({"score": score, "results": results})