from rest_framework.viewsets import ModelViewSet
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated

class NotificationViewSet(ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter notifications for the logged-in user
        return self.queryset.filter(recipient=self.request.user).order_by("-created_at")
