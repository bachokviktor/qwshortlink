from rest_framework import serializers

from . import models


class LinkSerializer(serializers.ModelSerializer):
    """
    This serializer is used to serialize link data.
    """
    class Meta:
        model = models.Link
        fields = ["id", "url", "short_url", "created_at", "owner"]
        read_only_fields = ["short_url", "created_at", "owner"]


class CompactLinkSerializer(serializers.ModelSerializer):
    """
    This is a read-only serializer, used to
    retrieve a url and its short version.
    """
    class Meta:
        model = models.Link
        fields = ["id", "url", "short_url"]
        read_only_fields = ["url", "short_url"]
