# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RoomViewSet, RoomMessagesAPIView,MessageViewSet

router = DefaultRouter()
router.register(r'rooms', RoomViewSet)
router.register(r'messages', MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('messages/room/<str:room_name>/', RoomMessagesAPIView.as_view(), name='room-messages'),
]
