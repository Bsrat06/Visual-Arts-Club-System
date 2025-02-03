from django.db import models
from users.models import CustomUser  # ✅ Import your User model

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    location = models.CharField(max_length=255)
    date = models.DateField()
    attendees = models.ManyToManyField(CustomUser, related_name="events_attending", blank=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="events_created")  # ✅ Ensure creator is properly defined

    def __str__(self):
        return self.title
