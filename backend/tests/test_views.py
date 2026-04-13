import pytest
from django.urls import reverse
from rest_framework import status

from links.models import Link


@pytest.mark.django_db
class TestUserViews:
    def test_create_user(self, django_user_model, api_client):
        payload = {
            "username": "testuser",
            "password": "x5AXFqw7",
        }

        response = api_client.post(
            reverse("users:register"), data=payload, format="json"
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert django_user_model.objects.count() == 1

    def test_retrieve_user(self, django_test_user, api_client):
        api_client.force_authenticate(django_test_user)

        response = api_client.get(
            reverse("users:user-detail"),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["username"] == django_test_user.username

    def test_update_user(self, django_test_user, api_client):
        new_data = {
            "username": "testuser_new",
            "email": "testuser@example.com",
        }

        api_client.force_authenticate(django_test_user)

        response = api_client.put(
            reverse("users:user-detail"),
            data=new_data,
            format="json"
        )

        django_test_user.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert django_test_user.username == new_data["username"]
        assert django_test_user.email == new_data["email"]

    def test_partially_update_user(self, django_test_user, api_client):
        new_data = {
            "email": "testuser@example.com",
        }

        api_client.force_authenticate(django_test_user)

        response = api_client.patch(
            reverse("users:user-detail"),
            data=new_data,
            format="json"
        )

        django_test_user.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert django_test_user.email == new_data["email"]

    def test_delete_user(
            self, django_user_model, django_test_user, api_client
    ):
        api_client.force_authenticate(django_test_user)

        response = api_client.delete(
            reverse("users:user-detail"),
            format="json"
        )

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert django_user_model.objects.count() == 0

    def test_fetch_user_links(self, django_test_user, api_client):
        Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )
        Link.objects.create(
            url="https://another.example.com/",
            owner=django_test_user
        )

        api_client.force_authenticate(django_test_user)

        response = api_client.get(
            reverse("users:user-links"),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_change_user_password(self, django_test_user, api_client):
        payload = {
            "password": "x5AXFqw7",
            "new_password": "PNaHseW3",
        }

        api_client.force_authenticate(django_test_user)

        response = api_client.put(
            reverse("users:user-password"),
            data=payload,
            format="json"
        )

        django_test_user.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert django_test_user.check_password(payload["new_password"])

    def test_anonymous_user_detail(self, api_client):
        response = api_client.get(reverse("users:user-detail"), format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_anonymous_user_links(self, api_client):
        response = api_client.get(reverse("users:user-links"), format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_anonymous_change_password(self, api_client):
        payload = {
            "password": "x5AXFqw7",
            "new_password": "PNaHseW3",
        }

        response = api_client.put(
            reverse("users:user-password"),
            data=payload,
            format="json"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLinkViews:
    def test_create_link(self, django_test_user, api_client):
        payload = {
            "url": "https://new.example.com/",
        }

        api_client.force_authenticate(django_test_user)

        response = api_client.post(
            reverse("links:link-list"), data=payload, format="json"
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert Link.objects.count() == 1

    def test_list_links(self, django_test_user, api_client):
        Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )
        Link.objects.create(
            url="https://another.example.com/",
            owner=django_test_user
        )

        response = api_client.get(reverse("links:link-list"), format="json")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_filter_links(self, django_test_user, api_client):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )
        Link.objects.create(
            url="https://another.example.com/",
            owner=django_test_user
        )

        response = api_client.get(
            reverse("links:link-list", query={"short_code": link.short_code}),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["id"] == link.id

    def test_retrieve_link(self, django_test_user, api_client):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        api_client.force_authenticate(django_test_user)

        response = api_client.get(
            reverse("links:link-detail", kwargs={"pk": link.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["url"] == link.url

    def test_update_link(self, django_test_user, api_client):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        new_data = {
            "url": "https://new.example.com/",
        }

        api_client.force_authenticate(django_test_user)

        response = api_client.put(
            reverse("links:link-detail", kwargs={"pk": link.id}),
            data=new_data,
            format="json"
        )

        link.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert link.url == new_data["url"]

    def test_delete_link(self, django_test_user, api_client):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        api_client.force_authenticate(django_test_user)

        response = api_client.delete(
            reverse("links:link-detail", kwargs={"pk": link.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert Link.objects.count() == 0

    def test_anonymous_detail(self, django_test_user, api_client):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        response = api_client.get(
            reverse("links:link-detail", kwargs={"pk": link.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_forbidden_detail(
            self, django_user_model, django_test_user, api_client
    ):
        link = Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )

        testuser2 = django_user_model.objects.create_user(
            username="testuser2",
            password="x5AXFqw7"
        )

        api_client.force_authenticate(testuser2)

        response = api_client.get(
            reverse("links:link-detail", kwargs={"pk": link.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
