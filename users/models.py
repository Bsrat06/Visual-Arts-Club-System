# users/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('member', 'Member'),
        ('visitor', 'Visitor'),
    ]
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='visitor')
    
    USERNAME_FIELD = "email"  # Use email to log in
    REQUIRED_FIELDS = []  # Remove username from required fields

    def __str__(self):
        return self.email