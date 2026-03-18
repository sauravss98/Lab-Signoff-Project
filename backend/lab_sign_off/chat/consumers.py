# chat/consumers.py
import json
import logging
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from asgiref.sync import sync_to_async
from .models import Room, Message
from aiokafka import AIOKafkaProducer

logger = logging.getLogger(__name__)

# Global producer instance
producer = None

async def get_producer():
    global producer
    if producer is None:
        producer = AIOKafkaProducer(
            bootstrap_servers='localhost:9092',
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        try:
            await producer.start()
        except Exception as e:
            logger.error(f"Kafka producer failed to start: {e}")
            producer = None
    return producer

class ChatConsumer(AsyncWebsocketConsumer):
    """ This is the consumer that is used for connecting the websocket for chat
    """
    async def connect(self):
        token = self.scope['query_string'].decode().split('=')[-1]
        self.user = await self.authenticate_token(token)

        if self.user is None:
            await self.close()
            return

        self.user_id = int(self.scope['url_route']['kwargs']['user_id'])
        self.room_group_name = self.get_room_group_name(self.user_id, self.user.id)

        if self.channel_layer is None:
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        if self.channel_layer is not None:
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = text_data_json['sender']

        prod_obj = await get_producer()
        
        if prod_obj:
            message_data = {
                'message': message,
                'sender': sender,
                'user_id': self.user.id,
                'target_user_id': self.user_id,
                'room_group_name': self.room_group_name
            }
            try:
                await prod_obj.send_and_wait('chat_messages_topic', message_data)
            except Exception as e:
                logger.error(f"Failed to produce message to Kafka: {e}")
                # Fallback inline execution
                await self.fallback_sync_flow(message, sender)
        else:
            # Fallback inline execution if producer failed to initialize
            await self.fallback_sync_flow(message, sender)

    async def fallback_sync_flow(self, message, sender):
        await self.save_message(self.user, self.user_id, message)
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender
            }
        )

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

    @sync_to_async
    def authenticate_token(self, token):
        User = get_user_model()
        try:
            user = User.objects.get(auth_token=token)
            return user
        except ObjectDoesNotExist:
            return None

    @sync_to_async
    def save_message(self, user, user_id, content):
        user1, user2 = min(user.id, user_id), max(user.id, user_id)
        room_name = f'chat_user_{user1}_{user2}'
        room, created = Room.objects.get_or_create(name=room_name)
        Message.objects.create(room=room, user=user, content=content)

    def get_room_group_name(self, user_id_1, user_id_2):
        return f'chat_user_{min(user_id_1, user_id_2)}_{max(user_id_1, user_id_2)}'
