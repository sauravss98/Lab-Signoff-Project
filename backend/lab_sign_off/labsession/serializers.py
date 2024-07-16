from rest_framework import serializers
from .models import LabSession, StudentEnrollment, StudentLabSession

class LabSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSession
        fields = ['id', 'name', 'order', 'course']

class StudentEnrollmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentEnrollment
        fields = ['id', 'student', 'course', 'enrollment_date']

class StudentLabSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLabSession
        fields = ['id', 'student', 'lab_session', 'completed']

class StudentProgressSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField()

    class Meta:
        model = StudentEnrollment
        fields = ['id', 'student', 'course', 'progress']

    def get_progress(self, obj):
        total_sessions = obj.course.lab_sessions.count()
        completed_sessions = StudentLabSession.objects.filter(
            student=obj.student,
            lab_session__course=obj.course,
            completed=True
        ).count()
        
        if total_sessions > 0:
            progress_percentage = (completed_sessions / total_sessions) * 100
            return f"{progress_percentage:.1f}%"
        return "0%"
