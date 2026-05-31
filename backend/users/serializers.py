from dj_rest_auth.serializers import UserDetailsSerializer


class UserSerializer(UserDetailsSerializer):
    """
    This serializer is used to retrieve or update user data.
    """
    class Meta(UserDetailsSerializer.Meta):
        fields = [
            "pk",
            "username",
            "email",
            "first_name",
            "last_name",
        ]

        read_only_fields = ["pk", "email"]
