import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


# Create your models here.
class CustomUser(AbstractUser):
    """
    This is the custom user model, that uses UUID insted of integer id.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
