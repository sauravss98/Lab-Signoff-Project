import logging
from celery import shared_task
from django.core.mail import send_mail
from .models import Notification
from django.contrib.auth import get_user_model

logger = logging.getLogger(__name__)

User = get_user_model()

# @shared_task(bind=True)
# def send_notification(self, user_ids, message, notification_type='in_app', extra_data=None):
#     logger.info(f"Task {self.request.id} started with user_ids: {user_ids}, message: {message}")

#     users = User.objects.filter(id__in=user_ids)
#     logger.info(f"Users found: {users}")

#     for user in users:
#         try:
#             notification = Notification.objects.create(
#                 user=user,
#                 message=message,
#                 notification_type=notification_type,
#                 extra_data=extra_data
#             )
#             notification.save()
#             logger.info(f"Notification created for user {user.id} with ID {notification.id}")
#             # if notification_type == 'email':
#             #     # Send email
#             #     send_mail(
#             #         'New Notification',
#             #         message,
#             #         'from@example.com',
#             #         [user.email],
#             #         fail_silently=False,
#             #     )
#         except Exception as e:
#             logger.error(f"Failed to create notification for user {user.id}: {str(e)}")

@shared_task(bind=True)
def send_notification(self, user_ids, message, notification_type='in_app', extra_data=None):
    logger.info(f"Task {self.request.id} started with user_ids: {user_ids}, message: {message}")

    try:
        users = User.objects.filter(id__in=user_ids)
        logger.info(f"Users found: {users}")

        for user in users:
            try:
                notification = Notification.objects.create(
                    user=user,
                    message=message,
                    notification_type=notification_type,
                    extra_data=extra_data
                )
                notification.save()
                logger.info(f"Notification created for user {user.id} with ID {notification.id}")
            except Exception as e:
                logger.error(f"Failed to create notification for user {user.id}: {str(e)}")
        
        logger.info(f"Task {self.request.id} completed successfully")
        return "Notifications sent successfully"
    except Exception as e:
        logger.error(f"Task {self.request.id} failed: {str(e)}")
        self.retry(exc=e, countdown=60, max_retries=3)
