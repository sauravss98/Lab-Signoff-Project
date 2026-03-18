import logging
import json
from kafka import KafkaProducer
from django.conf import settings
from .models import Notification
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)
User = get_user_model()

try:
    producer = KafkaProducer(
        bootstrap_servers=['localhost:9092'],
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
except Exception as e:
    logger.error(f"Failed to initialize KafkaProducer: {str(e)}")
    producer = None

def send_notification(user_ids, message, notification_type='in_app', extra_data=None):
    logger.info(f"Producing notification for user_ids: {user_ids}, message: {message}")
    
    if not producer:
        logger.error("Kafka producer is not available. Falling back to synchronous creation.")
        # Fallback to direct DB insert for safety if Kafka is down
        try:
            users = User.objects.filter(id__in=user_ids)
            for user in users:
                Notification.objects.create(
                    user=user,
                    message=message,
                    notification_type=notification_type,
                    extra_data=extra_data
                )
            return "Notifications tracked synchronously (Kafka down)"
        except Exception as e:
            logger.error(f"Fallback failed: {str(e)}")
            return "Failed to send notifications completely"
            
    data = {
        'user_ids': list(user_ids),
        'message': message,
        'notification_type': notification_type,
        'extra_data': extra_data
    }
    
    try:
        producer.send('notifications_topic', data)
        producer.flush()
        logger.info("Successfully produced to notifications_topic")
        return "Notification queued to Kafka successfully"
    except Exception as e:
        logger.error(f"Failed to produce notification to Kafka: {str(e)}")
        return "Failed to queue notification"
