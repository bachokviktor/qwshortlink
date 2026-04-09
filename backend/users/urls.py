from django.urls import path

from . import views


app_name = "users"

urlpatterns = [
    path("register/", views.UserRegisterView.as_view(), name="register"),
    path("user/", views.UserDetailView.as_view(), name="user-detail"),
    path("user/links/", views.UserLinksView.as_view(), name="user-links"),
]
