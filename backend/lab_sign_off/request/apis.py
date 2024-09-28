import logging
import os
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated,BasePermission
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from .models import LabRequest, RequestMessage
from .serializers import LabRequestSerializer, CreateLabRequestSerializer, RequestMessageSerializer, CreateRequestMessageSerializer
from user.permissions import IsAdminOrStaffUser
from django.http import HttpResponse, Http404
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from labsession.models import StudentLabSession
from notifications.tasks import send_notification
from celery.result import AsyncResult

logger = logging.getLogger(__name__)

class CreateLabRequestView(generics.CreateAPIView):
    """ Api view for creating lab request

    Args:
        generics (_type_): Inherits Rest framework CreateAPIView
    """
    serializer_class = CreateLabRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        student_lab_session = serializer.validated_data['student_lab_session']
        staff_members = student_lab_session.lab_session.course.staff.all()
    
        lab_request = serializer.save(student=self.request.user)
        lab_request.staff.set(staff_members)
    
        user_ids = [self.request.user.id]
        user_ids.extend(staff_members.values_list('id', flat=True))

        message = f"A new lab request has been created by {self.request.user.email}."
        extra_data = {'lab_request_id': lab_request.id,'text':lab_request.text}

        logger.info("Users: %s", user_ids)
        logger.info("Message: %s", message)
        logger.info("Extra data: %s", extra_data)

        logger.info("Queuing the notification task")
        result = send_notification(user_ids, message, 'in_app', extra_data)
        # async_result = AsyncResult(result.id)

        # send_notification.delay(user_ids, message, 'email', extra_data)

class IsStudentOrStaff(BasePermission):
    """ Class to check permission of user. Whether it is student or staff

    Args:
        BasePermission (_type_): Inherits BasePermission class
    """
    def has_object_permission(self, request, view, obj):
        return obj.student == request.user or request.user in obj.staff.all()

# no cache
# class ListLabRequestsView(generics.ListAPIView):
#     """ Class for request list api view

#     Args:
#         generics (_type_): ListAPIView

#     Returns:
#         _type_: queryset
#     """
#     serializer_class = LabRequestSerializer
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [SessionAuthentication, TokenAuthentication]

#     def get_queryset(self):
#         user = self.request.user
#         if user.user_type in ['admin', 'staff']:
#             return LabRequest.objects.filter(staff=user)
#         else:
#             return LabRequest.objects.filter(student=user)


# Cached
@method_decorator(cache_page(60 * 15), name='dispatch')  # Cache for 15 minutes
class ListLabRequestsView(generics.ListAPIView):
    """Class for request list api view. Cached api

    Args:
        generics (_type_): ListAPIView

    Returns:
        _type_: queryset
    """
    serializer_class = LabRequestSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ['admin', 'staff']:
            return LabRequest.objects.filter(staff=user)
        else:
            return LabRequest.objects.filter(student=user)
        

@method_decorator(cache_page(60 * 15), name='dispatch')  # Cache for 15 minutes
class AdminLabRequestsView(generics.ListAPIView):
    """Class for request list api view for admin. Cached api

    Args:
        generics (_type_): ListAPIView

    Returns:
        _type_: queryset
    """
    serializer_class = LabRequestSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        queryset = LabRequest.objects.all()
        return queryset

class RetrieveLabRequestView(generics.RetrieveAPIView):
    """ Class for request single api view

    Args:
        generics (_type_): RetrieveAPIView
    """
    queryset = LabRequest.objects.all()
    serializer_class = LabRequestSerializer
    permission_classes = [IsAuthenticated, IsStudentOrStaff]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

class RetrieveUpdateLabRequestView(generics.RetrieveUpdateAPIView):
    """ Class for request update api view

    Args:
        generics (_type_): RetrieveUpdateAPIView

    Returns:
        _type_: queryset
    """
    serializer_class = LabRequestSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        user = self.request.user
        if user.user_type in ['admin', 'staff']:
            return LabRequest.objects.filter(staff=user)
        else:
            return LabRequest.objects.filter(student=user)

class CreateRequestMessageView(generics.CreateAPIView):
    """ API view to create message in request

    Args:
        generics (_type_): CreateAPIView
    """
    serializer_class = CreateRequestMessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def perform_create(self, serializer):
        lab_request = get_object_or_404(LabRequest, pk=self.kwargs['request_id'])
        serializer.save(sender=self.request.user, lab_request=lab_request)

class ListRequestMessagesView(generics.ListAPIView):
    """ View to list messages in a request

    Args:
        generics (_type_): ListAPIView

    Returns:
        _type_: queryset
    """
    serializer_class = RequestMessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudentOrStaff]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get_queryset(self):
        lab_request = get_object_or_404(LabRequest, pk=self.kwargs['request_id'])
        user = self.request.user
        if lab_request.student == user or lab_request.staff == user:
            return RequestMessage.objects.filter(lab_request=lab_request)
        else:
            return RequestMessage.objects.none()


class DownloadLabRequestFileView(generics.GenericAPIView):
    """ View to download the file in request

    Args:
        generics (_type_): GenericAPIView

    Raises:
        Http404: File missing
        Http404: File does not exist

    Returns:
        _type_: File
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get(self, request, pk, *args, **kwargs):
        lab_request = get_object_or_404(LabRequest, pk=pk)

        if lab_request.file:
            file_path = lab_request.file.path
            return self._serve_file(file_path)
        else:
            raise Http404("File not found")

    def _serve_file(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(), content_type="application/octet-stream")
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
                return response
        else:
            raise Http404("File not found")


class DownloadRequestMessageFileView(generics.GenericAPIView):
    """ View to download the file in request message

    Args:
        generics (_type_): GenericAPIView

    Raises:
        Http404: File missing
        Http404: File does not exist

    Returns:
        _type_: File
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get(self, request, pk, *args, **kwargs):
        message = get_object_or_404(RequestMessage, pk=pk)

        if message.file:
            file_path = message.file.path
            return self._serve_file(file_path)
        else:
            raise Http404("File not found")

    def _serve_file(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(), content_type="application/octet-stream")
                filename = os.path.basename(file_path)
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                response['file-name'] = filename
                return response
        else:
            raise Http404("File not found")

class DownloadRequestFileView(generics.GenericAPIView):
    """ View to download the file in request message

    Args:
        generics (_type_): GenericAPIView

    Raises:
        Http404: File missing
        Http404: File does not exist

    Returns:
        _type_: File
    """
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [SessionAuthentication, TokenAuthentication]

    def get(self, request, pk, *args, **kwargs):
        message = get_object_or_404(LabRequest, pk=pk)

        if message.file:
            file_path = message.file.path
            return self._serve_file(file_path)
        else:
            raise Http404("File not found")

    def _serve_file(self, file_path):
        if os.path.exists(file_path):
            with open(file_path, 'rb') as file:
                response = HttpResponse(file.read(), content_type="application/octet-stream")
                filename = os.path.basename(file_path)
                response['Content-Disposition'] = f'attachment; filename="{filename}"'
                response['file-name'] = filename
                return response
        else:
            raise Http404("File not found")