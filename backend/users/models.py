import secrets
from datetime import timedelta
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


def generate_verification_code():
    """
    Generates a short random string.
    """
    char_pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    while True:
        verification_code = "".join(
            secrets.choice(char_pool) for _ in range(10)
        )
        collisions = VerificationCode.objects.filter(code=verification_code)

        if not collisions:
            return verification_code


def get_expiration_date():
    return timezone.now() + timedelta(hours=1)


class CustomUser(AbstractUser):
    email = models.EmailField(_("email address"))
    verified = models.BooleanField(
        verbose_name=_("verification status"),
        blank=True,
        default=False
    )


class VerificationCode(models.Model):
    """
    This model represents an email verification code.
    """
    code = models.CharField(
        verbose_name=_("verification code"),
        default=generate_verification_code,
        unique=True,
        editable=False
    )
    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        verbose_name=_("user")
    )
    created_at = models.DateTimeField(
        verbose_name=_("created at"),
        auto_now_add=True
    )
    expires_at = models.DateTimeField(
        verbose_name=_("expires at"),
        blank=True,
        default=get_expiration_date
    )

    class Meta:
        verbose_name = _("verification code")
        verbose_name_plural = _("verification codes")
        indexes = [
            models.Index(fields=["code"])
        ]

    def __str__(self):
        return f"{self.code}: {self.user.username}"
