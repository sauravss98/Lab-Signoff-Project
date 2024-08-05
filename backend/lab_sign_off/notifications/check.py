from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from notifications.tasks import send_notification
import logging
from celery.result import AsyncResult

logger = logging.getLogger(__name__)

class CheckNotification(APIView):
    def get(self, request):
        user_ids = [2, 18, 10]
        message = "Test notification message"
        extra_data = {'lab_request_id': 2}
    
        result = send_notification.delay(user_ids, message, 'in_app', extra_data)
        logger.info(f"Task queued with ID: {result.id}")
    
        res = AsyncResult(result.id)
        
        return Response({
            "task_id": result.id,
            "task_status": res.state,
            "task_result": res.result
        }, status=status.HTTP_200_OK)
