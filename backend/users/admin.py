from django.contrib.auth.admin import UserAdmin
from django.contrib import admin

from . import models


# Register your models here.
admin.site.register(models.CustomUser, UserAdmin)
