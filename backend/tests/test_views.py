import pytest
from django.urls import reverse
from rest_framework import status

from links.models import Link


@pytest.mark.django_db
class TestUserViews:
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
            reverse("user-links"),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 2

    def test_fetch_filtered_links(self, django_test_user, api_client):
        Link.objects.create(
            url="https://example.com/",
            owner=django_test_user
        )
        searched = Link.objects.create(
            url="https://another.example.com/",
            owner=django_test_user
        )

        api_client.force_authenticate(django_test_user)

        response = api_client.get(
            reverse("user-links", query={"q": "another"}),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 1
        assert response.data["results"][0]["short_code"] == searched.short_code

    def test_fetch_user_stats(self, django_test_user, api_client):
        top_link = Link.objects.create(
            url="https://example.com/",
            clicks=10,
            owner=django_test_user
        )
        Link.objects.create(
            url="https://another.example.com/",
            clicks=5,
            owner=django_test_user
        )

        api_client.force_authenticate(django_test_user)

        response = api_client.get(
            reverse("user-stat"),
            format="json"
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["total_links"] == 2
        assert response.data["total_clicks"] == 15
        assert response.data["top_link"] == top_link.short_code
        assert response.data["top_clicks"] == top_link.clicks

    def test_anonymous_user_links(self, api_client):
        response = api_client.get(reverse("user-links"), format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestLinkViews:
    def test_create_link(self, django_test_user, api_client):
        django_test_user.verified = True
        django_test_user.save()

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
        django_test_user.verified = True
        django_test_user.save()

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
        django_test_user.verified = True
        django_test_user.save()

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
        django_test_user.verified = True
        django_test_user.save()

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

        testuser2.verified = True
        testuser2.save()

        api_client.force_authenticate(testuser2)

        response = api_client.get(
            reverse("links:link-detail", kwargs={"pk": link.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN
