from django.contrib import admin
from .models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern


admin.site.register([CalendarObject, CalendarObjectException, ObjectRecurrencePattern])