from django.db import models

# Create your models here.
class Courses(models.Model):
    id = models.AutoField(primary_key=True)
    course_name = models.CharField(max_length=255, unique=True, error_messages={'unique': "A course with that name already exists."})
    staff = models.ManyToManyField('user.User', blank=True, limit_choices_to={'user_type': 'staff'}, related_name='courses')
    programs = models.ManyToManyField('program.Programs', blank=True, related_name='courses')

    def __str__(self):
        return self.course_name