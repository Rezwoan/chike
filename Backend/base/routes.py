from flask import Blueprint, render_template

# Create a Blueprint for base routes
base_bp = Blueprint('base', __name__)

@base_bp.route('/')
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
    return html_content  # Render the base template for the home page
