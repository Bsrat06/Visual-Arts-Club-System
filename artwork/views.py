from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from .models import Artwork
from .serializers import ArtworkSerializer

class ArtworkViewSet(viewsets.ModelViewSet):
    queryset = Artwork.objects.all()
    serializer_class = ArtworkSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    
    # Enable filtering by approval status and artist
    filterset_fields = ['approval_status', 'artist']
    
    # Enable search by title or description
    search_fields = ['title', 'description']
    
    # Enable ordering by submission date
    ordering_fields = ['submission_date']
