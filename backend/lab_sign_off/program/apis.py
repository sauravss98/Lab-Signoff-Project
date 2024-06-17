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
    Api view to create a new program
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = ProgramsSerializer
    
class ProgramsListView(ListAPIView):
    """
    Api view to list all the programs
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = ProgramsSerializer

    def get_queryset(self):
        queryset = Programs.objects.all()
        return queryset

class ProgramListView(RetrieveAPIView):
    """
    Api view to show a single the program
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = ProgramsSerializer
    def get_queryset(self):
        queryset = Programs.objects.all()
        return queryset

class UpdateProgramDetailsView(UpdateAPIView):
    """
    Api view to update the program details
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = ProgramsSerializer
    def get_queryset(self):
        queryset = Programs.objects.all()
        return queryset
