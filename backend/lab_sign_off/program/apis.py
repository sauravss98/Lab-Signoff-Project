from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView
)
from django.contrib.auth import get_user_model
from .models import Programs
from .serializers import ProgramsSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from user.permissions import IsAdminOrStaffUser
from rest_framework.authentication import SessionAuthentication,TokenAuthentication

class CreateProgramView(CreateAPIView):
    """
    Api view to create the book details
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = ProgramsSerializer