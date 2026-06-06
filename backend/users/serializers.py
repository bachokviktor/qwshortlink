from django.contrib.auth import get_user_model
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer
from allauth.account import app_settings as allauth_account_settings
from allauth.account.adapter import get_adapter
from allauth.utils import get_username_max_length
from allauth.account.utils import filter_users_by_email
from allauth.account.models import EmailAddress


class EmailAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailAddress
        fields = ["email", "verified", "primary"]


class UserSerializer(UserDetailsSerializer):
    """
    This serializer is used to retrieve or update user data.
    """
    username = serializers.CharField(
        max_length=get_username_max_length(),
        min_length=allauth_account_settings.USERNAME_MIN_LENGTH,
    )

    emailaddress_set = EmailAddressSerializer(read_only=True, many=True)

    class Meta(UserDetailsSerializer.Meta):
        fields = [
            "pk",
            "username",
            "emailaddress_set",
            "first_name",
            "last_name",
        ]

        read_only_fields = ["pk"]

    def validate_username(self, username):
        unique_check = get_user_model().objects.filter(username=username)

        if self.instance:
            unique_check = unique_check.exclude(pk=self.instance.pk)

        if unique_check.exists():
            raise serializers.ValidationError(
                _("This username is already taken.")
            )

        username = get_adapter().clean_username(username, shallow=True)

        return username


class ChangeEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)

    def validate_email(self, email):
        request = self.context.get("request")
        if not request:
            raise serializers.ValidationError(
                _("Failed to get request object."),
            )

        users = filter_users_by_email(email)
        on_this_account = [u for u in users if u.pk == request.user.pk]
        on_diff_account = [u for u in users if u.pk != request.user.pk]

        if on_this_account:
            raise serializers.ValidationError(
                _("This e-mail address is already in use."),
            )
        if on_diff_account:
            raise serializers.ValidationError(
                _("This e-mail address is already taken."),
            )

        return email

    def create(self, validated_data):
        request = self.context.get("request")

        return EmailAddress.objects.add_new_email(
            request, request.user, validated_data["email"]
        )
