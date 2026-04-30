from datetime import timedelta
from django.contrib.auth import get_user_model
from django.template.loader import render_to_string
from django.core.mail import send_mail
from django.utils import timezone
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
        from_email=None,
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
        from_email=None,
        recipient_list=[user.email]
    )


@shared_task
def clear_db():
    """
    This task deletes all the expired codes and
    unverified user accounts from the database.
    """
    get_user_model().objects.filter(verified=False).filter(
        date_joined__lt=timezone.now()-timedelta(days=5)
    ).delete()

    models.VerificationCode.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()

    models.PasswordResetCode.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()
