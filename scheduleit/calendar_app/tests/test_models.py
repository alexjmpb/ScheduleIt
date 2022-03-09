from django.utils import timezone
from rest_framework.test import APITestCase
from calendar_app.models import Task, TaskException, TaskRecurrencePattern, Event, EventException, EventRecurrencePattern
from django.contrib.auth import get_user_model
User = get_user_model()
from datetime import datetime, timedelta

class TaskTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test',
            email='test@test.com',
            password='Test1234'
        )
        self.task = Task.objects.create(
            title='test task',
            description='test description',
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=3)),
            is_recurring=True,
            created_by=self.user
        )
        self.task_recurrence_pattern = TaskRecurrencePattern.objects.create(
            parent_object=self.task,
            recurrence=4
        )
        self.task_exception = TaskException.objects.create(
            title='test task exception',
            description='test description',
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=2)),
            original_event=self.task,
            created_by=self.user
        )

    def test_task(self):
        self.assertTrue(Task.objects.get(id=1))
        self.assertEqual(self.task.due_date.hour, datetime.utcnow().hour + 3)

    def test_task_recurrence(self):
        self.assertTrue(TaskRecurrencePattern.objects.get(id=3))
        self.assertEqual(self.task_recurrence_pattern.recurrence, 4)

    def test_task_exception(self):
        self.assertTrue(TaskException.objects.get(id=2))
        self.assertEqual(self.task_exception.due_date.hour, datetime.utcnow().hour + 2)


class EventTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test',
            email='test@test.com',
            password='Test1234'
        )
        self.event = Event.objects.create(
            title='test event',
            description='test description',
            start_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=2)),
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=3)),
            is_recurring=True,
            created_by=self.user
        )
        self.event_recurrence_pattern = EventRecurrencePattern.objects.create(
            parent_object=self.event,
            recurrence=4
        )
        self.event_exception = EventException.objects.create(
            title='test event exception',
            description='test description',
            start_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=1)),
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=2)),
            original_event=self.event,
            created_by=self.user
        )
    
    def test_event(self):
        self.assertTrue(Event.objects.get(id=1))
        self.assertEqual(self.event.due_date.hour, datetime.utcnow().hour + 3)
        self.assertEqual(self.event.start_date.hour, datetime.utcnow().hour + 2)

    def test_event_recurrence(self):
        self.assertTrue(EventRecurrencePattern.objects.get(id=3))
        self.assertEqual(self.event_recurrence_pattern.recurrence, 4)

    def test_event_exception(self):
        self.assertTrue(EventException.objects.get(id=2))
        self.assertEqual(self.event_exception.due_date.hour, datetime.utcnow().hour + 2)
        self.assertEqual(self.event_exception.start_date.hour, datetime.utcnow().hour + 1)