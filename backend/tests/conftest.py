import pytest
from rest_framework.test import APIClient


@pytest.fixture(autouse=True)
def use_dummy_cache_backend(settings):
    settings.CACHES = {
        "default": {
            "BACKEND": "django.core.cache.backends.dummy.DummyCache",
        }
    }


@pytest.fixture
def django_test_user(db, django_user_model):
    """
    Creates and returns a test user instance.
    """
    user = django_user_model.objects.create_user(
        username="testuser",
        password="x5AXFqw7"
    )

    return user


@pytest.fixture
def api_client():
    """
    Returns an instance of REST Framework APIClient.
    """
    return APIClient()
