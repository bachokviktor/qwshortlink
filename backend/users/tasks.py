from celery import shared_task


@shared_task
def send_async_email():
    """
    This task asynchronously sends an email to a user.
    """
    pass


@shared_task
def clear_db():
    """
    This task deletes all the unverified user accounts from the database.
    """
    pass
