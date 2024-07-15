from django.shortcuts import get_object_or_404
from django.contrib.auth import logout,update_session_auth_hash
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView
)
from user.permissions import IsAdminOrStaffUser

from .serializers import UserAuthSerializer,UserDetailsSerializer,PasswordChangeSerializer,UserDropDownSerializer
from .models import User

from .utils import generate_otp,send_new_user_created_mail

@api_view(['POST'])
def login(request):
    """"
    Api for logging in the user
    """
    user = get_object_or_404(User, email=request.data['email'])
    if(user.email_verified == False):
        return Response({"message":"Please verify account using otp"}, status =  status.HTTP_401_UNAUTHORIZED)
    if not user.check_password(request.data["password"]):
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserAuthSerializer(instance=user)
    return Response({
        "message":"sucess",
        "token": token.key, 
        "user_email": serializer.data['email'],
        "user_type":serializer.data["user_type"],
        "user_first_name":serializer.data["first_name"],
        "user_last_name":serializer.data["last_name"],
        }, status =  status.HTTP_200_OK
    )

@api_view(['POST'])
@permission_classes([IsAdminOrStaffUser])
def create_user(request):
    """"
    Api for signing up the new user
    """
    serializer = UserAuthSerializer(data=request.data)
    # otp = generate_otp()
    if serializer.is_valid():
        user = serializer.save()
        user.email_verified = True
        send_new_user_created_mail(user.email)
        return Response({"user": serializer.data}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def verify_otp(request):
    """"
    Api for verifying otp of a new user
    """
    if request.method == 'POST':
        otp_entered = request.data['otp']
        user = request.user
        if int(user.otp) == int(otp_entered):
            # OTP matched, mark email as verified
            user.email_verified = True
            user.save()
            return Response('home')
        else:
            # OTP did not match, show error
            return Response({'error': 'Invalid OTP'})
    

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed for {}".format(request.user.email))

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_details_from_token(request):
    return Response(
        {"email":request.user.email, 
        "first_name":request.user.first_name,
        "last_name":request.user.last_name,
        "user_type":request.user.user_type},
        status=status.HTTP_200_OK
        )


class UserLogout(APIView):
    """"
    Api for logging out a user
    """
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
    
class UsersListView(ListAPIView):
    """
    API for users list API view. There is a filter that filters the status
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserDetailsSerializer

    def get_queryset(self):
        user_type_filter = self.request.query_params.get("user_type")
        if user_type_filter:
            queryset = User.objects.filter(user_type=user_type_filter).order_by("id")
        else:
            queryset = User.objects.all().order_by("id")
        return queryset
    
class UsersDropDownListView(ListAPIView):
    """
    API for users list API dropdown view.
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserDropDownSerializer
    pagination_class = None  

    def get_queryset(self):
        queryset = User.objects.filter(user_type="staff").order_by("id")
        return queryset
    
class UserListView(RetrieveAPIView):
    """
    Api for a single user
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class= UserDetailsSerializer
    def get_queryset(self):
        queryset = User.objects.all()
        return queryset


class ChangePasswordView(APIView):
    """
    An endpoint for changing password.
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            update_session_auth_hash(request, user)  # Keeps the user authenticated after password change
            return Response({"message": "Password updated successfully"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)