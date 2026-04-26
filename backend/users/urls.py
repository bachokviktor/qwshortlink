from django.urls import path

from . import views


app_name = "users"

urlpatterns = [
    path("register/", views.UserRegisterView.as_view(), name="register"),
    path("user/", views.UserDetailView.as_view(), name="user-detail"),
    path(
        "user/request-verification/",
        views.RequestVerificationView.as_view(),
        name="request-verification"
    ),
    path(
        "user/verification/",
        views.VerificationView.as_view(),
        name="verification"
    ),
    path("user/links/", views.UserLinksView.as_view(), name="user-links"),
    path(
        "user/password/",
        views.UserChangePasswordView.as_view(),
        name="user-password"
    ),
]
