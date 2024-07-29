from django.urls import path
from .views import (
        create_user,
        login,
        test_token,
        UserLogout,
        verify_otp,
        UsersListView,
        UserListView,
        get_user_details_from_token,
        ChangePasswordView,
        UsersDropDownListView,
        UserChatListView
)
# from .views import ViewUser

urlpatterns = [ 
        path('create_user', create_user,name="create user"),
        path('login', login,name="login"),
        path('test_token', test_token,name="test_token"),
        path('user_details', get_user_details_from_token,name="user_details"),
        path('logout', UserLogout.as_view(),name="logout"),
        path('verify_otp',verify_otp,name="verify_otp"),
        path('users_list',UsersListView.as_view(),name="users_list"),
        path('user/<int:pk>',UserListView.as_view(),name="user list view"),
        path('change-password/',ChangePasswordView.as_view(),name="change-password"),
        path('dropdown/user',UsersDropDownListView.as_view(),name="users_dropdown_list"),
        path('chat/users/', UserChatListView.as_view(), name='user-list'),
]
