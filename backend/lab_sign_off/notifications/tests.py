import json
from unittest.mock import patch, MagicMock
from django.test import TestCase
from django.contrib.auth import get_user_model
from notifications.tasks import send_notification
from notifications.models import Notification
from notifications.management.commands.run_notification_consumer import Command as NotificationConsumerCommand

User = get_user_model()

class NotificationKafkaTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(email="user1@example.com", username="user1")
        self.user2 = User.objects.create(email="user2@example.com", username="user2")

    @patch('notifications.tasks.producer')
    def test_send_notification_produces_to_kafka(self, mock_producer):
        """Test that send_notification publishes correctly to Kafka"""
        user_ids = [self.user1.id, self.user2.id]
        message = "Test notification"
        
        result = send_notification(user_ids, message, 'in_app', {'test': 'data'})
        
        self.assertEqual(result, "Notification queued to Kafka successfully")
        
        # Verify producer.send was called
        mock_producer.send.assert_called_once()
        args, kwargs = mock_producer.send.call_args
        self.assertEqual(args[0], 'notifications_topic')
        self.assertEqual(args[1]['message'], message)
        self.assertEqual(args[1]['user_ids'], user_ids)
        
        mock_producer.flush.assert_called_once()

    @patch('notifications.management.commands.run_notification_consumer.KafkaConsumer')
    def test_consumer_creates_database_records(self, mock_kafka_consumer):
        """Test that the management command creates Notification records from Kafka messages"""
        
        # Mocking the Kafka message structure
        mock_record = MagicMock()
        mock_record.value = {
            'user_ids': [self.user1.id],
            'message': 'Persisted Notification',
            'notification_type': 'in_app',
            'extra_data': None
        }
        
        # Making the consumer yield only this record then break (simulate finite behavior)
        mock_kafka_consumer.return_value = [mock_record]
        
        command = NotificationConsumerCommand()
        command.stdout = MagicMock()
        
        # We catch StopIteration or just let it process the list Mock we gave
        command.handle()
        
        self.assertEqual(Notification.objects.count(), 1)
        notif = Notification.objects.first()
        self.assertEqual(notif.user, self.user1)
        self.assertEqual(notif.message, 'Persisted Notification')
