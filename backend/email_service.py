from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, Personalization
from config import settings
from models import Incentive, User
from database import SessionLocal
from jinja2 import Template
import logging
from datetime import datetime, timedelta
from sqlalchemy import and_, or_

logger = logging.getLogger(__name__)

class EmailService:
    def __init__(self):
        self.sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        self.from_email = settings.SENDGRID_FROM_EMAIL

    def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        """Send email via SendGrid"""
        try:
            mail = Mail(
                from_email=self.from_email,
                to_emails=to_email,
                subject=subject,
                html_content=html_content
            )
            response = self.sg.send(mail)
            logger.info(f"Email sent to {to_email}: {response.status_code}")
            return response.status_code in [200, 202]
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False

    def send_welcome_email(self, email: str, full_name: str) -> bool:
        """Send welcome email to new user"""
        template = Template("""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Welcome to BuilderIQ, {{ name }}!</h2>
                <p>You're now connected to the most comprehensive builder incentive database.</p>
                <p>Get started by:</p>
                <ul>
                    <li><a href="{{ frontend_url }}/search">Searching for deals</a></li>
                    <li><a href="{{ frontend_url }}/app/marketing">Generating marketing content</a></li>
                    <li><a href="{{ frontend_url }}/app/settings">Setting up email alerts</a></li>
                </ul>
                <p>Questions? Contact us at support@builderiq.com</p>
            </body>
        </html>
        """)
        
        html_content = template.render(name=full_name, frontend_url=settings.FRONTEND_URL)
        return self.send_email(email, "Welcome to BuilderIQ!", html_content)

    def send_weekly_digest(self, user: User, incentives: list) -> bool:
        """Send weekly digest of new incentives"""
        template = Template("""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Your Weekly BuilderIQ Digest</h2>
                <p>Hi {{ name }},</p>
                <p>Here are {{ count }} new incentives from your favorite builders this week:</p>
                
                {% for incentive in incentives %}
                <div style="border: 1px solid #ddd; padding: 12px; margin: 10px 0; border-radius: 4px;">
                    <h4>{{ incentive.type }}</h4>
                    {% if incentive.value %}
                    <p style="font-size: 18px; color: #2ecc71; font-weight: bold;">${{ "%.0f"|format(incentive.value) }}</p>
                    {% endif %}
                    <p>{{ incentive.description }}</p>
                    {% if incentive.expiration_date %}
                    <p style="color: #e74c3c; font-size: 12px;">Expires: {{ incentive.expiration_date.strftime('%B %d, %Y') }}</p>
                    {% endif %}
                </div>
                {% endfor %}
                
                <p><a href="{{ frontend_url }}/app/dashboard" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">View All Incentives</a></p>
            </body>
        </html>
        """)
        
        html_content = template.render(
            name=user.full_name or user.email,
            count=len(incentives),
            incentives=incentives,
            frontend_url=settings.FRONTEND_URL
        )
        
        return self.send_email(user.email, "Your Weekly BuilderIQ Digest", html_content)

    def send_submission_approved_email(self, user: User, submission: dict) -> bool:
        """Send notification when submission is approved"""
        template = Template("""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Your Submission Was Approved!</h2>
                <p>Hi {{ user_name }},</p>
                <p>Great news! Your incentive submission has been approved and is now live on BuilderIQ.</p>
                
                <div style="background-color: #f0f0f0; padding: 15px; border-radius: 4px;">
                    <p><strong>{{ submission_type }}</strong></p>
                    <p>{{ submission_description }}</p>
                </div>
                
                <p>Thank you for contributing to BuilderIQ!</p>
            </body>
        </html>
        """)
        
        html_content = template.render(
            user_name=user.full_name or user.email,
            submission_type=submission.get('type'),
            submission_description=submission.get('description')
        )
        
        return self.send_email(user.email, "Your Submission Was Approved", html_content)

    def send_submission_rejected_email(self, user: User, reason: str) -> bool:
        """Send notification when submission is rejected"""
        template = Template("""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>Submission Review</h2>
                <p>Hi {{ user_name }},</p>
                <p>Thank you for your submission. Unfortunately, it didn't meet our criteria.</p>
                
                <p><strong>Reason:</strong></p>
                <p>{{ reason }}</p>
                
                <p>Feel free to <a href="{{ frontend_url }}/app/submit">submit another one</a> or <a href="mailto:support@builderiq.com">contact us</a> if you have questions.</p>
            </body>
        </html>
        """)
        
        html_content = template.render(
            user_name=user.full_name or user.email,
            reason=reason,
            frontend_url=settings.FRONTEND_URL
        )
        
        return self.send_email(user.email, "Submission Review", html_content)

email_service = EmailService()
