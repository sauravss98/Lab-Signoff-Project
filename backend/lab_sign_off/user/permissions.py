from rest_framework.permissions import BasePermission

class IsAdminOrStaffUser(BasePermission):
    """
    Custom permission to only allow admin or staff users to access the view.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.user_type == 'admin' or request.user.user_type == 'staff')