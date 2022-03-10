from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from .serializers import CalendarSerializer, ExceptionSerializer, RecurringPatternSerializer
from .models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern


class CalendarObjectViewSet(viewsets.ModelViewSet):
    serializer_class = CalendarSerializer
    queryset = CalendarObject.objects.all()


class ExceptionViewSet(viewsets.ModelViewSet):
    serializer_class = ExceptionSerializer
    queryset = CalendarObjectException.objects.all()


class RecurringPatternViewSet(viewsets.ModelViewSet):
    serializer_class = RecurringPatternSerializer
    queryset = ObjectRecurrencePattern.objects.all()


class CalendarMonthView(APIView):
    def get(self, request, month, year):
        calendar_object_query = CalendarObject.objects.filter(due_date__month=month, due_date__year=year)
        calendar_object_serializer = CalendarSerializer(calendar_object_query, many=True)

        calendar_exception_query = CalendarObjectException.objects.filter(due_date__month=month, due_date__year=year)
        calendar_exception_serializer = ExceptionSerializer(calendar_exception_query, many=True)

        objects_list = {
            'calendar_objects': calendar_object_serializer.data,
            'calendar_exceptions': calendar_exception_serializer.data
        }

        return Response(objects_list)

class CalendarYearView(APIView):
    def get(self, request, year):
        calendar_object_query = CalendarObject.objects.filter(due_date__year=year)
        calendar_object_serializer = CalendarSerializer(calendar_object_query, many=True)

        calendar_exception_query = CalendarObjectException.objects.filter(due_date__year=year)
        calendar_exception_serializer = ExceptionSerializer(calendar_exception_query, many=True)

        objects_list = {
            'calendar_objects': calendar_object_serializer.data,
            'calendar_exceptions': calendar_exception_serializer.data
        }

        return Response(objects_list)


class CalendarDayView(APIView):
    def get(self, request, month, year, day):
        calendar_object_query = CalendarObject.objects.filter(due_date__day=day, due_date__month=month, due_date__year=year)
        calendar_object_serializer = CalendarSerializer(calendar_object_query, many=True)

        calendar_exception_query = CalendarObjectException.objects.filter(due_date__day=day, due_date__month=month, due_date__year=year)
        calendar_exception_serializer = ExceptionSerializer(calendar_exception_query, many=True)

        objects_list = {
            'calendar_objects': calendar_object_serializer.data,
            'calendar_exceptions': calendar_exception_serializer.data
        }

        return Response(objects_list)
