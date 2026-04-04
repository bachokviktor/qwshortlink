from rest_framework.permissions import BasePermission


class IsOwnerOrAdmin(BasePermission):
    """
    Grants access only to the owner or admin user.
    """

    def has_object_permission(self, request, view, obj):
        return (request.user == obj.owner) or (request.user.is_stuff)
