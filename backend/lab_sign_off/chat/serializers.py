from rest_framework import serializers
from .models import Room, Message

class RoomSerializer(serializers.ModelSerializer):
    """ 
    Serializer for the chat rooms
    """
    class Meta:
        model = Room
        fields = ['id', 'name']

class MessageSerializer(serializers.ModelSerializer):
    """Serializer for message system
    """
    user = serializers.StringRelatedField()
    class Meta:
        model = Message
        fields = ['id', 'room', 'user', 'content', 'timestamp']
