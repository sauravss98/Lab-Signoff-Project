from django.urls import path
from .apis import (CreateLabRequestView,ListLabRequestsView,
    RetrieveUpdateLabRequestView,CreateRequestMessageView,ListRequestMessagesView)

urlpatterns = [
    path('create/', CreateLabRequestView.as_view(), name='create-lab-request'),
    path('list/', ListLabRequestsView.as_view(), name='list-lab-requests'),
    path('<int:pk>/', RetrieveUpdateLabRequestView.as_view(), name='retrieve-update-lab-request'),
    path('<int:request_id>/messages/create/', CreateRequestMessageView.as_view(), name='create-request-message'),
    path('<int:request_id>/messages/', ListRequestMessagesView.as_view(), name='list-request-messages'),
]