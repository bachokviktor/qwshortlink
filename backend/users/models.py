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


def generate_password_reset_code():
    """
    Generates a short random string.
    """
    char_pool = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    while True:
        code = "".join(
            secrets.choice(char_pool) for _ in range(10)
        )
        collisions = PasswordResetCode.objects.filter(code=code)

        if not collisions:
            return code


def get_expiration_date():
    return timezone.now() + timedelta(minutes=30)


class CustomUser(AbstractUser):
    email = models.EmailField(
        verbose_name=_("email address"),
        unique=True
    )
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
        max_length=10,
        default=generate_verification_code,
        unique=True,
        editable=False
    )
    email = models.EmailField(
        verbose_name=_("email address"),
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
            models.Index(fields=["code"]),
            models.Index(fields=["email"])
        ]

    def __str__(self):
        return f"{self.code}: {self.email}"


class PasswordResetCode(models.Model):
    """
    This model represents a password reset code.
    """
    code = models.CharField(
        verbose_name=_("password reset code"),
        default=generate_password_reset_code,
        max_length=10,
        unique=True,
        editable=False
    )
    user = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, verbose_name=_("user")
    )
    expires_at = models.DateTimeField(
        verbose_name=_("expires at"),
        blank=True,
        default=get_expiration_date
    )

    class Meta:
        verbose_name = _("password reset code")
        verbose_name_plural = _("password reset codes")
        indexes = [
            models.Index(fields=["code"])
        ]

    def __str__(self):
        return f"{self.code}: {self.user.username}"
