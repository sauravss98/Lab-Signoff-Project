from rest_framework import serializers
from program.serializers import ProgramsSerializer
from .models import * 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type']

class CoursesSerializer(serializers.ModelSerializer):
    staff = UserSerializer(many=True, read_only=True)
    programs = ProgramsSerializer(many=True, read_only=True)

    class Meta:
        model = Courses
        fields = ['id', 'course_name', 'staff', 'programs']