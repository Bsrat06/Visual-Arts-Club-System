from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminUser
from .models import Event
from .serializers import EventSerializer
from rest_framework.permissions import IsAuthenticated


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Enable filtering by date and location
    filterset_fields = ['date', 'location']

    # Enable search by event title and description
    search_fields = ['title', 'description']

    # Enable ordering by date
    ordering_fields = ['date']
    
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsAdminUser]  # Only admins can modify
        else:
            self.permission_classes = [IsAuthenticated]  # Members can only view
        return super().get_permissions()
