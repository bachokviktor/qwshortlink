from django.urls import path

from . import views


app_name = "users"

urlpatterns = [
    path("register/", views.UserRegisterView.as_view(), name="register"),
    path("google-auth/", views.GoogleAuthView.as_view(), name="google-auth"),
    path("user/", views.UserDetailView.as_view(), name="user-detail"),
    path(
        "user/request-verification/",
        views.RequestVerificationView.as_view(),
        name="request-verification"
    ),
    path(
        "user/verification/",
        views.VerificationView.as_view(),
        name="user-verification"
    ),
    path(
        "user/email/",
        views.UserChangeEmailView.as_view(),
        name="user-email"
    ),
    path(
        "user/request-reset/",
        views.RequestPasswordResetView.as_view(),
        name="request-reset"
    ),
    path(
        "user/reset/",
        views.PasswordResetView.as_view(),
        name="user-reset"
    ),
    path(
        "user/password/",
        views.UserChangePasswordView.as_view(),
        name="user-password"
    ),
    path("user/links/", views.UserLinksView.as_view(), name="user-links"),
    path("user/stat/", views.UserStatView.as_view(), name="user-stat"),
]
