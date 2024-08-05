from django.urls import path
from notifications.apis import NotificationListView
from notifications.check import CheckNotification

urlpatterns = [
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('check-notification/', CheckNotification.as_view(), name='notification-list'),
]
