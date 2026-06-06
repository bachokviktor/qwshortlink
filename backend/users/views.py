from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.shortcuts import redirect
from django.conf import settings
from django.db.models import Sum
from django.utils.translation import gettext_lazy as _
from django_filters import rest_framework as filters
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import serializers
from drf_spectacular.utils import (
    extend_schema_view, extend_schema, OpenApiParameter, inline_serializer
)
from drf_spectacular.contrib.rest_auth import RestAuthDetailSerializer
from drf_spectacular.types import OpenApiTypes
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from dj_rest_auth.registration.views import SocialLoginView
from dj_rest_auth.views import UserDetailsView
from dj_rest_auth.jwt_auth import unset_jwt_cookies

from links.serializers import LinkSerializer
from links.models import Link
from links.filtersets import MultiLinkFilter

from .serializers import ChangeEmailSerializer


@extend_schema_view(
    get=extend_schema(
        summary=_("Get the current user details"),
        description=_("Get the current user details"),
    ),
    put=extend_schema(
        summary=_("Update the current user details"),
        description=_("Update the current user details"),
    ),
    patch=extend_schema(
        summary=_("Partially update the current user details"),
        description=_("Partially update the current user details"),
    ),
    delete=extend_schema(
        summary=_("Delete the current user with password confirmation"),
        description=_("Delete the current user with password confirmation"),
        responses={
            204: None,
        }
    )
)
class CustomUserDetailsView(UserDetailsView):
    def delete(self, request):
        user = self.get_object()
        password = request.data.get("password")

        if not password:
            return Response(
                {"password": _("This field is required.")},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not user.check_password(password):
            return Response(
                {
                    "error": _(
                        "Failed to authenticate with provided credentials."
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        response = Response(status=status.HTTP_204_NO_CONTENT)

        unset_jwt_cookies(response)

        user.delete()

        return response


@extend_schema_view(
    get=extend_schema(
        summary=_(
            "Redirect a user to the frontend to confirm email verification"
        ),
        description=_(
            "Redirect a user to the frontend to confirm email verification"
        ),
        responses={
            302: None,
        },
        parameters=[
            OpenApiParameter(
                name="key",
                description=_("Email verification key"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH
            ),
        ],
    ),
)
class ConfirmEmailView(APIView):
    def get(self, request, key=None):
        if not key:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return redirect(
            f"{settings.FRONTEND_URL}/auth/verification/{key}"
        )


@extend_schema_view(
    get=extend_schema(
        summary=_(
            "Redirect a user to the frontend to confirm password reset"
        ),
        description=_(
            "Redirect a user to the frontend to confirm password reset"
        ),
        responses={
            302: None,
        },
        parameters=[
            OpenApiParameter(
                name="token",
                description=_("Password reset token"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH
            ),
            OpenApiParameter(
                name="uid",
                description=_("User ID"),
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH
            )
        ],
    ),
)
class ConfirmPasswordResetView(APIView):
    def get(self, request, uid=None, token=None):
        if not uid or not token:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        return redirect(
            f"{settings.FRONTEND_URL}/auth/reset/{uid}/{token}"
        )


@extend_schema_view(
    post=extend_schema(
        summary=_("Authenticate a user with Google social auth"),
        description=_("Authenticate a user with Google social auth"),
    ),
)
class GoogleLoginView(SocialLoginView):
    client_class = OAuth2Client
    adapter_class = GoogleOAuth2Adapter
    callback_url = f"{settings.FRONTEND_URL}/auth/google/callback"


@extend_schema_view(
    post=extend_schema(
        summary=_("Change the current user email"),
        description=_("Change the current user email"),
        responses={
            201: RestAuthDetailSerializer,
        },
    ),
)
class ChangeEmailView(generics.CreateAPIView):
    throttle_scope = "dj_rest_auth"
    permission_classes = [IsAuthenticated]
    serializer_class = ChangeEmailSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        return Response(
            {"detail": _("Verification e-mail sent.")},
            status=status.HTTP_201_CREATED,
            headers=headers
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


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
            ),
            OpenApiParameter(
                name="q",
                description=_("Search string for filtering"),
                type=OpenApiTypes.STR,
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
    filter_backends = [filters.DjangoFilterBackend]
    filterset_class = MultiLinkFilter

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False):
            return Link.objects.none()

        return self.request.user.links.all().order_by("-created_at")


@extend_schema_view(
    get=extend_schema(
        summary=_("Fetch the current user statistics"),
        description=_("Fetch the current user statistics"),
        responses={
            200: inline_serializer(
                name="UserStatistics",
                fields={
                    "total_links": serializers.IntegerField(read_only=True),
                    "total_clicks": serializers.IntegerField(read_only=True),
                    "top_link": serializers.CharField(read_only=True),
                    "top_clicks": serializers.IntegerField(read_only=True),
                }
            )
        },
    ),
)
class UserStatView(APIView):
    """
    This view aggregates user statistics.
    """
    permission_classes = [IsAuthenticated]

    @method_decorator(cache_page(180))
    def get(self, request):
        total_links = request.user.links.count()
        total_clicks = request.user.links.aggregate(Sum("clicks", default=0))
        top_link = request.user.links.order_by("-clicks").first()
        top_clicks = top_link.clicks if top_link else 0

        return Response(
            data={
                "total_links": total_links,
                "total_clicks": total_clicks["clicks__sum"],
                "top_link": top_link.short_code if top_link else "",
                "top_clicks": top_clicks,
            },
            status=status.HTTP_200_OK
        )
