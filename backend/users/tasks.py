from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.core.mail import send_mail
from celery import shared_task

from . import models


@shared_task
def send_verification_email(pk):
    """
    This task asynchronously sends a verification email to the user.
    """
    user = get_user_model().objects.get(pk=pk)

    verification_code = models.VerificationCode.objects.create(
        email=user.email,
    )

    email_content = render_to_string(
        "users/verification_email.txt",
        context={
            "verification_code": verification_code.code,
        }
    )

    send_mail(
        subject="Email Verification Code",
        message=email_content,
        from_email="noreply@example.com",
        recipient_list=[user.email]
    )
