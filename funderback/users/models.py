from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.exceptions import ValidationError
import re

class User(AbstractUser):
    mobile_phone = models.CharField(max_length=15, unique=True)
    is_active = models.BooleanField(default=False)

    def clean(self):
        super().clean()
        if not re.match(r"^01[0-2,5]{1}[0-9]{8}$", self.mobile_phone):
            raise ValidationError({
                'mobile_phone': 'Mobile phone number must be a valid Egyptian number.'
            })
