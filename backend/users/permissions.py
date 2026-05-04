from rest_framework.permissions import BasePermission


class IsVerifiend(BasePermission):
    """
    Checks whether the user is verified.
    """

    def has_permission(self, request, view):
        return request.user.verified


class EmailAuth(BasePermission):
    """
    Checks whether the user's authentication method is email.
    """

    def has_permission(self, request, view):
        return request.user.auth_method == "email"
