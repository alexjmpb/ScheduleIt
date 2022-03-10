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
    is_event = models.BooleanField(default=False)
    start_date = models.DateTimeField(default=timezone.now)
    due_date = models.DateTimeField(default=timezone.now)


    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.is_event:
            self.start_date = self.due_date
        super(AbstractCalendarObject, self).save(*args, **kwargs)


class CalendarObject(AbstractCalendarObject):
    is_recurring = models.BooleanField(default=False)


class CalendarObjectException(AbstractCalendarObject):
    occurrence_number = models.PositiveIntegerField(default=0)
    original_object = models.ForeignKey(CalendarObject, on_delete=models.CASCADE)


class ObjectRecurrencePattern(models.Model):
    parent_object = models.ForeignKey(
        CalendarObject, 
        on_delete=models.CASCADE
    )
    has_end = models.BooleanField(default=False)
    final_date = models.DateField(default=timezone.now)
    recurrence = models.PositiveIntegerField(default=0)