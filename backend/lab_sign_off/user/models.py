from django.db import models # type: ignore
from django.contrib.auth.models import AbstractUser # type: ignore
from program.models import Programs

# Create your models here.
class User(AbstractUser):
    """
    Model for Custom User
    """
    USER_TYPE = (
        ("admin","Admin"),
        ("staff","Staff"), 
        ("student","Student")
    )

    email = models.EmailField(unique = True, error_messages=({'unique':"A user with that email already exists."}))
    user_type = models.CharField(max_length = 10, choices = USER_TYPE,default="student")
    updated_on = models.DateTimeField(auto_now=True)
    otp = models.PositiveIntegerField(default = 000000)
    email_verified = models.BooleanField(default = False)

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['email']

class Student(User):
    course= models.ManyToManyField(Programs, related_name='students')
    
class Staff(User):
    course= models.ManyToManyField(Programs, related_name='staffs')