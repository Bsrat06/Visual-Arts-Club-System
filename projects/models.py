from django.db import models
from users.models import CustomUser
from django.utils import timezone

class Project(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    start_date = models.DateField(default=timezone.now)  # ✅ Default start date
    end_date = models.DateField(null=True, blank=True)  # ✅ Allow null values
    members = models.ManyToManyField(CustomUser, related_name="projects_participating", blank=True)
    creator = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="projects_created")

    def __str__(self):
        return self.title
