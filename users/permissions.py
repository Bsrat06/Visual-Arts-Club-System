from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """Allows access only to Admin users."""
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
