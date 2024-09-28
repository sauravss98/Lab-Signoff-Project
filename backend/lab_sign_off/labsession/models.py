from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Max
from django.core.exceptions import ValidationError

User = get_user_model()
# Create your models here.
class LabSession(models.Model):
    course = models.ForeignKey('course.Courses', on_delete=models.CASCADE, related_name='lab_sessions')
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.PositiveIntegerField(editable=False)

    class Meta:
        ordering = ['order']
        unique_together = [
            ['course', 'order'],
            ['course', 'name']
        ]

    def save(self, *args, **kwargs):
        if not self.pk:
            max_order = LabSession.objects.filter(course=self.course).aggregate(Max('order'))['order__max']
            self.order = (max_order or 0) + 1
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.course.course_name} - Session {self.order}: {self.name}"

    def clean(self):
        existing = LabSession.objects.filter(course=self.course, name=self.name).exclude(pk=self.pk)
        if existing.exists():
            raise ValidationError({'name': 'A session with this name already exists for this course.'})

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


class StudentLabSessionFeedback(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    lab_session = models.ForeignKey(LabSession, on_delete=models.CASCADE, related_name='feedbacks')
    feedback = models.TextField()
    rating = models.PositiveIntegerField(null=True, blank=True)

    class Meta:
        unique_together = ['student', 'lab_session']

    def __str__(self):
        return f"Feedback by {self.student.username} for {self.lab_session.name}"