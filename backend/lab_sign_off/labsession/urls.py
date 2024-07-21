from django.urls import path
from .apis import (
    LabSessionListAPIView, LabSessionCreateAPIView, LabSessionRetrieveAPIView,
    LabSessionUpdateAPIView, LabSessionDestroyAPIView,
    StudentEnrollmentListAPIView, StudentEnrollmentCreateAPIView,
    StudentEnrollmentRetrieveAPIView, StudentEnrollmentUpdateAPIView,
    StudentEnrollmentDestroyAPIView,
    StudentLabSessionListAPIView, StudentLabSessionUpdateAPIView,
    StudentProgressRetrieveAPIView
)

urlpatterns = [
    # LabSession URLs
    path('courses/<int:course_id>/lab-sessions/', LabSessionListAPIView.as_view(), name='lab-session-list'),
    path('courses/<int:course_id>/lab-sessions/create/', LabSessionCreateAPIView.as_view(), name='lab-session-create'),
    path('lab-sessions/<int:pk>/', LabSessionRetrieveAPIView.as_view(), name='lab-session-detail'),
    path('lab-sessions/<int:pk>/update/', LabSessionUpdateAPIView.as_view(), name='lab-session-update'),
    path('lab-sessions/<int:pk>/delete/', LabSessionDestroyAPIView.as_view(), name='lab-session-delete'),

    # StudentEnrollment URLs
    path('courses/<int:course_id>/enrollments/', StudentEnrollmentListAPIView.as_view(), name='student-enrollment-list'),
    path('courses/<int:course_id>/enrollments/create/', StudentEnrollmentCreateAPIView.as_view(), name='student-enrollment-create'),
    path('enrollments/<int:pk>/', StudentEnrollmentRetrieveAPIView.as_view(), name='student-enrollment-detail'),
    path('enrollments/<int:pk>/update/', StudentEnrollmentUpdateAPIView.as_view(), name='student-enrollment-update'),
    path('enrollments/<int:pk>/delete/', StudentEnrollmentDestroyAPIView.as_view(), name='student-enrollment-delete'),

    # StudentLabSession URLs
    path('courses/<int:course_id>/student-lab-sessions/', StudentLabSessionListAPIView.as_view(), name='student-lab-session-list'),
    path('student-lab-sessions/<int:pk>/update/', StudentLabSessionUpdateAPIView.as_view(), name='student-lab-session-update'),

    # StudentProgress URL
    path('courses/<int:course_id>/progress/', StudentProgressRetrieveAPIView.as_view(), name='student-progress'),
]