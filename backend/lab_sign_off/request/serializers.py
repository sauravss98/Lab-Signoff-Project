from rest_framework import serializers
from django.db.models import QuerySet
from .models import LabRequest, RequestMessage
from labsession.serializers import StudentLabSessionSerializer
from user.models import User

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'user_type']

    def to_representation(self, instance):
        if isinstance(instance, QuerySet):
            return [super().to_representation(item) for item in instance]
        return super().to_representation(instance)

class RequestMessageSerializer(serializers.ModelSerializer):
    sender = UserDetailsSerializer(read_only=True)

    class Meta:
        model = RequestMessage
        fields = ['id', 'sender', 'message', 'file', 'created_at']

class LabRequestSerializer(serializers.ModelSerializer):
    student = UserDetailsSerializer(read_only=True)
    staff = UserDetailsSerializer(many=True, read_only=True)
    student_lab_session = StudentLabSessionSerializer(read_only=True)
    messages = RequestMessageSerializer(many=True, read_only=True)

    class Meta:
        model = LabRequest
        fields = ['id', 'student_lab_session', 'student', 'staff', 'text', 'file', 'status', 'created_at', 'updated_at', 'messages']

class CreateLabRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabRequest
        fields = ['student_lab_session', 'text', 'file']

class CreateRequestMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestMessage
        fields = ['message', 'file']