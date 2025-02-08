from rest_framework import serializers
from .models import Artwork

class ArtworkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Artwork
        fields = ['title', 'description', 'image']  # Exclude 'artist' if it's set in `create()`
    
    def create(self, validated_data):
        request = self.context.get('request')  # Get the request from the context
        validated_data['artist'] = request.user  # Assign the logged-in user
        return super().create(validated_data)
