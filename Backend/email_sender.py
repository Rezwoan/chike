import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
SENDER_EMAIL = "hi@playchike.com"
PASSWORD = "#cab466GOES601#"
SMTP_SERVER = "mail.playchike.com"
SMTP_PORT = 465  # Use 465 for SSL

def send_email(receiver_email, name, referral_code):
    """
    Sends a plain-text email with a personalized message and referral link.

    Args:
        receiver_email (str): Recipient's email address.
        name (str): Recipient's name.
        referral_code (str): Referral code to include in the email.
    """

    # Create the referral link
    referral_link = f"https://Playchike.com/signup?ref={referral_code}"

    # Email subject
    subject = "Welcome to Playchike.com! Here's Your Referral Link"

    # Plain-text Email Body
    plain_text_message = f"""
Hello {name},

Welcome to Playchike.com — we’re thrilled to have you with us!

Below is your unique referral link:
{referral_link}

Copy and share this link with your friends and family. By sharing your referral link, you can earn exclusive rewards. Start sharing today!

If you have any questions, just reply to this email — we’re always here to help.

Cheers,
The Playchike.com Team
"""

    # Create a multipart message (to allow for flexibility if you add HTML later)
    message = MIMEMultipart("alternative")
    message["From"] = SENDER_EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject

    # Attach the plain-text content
    message.attach(MIMEText(plain_text_message, "plain"))

    try:
        # Connect to the SMTP server over SSL on port 465
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:

            # Optional: Enable debug output for troubleshooting
            # server.set_debuglevel(1)

            # Log in to the server
            server.login(SENDER_EMAIL, PASSWORD)

            # Send the email
            server.send_message(message)

        print(f"Email sent successfully to {receiver_email}")

    except Exception as e:
        print(f"Failed to send email to {receiver_email}. Error: {e}")

# Example usage
if __name__ == "__main__":
    receiver_email = "sowadhossain017@gmail.com"
    referral_token = "Test"
    name = "sowad"
    # Send the email
    send_email(receiver_email, name ,referral_token)
