import json
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.contrib.auth import get_user_model
from chat.models import Room, Message
from chat.management.commands.run_chat_consumer import Command as ChatConsumerCommand
import asyncio

User = get_user_model()

class ChatKafkaTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(email="userA@example.com", username="userA")
        self.user2 = User.objects.create(email="userB@example.com", username="userB")

    @patch('chat.management.commands.run_chat_consumer.get_channel_layer')
    @patch('chat.management.commands.run_chat_consumer.KafkaConsumer')
    @patch('chat.management.commands.run_chat_consumer.async_to_sync')
    def test_consumer_creates_room_and_message(self, mock_async_to_sync, mock_kafka_consumer, mock_channel_layer):
        """Test the management command correctly handles chat message records from Kafka"""
        
        # Mock the async_to_sync and channel group send
        mock_group_send = MagicMock()
        mock_async_to_sync.return_value = mock_group_send
        mock_channel_layer_instance = MagicMock()
        mock_channel_layer.return_value = mock_channel_layer_instance
        
        # Mocking Kafka record
        mock_record = MagicMock()
        mock_record.value = {
            'message': 'Hello there',
            'sender': 'userA',
            'user_id': self.user1.id,
            'target_user_id': self.user2.id,
            'room_group_name': 'chat_user_1_2'
        }
        mock_kafka_consumer.return_value = [mock_record]
        
        command = ChatConsumerCommand()
        command.stdout = MagicMock()
        
        # Execute the consumer logic over our single mocked record
        command.handle()

        # Verify DB records
        self.assertEqual(Room.objects.count(), 1)
        self.assertEqual(Message.objects.count(), 1)
        
        msg = Message.objects.first()
        self.assertEqual(msg.content, 'Hello there')
        self.assertEqual(msg.user, self.user1)

        # Verify channel_layer group_send was invoked
        mock_group_send.assert_called_once_with(
            'chat_user_1_2',
            {
                'type': 'chat_message',
                'message': 'Hello there',
                'sender': 'userA'
            }
        )
