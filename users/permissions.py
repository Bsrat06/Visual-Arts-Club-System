from rest_framework.permissions import BasePermission

class IsAdminUser(BasePermission):
    """
    Custom permission to check if the user is an admin (superuser or staff).
    """
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.is_superuser)  # ✅ Allow superusers too
