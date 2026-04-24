from django.contrib.auth.admin import UserAdmin
from django.contrib import admin

from . import models


class CustomUserAdmin(UserAdmin):
    list_display = (
        "username",
        "email",
        "first_name",
        "last_name",
        "verified",
        "is_staff"
    )
    list_filter = (
        "verified", "is_staff", "is_superuser", "is_active", "groups"
    )


admin.site.register(models.CustomUser, CustomUserAdmin)
admin.site.register(models.VerificationCode)
