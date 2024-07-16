from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from course.models import Courses
from .models import LabSession, StudentEnrollment, StudentLabSession
from .serializers import (
    LabSessionSerializer, StudentEnrollmentSerializer, 
    StudentLabSessionSerializer, StudentProgressSerializer
)
from user.permissions import IsAdminOrStaffUser
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

# LabSession views
class LabSessionListAPIView(generics.ListAPIView):
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return LabSession.objects.filter(course_id=self.kwargs['course_id'])

class LabSessionCreateAPIView(generics.CreateAPIView):
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        course_id = self.kwargs['course_id']
        course = get_object_or_404(Courses, id=course_id)
        lab_session = serializer.save(course=course)

        # Create StudentLabSession instances for all enrolled students
        enrolled_students = StudentEnrollment.objects.filter(course=course)
        for enrollment in enrolled_students:
            StudentLabSession.objects.get_or_create(student=enrollment.student, lab_session=lab_session)

class LabSessionRetrieveAPIView(generics.RetrieveAPIView):
    queryset = LabSession.objects.all()
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class LabSessionUpdateAPIView(generics.UpdateAPIView):
    queryset = LabSession.objects.all()
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class LabSessionDestroyAPIView(generics.DestroyAPIView):
    queryset = LabSession.objects.all()
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

# StudentEnrollment views
class StudentEnrollmentListAPIView(generics.ListAPIView):
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return StudentEnrollment.objects.filter(course_id=self.kwargs['course_id'])

class StudentEnrollmentCreateAPIView(generics.CreateAPIView):
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        enrollment = serializer.save()
        course = enrollment.course
        student = enrollment.student

        # Create StudentLabSession instances for each LabSession in the course
        lab_sessions = LabSession.objects.filter(course=course)
        for lab_session in lab_sessions:
            StudentLabSession.objects.get_or_create(student=student, lab_session=lab_session)

class StudentEnrollmentRetrieveAPIView(generics.RetrieveAPIView):
    queryset = StudentEnrollment.objects.all()
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class StudentEnrollmentUpdateAPIView(generics.UpdateAPIView):
    queryset = StudentEnrollment.objects.all()
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class StudentEnrollmentDestroyAPIView(generics.DestroyAPIView):
    queryset = StudentEnrollment.objects.all()
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

# StudentLabSession views
class StudentLabSessionListAPIView(generics.ListAPIView):
    serializer_class = StudentLabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return StudentLabSession.objects.filter(
            student=self.request.user,
            lab_session__course_id=self.kwargs['course_id']
        )

class StudentLabSessionUpdateAPIView(generics.UpdateAPIView):
    serializer_class = StudentLabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return StudentLabSession.objects.filter(student=self.request.user)

# StudentProgress view
class StudentProgressRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = StudentProgressSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return get_object_or_404(StudentEnrollment, student=self.request.user, course_id=self.kwargs['course_id'])
