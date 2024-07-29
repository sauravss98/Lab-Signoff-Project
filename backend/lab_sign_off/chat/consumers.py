import json
import logging
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.core.exceptions import ObjectDoesNotExist
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query parameters
        token = self.scope['query_string'].decode().split('=')[-1]

        # Authenticate the token
        self.user = await self.authenticate_token(token)
        logger.info(f"Authenticated user: {self.user}")

        if self.user is None:
            logger.warning("Invalid token")
            await self.close()
            return

        # Convert user_id from URL parameters to integer
        self.user_id = int(self.scope['url_route']['kwargs']['user_id'])
        self.room_group_name = self.get_room_group_name(self.user_id, self.user.id)

        logger.info(f"User {self.user} connected to {self.room_group_name}")

        if self.channel_layer is None:
            logger.error("Channel layer is None")
            await self.close()
            return

        logger.info(f"Channel Layer: {self.channel_layer}")

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
        logger.info("Received message")

        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send the message to the chat room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    async def chat_message(self, event):
        message = event['message']

        # Send the message to the WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

    @sync_to_async
    def authenticate_token(self, token):
        User = get_user_model()
        try:
            # Example query to find user by token
            user = User.objects.get(auth_token=token)  # Adjust this based on your actual user model
            return user
        except ObjectDoesNotExist:
            return None

    def get_room_group_name(self, user_id_1, user_id_2):
        user_id_1 = int(user_id_1)  # Convert to integer
        user_id_2 = int(user_id_2)  # Convert to integer
        return f'chat_user_{min(user_id_1, user_id_2)}_{max(user_id_1, user_id_2)}'

