from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from users.pagination import CustomPagination
from notifications.models import Notification
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Artwork
from .serializers import ArtworkSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsAdminUser
from rest_framework.decorators import action
from rest_framework import status


class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()#.order_by("-submission_date")
    serializer_class = ArtworkSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)  # ✅ Allow file uploads
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

    
    def perform_create(self, serializer):
        serializer.save(artist=self.request.user)


    def perform_update(self, serializer):
        print("Updating Artwork with Data:", serializer.validated_data)  # ✅ Debugging log
        instance = serializer.save()
        
        if instance.approval_status == 'rejected' and 'feedback' in serializer.validated_data:
            Notification.objects.create(
                recipient=instance.artist,
                message=f"Your artwork '{instance.title}' has been rejected. Feedback: {instance.feedback}",
                notification_type='artwork_feedback'
            )
        
        if instance.approval_status == 'approved':
            Notification.objects.create(
                recipient=instance.artist,
                message=f"Your artwork '{instance.title}' has been approved.",
                notification_type='artwork_approved'
            )



    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminUser])
    def approve(self, request, pk=None):
        artwork = self.get_object()
        artwork.approval_status = 'approved'
        artwork.save()

        # Send Notification
        Notification.objects.create(
            recipient=artwork.artist,
            message=f"Your artwork '{artwork.title}' has been approved.",
            notification_type='artwork_approved'
        )
        return Response({"message": "Artwork approved successfully."}, status=status.HTTP_200_OK)


    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated, IsAdminUser])
    def reject(self, request, pk=None):
        artwork = self.get_object()
        feedback = request.data.get("feedback", "")

        print("Feedback received for rejection:", feedback)  # Debugging log

        if not feedback.strip():
            return Response(
                {"error": "Feedback is required when rejecting an artwork."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        artwork.approval_status = 'rejected'
        artwork.feedback = feedback  # Save the feedback
        artwork.save()

        print("Artwork feedback saved:", artwork.feedback)  # Debugging log

        Notification.objects.create(
            recipient=artwork.artist,
            message=f"Your artwork '{artwork.title}' has been rejected. Feedback: {feedback}",
            notification_type='artwork_rejected'
        )
        return Response({"message": "Artwork rejected successfully."}, status=status.HTTP_200_OK)


    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_artworks(self, request):
        user_artworks = self.queryset.filter(artist=request.user)
        serializer = self.get_serializer(user_artworks, many=True)
        return Response(serializer.data)