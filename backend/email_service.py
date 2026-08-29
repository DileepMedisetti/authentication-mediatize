import smtplib
import os
from email.message import EmailMessage
from dotenv import load_dotenv

load_dotenv()

# Gmail's mail server
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587


EMAIL_USERNAME = os.getenv("EMAIL_USERNAME")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")



def send_reset_email(receiver_email: str, reset_link: str):

    message = EmailMessage()

    message["Subject"] = "Password Reset Request"
    message["From"] = EMAIL_USERNAME
    message["To"] = receiver_email

    message.set_content(
        f"""
Hello,

We received a request to reset your password.

Click the link below to reset your password:

{reset_link}

This link will expire in 30 minutes.

If you did not request a password reset, you can safely ignore this email.

Regards,
Authentication Team
"""
    )

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT, timeout=15) as server:

        server.starttls()

        server.login(
            EMAIL_USERNAME,
            EMAIL_PASSWORD
        )

        server.send_message(message)
        