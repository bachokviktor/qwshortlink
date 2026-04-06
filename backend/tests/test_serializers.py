import pytest

from users import serializers
from links.serializers import LinkSerializer, CompactLinkSerializer
from links.models import Link


@pytest.mark.django_db
class TestUserSerializers:
    def test_create_user(self, django_user_model):
        serializer = serializers.CreateUserSerializer(
            data={"username": "testuser", "password": "x5AXFqw7"}
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert validation_status
        assert django_user_model.objects.count() == 1
        assert serializer.instance.username == "testuser"

    def test_invalid_username_user(self, django_user_model):
        serializer = serializers.CreateUserSerializer(
            data={"username": "test", "password": "x5AXFqw7"}
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert not validation_status
        assert django_user_model.objects.count() == 0

    def test_invalid_password_user(self, django_user_model):
        serializer = serializers.CreateUserSerializer(
            data={"username": "testuser", "password": "qwer"}
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert not validation_status
        assert django_user_model.objects.count() == 0

    def test_retrieve_compact(self, django_test_user):
        serializer = serializers.CompactUserSerializer(django_test_user)
        data = serializer.data

        assert data["id"] == django_test_user.id
        assert data["username"] == django_test_user.username

    def test_retrieve_compact_many(self, django_user_model):
        django_user_model.objects.create_user(
            username="testuser1",
            password="x5AXFqw7"
        )
        django_user_model.objects.create_user(
            username="testuser2",
            password="x5AXFqw7"
        )
        django_user_model.objects.create_user(
            username="testuser3",
            password="x5AXFqw7"
        )

        serializer = serializers.CompactUserSerializer(
            django_user_model.objects.all(), many=True
        )

        assert len(serializer.data) == 3

    def test_retrieve_user(self, django_test_user):
        serializer = serializers.UserSerializer(django_test_user)
        data = serializer.data

        assert data["id"] == django_test_user.id
        assert data["username"] == django_test_user.username

    def test_update_user(self, django_test_user):
        new_data = {
            "username": "testuser_new",
            "email": "testuser@example.com",
        }

        serializer = serializers.UserSerializer(
            instance=django_test_user, data=new_data
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert validation_status
        assert new_data["username"] == django_test_user.username
        assert new_data["email"] == django_test_user.email

    def test_invalid_username_update_user(self, django_test_user):
        new_data = {
            "username": "new",
        }

        serializer = serializers.UserSerializer(
            instance=django_test_user, data=new_data
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert not validation_status
        assert new_data["username"] != django_test_user.username


@pytest.mark.django_db
class TestLinkSerializers:
    def test_create_link(self, django_test_user):
        serializer = LinkSerializer(
            data={"url": "https://example.com/"}
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save(owner=django_test_user)

        assert validation_status
        assert Link.objects.count() == 1
        assert serializer.instance in django_test_user.urls.all()

    def test_retrieve_compact(self, django_test_user):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        serializer = CompactLinkSerializer(link)
        data = serializer.data

        assert data["id"] == link.id
        assert data["url"] == link.url

    def test_retrieve_compact_many(self, django_test_user):
        Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )
        Link.objects.create(
            url="https://another.example.com/",
            owner=django_test_user
        )

        serializer = CompactLinkSerializer(
            Link.objects.all(), many=True
        )

        assert len(serializer.data) == 2

    def test_retrieve_link(self, django_test_user):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        serializer = LinkSerializer(link)
        data = serializer.data

        assert data["id"] == link.id
        assert data["url"] == link.url

    def test_update_link(self, django_test_user):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        new_data = {
            "url": "https://new.example.com/",
        }

        serializer = LinkSerializer(
            instance=link, data=new_data
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert validation_status
        assert new_data["url"] == link.url
