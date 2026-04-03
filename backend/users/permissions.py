from rest_framework.permissions import BasePermission


class IsCurrentUserOrAdmin(BasePermission):
    """
    Allow only the user himself access his data.
    Staff users have access to all users.
    """

    def has_object_permission(self, request, view, obj):
        return (request.user == obj) or (request.user.is_staff)
