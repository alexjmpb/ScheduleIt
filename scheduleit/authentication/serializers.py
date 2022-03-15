from rest_framework import serializers
from django.contrib.auth import get_user_model
User = get_user_model()
from rest_framework import validators
from django.utils.translation import gettext as _
from djoser.serializers import UserSerializer

class UserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'last_login', 'date_joined', 'image']
        read_only_fields = ['last_login', 'date_joined', 'id']


class CurrentUserSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        model = User
        fields = ['id', 'username', 'email', 'last_login', 'date_joined', 'image']
        read_only_fields = ['last_login', 'date_joined', 'id']

    def validate_username(self, value):
        if len(User.objects.exclude(id=self.instance.id).filter(username__iexact=value)) > 0:
            raise serializers.ValidationError("User with this username already exist.", code="not_unique")
        return value

    def validate_email(self, value):
        if len(User.objects.exclude(id=self.instance.id).filter(email__iexact=value)) > 0:
            raise serializers.ValidationError("User with this email address already exist.", code="not_unique")
        return value