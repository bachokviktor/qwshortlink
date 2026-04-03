from django.contrib.auth import get_user_model
from rest_framework import serializers


class CreateUserSerializer(serializers.ModelSerializer):
    """
    This serializer is used only for user creation.
    """
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "password"]
        read_only_fields = ["id"]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
        }

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
            "is_staff",
            "date_joined",
        ]
        read_only_fields = ["id", "is_staff", "date_joined"]


class CompactUserSerializer(serializers.ModelSerializer):
    """
    This serializer is read-only, and used to retrieve
    compact user data.
    """
    class Meta:
        model = get_user_model()
        fields = ["id", "username"]
        read_only_fields = ["id", "username"]
