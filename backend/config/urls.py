"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView
)

from users.views import (
    ConfirmEmailView,
    ConfirmPasswordResetView,
    GoogleLoginView,
    UserLinksView,
    UserStatView,
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path(
        "api/auth/password-reset/confirm/<str:uid>/<str:token>/",
        ConfirmPasswordResetView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "api/auth/registration/account-confirm-email/<str:key>/",
        ConfirmEmailView.as_view(),
        name="account_confirm_email",
    ),
    path("api/auth/user/links/", UserLinksView.as_view(), name="user-links"),
    path("api/auth/user/stat/", UserStatView.as_view(), name="user-stat"),
    path("api/auth/", include("dj_rest_auth.urls")),
    path("api/auth/registration/", include("dj_rest_auth.registration.urls")),
    path("api/auth/google/", GoogleLoginView.as_view(), name="google_login"),
    path("api/links/", include("links.urls")),
]

if settings.DEBUG:
    urlpatterns += [
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        path(
            "api/docs/",
            SpectacularSwaggerView.as_view(url_name="schema"),
            name="swagger-ui"
        ),
    ]
