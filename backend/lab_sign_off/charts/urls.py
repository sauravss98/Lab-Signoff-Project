from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FeedbackViewSet,
    EnrollmentViewSet,
    LabSessionViewSet,
    LabRequestViewSet,
    UserViewSet,
    ProgramViewSet,
    LabSessionOrderViewSet,
    CompletionVsFeedbackViewSet,
    EnrollmentVsParticipationViewSet,
    LabRequestResponseTimeViewSet,
)

router = DefaultRouter()
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'enrollment', EnrollmentViewSet, basename='enrollment')
router.register(r'lab-sessions', LabSessionViewSet, basename='lab-sessions')
router.register(r'lab-requests', LabRequestViewSet, basename='lab-requests')
router.register(r'users', UserViewSet, basename='users')
router.register(r'programs', ProgramViewSet, basename='programs')
router.register(r'lab-sessions-order', LabSessionOrderViewSet, basename='lab-sessions-order')
router.register(r'completion-vs-feedback', CompletionVsFeedbackViewSet, basename='completion-vs-feedback')
router.register(r'enrollment-vs-participation', EnrollmentVsParticipationViewSet, basename='enrollment-vs-participation')
router.register(r'lab-request-response-time', LabRequestResponseTimeViewSet, basename='lab-request-response-time')

urlpatterns = [
    path('', include(router.urls)),
]