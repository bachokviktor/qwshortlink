import uuid
import pytest


@pytest.mark.django_db
class TestUserModels:
    def test_create_user(self, django_user_model):
        user = django_user_model.objects.create_user(
            username="testuser",
            password="x5AXFqw7"
        )

        assert isinstance(user.id, uuid.UUID)
        assert django_user_model.objects.count() == 1
