from django.urls import path
from .apis import CreateProgramView

urlpatterns = [
    path('create/', CreateProgramView.as_view()),
]
