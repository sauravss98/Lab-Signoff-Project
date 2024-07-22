from rest_framework import serializers
from .models import LabSession, StudentEnrollment, StudentLabSession
from user.models import User
from course.models import Courses

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


#Serializer for student list with enrollement serializer
class StudentCourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id', 'course_name']

class StudentWithCoursesSerializer(serializers.ModelSerializer):
    enrolled_courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'enrolled_courses']

    def get_enrolled_courses(self, obj):
        enrollments = StudentEnrollment.objects.filter(student=obj)
        courses = Courses.objects.filter(id__in=enrollments.values_list('course', flat=True))
        return StudentCourseSerializer(courses, many=True).data
    
class CourseLabSessionsSerializer(serializers.ModelSerializer):
    lab_sessions = serializers.SerializerMethodField()

    class Meta:
        model = Courses
        fields = ['id', 'course_name', 'lab_sessions']

    def get_lab_sessions(self, obj):
        # Filter lab sessions related to the current course
        lab_sessions = LabSession.objects.filter(course=obj)
        # Get lab sessions for the specific student
        student_lab_sessions = StudentLabSession.objects.filter(
            student=self.context['student'],
            lab_session__in=lab_sessions
        )
        # Serialize the lab sessions
        lab_sessions_data = LabSessionSerializer(lab_sessions, many=True).data

        # Add completed status to each lab session
        for lab_session in lab_sessions_data:
            lab_session_id = lab_session['id']
            # Check if the lab session is completed for the student
            lab_session['completed'] = any(
                sls.completed for sls in student_lab_sessions if sls.lab_session.id == lab_session_id
            )

        return lab_sessions_data

class StudentWithCoursesAndLabSessionsSerializer(serializers.ModelSerializer):
    enrolled_courses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'enrolled_courses']

    def get_enrolled_courses(self, obj):
        enrollments = StudentEnrollment.objects.filter(student=obj)
        courses = Courses.objects.filter(id__in=enrollments.values_list('course', flat=True))
        # Use context to pass the student object to the course serializer
        serializer = CourseLabSessionsSerializer(courses, many=True, context={'student': obj})
        return serializer.data