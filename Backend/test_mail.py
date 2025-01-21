# test_send_email.py

from email_sender import send_email

# Test variables
receiver_email = "johnwick10242048@gmail.com"
name = "John"
referral_code = "REF123456"

# Call the send_email function from email_sender.py
send_email(receiver_email, name, referral_code)
