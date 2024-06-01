from django.shortcuts import render
import ast
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView
)
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User
from .serializers import UserDetailsSerializer
# Create your views here.

class ViewUser(ListAPIView):
    """
    Api to view item in cart
    """
    # authentication_classes = [SessionAuthentication, TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer
    def get_queryset(self):
        queryset = User.objects.all()
        return queryset