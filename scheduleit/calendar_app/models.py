from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta, datetime
User = get_user_model()


class AbstractCalendarObject(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(
        max_length=400,
        blank=True,
        null=True,
        default=''
    )
    date_created = models.DateTimeField(auto_now_add=True)
    is_fully_day = models.BooleanField(default=False)
    created_by = models.ForeignKey(
        User, 
        on_delete=models.CASCADE
    )

    class Meta:
        abstract = True


class AbstractRecurrencePattern(models.Model):
    has_end = models.BooleanField(default=False)
    final_date = models.DateField(default=timezone.now)
    recurrence = models.PositiveIntegerField(default=0)

    class Meta:
        abstract = True


class AbstractTask(AbstractCalendarObject):
    due_date = models.DateTimeField(default=timezone.now)

    class Meta:
        abstract = True


class Task(AbstractTask):
    is_recurring = models.BooleanField(default=False)


class TaskException(AbstractTask):
    occurrence_number = models.PositiveIntegerField(default=0)
    original_event = models.ForeignKey(Task, on_delete=models.CASCADE)


class TaskRecurrencePattern(AbstractRecurrencePattern):
    parent_object = models.ForeignKey(Task, on_delete=models.CASCADE)


class AbstractEvent(AbstractCalendarObject):
    start_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(default=timezone.make_aware(datetime.utcnow() + timedelta(hours=1)))

    class Meta:
        abstract = True


class Event(AbstractEvent):
    is_recurring = models.BooleanField(default=False)


class EventException(AbstractEvent):
    occurrence_number = models.PositiveIntegerField(default=0)
    original_event = models.ForeignKey(Event, on_delete=models.CASCADE)


class EventRecurrencePattern(AbstractRecurrencePattern):
    parent_object = models.ForeignKey(Event, on_delete=models.CASCADE)