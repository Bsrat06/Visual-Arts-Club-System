from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser
from users.pagination import CustomPagination
from notifications.models import Notification
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Artwork
from .serializers import ArtworkSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminUser

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


    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            print(f"Permissions checked for admin user: {self.request.user.is_staff}")  # ✅ Debugging log
            permission_classes = [IsAuthenticated, IsAdminUser]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    


    def perform_update(self, serializer):
        print("Updating Artwork with Data:", serializer.validated_data)  # ✅ Debugging log
        instance = serializer.save()
        if instance.approval_status == 'approved':
            Notification.objects.create(
                recipient=instance.artist,
                message=f"Your artwork '{instance.title}' has been approved.",
                notification_type='artwork_approved'
            )
