from rest_framework.viewsets import ModelViewSet
from rest_framework import permissions

from . import serializers
from . import models
from .permissions import IsOwnerOrAdmin


# Create your views here.
class LinkViewSet(ModelViewSet):
    """
    This view is used to create, retrieve, or update information
    about the links.
    """
    queryset = models.Link.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return serializers.CompactLinkSerializer

        return serializers.LinkSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [permissions.AllowAny]
        elif self.action == "create":
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]

        return [permission() for permission in permission_classes]
