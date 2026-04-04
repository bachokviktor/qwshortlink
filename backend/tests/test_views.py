import pytest
from django.urls import reverse
from rest_framework import status


@pytest.mark.django_db
class TestUserViews:
    def test_create_user(self, django_user_model, api_client):
        payload = {
            "username": "testuser",
            "password": "x5AXFqw7",
        }

        response = api_client.post(
            reverse("users:user-list"), data=payload, format="json"
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert django_user_model.objects.count() == 1

    def test_list_users(self, django_user_model, django_test_user, api_client):
        django_user_model.objects.create_user(
            username="testuser1",
            password="x5AXFqw7"
        )
        django_user_model.objects.create_user(
            username="testuser2",
            password="x5AXFqw7"
        )

        api_client.force_authenticate(django_test_user)

        response = api_client.get(reverse("users:user-list"), format="json")

        assert response.status_code == status.HTTP_200_OK
        assert len(response.data["results"]) == 3

    def test_retrieve_user(self, django_test_user, api_client):
        api_client.force_authenticate(django_test_user)

        response = api_client.get(
            reverse("users:user-detail", kwargs={"pk": django_test_user.id}),
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
            reverse("users:user-detail", kwargs={"pk": django_test_user.id}),
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
            reverse("users:user-detail", kwargs={"pk": django_test_user.id}),
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
            reverse("users:user-detail", kwargs={"pk": django_test_user.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert django_user_model.objects.count() == 0

    def test_anonymous_user_list(self, api_client):
        response = api_client.get(reverse("users:user-list"), format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_forbidden_user_detail(
            self, django_user_model, django_test_user, api_client
    ):
        testuser2 = django_user_model.objects.create_user(
            username="testuser2",
            password="x5AXFqw7"
        )

        api_client.force_authenticate(testuser2)

        response = api_client.get(
            reverse("users:user-detail", kwargs={"pk": django_test_user.id}),
            format="json"
        )

        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_admin_user_detail(
            self, admin_user, django_test_user, api_client
    ):
        new_data = {
            "username": "testuser_new",
            "email": "testuser@example.com",
        }

        api_client.force_authenticate(admin_user)

        response = api_client.put(
            reverse("users:user-detail", kwargs={"pk": django_test_user.id}),
            data=new_data,
            format="json"
        )

        django_test_user.refresh_from_db()

        assert response.status_code == status.HTTP_200_OK
        assert django_test_user.username == new_data["username"]
        assert django_test_user.email == new_data["email"]
