from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from users.permissions import IsAdminUser
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.permissions import IsAuthenticated


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
    
 