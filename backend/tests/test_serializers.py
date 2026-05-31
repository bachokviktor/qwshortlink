import pytest

from users import serializers
from links.serializers import LinkSerializer, CompactLinkSerializer
from links.models import Link


@pytest.mark.django_db
class TestUserSerializers:
    def test_retrieve_user(self, django_test_user):
        serializer = serializers.UserSerializer(django_test_user)
        data = serializer.data

        assert data["pk"] == django_test_user.id
        assert data["username"] == django_test_user.username

    def test_update_user(self, django_test_user):
        new_data = {
            "username": "testuser_new",
            "first_name": "User",
        }

        serializer = serializers.UserSerializer(
            instance=django_test_user, data=new_data
        )

        validation_status = serializer.is_valid()
        if validation_status:
            serializer.save()

        assert validation_status
        assert new_data["username"] == django_test_user.username
        assert new_data["first_name"] == django_test_user.first_name


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
        assert serializer.instance in django_test_user.links.all()

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
