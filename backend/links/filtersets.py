from django.db.models import Q
from django_filters import rest_framework as filters

from . import models


class LinkFilter(filters.FilterSet):
    class Meta:
        model = models.Link
        fields = ["short_code"]


class MultiLinkFilter(filters.FilterSet):
    q = filters.CharFilter(
        method="url_or_code_match", label="Search"
    )

    class Meta:
        model = models.Link
        fields = ["q"]

    def url_or_code_match(self, queryset, name, value):
        return queryset.filter(
            Q(url__icontains=value) | Q(short_code__icontains=value)
        )
