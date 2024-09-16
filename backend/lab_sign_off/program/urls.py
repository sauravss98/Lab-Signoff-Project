from django.urls import path
from .apis import (CreateProgramView,
ProgramsListView, ProgramListView, DeleteProgramView, 
UpdateProgramDetailsView, ProgramsDropDownListView)

urlpatterns = [
    path('create/', CreateProgramView.as_view()),
    path('list/',ProgramsListView.as_view()),
    path('<int:pk>/',ProgramListView.as_view()),
    path('update/<int:pk>/',UpdateProgramDetailsView.as_view()),
    path('delete/<int:pk>/', DeleteProgramView.as_view()),
    path('dropdown/programs/',ProgramsDropDownListView.as_view()),
]
