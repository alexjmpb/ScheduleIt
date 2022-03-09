from rest_framework import serializers
from .models import AppUser
from rest_framework import validators
from django.utils.translation import gettext as _
from djoser.serializers import UserSerializer

class UserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = AppUser
        fields = ['id', 'username', 'email', 'last_login', 'date_joined', 'image']
        read_only_fields = ['last_login', 'date_joined', 'id']