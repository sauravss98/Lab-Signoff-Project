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
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True, 'allow_blank': False},
            'last_name': {'required': True, 'allow_blank': False}
        }

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
        
        user.email_verified = True
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
        
class UserDropDownSerializer(serializers.ModelSerializer):
    """
    Serializer for User Detail dropdown
    """
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name']
        

class PasswordChangeSerializer(serializers.Serializer):
    """
    Serializer for password changes

    Args:
        serializers (_type_): old_password,newpassword

    Returns:
        Validated data 
    """
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']