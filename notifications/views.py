# notifications/views.py
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Notification
from .serializers import NotificationSerializer

class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only fetch notifications for the logged-in user
        return self.queryset.filter(recipient=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def mark_as_read(self, request, pk=None):
        # Mark a notification as read
        notification = self.get_object()
        notification.read = True
        notification.save()
        return Response({"message": "Notification marked as read."})
    
    
    @action(detail=False, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def mark_all_as_read(self, request):
        notifications = self.get_queryset().filter(read=False)
        notifications.update(read=True)
        return Response({"message": "All notifications marked as read."})
    

    # def get_queryset(self):
    #     return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')


