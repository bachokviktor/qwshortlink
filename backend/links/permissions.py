from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """
    Grants access only to the owner of the link.
    """

    def has_object_permission(self, request, view, obj):
        return request.user == obj.owner
