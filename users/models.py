# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('visitor', 'Visitor'),
    ]
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visitor')
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    
    USERNAME_FIELD = "email"  # Use email to log in
    REQUIRED_FIELDS = []  # Remove username from required fields

    def __str__(self):
        return self.email
    
    
    
class ActivityLog(models.Model):
    ACTION_TYPES = [
        ('login', 'Login'),
        ('logout', 'Logout'),
        ('update', 'Update Profile'),
        ('create', 'Create Resource'),
        ('delete', 'Delete Resource'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    resource = models.CharField(max_length=100, blank=True, null=True)  # Optional resource name (e.g., "Project")
    timestamp = models.DateTimeField(default=now)

    def __str__(self):
        return f"{self.user.email} - {self.action} at {self.timestamp}"