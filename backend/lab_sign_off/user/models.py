from django.db import models # type: ignore
from django.contrib.auth.models import AbstractUser # type: ignore

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
    program = models.ForeignKey('program.Programs', related_name='students', on_delete=models.CASCADE,null=True, blank=True)
    courses = models.ManyToManyField('course.Courses', related_name='student_courses')
    
class Staff(User):
    courses = models.ManyToManyField('course.Courses', related_name='staff_courses')