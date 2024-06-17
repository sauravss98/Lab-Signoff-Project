from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    """
    Model for Custom User
    """
    STATUS = (
        ("admin","Admin"),
        ("staff","Staff"), 
        ("student","Student")
    )

    email = models.EmailField(unique = True, error_messages=({'unique':"A user with that email already exists."}))
    status = models.CharField(max_length = 10, choices = STATUS,default="student")
    updated_on = models.DateTimeField(auto_now=True)
    otp = models.PositiveIntegerField(default = 000000)
    email_verified = models.BooleanField(default = False)

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['email']
    