from rest_framework import serializers
from .models import User

class UserAuthSerializer(serializers.ModelSerializer):
    """
    Serializer for User Authenication
    """
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'first_name', 'last_name']

    extra_kwargs = {
        'password': {'write_only': True},
    }

    def create(self, validated_data):
        user = User(email=validated_data['email'])
        user.set_password(validated_data['password'])
        user.first_name = validated_data['first_name']
        user.last_name = validated_data['last_name']
        user.save()
        return user


class UserDetailsSerializer(serializers.ModelSerializer):
    """
    Serializer for User Detail
    """
    class Meta:
        model = User
        fields = ['id','email',"first_name","last_name"]