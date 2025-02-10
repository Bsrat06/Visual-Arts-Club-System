from rest_framework import serializers
from .models import CustomUser, ActivityLog

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["pk", "username", "email", "first_name", "last_name", "is_staff", "is_superuser", "role"]
        
        
class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "password", "profile_picture"]  # ✅ Include profile_picture
        extra_kwargs = {
            'password': {'write_only': True, 'required': False},
        }

    def update(self, instance, validated_data):
        # Handle password update if provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)
    
    
class ActivityLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action', 'resource', 'timestamp']
        
        
        
class UserPreferencesSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["notification_preferences"]

    def update(self, instance, validated_data):
        instance.notification_preferences = validated_data.get("notification_preferences", instance.notification_preferences)
        instance.save()
        return instance
