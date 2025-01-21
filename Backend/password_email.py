import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
SENDER_EMAIL = "hi@playchike.com"
PASSWORD = "#cab466GOES601#"
SMTP_SERVER = "mail.playchike.com"
SMTP_PORT = 465  # Use 465 for SSL

def send_password_reset_email(receiver_email, name, password_token):
    """
    Sends a plain-text email with a link to reset the password using a password token.

    Args:
        receiver_email (str): Recipient's email address.
        name (str): Recipient's name.
        password_token (str): Unique password reset token.
    """

    # Create the password reset link
    reset_link = f"https://playchike.com/set-password?token={password_token}"

    # Email subject
    subject = "Reset Your Password - Playchike.com"

    # Plain-text Email Body
    plain_text_message = f"""
Hello {name},

We received a request to reset your password for your Playchike.com account.

Click the link below to reset your password:
{reset_link}

If you didn’t request a password reset, you can safely ignore this email.

This link is only valid for one-time use and will expire after a certain period.

If you have any questions, just reply to this email — we’re always here to help.

Cheers,
The Playchike.com Team
"""

    # Create a multipart message
    message = MIMEMultipart("alternative")
    message["From"] = SENDER_EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject

    # Attach the plain-text content
    message.attach(MIMEText(plain_text_message, "plain"))

    try:
        # Connect to the SMTP server over SSL
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:

            # Optional: Enable debug output for troubleshooting
            # server.set_debuglevel(1)

            # Log in to the SMTP server
            server.login(SENDER_EMAIL, PASSWORD)

            # Send the email
            server.send_message(message)

        print(f"Password reset email sent successfully to {receiver_email}")

    except Exception as e:
        print(f"Failed to send password reset email to {receiver_email}. Error: {e}")

# Example usage
if __name__ == "__main__":
    receiver_email = "sowadhossain017@gmail.com"
    password_token = "TOKEN12345"
    name = "Sowad"

    # Send the password reset email
    send_password_reset_email(receiver_email, name, password_token)
