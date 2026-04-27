import pytest

from users.models import VerificationCode, PasswordResetCode
from links.models import Link


@pytest.mark.django_db
class TestUserModel:
    def test_create_user(self, django_user_model):
        user = django_user_model.objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="x5AXFqw7"
        )

        assert user.id == 1
        assert django_user_model.objects.count() == 1


@pytest.mark.django_db
class TestVerificationCodeModel:
    def test_create_verification_code(self):
        code = VerificationCode.objects.create(email="testuser@example.com")

        assert code.id == 1
        assert VerificationCode.objects.count() == 1


@pytest.mark.django_db
class TestPasswordResetCodeModel:
    def test_create_password_reset_code(self, django_test_user):
        code = PasswordResetCode.objects.create(user=django_test_user)

        assert code.id == 1
        assert PasswordResetCode.objects.count() == 1


@pytest.mark.django_db
class TestLinkModel:
    def test_create_link(self, django_test_user):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        assert link.id == 1
        assert Link.objects.count() == 1
        assert link in django_test_user.links.all()
