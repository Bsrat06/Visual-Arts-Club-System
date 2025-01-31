from django.urls import path, include
from .views import CustomAuthToken

urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('auth/login/', CustomAuthToken.as_view(), name='api_login'),
]