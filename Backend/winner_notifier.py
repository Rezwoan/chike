import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

# Configuration
SENDER_EMAIL = "hi@playchike.com"
PASSWORD = "#cab466GOES601#"
SMTP_SERVER = "mail.playchike.com"
SMTP_PORT = 465  # Use 465 for SSL

def send_winner_email(receiver_email, name, referral_count, prize, timeframe, date, referral_code):

    # Email subject
    subject = f"🎉 Congratulations, You’re the {timeframe.capitalize()} Top Referrer!"

    # HTML Email Body
    html_message = f"""
    <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    background-color: #f9f9f9;
                    margin: 0;
                    padding: 0;
                }}
                .email-container {{
                    background-color: #ffffff;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 600px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                }}
                .header {{
                    background-color: #67358E;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                }}
                .header h1 {{
                    margin: 0;
                    font-size: 24px;
                }}
                .content {{
                    padding: 20px;
                    text-align: center;
                    color: #333333;
                }}
                .content p {{
                    margin: 10px 0;
                    font-size: 16px;
                    line-height: 1.5;
                }}
                .cta-button {{
                    display: inline-block;
                    background-color: #ffffff;
                    color: #000000;
                    text-decoration: none;
                    padding: 10px 20px;
                    margin-top: 20px;
                    border-radius: 50px;
                    font-size: 16px;
                }}
                .cta-button:hover {{
                    background-color: #8B5FBF;
                }}
                .referral-link {{
                    display: inline-block;
                    color: #67358E;
                    text-decoration: none;
                    font-weight: bold;
                    word-break: break-word;
                }}
                .referral-link:hover {{
                    text-decoration: underline;
                }}
                .footer {{
                    margin-top: 20px;
                    padding: 10px;
                    font-size: 14px;
                    color: #999999;
                }}
            </style>
        </head>
        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="header">
                    <h1>🎉 You’re the {timeframe.capitalize()} Top Referrer!</h1>
                </div>
                <!-- Content -->
                <div class="content">
                    <p>Hi <strong>{name}</strong>,</p>
                    <p>Congratulations for being the top referrer {timeframe}!</p>
                    <p><strong>Date:</strong> {date}</p>
                    <p><strong>Referrals:</strong> {referral_count}</p>
                    <p><strong>Prize:</strong> {prize}</p>
                    <p>Your hard work and dedication paid off!</p>
                    <p>Want to win again next time? Keep sharing your unique referral link:</p>
                    <p style="color: #28A745; font-weight: bold; font-size: 16px;">Playchike.com/signup?ref={referral_code}</p>

                    
                    
                </div>
                <!-- Footer -->
                <div class="footer">
                    <p>Thank you for being an active part of our community!</p>
                    <p>If you have any questions, reply to this email — we’re here to help.</p>
                    <p>Cheers,</p>
                    <p><strong>The Playchike.com Team</strong></p>
                </div>
            </div>
        </body>
    </html>
    """

    # Create a multipart message
    message = MIMEMultipart("alternative")
    message["From"] = SENDER_EMAIL
    message["To"] = receiver_email
    message["Subject"] = subject

    # Attach the HTML content
    message.attach(MIMEText(html_message, "html"))

    try:
        # Connect to the SMTP server over SSL
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
            # Log in to the server
            server.login(SENDER_EMAIL, PASSWORD)

            # Send the email
            server.send_message(message)

        print(f"Winner email sent successfully to {receiver_email}")

    except Exception as e:
        print(f"Failed to send email to {receiver_email}. Error: {e}")

# Example Usage
if __name__ == "__main__":
    # Example winner details
    today_date = datetime.now().strftime("%B %d, %Y")  # Format: "Month Day, Year"
    send_winner_email(
        receiver_email="johnwick10242048@gmail.com",
        name="John Doe",
        referral_count=25,
        prize="$1",
        timeframe="daily",
        date=today_date,
        referral_code="REF123456"
    )
