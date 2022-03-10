from rest_framework.test import APITestCase
from django.urls import reverse
from calendar_app.models import CalendarObject, CalendarObjectException, ObjectRecurrencePattern
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import datetime, timedelta
User = get_user_model()


class CalendarTest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='test',
            email='test@test.com', 
            password='Test1234'
        )
        self.task = CalendarObject.objects.create(
            title='test task',
            description='test description',
            due_date=timezone.make_aware(datetime.utcnow() + timedelta(hours=5)),
            is_event=False,
            is_recurring=False,
            created_by=self.user
        )
        self.task_outdated = CalendarObject.objects.create(
            title='test task outdated',
            description='test description outdated',
            due_date=timezone.make_aware(datetime.utcnow() - timedelta(days=365)),
            is_event=False,
            is_recurring=False,
            created_by=self.user
        )
        

    def test_calendar_year(self):
        url = reverse('calendar-year', kwargs={'year': self.task.due_date.year})
        response = self.client.get(url)
        self.assertEqual(dict(response.data['calendar_objects'][0])['title'], self.task.title)
        self.assertTrue(2 > len(response.data['calendar_objects']))

    def test_calendar_month(self):
        url = reverse('calendar-month', kwargs={'year': self.task.due_date.year, 'month': self.task.due_date.month})
        response = self.client.get(url)
        self.assertEqual(dict(response.data['calendar_objects'][0])['title'], self.task.title)
        self.assertTrue(2 > len(response.data['calendar_objects']))

    def test_calendar_day(self):
        url = reverse('calendar-day', kwargs={'year': self.task.due_date.year, 'month': self.task.due_date.month, 'day': self.task.due_date.day})
        response = self.client.get(url)
        self.assertEqual(dict(response.data['calendar_objects'][0])['title'], self.task.title)
        self.assertTrue(2 > len(response.data['calendar_objects']))

