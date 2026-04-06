import json
import logging
from django.core.management.base import BaseCommand
from kafka import KafkaConsumer
from notifications.models import Notification
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

class Command(BaseCommand):
    help = 'Starts the Kafka consumer for notifications'

    def handle(self, *args, **options):
        self.stdout.write("Initializing Kafka Consumer for notifications...")
        try:
            consumer = KafkaConsumer(
                'notifications_topic',
                bootstrap_servers=['localhost:9092'],
                auto_offset_reset='latest',
                enable_auto_commit=True,
                group_id='notification-group',
                value_deserializer=lambda x: json.loads(x.decode('utf-8'))
            )
            self.stdout.write(self.style.SUCCESS("Successfully connected to Kafka. Listening for notifications..."))
            
            for message in consumer:
                data = message.value
                user_ids = data.get('user_ids', [])
                msg_text = data.get('message', '')
                notification_type = data.get('notification_type', 'in_app')
                extra_data = data.get('extra_data', None)
                
                if not user_ids or not msg_text:
                    self.stdout.write(self.style.WARNING(f"Invalid message format received: {data}"))
                    continue
                
                try:
                    users = User.objects.filter(id__in=user_ids)
                    notifications_to_create = [
                        Notification(
                            user=user,
                            message=msg_text,
                            notification_type=notification_type,
                            extra_data=extra_data
                        )
                        for user in users
                    ]
                    Notification.objects.bulk_create(notifications_to_create)
                    self.stdout.write(self.style.SUCCESS(f"Created {len(notifications_to_create)} notifications successfully."))
                    
                except Exception as db_exception:
                    logger.error(f"Error saving to DB: {db_exception}")
                    self.stdout.write(self.style.ERROR(f"Error saving to DB: {db_exception}"))

        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Kafka connection failed: {e}"))
            logger.error(f"Kafka connection failed: {e}")
