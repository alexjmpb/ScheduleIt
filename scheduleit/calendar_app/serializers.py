import time
from rest_framework import serializers
from .models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern
from django.utils.translation import gettext as _
from django.contrib.auth import get_user_model
User = get_user_model()


class CalendarSerializer(serializers.ModelSerializer):
    created_by = serializers.CurrentUserDefault()
    class Meta:
        model = CalendarObject
        fields = '__all__'

    def validate(self, data):
        if data.get('is_event', None) == True:
            if data['due_date'].time() < data['start_time']:
                raise serializers.ValidationError({'start_time':_('The start time of the event cannot be later than the due time')})         
        return data


class ExceptionSerializer(CalendarSerializer):
    class Meta(CalendarSerializer.Meta):
        model = CalendarObjectException


class RecurringPatternSerializer(serializers.ModelSerializer):
    parent_id = serializers.IntegerField(write_only=True)
    parent_object = CalendarSerializer(
        many=False, 
        read_only=True
    )

    def _user(self):
        request = self.context.get('request', None)
        if request:
            return request.user

    def create(self, validated_data):
        parent_id = validated_data.pop('parent_id')
        validated_data['parent_object'] = CalendarObject.objects.get(pk=parent_id)
        validated_data['created_by'] = self._user()
        pattern = ObjectRecurrencePattern.objects.create(**validated_data)
        return pattern

    class Meta:
        model = ObjectRecurrencePattern
        fields = '__all__'
        read_only_fields = ['created_by']