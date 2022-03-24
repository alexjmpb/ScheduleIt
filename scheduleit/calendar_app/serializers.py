from rest_framework import serializers
from .models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern
from django.utils.translation import gettext as _


class CalendarSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarObject
        fields = '__all__'
        read_only_fields = ['date_created', 'id']

    def validate(self, data):
        if data['is_event'] == True:
            if data['due_date'] < data['start_date']:
                raise serializers.ValidationError({'due_date':_('The due date of the event cannot be sooner than the start date')})
        return data


class ExceptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalendarObjectException
        fields = '__all__'
        read_only_fields = ['date_created', 'id']


class RecurringPatternSerializer(serializers.ModelSerializer):
    parent_object = CalendarSerializer(many=False)
    class Meta:
        model = ObjectRecurrencePattern
        fields = '__all__'
        read_only_fields = ['id']