from django.db import models
from users.models import CustomUser

class Artwork(models.Model):
    
    
    CATEGORY_CHOICES = [
        ('sketch', 'Sketch'),
        ('canvas', 'Canvas'),
        ('wallart', 'Wall Art'),
        ('digital', 'Digital'),
        ('photography', 'Photography'),
    ]
    
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    title = models.CharField(max_length=100)
    description = models.TextField()
    image = models.ImageField(upload_to='artworks/')
    artist = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='artworks')
    submission_date = models.DateTimeField(auto_now_add=True)
    approval_status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    feedback = models.TextField(blank=True, null=True)  # ✅ New field for rejection feedback
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='sketch')


    def __str__(self):
        return self.title
