from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers


class CreateUserSerializer(serializers.ModelSerializer):
    """
    This serializer is used only for user creation.
    """
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
            },
        }

    def validate_username(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                _("Username must be at least 5 characters long.")
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


class VerificationCodeSerializer(serializers.Serializer):
    """
    This serializer is used to serialize email validation codes.
    """
    code = serializers.CharField(max_length=10, required=True)


class ChangeEmailSerializer(serializers.ModelSerializer):
    """
    This serializer is used to change user email.
    """
    class Meta:
        model = get_user_model()
        fields = ["email"]

    def validate_email(self, value):
        instance = getattr(self, "instance", None)

        if not instance:
            raise serializers.ValidationError(
                _("You must provide an instance to this serializer.")
            )

        if value == instance.email:
            raise serializers.ValidationError(
                _("New email must be different from the previous one.")
            )

        return value

    def update(self, instance, validated_data):
        instance.verified = False
        instance.email = validated_data["email"]
        instance.save()

        return instance


class ChangePasswordSerializer(serializers.ModelSerializer):
    """
    This serializer is used to change user password.
    """
    new_password = serializers.CharField(
        max_length=128, write_only=True, required=True
    )

    class Meta:
        model = get_user_model()
        fields = ["password", "new_password"]
        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": True,
            },
        }

    def validate_password(self, value):
        instance = getattr(self, "instance", None)

        if not instance:
            raise serializers.ValidationError(
                _("You must provide an instance to this serializer.")
            )

        if not instance.check_password(value):
            raise serializers.ValidationError(
                _("Wrong password.")
            )

        return value

    def validate_new_password(self, value):
        if value == self.initial_data["password"]:
            raise serializers.ValidationError(
                _("New password must be different from the previous one.")
            )

        try:
            validate_password(password=value)
        except ValidationError as error:
            raise serializers.ValidationError(error.messages)

        return value

    def update(self, instance, validated_data):
        instance.set_password(validated_data["new_password"])
        instance.save()

        return instance


class RequestPasswordResetSerializer(serializers.Serializer):
    """
    This serializer is used to serialize username for password reset.
    """
    username = serializers.CharField(max_length=150, required=True)


class PasswordResetSerializer(serializers.Serializer):
    """
    This serializer is used to serialize username,
    code, and a new password during the password reset.
    """
    username = serializers.CharField(max_length=150, required=True)
    code = serializers.CharField(
        max_length=10, write_only=True, required=True
    )
    password = serializers.CharField(
        max_length=128, write_only=True, required=True
    )

    def validate_password(self, value):
        try:
            validate_password(password=value)
        except ValidationError as error:
            raise serializers.ValidationError(error.messages)

        return value


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
            "verified",
        ]
        read_only_fields = ["email", "verified"]

    def validate_username(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                _("Username must be at least 5 characters long.")
            )

        return value
