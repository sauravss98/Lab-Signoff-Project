from rest_framework import serializers
from .models import * 

class ProgramsSerializer(serializers.ModelSerializer):
    """
    Serializer for program
    """
    class Meta:
        model= Programs
        fields=["id","program_name","program_lenght"]
        
class ProgramsDropDownSerializer(serializers.ModelSerializer):
    """
    Serializer for program dropdown
    """
    class Meta:
        model= Programs
        fields=["id","program_name"]