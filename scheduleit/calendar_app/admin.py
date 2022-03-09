from django.contrib import admin
from .models import Event, EventException, EventRecurrencePattern, Task, TaskException, TaskRecurrencePattern


admin.site.register([Event, EventException, EventRecurrencePattern, Task, TaskException, TaskRecurrencePattern])