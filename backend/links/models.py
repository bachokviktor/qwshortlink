import secrets
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


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
    url = models.URLField(max_length=2048)
    short_code = models.CharField(
        verbose_name=_("short code"),
        default=generate_short_code,
        unique=True,
        editable=False
    )
    created_at = models.DateTimeField(
        verbose_name=_("created at"),
        auto_now_add=True
    )
    owner = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
        related_name="links",
        verbose_name=_("owner")
    )
    clicks = models.IntegerField(
        verbose_name=_("number of clicks"),
        blank=True,
        default=0,
        validators=[MinValueValidator(0)]
    )

    class Meta:
        verbose_name = _("link")
        verbose_name_plural = _("links")
        indexes = [
            models.Index(fields=["url"]),
            models.Index(fields=["short_code"])
        ]

    def __str__(self):
        return f"{self.short_code}: {self.url}"
