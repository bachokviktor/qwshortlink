from rest_framework.permissions import BasePermission


class IsVerifiend(BasePermission):
    def has_permission(self, request, view):
        return request.user.verified
