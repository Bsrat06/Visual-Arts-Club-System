from notifications.models import Notification
from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminUser
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Enable filtering by start_date and members
    filterset_fields = ['start_date', 'members']

    # Enable search by project title and description
    search_fields = ['title', 'description']

    # Enable ordering by start_date
    ordering_fields = ['start_date']
    
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated, IsAdminUser]  # Only admins can modify
        else:
            self.permission_classes = [IsAuthenticated]  # Members can only view
        return super().get_permissions()
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
     
    
    
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)  # ✅ Automatically assign logged-in user
        
        
        
    def perform_update(self, serializer):
        instance = serializer.save()
        for member in instance.members.all():
            Notification.objects.create(
                recipient=member,
                message=f"You have been added to the project '{instance.title}'.",
                notification_type='project_invite'
            )
            
            
            
class ProjectStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Total Projects
        total_projects = Project.objects.count()

        # Ongoing Projects
        ongoing_projects = Project.objects.filter(is_completed=False).count()

        # Completed Projects
        completed_projects = Project.objects.filter(is_completed=True).count()

        # Member-Specific Contributions
        if request.user.role == "member":
            user_contributions = Project.objects.filter(contributors=request.user).count()
        else:
            user_contributions = 0  # Not applicable for admins

        return Response({
            "total_projects": total_projects,
            "ongoing_projects": ongoing_projects,
            "completed_projects": completed_projects,
            "user_contributions": user_contributions,
        })