from rest_framework import serializers
from program.serializers import ProgramsSerializer
from user.models import User
from course.models import Courses
from labsession.models import LabSession

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
 
class LabSessionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LabSession
        fields = ['id', 'name']

class CoursesWithLabSessionsSerializer(serializers.ModelSerializer):
    """Serializer for courses and couunt of lab sessions

    Args:
        serializers (_type_): _description_

    Returns:
        _type_: _description_
    """
    lab_sessions_count = serializers.SerializerMethodField()
    lab_sessions = serializers.SerializerMethodField()

    class Meta:
        model = Courses
        fields = ['id', 'course_name', 'lab_sessions_count', 'lab_sessions']

    def get_lab_sessions_count(self, obj):
        return obj.lab_sessions.count()

    def get_lab_sessions(self, obj):
        lab_sessions = obj.lab_sessions.all()
        return LabSessionDetailSerializer(lab_sessions, many=True).data
    # def to_internal_value(self, data):
    #     print(data)
    #     # Convert 'staff' and 'programs' to lists of integers if they are provided as comma-separated strings
    #     if isinstance(data.get('staff'), str):
    #         data['staff'] = list(map(int, data['staff'].split(',')))
    #     if isinstance(data.get('programs'), str):
    #         data['programs'] = list(map(int, data['programs'].split(',')))
    #     return super().to_internal_value(data)