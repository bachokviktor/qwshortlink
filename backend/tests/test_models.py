import pytest

from links.models import Link


@pytest.mark.django_db
class TestUserModels:
    def test_create_user(self, django_user_model):
        user = django_user_model.objects.create_user(
            username="testuser",
            password="x5AXFqw7"
        )

        assert user.id == 1
        assert django_user_model.objects.count() == 1


@pytest.mark.django_db
class TestLinkModels:
    def test_create_link(self, django_test_user):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        assert link.id == 1
        assert Link.objects.count() == 1
        assert link in django_test_user.urls.all()
