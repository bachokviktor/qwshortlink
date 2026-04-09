from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework import serializers


class CreateUserSerializer(serializers.ModelSerializer):
    """
    This serializer is used only for user creation.
    """
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
        }

    def validate_username(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Username must be at least 5 characters long."
            )

        return value

    def validate_password(self, value):
        try:
            validate_password(password=value)
        except ValidationError as error:
            raise serializers.ValidationError(error.messages)

        return value

    def create(self, validated_data):
        user = get_user_model().objects.create_user(**validated_data)

        return user


class UserSerializer(serializers.ModelSerializer):
    """
    This serializer is used to retrieve or update user data.
    """
    class Meta:
        model = get_user_model()
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
        ]

    def validate_username(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Username must be at least 5 characters long."
            )

        return value
