from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    """
    Model for Custom User
    """
    STATUS = (
        ("admin","admin"),
        ("staff","staff"),
        ("student","student")
    )

    email = models.EmailField(unique=True)
    status = models.CharField(max_length=100, choices=STATUS, default="student")
    updated_on = models.DateTimeField(auto_now=True)
    otp = models.IntegerField(default=000000)
    email_verified = models.BooleanField(default=False)

    # Add related_name to groups field
    groups = models.ManyToManyField(
        'auth.Group',  # Use 'auth.Group' to refer to the built-in Group model
        verbose_name='groups',
        blank=True,
        related_name='custom_user_groups'  # Unique related_name
    )

    # Add related_name to user_permissions field
    user_permissions = models.ManyToManyField(
        'auth.Permission',  # Use 'auth.Permission' to refer to the built-in Permission model
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_permissions'  # Unique related_name
    )

    def __str__(self):
        return self.email
