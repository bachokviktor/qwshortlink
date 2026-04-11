from django_filters import rest_framework as filters

from . import models


class LinkFilter(filters.FilterSet):
    class Meta:
        model = models.Link
        fields = ["short_code"]
