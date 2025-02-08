from rest_framework import serializers
from .models import Artwork

class ArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artwork
        fields = ['id', 'title', 'description', 'image', 'artist', 'feedback', 'approval_status', 'submission_date']  # ✅ Include 'id' and 'approval_status'
        read_only_fields = ['approval_status', 'feedback', 'artist', 'submission_date']
        
        
        
    def create(self, validated_data):
        request = self.context.get('request')  # Get the request from the context
        validated_data['artist'] = request.user  # Assign the logged-in user
        return super().create(validated_data)
