from django.utils import timezone
from rest_framework.test import APITestCase
from calendar_app.models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern
from django.contrib.auth import get_user_model
User = get_user_model()
from datetime import datetime, timedelta

class CalendarObjectTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test',
            email='test@test.com',
            password='Test1234'
        )
        self.calendar_object = CalendarObject.objects.create(
            title='test calendar object',
            description='test description',
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=3)),
            is_recurring=True,
            created_by=self.user
        )
        self.object_recurrence_pattern = ObjectRecurrencePattern.objects.create(
            parent_object=self.calendar_object,
            recurrence=4
        )
        self.calendar_object_exception = CalendarObjectException.objects.create(
            title='test calendar object exception',
            description='test description',
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=2)),
            original_object=self.calendar_object,
            created_by=self.user
        )

    def test_calendar_object(self):
        self.assertTrue(CalendarObject.objects.get(id=1))
        self.assertEqual(self.calendar_object.due_date.hour, datetime.utcnow().hour + 3)

    def test_calendar_object_recurrence(self):
        self.assertTrue(ObjectRecurrencePattern.objects.get(id=3))
        self.assertEqual(self.object_recurrence_pattern.recurrence, 4)

    def test_calendar_object_exception(self):
        self.assertTrue(CalendarObjectException.objects.get(id=2))
        self.assertEqual(self.calendar_object_exception.due_date.hour, datetime.utcnow().hour + 2)