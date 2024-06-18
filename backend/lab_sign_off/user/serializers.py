from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import User,Staff,Student

class UserAuthSerializer(serializers.ModelSerializer):
    """
    Serializer for User Authentication
    """
    class Meta:
        model = User
        fields = ['email', 'password', 'first_name', 'last_name', 'user_type']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user_type = validated_data.pop('user_type')
        email = validated_data['email']
        first_name = validated_data['first_name']
        default_password = email + first_name
        user_name = default_password
        
        if user_type == 'student':
            user = Student(**validated_data)
        elif user_type == 'staff':
            user = Staff(**validated_data)
        elif user_type == "admin":
            user = User(**validated_data)
        else:
            user = User(**validated_data)
        
        user.user_type = user_type
        user.username = user_name
        user.set_password(default_password)
        user.save()
        
        return user

# class UserAuthSerializer(serializers.ModelSerializer):
#     """
#     Serializer for User Authentication
#     """
#     class Meta:
#         model = User
#         fields = ['email', 'password', 'first_name', 'last_name','user_type']
#         extra_kwargs = {'password': {'write_only': True}}

#     # def validate_password(self, value):
#     #     """
#     #     Validate the password to ensure it meets the required complexity.
#     #     """
#     #     try:
#     #         validate_password(value)
#     #     except ValidationError as e:
#     #         raise serializers.ValidationError(str(e))
#     #     return value

#     def create(self, validated_data):
#         user_type = validated_data.pop('user_type')
#         email = validated_data['email']
#         first_name = validated_data['first_name']
#         default_password = email + first_name
        
#         if user_type == 'student':
#             user = Student.objects.create_user(
#                 **validated_data,
#                 password=default_password
#             )
#         elif user_type == 'staff':
#             user = Staff.objects.create_user(
#                 **validated_data,
#                 password=default_password
#             )
#         else:
#             user = User.objects.create_user(
#                 **validated_data,
#                 password=default_password
#             )
        
#         return user


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for User Detail
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', "user_type"]
