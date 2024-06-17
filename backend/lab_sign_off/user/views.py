from django.shortcuts import get_object_or_404
from django.contrib.auth import logout
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView


from .serializers import UserAuthSerializer
from .models import User

from .utils import generate_otp,send_otp_mail

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
    return Response({"message":"sucess","token": token.key, "user_email": serializer.data['email']}, status =  status.HTTP_200_OK)

@api_view(['POST'])
def signup(request):
    """"
    Api for signing up the new user
    """
    serializer = UserAuthSerializer(data=request.data)
    # otp = generate_otp()
    if serializer.is_valid():
        serializer.save()
        user = User.objects.get(email=request.data['email'])
        user.set_password(request.data["password"])
        user.username = request.data['email']+request.data['first_name']
        # user.otp = otp
        user.email_verified = True
        user.save()
        # send_otp_mail(otp,user.email)
        token= Token.objects.create(user=user)
        return Response({"token": token.key, "user": serializer.data}, status=status.HTTP_201_CREATED)
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
        print(user)
        print(f"otp form user {otp_entered}")
        print(f"otp stored in db {user.otp}")
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


class UserLogout(APIView):
    """"
    Api for logging out a user
    """
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
