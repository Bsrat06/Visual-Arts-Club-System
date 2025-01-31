from django.db import models
from users.models import CustomUser

# Create your models here.

class Event(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    date = models.DateField()
    location = models.CharField(max_length=200)
    attendees = models.ManyToManyField(CustomUser, related_name='events')

    def __str__(self):
        return self.title
