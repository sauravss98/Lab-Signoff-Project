from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView
)
from django.contrib.auth import get_user_model
from .models import Courses
from .serializers import CoursesSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from user.permissions import IsAdminOrStaffUser
from rest_framework.authentication import SessionAuthentication,TokenAuthentication

