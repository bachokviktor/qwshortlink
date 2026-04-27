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
        subject="QWShortLink Email Verification",
        message=email_content,
        from_email="noreply@example.com",
        recipient_list=[user.email]
    )


@shared_task
def send_password_reset_email(pk):
    """
    This task asynchronously sends a password reset email to the user.
    """
    user = get_user_model().objects.get(pk=pk)

    password_reset_code = models.PasswordResetCode.objects.create(
        user=user,
    )

    email_content = render_to_string(
        "users/password_reset_email.txt",
        context={
            "password_reset_code": password_reset_code.code,
        }
    )

    send_mail(
        subject="QWShortLink Password Reset",
        message=email_content,
        from_email="noreply@example.com",
        recipient_list=[user.email]
    )
