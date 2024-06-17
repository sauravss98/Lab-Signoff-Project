from django.urls import path
from .views import create_user,login,test_token,UserLogout,verify_otp
# from .views import ViewUser

urlpatterns = [ 
        path('create_user', create_user),
        path('login', login),
        path('test_token', test_token),
        path('logout', UserLogout.as_view()),
        path('verify_otp',verify_otp),
]
