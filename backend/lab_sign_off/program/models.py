from django.db import models

# Create your models here.
class Programs(models.Model):
    id=models.AutoField(primary_key=True)
    program_name= models.CharField(max_length=255,unique=True,error_messages=({'unique':"A program with that name already exists."}))
    program_lenght = models.PositiveIntegerField(default=1)

    def __str__(self):
        return self.program_name
