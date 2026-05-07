from django.utils.translation import gettext_lazy as _
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.shortcuts import redirect, get_object_or_404
from django.db.models import F
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework import permissions
from django_filters import rest_framework as filters
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import (
    extend_schema_view, extend_schema, OpenApiParameter
)

from . import serializers, models, filtersets
from .permissions import IsOwner
from users.permissions import IsVerifiend


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
    redirect=extend_schema(
        summary=_("Redirect to a link by id"),
        description=_("Redirect to a link by id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying the link"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ],
        responses={302: None},
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

    @action(detail=True, methods=["get"])
    def redirect(self, request, pk=None):
        link = get_object_or_404(models.Link, pk=pk)

        link.clicks = F("clicks") + 1
        link.save()

        return redirect(link.url)

    def get_queryset(self):
        if self.action == "list":
            return models.Link.objects.all().order_by("-created_at")

        return models.Link.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.CompactLinkSerializer

        return serializers.LinkSerializer

    def get_permissions(self):
        if (self.action == "list") or (self.action == "redirect"):
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated, IsVerifiend]
        else:
            permission_classes = [
                permissions.IsAuthenticated, IsVerifiend, IsOwner
            ]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
