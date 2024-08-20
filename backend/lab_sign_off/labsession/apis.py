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
    StudentLabSessionFeedbackSerializer
)


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
        course_id = self.kwargs['course_id']
        course = Courses.objects.get(id=course_id)
        serializer.save(course=course)

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
        
class StudentLabSessionListView(generics.ListAPIView):
    serializer_class = StudentLabSessionWithDetailsSerializer
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


# StudentProgress view
class StudentProgressRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = StudentProgressSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return get_object_or_404(StudentEnrollment, student=self.request.user, course_id=self.kwargs['course_id'])


#Api for for student list with enrollement serializer
class StudentWithCoursesListAPIView(generics.ListAPIView):
    serializer_class = StudentWithCoursesSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return User.objects.filter(user_type='student').order_by("id")
    

class StudentWithCoursesDetailAPIView(generics.RetrieveAPIView):
    serializer_class = StudentWithCoursesSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        return User.objects.filter(user_type='student')
    
class CurrentStudentWithCoursesDetailAPIView(generics.RetrieveAPIView):
    serializer_class = StudentWithCoursesSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return self.request.user
    

class AvailableCoursesListAPIView(generics.ListAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = CoursesSerializer

    def get(self, request, student_id, *args, **kwargs):
        try:
            student = User.objects.get(id=student_id)
        except User.DoesNotExist:
            return Response({"error": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

        # Get the courses the student is already enrolled in
        enrolled_courses = StudentEnrollment.objects.filter(student=student).values_list('course_id', flat=True)

        # Exclude the enrolled courses from the available courses
        queryset = Courses.objects.exclude(id__in=enrolled_courses).order_by("id")
        
        # Serialize the queryset
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class StudentWithCoursesAndLabSessionsAPIView(generics.RetrieveAPIView):
    serializer_class = StudentWithCoursesAndLabSessionsSerializer
    permission_classes = [IsAuthenticated, IsAdminOrStaffUser]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        return get_object_or_404(User, pk=self.kwargs['pk'], user_type='student')


# Feedback Views
class StudentLabSessionFeedbackCreateAPIView(generics.CreateAPIView):
    serializer_class = StudentLabSessionFeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        student = self.request.user
        lab_session_id = self.kwargs['lab_session_id']
        lab_session = get_object_or_404(LabSession, id=lab_session_id)
        serializer.save(student=student, lab_session=lab_session)

class StudentLabSessionFeedbackRetrieveAPIView(generics.RetrieveAPIView):
    serializer_class = StudentLabSessionFeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        student = self.request.user
        lab_session_id = self.kwargs['lab_session_id']
        return get_object_or_404(StudentLabSessionFeedback, student=student, lab_session_id=lab_session_id)

class StudentLabSessionFeedbackUpdateAPIView(generics.UpdateAPIView):
    serializer_class = StudentLabSessionFeedbackSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_object(self):
        student = self.request.user
        lab_session_id = self.kwargs['lab_session_id']
        return get_object_or_404(StudentLabSessionFeedback, student=student, lab_session_id=lab_session_id)