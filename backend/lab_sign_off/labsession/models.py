from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()
# Create your models here.
class LabSession(models.Model):
    course = models.ForeignKey('course.Courses', on_delete=models.CASCADE, related_name='lab_sessions')
    name = models.CharField(max_length=255)
    order = models.PositiveIntegerField()

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(fields=['course', 'order'], name='unique_course_order')
        ]

    def __str__(self):
        return f"{self.course.course_name} - Session {self.order}: {self.name}"

class StudentEnrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='enrollments')
    course = models.ForeignKey('course.Courses', on_delete=models.CASCADE, related_name='enrollments')
    enrollment_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'course'], name='unique_student_course')
        ]

    def __str__(self):
        return f"{self.student.username} enrolled in {self.course.course_name}"

class StudentLabSession(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_sessions')
    lab_session = models.ForeignKey(LabSession, on_delete=models.CASCADE, related_name='student_sessions')
    completed = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['student', 'lab_session'], name='unique_student_lab_session')
        ]

    def __str__(self):
        return f"{self.student.username} - {self.lab_session.name} - {'Completed' if self.completed else 'Not Completed'}"
