from rest_framework import serializers
from .models import LabRequest, RequestMessage
from user.serializers import UserDetailsSerializer as UserSerializer
from labsession.serializers import StudentLabSessionSerializer

class RequestMessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = RequestMessage
        fields = ['id', 'sender', 'message', 'file', 'created_at']

class LabRequestSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    staff = UserSerializer(read_only=True)
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