from django.contrib import admin

from . import models


class LinkAdmin(admin.ModelAdmin):
    fields = ["url", "owner"]
    readonly_fields = ["short_code", "created_at"]
    list_display = ["short_code", "url", "owner", "created_at"]
    search_fields = ["url", "short_code"]


admin.site.register(models.Link, LinkAdmin)
