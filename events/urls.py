from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventViewSet, EventStatsView

router = DefaultRouter()
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('event-stats/', EventStatsView.as_view(), name='event-stats'),
]
