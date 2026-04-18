from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions
from django_filters import rest_framework as filters
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    extend_schema_view, extend_schema, OpenApiParameter
)

from . import serializers, models, filtersets
from .permissions import IsOwner


@extend_schema_view(
    list=extend_schema(
        summary=_("List all links in the system"),
        description=_("List all links in the system"),
        parameters=[
            OpenApiParameter(
                name="page",
                description=_("A page number within the paginated result set"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY
            ),
            OpenApiParameter(
                name="short_code",
                description=_("Short code corresponding to a link"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY
            )
        ]
    ),
    create=extend_schema(
        summary=_("Add a new link"),
        description=_("Add a new link"),
    ),
    retrieve=extend_schema(
        summary=_("Retrieve a link by id"),
        description=_("Retrieve a link by id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying the link"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    update=extend_schema(
        summary=_("Update a link with specified id"),
        description=_("Update a link with specified id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying the link"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    partial_update=extend_schema(
        summary=_("Partially update a link with specified id"),
        description=_("Partially update a link with specified id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying the link"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    destroy=extend_schema(
        summary=_("Delete a link with specified id"),
        description=_("Delete a link with specified id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying the link"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
)
class LinkViewSet(ModelViewSet):
    """
    This view is used to create, retrieve, or update information
    about the links.
    """
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = filtersets.LinkFilter

    @method_decorator(cache_page(300))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        if self.action == "list":
            return models.Link.objects.all().order_by("-created_at")

        return models.Link.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.CompactLinkSerializer

        return serializers.LinkSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwner]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
