from django.urls import path, include
from django.urls import path
from dj_rest_auth.views import PasswordResetView, PasswordResetConfirmView, LogoutView
from .views import CustomAuthToken, UserListView, UserDetailView, UpdateUserRoleView, ProfileUpdateView

urlpatterns = [
    # Password Reset Endpoints (Manually Defined)
    path('auth/password/reset/', PasswordResetView.as_view(), name='password_reset'),
    path('auth/password/reset/confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),

    # Logout Endpoint
    path('auth/logout/', LogoutView.as_view(), name='logout'),

    # Custom Authentication Paths
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration
    path('auth/login/', CustomAuthToken.as_view(), name='api_login'),  # Custom login with role
    path("auth/user/", UserDetailView.as_view(), name="user-detail"),  # Custom user detail
    path("users/", UserListView.as_view(), name="user-list"),  # Admin user list
    path("users/<int:pk>/update-role/", UpdateUserRoleView.as_view(), name="update-user-role"),
    path("auth/profile/update/", ProfileUpdateView.as_view(), name="profile-update"),

]
