"""
Email utility for sending notifications via Gmail SMTP.
"""
import smtplib
import threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from config import Config


def send_contact_notification_async(contact_data: dict) -> None:
    """
    Send email notification in a background thread.
    This returns immediately and doesn't block the main request.
    
    Args:
        contact_data: Dictionary containing form data (name, email, phone, message)
    """
    thread = threading.Thread(
        target=_send_contact_notification,
        args=(contact_data,),
        daemon=True  # Thread will be killed when main program exits
    )
    thread.start()
    print("Email notification queued in background thread")


def _send_contact_notification(contact_data: dict) -> bool:
    """
    Internal function to send email notification.
    Called in a background thread by send_contact_notification_async.
    
    Args:
        contact_data: Dictionary containing form data (name, email, phone, message)
    
    Returns:
        True if email sent successfully, False otherwise
    """
    # Check if email is configured
    if not Config.SMTP_EMAIL or not Config.SMTP_PASSWORD:
        print("Email not configured - skipping notification")
        return False
    
    try:
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"🚀 New Contact: {contact_data.get('name', 'Unknown')} - DevForge"
        msg['From'] = Config.SMTP_EMAIL
        msg['To'] = Config.NOTIFICATION_EMAIL or Config.SMTP_EMAIL
        
        # Format the data
        name = contact_data.get('name', 'N/A')
        email = contact_data.get('email', 'N/A')
        phone = contact_data.get('phone', 'Not provided')
        message = contact_data.get('message', 'No message')
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        
        # Plain text version
        text_content = f"""
New Contact Form Submission
===========================

Name: {name}
Email: {email}
Phone: {phone}

Message:
{message}

---
Submitted at: {timestamp}
        """
        
        # HTML version
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }}
        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
        .header {{ background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }}
        .header h1 {{ margin: 0; font-size: 24px; }}
        .content {{ background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px; }}
        .field {{ margin-bottom: 20px; }}
        .field-label {{ font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; }}
        .field-value {{ font-size: 16px; color: #1e293b; }}
        .message-box {{ background: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; white-space: pre-wrap; }}
        .footer {{ text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8; }}
        .badge {{ display: inline-block; background: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="field-label">Name</div>
                <div class="field-value">{name}</div>
            </div>
            
            <div class="field">
                <div class="field-label">Email</div>
                <div class="field-value"><a href="mailto:{email}">{email}</a></div>
            </div>
            
            <div class="field">
                <div class="field-label">Phone</div>
                <div class="field-value">{phone}</div>
            </div>
            
            <div class="field">
                <div class="field-label">Message</div>
                <div class="message-box">{message}</div>
            </div>
        </div>
        <div class="footer">
            Submitted on {timestamp} via DevForge Contact Form
        </div>
    </div>
</body>
</html>
        """
        
        # Attach both versions
        part1 = MIMEText(text_content, 'plain')
        part2 = MIMEText(html_content, 'html')
        msg.attach(part1)
        msg.attach(part2)
        
        # Send email
        with smtplib.SMTP(Config.SMTP_HOST, Config.SMTP_PORT) as server:
            server.starttls()
            server.login(Config.SMTP_EMAIL, Config.SMTP_PASSWORD)
            server.send_message(msg)
        
        print(f"Email notification sent successfully to {msg['To']}")
        return True
        
    except Exception as e:
        print(f"Failed to send email notification: {str(e)}")
        return False

