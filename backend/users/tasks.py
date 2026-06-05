from datetime import timedelta
from django.core.mail import send_mail
from django.contrib.auth import get_user_model
from django.utils import timezone
from allauth.account.models import EmailConfirmation
from celery import shared_task


@shared_task
def send_async_email(subject, message, sender, recipient):
    """
    This task asynchronously sends an email to a user.
    """
    send_mail(subject, message, sender, [recipient])


@shared_task
def clear_db():
    """
    This task deletes all the unverified user accounts from the database.
    """
    EmailConfirmation.objects.delete_expired_confirmations()

    get_user_model().objects.filter(
        emailaddress__verified=False,
        emailaddress__primary=True,
        date_joined__lt=timezone.now()-timedelta(days=3)
    ).delete()
