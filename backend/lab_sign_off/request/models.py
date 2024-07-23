from django.db import models
from django.contrib.auth import get_user_model
from labsession.models import StudentLabSession

User = get_user_model()

# Create your models here.
class LabRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    student_lab_session = models.ForeignKey(StudentLabSession, on_delete=models.CASCADE, related_name='requests')
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_requests')
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name='lab_requests_to_review', null=True, blank=True)
    text = models.TextField()
    file = models.FileField(upload_to='lab_requests/', null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request for {self.student_lab_session} by {self.student}"

class RequestMessage(models.Model):
    lab_request = models.ForeignKey(LabRequest, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()
    file = models.FileField(upload_to='request_messages/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message in {self.lab_request} by {self.sender}"