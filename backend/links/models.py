import secrets
from django.contrib.auth import get_user_model
from django.db import models


def generate_short_url():
    """
    Generates a short random string.
    """
    char_pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    while True:
        short_url = "".join(secrets.choice(char_pool) for _ in range(6))
        check = Link.objects.filter(short_url=short_url)

        if not check:
            return short_url


class Link(models.Model):
    """
    This model represents a link.
    """
    url = models.URLField()
    short_url = models.CharField(
        default=generate_short_url, unique=True, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="urls"
    )

    class Meta:
        indexes = [
            models.Index(fields=["url"]),
            models.Index(fields=["short_url"])
        ]

    def __str__(self):
        return self.url
