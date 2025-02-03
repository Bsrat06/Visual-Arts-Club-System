from django.urls import path, include
from .views import CustomAuthToken, UserListView

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/login/', CustomAuthToken.as_view(), name='api_login'),
    path("users/", UserListView.as_view(), name="user-list"),  # ✅ Add user list endpoint
]