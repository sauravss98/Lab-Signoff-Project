from rest_framework.generics import (
    CreateAPIView,
    DestroyAPIView,
    ListAPIView,
    UpdateAPIView,
    RetrieveAPIView
)
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Courses
from .serializers import CoursesSerializer,CoursesCreateSerializer,CoursesWithLabSessionsSerializer,UserSerializer
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from user.permissions import IsAdminOrStaffUser
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from user.models import Staff,User
from program.models import Programs

class CourseCreateAPIView(CreateAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    
    def post(self,request):
        staff_ids  = request.data.get('staff_ids', []).strip('[]')
        print(staff_ids)
        staff_ids_array = list(map(int, staff_ids.split(','))) if staff_ids else []
        print(staff_ids_array)
        programs_ids  = request.data.get('programs_ids', []).strip('[]')
        programs_ids_array = list(map(int, programs_ids.split(','))) if programs_ids else []
        course = Courses.objects.create(course_name=request.data.get('course_name'))
        for staff_id in staff_ids_array:
            try:
                staff = User.objects.get(pk=staff_id)
                if staff.user_type == 'staff':
                    course.staff.add(staff)
                else:
                    return Response(
                        {"error": f"User with id {staff_id} is not a staff member."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except User.DoesNotExist:
                return Response(
                    {"error": f"User with id {staff_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        for program_id in programs_ids_array:
            program = Programs.objects.get(pk = program_id)
            print(program)
            course.programs.add(program)
        serializer = CoursesCreateSerializer(course)
        return Response(serializer.data)
        
    
class CoursesListView(ListAPIView):
    """
    Api view to create the book list
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = CoursesSerializer

    def get_queryset(self):
        queryset = Courses.objects.all().order_by("id")
        return queryset

class CourseView(RetrieveAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer

class CourseUpdateAPIView(UpdateAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    queryset = Courses.objects.all()
    serializer_class = CoursesCreateSerializer
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # Extract and process staff_ids
        staff_ids = request.data.get('staff_ids', '[]').strip('[]')
        staff_ids_array = list(map(int, staff_ids.split(','))) if staff_ids else []

        # Extract and process programs_ids
        programs_ids = request.data.get('programs_ids', '[]').strip('[]')
        programs_ids_array = list(map(int, programs_ids.split(','))) if programs_ids else []

        # Update course name if provided
        course_name = request.data.get('course_name')
        if course_name:
            instance.course_name = course_name

        # Clear existing staff and programs if provided
        if staff_ids:
            instance.staff.clear()
            for staff_id in staff_ids_array:
                try:
                    staff = User.objects.get(pk=staff_id)
                    if staff.user_type == 'staff':
                        instance.staff.add(staff)
                    else:
                        return Response(
                            {"error": f"User with id {staff_id} is not a staff member."},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                except User.DoesNotExist:
                    return Response(
                        {"error": f"User with id {staff_id} does not exist."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        if programs_ids:
            instance.programs.clear()
            for program_id in programs_ids_array:
                try:
                    program = Programs.objects.get(pk=program_id)
                    instance.programs.add(program)
                except Programs.DoesNotExist:
                    return Response(
                        {"error": f"Program with id {program_id} does not exist."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

        instance.save()
        serializer = self.get_serializer(instance, partial=partial)
        return Response(serializer.data)


class CourseDestroyAPIView(DestroyAPIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer


class CoursesWithLabSessionsListAPIView(ListAPIView):
    """List Api for courses and lab sessions

    Args:
        ListAPIView (_type_): _description_

    Returns:
        _type_: _description_
    """
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAdminOrStaffUser]
    serializer_class = CoursesWithLabSessionsSerializer

    def get_queryset(self):
        return Courses.objects.all().order_by("id")

class CourseStaffListAPIView(APIView):
    authentication_classes = [SessionAuthentication, TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, course_id):
        try:
            course = Courses.objects.get(pk=course_id)
            staff_members = course.staff.all()
            serializer = UserSerializer(staff_members, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Courses.DoesNotExist:
            return Response(
                {"error": "Course not found."},
                status=status.HTTP_404_NOT_FOUND
            )