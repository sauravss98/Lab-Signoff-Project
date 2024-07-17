from rest_framework import serializers
from .models import LabSession, StudentEnrollment, StudentLabSession

class LabSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSession
        fields = ['id', 'name', 'course']
        read_only_fields = ['order']

    def validate(self, data):
        course = data.get('course')
        name = data.get('name')
        instance = self.instance  # This will be None for create operations

        # Check if a session with this name already exists for the course
        existing = LabSession.objects.filter(course=course, name=name)
        if instance:
            existing = existing.exclude(pk=instance.pk)

        if existing.exists():
            raise serializers.ValidationError({'name': 'A session with this name already exists for this course.'})

        return data

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
