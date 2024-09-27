from django.urls import path
from .apis import (CreateLabRequestView,ListLabRequestsView,
    RetrieveUpdateLabRequestView,CreateRequestMessageView,ListRequestMessagesView,
    DownloadLabRequestFileView, DownloadRequestMessageFileView,AdminLabRequestsView,
    DownloadRequestFileView)

urlpatterns = [
    path('create/', CreateLabRequestView.as_view(), name='create-lab-request'),
    path('list/', ListLabRequestsView.as_view(), name='list-lab-requests'),
    path("list/admin", AdminLabRequestsView.as_view(), name="admin-lab-requests-list"),
    path('<int:pk>/', RetrieveUpdateLabRequestView.as_view(), name='retrieve-update-lab-request'),
    path('<int:request_id>/messages/create/', CreateRequestMessageView.as_view(), name='create-request-message'),
    path('<int:request_id>/messages/', ListRequestMessagesView.as_view(), name='list-request-messages'),
    path('request_messages/<str:file_name>/', ListRequestMessagesView.as_view(), name='list-request-messages'),
    path('lab_requests/<int:pk>/download/', DownloadLabRequestFileView.as_view(), name='download-lab-request-file'),
    path('request_messages/<int:pk>/download/', DownloadRequestMessageFileView.as_view(), name='download-request-message-file'),
    path('<int:pk>/file-download/', DownloadRequestFileView.as_view(), name='download-request-message-file'),
]