from django.core.mail import send_mail
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
    pass
