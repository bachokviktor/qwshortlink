from django.contrib.auth import get_user_model
from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.utils import get_username_max_length


class UserSerializer(UserDetailsSerializer):
    """
    This serializer is used to retrieve or update user data.
    """
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_account_settings.USERNAME_MIN_LENGTH,
    )

    class Meta(UserDetailsSerializer.Meta):
        fields = [
            "pk",
            "username",
            "email",
            "first_name",
            "last_name",
        ]

        read_only_fields = ["pk", "email"]

    def validate_username(self, username):
        unique_check = get_user_model().objects.filter(username=username)

        if self.instance:
            unique_check = unique_check.exclude(pk=self.instance.pk)

        if unique_check.exists():
            raise serializers.ValidationError(
                "This username is already taken."
            )

        username = get_adapter().clean_username(username, shallow=True)

        return username
