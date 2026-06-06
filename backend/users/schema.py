from django.utils.translation import gettext_lazy as _
from drf_spectacular.extensions import OpenApiViewExtension
from drf_spectacular.utils import extend_schema_view, extend_schema


class LoginViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.views.LoginView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Authenticate a user with provided credentials"),
                description=_("Authenticate a user with provided credentials"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class LogoutViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.views.LogoutView"

    def view_replacement(self):
        @extend_schema_view(
            get=extend_schema(exclude=True),
            post=extend_schema(
                summary=_("Logout the current user"),
                description=_("Logout the current user"),
            ),
        )
        class Fixed(self.target_class):
            serializer_class = None

        return Fixed


class PasswordResetViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.views.PasswordResetView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Send a password reset link to a user"),
                description=_("Send a password reset link to a user"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class PasswordResetConfirmViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.views.PasswordResetConfirmView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Reset user password via confirmation link"),
                description=_("Reset user password via confirmation link"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class PasswordChangeViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.views.PasswordChangeView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Change the password of the current user"),
                description=_("Change the password of the current user"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class RegisterViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.registration.views.RegisterView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Register a new user"),
                description=_("Register a new user"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class VerifyEmailViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.registration.views.VerifyEmailView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Verify user email via confirmation link"),
                description=_("Verify user email via confirmation link"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class ResendEmailVerificationViewExtension(OpenApiViewExtension):
    target_class = "dj_rest_auth.registration.views.ResendEmailVerificationView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Resend another email verification letter"),
                description=_("Resend another email verification letter"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed


class TokenVerifyViewExtension(OpenApiViewExtension):
    target_class = "rest_framework_simplejwt.views.TokenVerifyView"

    def view_replacement(self):
        @extend_schema_view(
            post=extend_schema(
                summary=_("Verify the provided JWT token"),
                description=_("Verify the provided JWT token"),
            ),
        )
        class Fixed(self.target_class):
            pass

        return Fixed
