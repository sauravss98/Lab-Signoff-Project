from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,BasePermission
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

class IsStudentOrStaff(BasePermission):
    def has_object_permission(self, request, view, obj):
        # Check if the user is the student who created the request or a staff member in the request
        return obj.student == request.user or request.user in obj.staff.all()

class ListLabRequestsView(generics.ListAPIView):
    serializer_class = LabRequestSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ['admin', 'staff']:
            # For admin or staff, return requests where the user is a staff member
            return LabRequest.objects.filter(staff=user)
        else:
            # For students, return requests created by the user
            return LabRequest.objects.filter(student=user)

class RetrieveLabRequestView(generics.RetrieveAPIView):
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = [IsAuthenticated, IsStudentOrStaff]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

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