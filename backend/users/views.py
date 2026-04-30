from django.contrib.auth import get_user_model
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from drf_spectacular.utils import (
    extend_schema_view, extend_schema, OpenApiParameter
)
from drf_spectacular.types import OpenApiTypes

from links.serializers import LinkSerializer
from .models import VerificationCode, PasswordResetCode
from .serializers import (
    CreateUserSerializer,
    VerificationCodeSerializer,
    ChangeEmailSerializer,
    ChangePasswordSerializer,
    RequestPasswordResetSerializer,
    PasswordResetSerializer,
    UserSerializer
)
from .permissions import IsVerifiend
from core.throttling import RestrictedAnonThrottle
from .tasks import send_verification_email, send_password_reset_email


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
    throttle_classes = [UserRateThrottle, AnonRateThrottle]

    def perform_create(self, serializer):
        instance = serializer.save()

        send_verification_email.delay_on_commit(instance.pk)


@extend_schema_view(
    get=extend_schema(
        summary=_("Send a verification code to the user's email address"),
        description=_("Send a verification code to the user's email address"),
        responses={200: None},
    ),
)
class RequestVerificationView(APIView):
    """
    This view sends a verification code to the user's email address.
    """
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def get(self, request):
        send_verification_email.delay(request.user.pk)

        return Response(status=status.HTTP_200_OK)


@extend_schema_view(
    post=extend_schema(
        summary=_("Verify user email with a verification code"),
        description=_("Verify user email with a verification code"),
    ),
)
class VerificationView(APIView):
    """
    This view verifies user email using email.
    """
    serializer_class = VerificationCodeSerializer
    permission_classes = [IsAuthenticated]
    throttle_classes = [UserRateThrottle]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = VerificationCode.objects.filter(
                code=serializer.validated_data.get("code")
            ).filter(expires_at__gt=timezone.now()).first()

            if code and (request.user.email == code.email):
                user = request.user
                user.verified = True
                user.save()

                code.delete()

                return Response(status=status.HTTP_200_OK)

            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data=serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema_view(
    put=extend_schema(
        summary=_("Change user email"),
        description=_("Change user email"),
    ),
)
class UserChangeEmailView(APIView):
    """
    This view handles user email change.
    """
    serializer_class = ChangeEmailSerializer
    permission_classes = [IsAuthenticated, IsVerifiend]

    def put(self, request):
        serializer = self.serializer_class(
            instance=self.request.user, data=request.data
        )

        if serializer.is_valid():
            instance = serializer.save()

            send_verification_email.delay_on_commit(instance.pk)

            return Response(status=status.HTTP_200_OK)

        return Response(
            data=serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema_view(
    post=extend_schema(
        summary=_("Send password reset code to the user"),
        description=_("Send password reset code to the user"),
    ),
)
class RequestPasswordResetView(APIView):
    """
    This view sends password reset code to the user.
    """
    serializer_class = RequestPasswordResetSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RestrictedAnonThrottle, UserRateThrottle]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = get_user_model().objects.filter(
                username=serializer.validated_data.get("username")
            ).first()

            if user and user.verified:
                send_password_reset_email.delay(pk=user.pk)

                return Response(status=status.HTTP_200_OK)

            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data=serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema_view(
    post=extend_schema(
        summary=_("Reset user password"),
        description=_("Reset user password"),
    ),
)
class PasswordResetView(APIView):
    """
    This view resets user password.
    """
    serializer_class = PasswordResetSerializer
    permission_classes = [AllowAny]
    throttle_classes = [RestrictedAnonThrottle, UserRateThrottle]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            code = PasswordResetCode.objects.filter(
                code=serializer.validated_data.get("code")
            ).filter(expires_at__gt=timezone.now()).first()
            user = get_user_model().objects.filter(
                username=serializer.validated_data.get("username")
            ).first()

            if code and user and (code.user == user):
                user.set_password(serializer.validated_data.get("password"))
                user.save()

                code.delete()

                return Response(status=status.HTTP_200_OK)

            return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(
            data=serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


@extend_schema_view(
    put=extend_schema(
        summary=_("Change user password"),
        description=_("Change user password"),
    ),
)
class UserChangePasswordView(APIView):
    """
    This view handles user password change.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated, IsVerifiend]

    def put(self, request):
        serializer = self.serializer_class(
            instance=self.request.user, data=request.data
        )

        if serializer.is_valid():
            serializer.save()

            return Response(status=status.HTTP_200_OK)

        return Response(
            data=serializer.errors, status=status.HTTP_400_BAD_REQUEST
        )


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
        return self.request.user.links.all().order_by("-created_at")
