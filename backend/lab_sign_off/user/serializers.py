from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User

class UserAuthSerializer(serializers.ModelSerializer):
    """
    Serializer for User Authentication
    """
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name']
        extra_kwargs = {'password': {'write_only': True}}

    # def validate_password(self, value):
    #     """
    #     Validate the password to ensure it meets the required complexity.
    #     """
    #     try:
    #         validate_password(value)
    #     except ValidationError as e:
    #         raise serializers.ValidationError(str(e))
    #     return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username = validated_data['email']+validated_data['first_name'],
            password=validated_data['email']+validated_data['first_name'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for User Detail
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', "status"]
