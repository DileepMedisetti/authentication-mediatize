import os
import resend
from dotenv import load_dotenv

load_dotenv()


# ==========================================
# RESEND CONFIGURATION
# ==========================================

RESEND_API_KEY = os.getenv("RESEND_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM")


if not RESEND_API_KEY:
    raise RuntimeError("RESEND_API_KEY is not configured")

if not EMAIL_FROM:
    raise RuntimeError("EMAIL_FROM is not configured")


resend.api_key = RESEND_API_KEY


# ==========================================
# SEND RESET PASSWORD EMAIL
# ==========================================

def send_reset_email(
    receiver_email: str,
    reset_link: str
):

    params = {
        "from": EMAIL_FROM,

        "to": [receiver_email],

        "subject": "Password Reset Request",

        "text": f"""
Hello,

We received a request to reset your password.

Click the link below to reset your password:

{reset_link}

This link will expire in 30 minutes.

If you did not request a password reset,
you can safely ignore this email.

Regards,
Authentication Team
"""
    }

    try:

        response = resend.Emails.send(params)

        print("Password reset email sent successfully.")

        return response

    except Exception as e:

        print("Failed to send password reset email.")

        print("Error:", str(e))

        raise