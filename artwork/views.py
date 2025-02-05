from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from users.pagination import CustomPagination
from notifications.models import Notification
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Artwork
from .serializers import ArtworkSerializer
from rest_framework.response import Response

class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()#.order_by("-submission_date")
    serializer_class = ArtworkSerializer
    parser_classes = (MultiPartParser, FormParser)  # ✅ Allow file uploads
    pagination_class = CustomPagination  # Use the custom pagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Enable filtering by approval status and artist
    filterset_fields = ['approval_status', 'artist']
    
    # Enable search by title or description
    search_fields = ['title', 'description']
    
    # Enable ordering by submission date
    ordering_fields = ['submission_date']


    def perform_update(self, serializer):
        instance = serializer.save()
        if instance.approval_status == 'approved':
            Notification.objects.create(
                recipient=instance.artist,
                message=f"Your artwork '{instance.title}' has been approved!",
                notification_type='artwork_approved'
            )