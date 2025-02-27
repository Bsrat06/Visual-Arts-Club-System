from notifications.models import Notification
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminUser
from .serializers import EventSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import Event, EventRegistration
from django.db import models
from django.db.models import Count
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from rest_framework.pagination import PageNumberPagination


class EventPagination(PageNumberPagination):
    page_size = 8


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    parser_classes = (MultiPartParser, FormParser)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    pagination_class = EventPagination
    
    
    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    # Enable filtering by date and location
    filterset_fields = ['date', 'location']

    # Enable search by event title and description
    search_fields = ['title', 'description']

    # Enable ordering by date
    ordering_fields = ['date']
    
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = [AllowAny]
        return [permission() for permission in permission_classes]

    
    def perform_update(self, serializer):
        instance = serializer.save()
        for attendee in instance.attendees.all():
            Notification.objects.create(
                recipient=attendee,
                message=f"The event '{instance.title}' has been updated.",
                notification_type='event_update'
            )


    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)  # ✅ Automatically assign logged-in user
        
    
    def create(self, request, *args, **kwargs):
        print(f"Request User: {request.user}")  # ✅ Debugging log
        print(f"Is Superuser: {request.user.is_superuser}")  # ✅ Should be True
        print(f"Is Staff: {request.user.is_staff}")  # ✅ Should be True
        print("Request Payload:", request.data)  # Log the payload
        return super().create(request, *args, **kwargs)



    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_events(self, request):
        user_events = self.queryset.filter(creator=request.user)
        serializer = self.get_serializer(user_events, many=True)
        return Response(serializer.data)
    
    


class EventStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_events = Event.objects.count()
        completed_events = Event.objects.filter(is_completed=True).count()
        upcoming_events = Event.objects.filter(is_completed=False).count()

        # Participation statistics
        participation_stats = (
            EventRegistration.objects.values("event__title")
            .annotate(participant_count=Count("user"))
            .order_by("-participant_count")
        )

        return Response({
            "total_events": total_events,
            "completed_events": completed_events,
            "upcoming_events": upcoming_events,
            "participation_stats": list(participation_stats),
        })