from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from drf_spectacular.utils import (
    extend_schema_view, extend_schema, OpenApiParameter
)
from drf_spectacular.types import OpenApiTypes

from links.serializers import LinkSerializer
from .serializers import CreateUserSerializer, UserSerializer


@extend_schema_view(
    post=extend_schema(
        summary=_("Create a new user"),
        description=_("Create a new user"),
    ),
)
class UserRegisterView(generics.CreateAPIView):
    """
    This view handles user registration.
    """
    queryset = get_user_model().objects.all()
    serializer_class = CreateUserSerializer
    permission_classes = [AllowAny]


@extend_schema_view(
    get=extend_schema(
        summary=_("Retrieve the current user"),
        description=_("Retrieve the current user"),
    ),
    put=extend_schema(
        summary=_("Update the current user"),
        description=_("Update the current user"),
    ),
    patch=extend_schema(
        summary=_("Partially update the current user"),
        description=_("Partially update the current user"),
    ),
    delete=extend_schema(
        summary=_("Delete the current user"),
        description=_("Delete the current user"),
    ),
)
class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    This view is used to retrieve or modify the current user data.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


@extend_schema_view(
    get=extend_schema(
        summary=_("Fetch all the links of the current user"),
        description=_("Fetch all the links of the current user"),
        parameters=[
            OpenApiParameter(
                name="page",
                description=_("A page number within the paginated result set"),
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY
            )
        ],
    ),
)
class UserLinksView(generics.ListAPIView):
    """
    This view is used to fetch all links of the current user.
    """
    serializer_class = LinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.request.user.urls.all().order_by("-created_at")
