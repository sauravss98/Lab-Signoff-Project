from rest_framework import serializers
from program.serializers import ProgramsSerializer
from user.models import User
from course.models import Courses

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'user_type','first_name', 'last_name']

class CoursesCreateSerializer(serializers.ModelSerializer):
    staff = UserSerializer(many=True, read_only=True)
    programs = ProgramsSerializer(many=True, read_only=True)

    class Meta:
        model = Courses
        fields = '__all__'

class CoursesSerializer(serializers.ModelSerializer):
    staff = serializers.SerializerMethodField(read_only=True)
    programs = serializers.SerializerMethodField(read_only=True)
    
    def get_staff(self,obj):
        try:
            staff_list=[]
            if obj.staff.all():
                for item in obj.staff.all():
                    staff_list.append(
                        {
                            "id":item.id,
                            "email":item.email,
                            "first_name": item.first_name,
                            "last_name": item.last_name,
                        }
                    )
                return staff_list
            return []
        except Exception as execption:
            return []
        
    def get_programs(self,obj):
        try:
            programs_list=[]
            if obj.staff.all():
                for program in obj.programs.all():
                    programs_list.append(
                        {
                            "id":program.id,
                            "program_name":program.program_name
                        }
                    )
                return programs_list
            return []
        except Exception as execption:
            return []

    class Meta:
        model = Courses
        fields = ['id', 'course_name', 'staff', 'programs']
        
    # def to_internal_value(self, data):
    #     print(data)
    #     # Convert 'staff' and 'programs' to lists of integers if they are provided as comma-separated strings
    #     if isinstance(data.get('staff'), str):
    #         data['staff'] = list(map(int, data['staff'].split(',')))
    #     if isinstance(data.get('programs'), str):
    #         data['programs'] = list(map(int, data['programs'].split(',')))
    #     return super().to_internal_value(data)