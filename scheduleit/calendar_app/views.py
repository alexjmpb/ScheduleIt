from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import datetime
from .serializers import CalendarSerializer, ExceptionSerializer, RecurringPatternSerializer
from .models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        print(obj)


class CalendarObjectViewSet(viewsets.ModelViewSet):

    serializer_class = CalendarSerializer
    
    def get_queryset(self):
        return CalendarObject.objects.filter(created_by=self.request.user)


class ExceptionViewSet(viewsets.ModelViewSet):
    serializer_class = ExceptionSerializer
    queryset = CalendarObjectException.objects.all()

    def get_queryset(self):
        return CalendarObjectException.objects.filter(created_by=self.request.user)


class RecurringPatternViewSet(viewsets.ModelViewSet):
    serializer_class = RecurringPatternSerializer
    queryset = ObjectRecurrencePattern.objects.all()

    def get_queryset(self):
        return ObjectRecurrencePattern.objects.filter(created_by=self.request.user)


class CalendarMonthView(APIView):
    def get(self, request, month, year):
        calendar_object_query = CalendarObject.objects.filter(due_date__month=month, due_date__year=year, created_by=request.user)
        calendar_object_serializer = CalendarSerializer(calendar_object_query, many=True)

        calendar_exception_query = CalendarObjectException.objects.filter(due_date__month=month, due_date__year=year, created_by=request.user)
        calendar_exception_serializer = ExceptionSerializer(calendar_exception_query, many=True)

        objects_list = {
            'calendar_objects': calendar_object_serializer.data,
            'calendar_exceptions': calendar_exception_serializer.data
        }

        return Response(objects_list)


class CalendarYearView(APIView):
    def get(self, request, year):
        calendar_object_query = CalendarObject.objects.filter(due_date__year=year, created_by=request.user)
        calendar_object_serializer = CalendarSerializer(calendar_object_query, many=True)

        calendar_exception_query = CalendarObjectException.objects.filter(due_date__year=year, created_by=request.user)
        calendar_exception_serializer = ExceptionSerializer(calendar_exception_query, many=True)

        objects_list = {
            'calendar_objects': calendar_object_serializer.data,
            'calendar_exceptions': calendar_exception_serializer.data
        }

        return Response(objects_list)


class CalendarDayView(APIView):
    def get(self, request, month, year, day):
        calendar_object_query = CalendarObject.objects.filter(due_date__day=day, due_date__month=month, due_date__year=year, created_by=request.user)
        calendar_object_serializer = CalendarSerializer(calendar_object_query, many=True)

        calendar_exception_query = CalendarObjectException.objects.filter(due_date__day=day, due_date__month=month, due_date__year=year, created_by=request.user)
        calendar_exception_serializer = ExceptionSerializer(calendar_exception_query, many=True)

        objects_list = {
            'calendar_objects': calendar_object_serializer.data,
            'calendar_exceptions': calendar_exception_serializer.data
        }

        return Response(objects_list)
