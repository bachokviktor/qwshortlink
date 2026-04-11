import secrets
from django.contrib.auth import get_user_model
from django.db import models


def generate_short_code():
    """
    Generates a short random string.
    """
    char_pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    while True:
        short_code = "".join(secrets.choice(char_pool) for _ in range(6))
        collisions = Link.objects.filter(short_code=short_code)

        if not collisions:
            return short_code


class Link(models.Model):
    """
    This model represents a link.
    """
    url = models.URLField()
    short_code = models.CharField(
        default=generate_short_code, unique=True, editable=False
    )
    created_at = models.DateTimeField(auto_now_add=True)
    owner = models.ForeignKey(
        get_user_model(), on_delete=models.CASCADE, related_name="links"
    )

    class Meta:
        indexes = [
            models.Index(fields=["url"]),
            models.Index(fields=["short_code"])
        ]

    def __str__(self):
        return f"{self.short_code}: {self.url}"
