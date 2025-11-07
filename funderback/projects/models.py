from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from users.models import User

class Project(models.Model):
    title = models.CharField(max_length=255)
    details = models.TextField()
    total_target = models.DecimalField(max_digits=10, decimal_places=2)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')

    def clean(self):
        super().clean()
        if self.start_time and self.end_time:
            if self.start_time >= self.end_time:
                raise ValidationError({
                    'end_time': 'End time must be after start time.'
                })
        if self.total_target <= 0:
            raise ValidationError({
                'total_target': 'Total target must be a positive number.'
            })

    def __str__(self):
        return self.title

class Contribution(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='contributions')
    contributor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='contributions')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def clean(self):
        super().clean()
        if self.amount <= 0:
            raise ValidationError({
                'amount': 'Contribution amount must be a positive number.'
            })

    def __str__(self):
        return f"Contribution to {self.project.title} by {self.contributor.username}"
