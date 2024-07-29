import logging
from rest_framework import viewsets
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Room, Message
from rest_framework.exceptions import NotFound
from .serializers import RoomSerializer, MessageSerializer

logger = logging.getLogger(__name__)

class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

    @action(detail=False, methods=['get'])
    def room_messages(self, request):
        room_name = request.query_params.get('room_name')
        if not room_name:
            raise NotFound("Room name not provided.")
        try:
            room = Room.objects.get(name=room_name)
        except Room.DoesNotExist:
            raise NotFound(f"Room '{room_name}' not found.")
        messages = Message.objects.filter(room=room)
        serializer = self.get_serializer(messages, many=True)
        return Response(serializer.data)

class RoomMessagesAPIView(APIView):
    def get(self, request, room_name):
        # Validate and process the room_name
        if not room_name:
            return Response({"detail": "Room name not provided."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            room = Room.objects.get(name=room_name)
        except Room.DoesNotExist:
            return Response({"detail": f"Room '{room_name}' not found."}, status=status.HTTP_404_NOT_FOUND)
        
        messages = Message.objects.filter(room=room)
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)