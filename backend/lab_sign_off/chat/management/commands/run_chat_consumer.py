import json
import logging
from django.core.management.base import BaseCommand
from kafka import KafkaConsumer
from chat.models import Room, Message
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

class Command(BaseCommand):
    help = 'Starts the Kafka consumer for chat messages'

    def handle(self, *args, **options):
        self.stdout.write("Initializing Kafka Consumer for chat messages...")
        
        channel_layer = get_channel_layer()

        try:
            consumer = KafkaConsumer(
                'chat_messages_topic',
                bootstrap_servers=['localhost:9092'],
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id='chat-group',
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            self.stdout.write(self.style.SUCCESS("Successfully connected to Kafka. Listening for chat messages..."))
            
            for message_record in consumer:
                data = message_record.value
                msg_text = data.get('message', '')
                sender = data.get('sender', '')
                user_id = data.get('user_id')
                target_user_id = data.get('target_user_id')
                room_group_name = data.get('room_group_name')
                
                if not user_id or not target_user_id or not msg_text:
                    self.stdout.write(self.style.WARNING(f"Invalid message format received: {data}"))
                    continue
                
                try:
                    # Resolve user
                    user = User.objects.get(id=user_id)
                    
                    # Create DB records
                    user1, user2 = min(user.id, target_user_id), max(user.id, target_user_id)
                    room_name = f'chat_user_{user1}_{user2}'
                    room, _ = Room.objects.get_or_create(name=room_name)
                    Message.objects.create(room=room, user=user, content=msg_text)

                    # Send to channel layer
                    if channel_layer:
                        async_to_sync(channel_layer.group_send)(
                            room_group_name,
                            {
                                'type': 'chat_message',
                                'message': msg_text,
                                'sender': sender
                            }
                        )
                    
                except User.DoesNotExist:
                    logger.error(f"User ID {user_id} does not exist.")
                except Exception as db_exception:
                    logger.error(f"Error processing chat message: {db_exception}")
                    self.stdout.write(self.style.ERROR(f"Error processing chat message: {db_exception}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Kafka connection failed: {e}"))
            logger.error(f"Kafka connection failed: {e}")
