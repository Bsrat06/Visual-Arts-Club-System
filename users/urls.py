from django.urls import path, include
from .views import CustomAuthToken, UserListView, UserDetailView

urlpatterns = [
    # Include specific features from `dj_rest_auth`:
    path('auth/password/reset/', include('dj_rest_auth.urls')),  # Password reset
    path('auth/logout/', include('dj_rest_auth.urls')),          # Logout endpoint
    
    # Custom paths:
    path('auth/registration/', include('dj_rest_auth.registration.urls')),  # Registration
    path('auth/login/', CustomAuthToken.as_view(), name='api_login'),       # Custom login with role
    path("auth/user/", UserDetailView.as_view(), name="user-detail"),       # Custom user detail endpoint
    path("users/", UserListView.as_view(), name="user-list"),               # Admin user list
]
