from django.urls import path
# from .views import signup,login,test_token,UserLogout,verify_otp
from .views import ViewUser

urlpatterns = [ 
        # path('signup', signup),
        # path('login', login),
        # path('test_token', test_token),
        # path('logout', UserLogout.as_view()),
        # path('verify_otp',verify_otp)
        path('test/user',ViewUser.as_view())
]
