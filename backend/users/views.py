from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny

from .permissions import IsCurrentUserOrAdmin
from . import serializers


class UserViewSet(ModelViewSet):
    """
    This viewset works with users.
    """
    queryset = get_user_model().objects.all()

    def get_permissions(self):
        if self.action == "create":
            permission_classes = [AllowAny]
        elif self.action == "list":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAuthenticated, IsCurrentUserOrAdmin]

        return [permission() for permission in permission_classes]

    def get_serializer_class(self):
        if self.action == "create":
            serializer_class = serializers.CreateUserSerializer
        elif self.action == "list":
            serializer_class = serializers.CompactUserSerializer
        else:
            serializer_class = serializers.UserSerializer

        return serializer_class
