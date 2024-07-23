from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models import LabRequest, RequestMessage
from .serializers import LabRequestSerializer, CreateLabRequestSerializer, RequestMessageSerializer, CreateRequestMessageSerializer
from user.permissions import IsAdminOrStaffUser
from django.shortcuts import get_object_or_404
from labsession.models import StudentLabSession

class CreateLabRequestView(generics.CreateAPIView):
    serializer_class = CreateLabRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        student_lab_session = serializer.validated_data['student_lab_session']
        staff_members = student_lab_session.lab_session.course.staff.all()

        lab_request = serializer.save(student=self.request.user)
        lab_request.staff.set(staff_members)

class ListLabRequestsView(generics.ListAPIView):
    serializer_class = LabRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ['admin', 'staff']:
            return LabRequest.objects.filter(staff=user)
        else:
            return LabRequest.objects.filter(student=user)

class RetrieveUpdateLabRequestView(generics.RetrieveUpdateAPIView):
    serializer_class = LabRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ['admin', 'staff']:
            return LabRequest.objects.filter(staff=user)
        else:
            return LabRequest.objects.filter(student=user)

class CreateRequestMessageView(generics.CreateAPIView):
    serializer_class = CreateRequestMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        lab_request = get_object_or_404(LabRequest, pk=self.kwargs['request_id'])
        serializer.save(sender=self.request.user, lab_request=lab_request)

class ListRequestMessagesView(generics.ListAPIView):
    serializer_class = RequestMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        lab_request = get_object_or_404(LabRequest, pk=self.kwargs['request_id'])
        user = self.request.user
        if lab_request.student == user or lab_request.staff == user:
            return RequestMessage.objects.filter(lab_request=lab_request)
        else:
            return RequestMessage.objects.none()