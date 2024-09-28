from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from django.shortcuts import get_object_or_404
from django.core.exceptions import ValidationError
from user.models import User
from user.permissions import IsAdminOrStaffUser
from course.models import Courses
from course.serializers import CoursesSerializer
from .models import (
    LabSession, StudentEnrollment, 
    StudentLabSession, StudentLabSessionFeedback
)
from .serializers import (
    LabSessionSerializer, StudentEnrollmentSerializer,
    StudentLabSessionSerializer, StudentProgressSerializer,
    StudentWithCoursesSerializer,StudentWithCoursesAndLabSessionsSerializer,
    StudentLabSessionWithDetailsSerializer,LabSessionSerializer, 
    StudentLabSessionFeedbackSerializer,FeedbackSerializer
)


# LabSession views
class LabSessionListAPIView(generics.ListAPIView):
    """API for lab session list
    """
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return LabSession.objects.filter(course_id=self.kwargs['course_id'])

class LabSessionCreateAPIView(generics.CreateAPIView):
    """API view to create the lab session
    """
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_create(self, serializer):
        course = get_object_or_404(Courses, id=self.kwargs['course_id'])
        lab_session = serializer.save(course=course)

        enrollments = StudentEnrollment.objects.filter(course=course)
        for enrollment in enrollments:
            StudentLabSession.objects.create(student=enrollment.student, lab_session=lab_session)

class LabSessionRetrieveAPIView(generics.RetrieveAPIView):
    """API view to get a single lab session
    """
    queryset = LabSession.objects.all()
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class LabSessionUpdateAPIView(generics.UpdateAPIView):
    """API view to update the lab session
    """
    queryset = LabSession.objects.all()
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)        
        try:
            self.perform_update(serializer)
            return Response(serializer.data)
        except ValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def perform_update(self, serializer):
        serializer.save()

class LabSessionDestroyAPIView(generics.DestroyAPIView):
    """API view to delete a lab session
    """
    queryset = LabSession.objects.all()
    serializer_class = LabSessionSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]


class StudentEnrollmentListAPIView(generics.ListAPIView):
    """API view to see the student enrollment list
    """
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return StudentEnrollment.objects.filter(course_id=self.kwargs['course_id'])

class StudentEnrollmentCreateAPIView(generics.CreateAPIView):
    """API view to enrol the student into course
    """
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        enrollment = serializer.save()
        course = enrollment.course
        student = enrollment.student

        lab_sessions = LabSession.objects.filter(course=course)
        for lab_session in lab_sessions:
            StudentLabSession.objects.get_or_create(student=student, lab_session=lab_session)

class StudentEnrollmentRetrieveAPIView(generics.RetrieveAPIView):
    """API view to see a student enrollment in detail
    """
    queryset = StudentEnrollment.objects.all()
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class StudentEnrollmentUpdateAPIView(generics.UpdateAPIView):
    """API view to update the student enrolment
    """
    queryset = StudentEnrollment.objects.all()
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class StudentEnrollmentDestroyAPIView(generics.DestroyAPIView):
    """API view to delete a student enrollment
    """
    queryset = StudentEnrollment.objects.all()
    serializer_class = StudentEnrollmentSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]


class StudentLabSessionListAPIView(generics.ListAPIView):
    """API view to list the labsession of student
    """
    serializer_class = StudentLabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return StudentLabSession.objects.filter(
            student=self.request.user,
            lab_session__course_id=self.kwargs['course_id']
        )
        
class StudentLabSessionListView(generics.ListAPIView):
    """API view to list the labsession of student
    """
    serializer_class = StudentLabSessionWithDetailsSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return StudentLabSession.objects.filter(
            student=self.request.user,
            lab_session__course_id=self.kwargs['course_id']
        )

class StudentLabSessionUpdateAPIView(generics.UpdateAPIView):
    """API view to update the labsession of student
    """
    serializer_class = StudentLabSessionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        student_id = self.kwargs['student_id']
        lab_session_id = self.kwargs['lab_session_id']

        queryset = StudentLabSession.objects.filter(student_id=student_id, lab_session_id=lab_session_id)

        obj = get_object_or_404(queryset)
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class StudentProgressRetrieveAPIView(generics.RetrieveAPIView):
    """API view to track student progress in a course
    """
    serializer_class = StudentProgressSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return get_object_or_404(StudentEnrollment, student=self.request.user, course_id=self.kwargs['course_id'])


class StudentWithCoursesListAPIView(generics.ListAPIView):
    """API view for student list with enrollment
    """
    serializer_class = StudentWithCoursesSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return User.objects.filter(user_type='student').order_by("id")
    

class StudentWithCoursesDetailAPIView(generics.RetrieveAPIView):
    """API view to get student and course details
    """
    serializer_class = StudentWithCoursesSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return User.objects.filter(user_type='student')
    
class CurrentStudentWithCoursesDetailAPIView(generics.RetrieveAPIView):
    """API view to get student and course details
    """
    serializer_class = StudentWithCoursesSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return self.request.user
    

class AvailableCoursesListAPIView(generics.ListAPIView):
    """API view to filter the courses based on what the student is already enrolled to
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CoursesSerializer

    def get(self, request, student_id, *args, **kwargs):
        try:
            student = User.objects.get(id=student_id)
        except User.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        enrolled_courses = StudentEnrollment.objects.filter(student=student).values_list('course_id', flat=True)

        queryset = Courses.objects.exclude(id__in=enrolled_courses).order_by("id")
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StudentWithCoursesAndLabSessionsAPIView(generics.RetrieveAPIView):
    """API view for student data on course and all lab sessions
    """
    serializer_class = StudentWithCoursesAndLabSessionsSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return get_object_or_404(User, pk=self.kwargs['pk'], user_type='student')


class StudentLabSessionFeedbackCreateAPIView(generics.CreateAPIView):
    """API view to create feedback
    """
    serializer_class = StudentLabSessionFeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        student = self.request.user
        lab_session_id = self.kwargs['lab_session_id']
        lab_session = get_object_or_404(LabSession, id=lab_session_id)
        serializer.save(student=student, lab_session=lab_session)

class StudentLabSessionFeedbackRetrieveAPIView(generics.RetrieveAPIView):
    """API to view feedback
    """
    serializer_class = StudentLabSessionFeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        student = self.request.user
        lab_session_id = self.kwargs['lab_session_id']
        return get_object_or_404(StudentLabSessionFeedback, student=student, lab_session_id=lab_session_id)

class StudentLabSessionFeedbackUpdateAPIView(generics.UpdateAPIView):
    """API view to update feedback
    """
    serializer_class = StudentLabSessionFeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        student = self.request.user
        lab_session_id = self.kwargs['lab_session_id']
        return get_object_or_404(StudentLabSessionFeedback, student=student, lab_session_id=lab_session_id)


class FeedbackListAPIView(generics.ListAPIView):
    """API view to list all feedback
    """
    serializer_class = FeedbackSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    
    def get_queryset(self):
        return StudentLabSessionFeedback.objects.all()