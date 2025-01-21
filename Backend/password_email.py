import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Configuration
SENDER_EMAIL = "hi@playchike.com"
PASSWORD = "#cab466GOES601#"
SMTP_SERVER = "mail.playchike.com"
SMTP_PORT = 465  # Use 465 for SSL

def send_email(receiver_email,  referral_code):


    # Create the referral link
    referral_link = f"https://Playchike.com/set-password?token={referral_code}"

    # Email subject
    subject = "Welcome to Playchike.com! Here's Your set password link"

    # Plain-text Email Body
    plain_text_message = f"""
Hello,

Welcome to Playchike.com — we’re thrilled to have you with us!

Below is your unique referral link:
{referral_link}

Please click on the link to set your password. 
This link is only valid for one time use.

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


receiver_email = "johnwick10242048@gmail.com"
name = "John"
referral_code = "REF123456"

# Call the send_email function from email_sender.py
send_email(receiver_email, referral_code)