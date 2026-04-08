from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.response import Response
from drf_spectacular.utils import (
    extend_schema_view, extend_schema, OpenApiParameter
)
from drf_spectacular.types import OpenApiTypes

from links.serializers import LinkSerializer
from .permissions import IsCurrentUserOrAdmin
from . import serializers


@extend_schema_view(
    list=extend_schema(
        summary=_("List all users in the system"),
        description=_("List all users in the system"),
        parameters=[
            OpenApiParameter(
                name="page",
                description=_("A page number within the paginated result set"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY
            )
        ]
    ),
    create=extend_schema(
        summary=_("Create a new user"),
        description=_("Create a new user"),
    ),
    retrieve=extend_schema(
        summary=_("Retrieve a user by id"),
        description=_("Retrieve a user by id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying this user"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    update=extend_schema(
        summary=_("Update a user with specified id"),
        description=_("Update a user with specified id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying this user"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    partial_update=extend_schema(
        summary=_("Partially update a user with specified id"),
        description=_("Partially update a user with specified id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying this user"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    destroy=extend_schema(
        summary=_("Delete a user with specified id"),
        description=_("Delete a user with specified id"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying this user"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
    links=extend_schema(
        summary=_("Fetch all the links of specified user"),
        description=_("Fetch all the links of specified user"),
        parameters=[
            OpenApiParameter(
                name="id",
                description=_("An integer id identifying this user"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.PATH
            )
        ]
    ),
)
class UserViewSet(ModelViewSet):
    """
    This viewset works with users.
    """
    queryset = get_user_model().objects.all()

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        elif self.action == "list":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsCurrentUserOrAdmin]

        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "create":
            serializer_class = serializers.CreateUserSerializer
        elif self.action == "list":
            serializer_class = serializers.CompactUserSerializer
        elif self.action == "links":
            serializer_class = LinkSerializer
        else:
            serializer_class = serializers.UserSerializer

        return serializer_class

    @action(detail=True)
    def links(self, request, pk=None):
        user = self.get_object()
        user_links = user.urls.all().order_by("-created_at")

        page = self.paginate_queryset(user_links)
        if page is not None:
            serializer = self.get_serializer(page, many=True)

            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(user_links, many=True)

        return Response(serializer.data)
