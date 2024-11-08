from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import LabSession, StudentEnrollment, StudentLabSession, StudentLabSessionFeedback
from user.models import User
from course.models import Courses

class LabSessionSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.course_name', read_only=True)
    class Meta:
        model = LabSession
        fields = ['id', 'name', 'course', 'course_name', 'description']
        read_only_fields = ['course_name']

    def validate(self, data):
        course = data.get('course')
        name = data.get('name')
        instance = self.instance

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

    def validate(self, data):
        course = data.get('course')

        if not course.staff.exists():
            raise ValidationError({"course": "This course does not have any staff assigned. Enrollment is not allowed."})

        return data

class StudentLabSessionSerializer(serializers.ModelSerializer):
    lab_session = LabSessionSerializer()
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
        lab_sessions = LabSession.objects.filter(course=obj)
        student_lab_sessions = StudentLabSession.objects.filter(
            student=self.context['student'],
            lab_session__in=lab_sessions
        )
        lab_sessions_data = LabSessionSerializer(lab_sessions, many=True).data
        for lab_session in lab_sessions_data:
            lab_session_id = lab_session['id']
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
        serializer = CourseLabSessionsSerializer(courses, many=True, context={'student': obj})
        return serializer.data

class StudentLabSessionWithDetailsSerializer(serializers.ModelSerializer):
    lab_session_name = serializers.CharField(source='lab_session.name', read_only=True)
    lab_session_description = serializers.CharField(source='lab_session.description', read_only=True)

    class Meta:
        model = StudentLabSession
        fields = ['id', 'student', 'lab_session', 'lab_session_name', 'completed','lab_session_description']
        

class StudentLabSessionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentLabSessionFeedback
        fields = ['id', 'student', 'lab_session', 'feedback', 'rating']
        read_only_fields = ['student', 'lab_session']


class FeedbackSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source="lab_session.course.course_name", read_only=True)
    course_id = serializers.IntegerField(source="lab_session.course.id", read_only=True)
    lab_session_name = serializers.CharField(source="lab_session.name", read_only=True)
    class Meta:
        model = StudentLabSessionFeedback
        fields = ['id', 'lab_session', 'feedback', 'rating', 'course_name', 'course_id', 'lab_session_name']
        read_only_fields = ['student', 'lab_session']