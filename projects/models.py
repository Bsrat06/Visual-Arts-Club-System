from django.db import models
from users.models import CustomUser

# Create your models here.

class Project(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    members = models.ManyToManyField(CustomUser, related_name='projects')
    start_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.title
