from django.db import models
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from course.models import Courses
from labsession.models import (
    StudentLabSessionFeedback, LabSession,
    StudentEnrollment
)
from program.models import Programs
from request.models import LabRequest
from user.models import User



class FeedbackViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def overall_ratings(self, request):
        feedback_data = StudentLabSessionFeedback.objects.values('rating').annotate(count=models.Count('id')).order_by('rating')
        return Response(feedback_data)

    @action(detail=False, methods=['get'])
    def course_ratings(self, request):
        course_feedback = LabSession.objects.values('course__course_name').annotate(average_rating=models.Avg('feedbacks__rating')).order_by('course__course_name')
        return Response(course_feedback)
    
    @action(detail=False, methods=['get'])
    def rating_distribution(self, request):
        ratings = StudentLabSessionFeedback.objects.values('rating').annotate(count=Count('id')).order_by('rating')
        rating_counts = {str(rating): 0 for rating in range(1, 6)}
        for rating in ratings:
            rating_counts[str(rating['rating'])] = rating['count']
        return Response(rating_counts)
    

class EnrollmentViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def trends(self, request):
        enrollment_data = StudentEnrollment.objects.values('enrollment_date__date').annotate(enrollments=models.Count('id')).order_by('enrollment_date__date')
        return Response(enrollment_data)

    @action(detail=False, methods=['get'])
    def course_count(self, request):
        course_enrollments = Courses.objects.annotate(enrollments=models.Count('enrollments')).values('course_name', 'enrollments').order_by('course_name')
        return Response(course_enrollments)

    @action(detail=False, methods=['get'])
    def program_count(self, request):
        program_enrollments = Programs.objects.annotate(enrollments=models.Count('students')).values('program_name', 'enrollments').order_by('program_name')
        return Response(program_enrollments)


class LabSessionViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def completion_rates(self, request):
        lab_sessions = LabSession.objects.all()
        completion_data = []
        for session in lab_sessions:
            completed = session.student_sessions.filter(completed=True).count()
            not_completed = session.student_sessions.filter(completed=False).count()
            completion_data.append({
                'session': session.name,
                'completed': completed,
                'not_completed': not_completed
            })
        return Response(completion_data)

    @action(detail=False, methods=['get'])
    def course_participation(self, request):
        course_participation = LabSession.objects.values('course__course_name').annotate(participation=models.Count('student_sessions')).order_by('course__course_name')
        return Response(course_participation)


class LabRequestViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def status_distribution(self, request):
        status_data = LabRequest.objects.values('status').annotate(count=models.Count('id')).order_by('status')
        return Response(status_data)

    @action(detail=False, methods=['get'])
    def trends(self, request):
        request_data = LabRequest.objects.values('created_at__date').annotate(requests=models.Count('id')).order_by('created_at__date')
        return Response(request_data)

    @action(detail=False, methods=['get'])
    def course_count(self, request):
        course_requests = LabRequest.objects.values('student_lab_session__lab_session__course__course_name').annotate(requests=models.Count('id')).order_by('student_lab_session__lab_session__course__course_name')
        return Response(course_requests)
    

class UserViewSet(viewsets.ViewSet):
    
    @action(detail=False, methods=['get'])
    def type_distribution(self, request):
        user_type_data = User.objects.values('user_type').annotate(count=models.Count('id')).order_by('user_type')
        return Response(user_type_data)


class ProgramViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def student_count(self, request):
        program_data = Programs.objects.annotate(students=models.Count('students')).values('program_name', 'students').order_by('program_name')
        return Response(program_data)

    @action(detail=False, methods=['get'])
    def average_length(self, request):
        average_length_data = Programs.objects.aggregate(average_length=models.Avg('program_lenght'))
        return Response(average_length_data)
    

class LabSessionOrderViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def order(self, request):
        session_order = LabSession.objects.values('course__course_name', 'order', 'name').order_by('course__course_name', 'order')
        course_sessions = {}
        for session in session_order:
            course_name = session['course__course_name']
            if course_name not in course_sessions:
                course_sessions[course_name] = []
            course_sessions[course_name].append(session['name'])
        return Response(course_sessions)


class CompletionVsFeedbackViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def correlation(self, request):
        correlation_data = LabSession.objects.annotate(
            completion_rate=models.Count('student_sessions', filter=models.Q(student_sessions__completed=True)) * 100.0 / models.Count('student_sessions'),
            average_feedback=models.Avg('feedbacks__rating')
        ).values('name', 'completion_rate', 'average_feedback').order_by('name')
        return Response(correlation_data)


class EnrollmentVsParticipationViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def enrollment_vs_participation(self, request):
        enrollment_vs_participation = Courses.objects.annotate(
            enrollments=models.Count('enrollments'),
            participation=models.Count('lab_sessions__student_sessions')
        ).values('course_name', 'enrollments', 'participation').order_by('course_name')
        return Response(enrollment_vs_participation)
    

class LabRequestResponseTimeViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'])
    def response_time(self, request):
        response_time_data = LabRequest.objects.annotate(
            average_response_time=models.Avg('requestmessage__response_time')
        ).values('staff__name', 'average_response_time').order_by('staff__name')
        return Response(response_time_data)