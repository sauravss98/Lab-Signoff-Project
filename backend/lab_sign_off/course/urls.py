from django.urls import path
from .apis import CourseCreateAPIView,CoursesListView,CourseView,CourseUpdateAPIView,CourseDestroyAPIView,CoursesWithLabSessionsListAPIView

urlpatterns = [
    path('create/', CourseCreateAPIView.as_view()),
    path('list/',CoursesListView.as_view()),
    path('<int:pk>/',CourseView.as_view()),
    path('update/<int:pk>/',CourseUpdateAPIView.as_view()),
    path('delete/<int:pk>/',CourseDestroyAPIView.as_view()),
    path('courses-with-sessions-list/',CoursesWithLabSessionsListAPIView.as_view(), name='courses-with-lab-sessions')
]
