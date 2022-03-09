from django.core import mail
from rest_framework import status
from rest_framework.test import APITestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
User = get_user_model()
from django.conf import settings

class UserCreation(APITestCase):
    def setUp(self):
        self.register_url = reverse('authentication:appuser-list')
        self.login_url = reverse('authentication:jwt-create')
        self.me_url = reverse('authentication:appuser-me')

        self.user_info = {
            'username': 'test',
            'email': 'test@test.com',
            'password': 'TestPass1234',
            're_password': 'TestPass1234',
        }

    def test_user_creation(self):
        response = self.client.post(self.register_url, self.user_info)

        self.assertIn(self.user_info['email'], mail.outbox[0].to)

        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.get(username=self.user_info['username']))

        response_login = self.client.post(self.login_url, {'username': self.user_info['username'], 'password': self.user_info['password']})
        self.assertEqual(response_login.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response_login.data['access'])
        response_me = self.client.get(self.me_url)
        self.assertEqual(response_me.status_code, 200)
    
    def test_user_creation_bad_request(self):
        self.user_info['password'] = 'T'
        response = self.client.post(self.register_url, self.user_info)

        self.assertEqual(response.status_code, 400)


class UserReset(APITestCase):
    def setUp(self):
        self.reset_password_url = reverse('authentication:appuser-reset-password')
        self.reset_password_confirm_url = reverse('authentication:appuser-reset-password-confirm')
        self.login_url = reverse('authentication:jwt-create')
        self.me_url = reverse('authentication:appuser-me')
        self.user = User.objects.create(username='test', email='test@test.com', password='Test1234')

    def test_reset_password(self):
        response_reset = self.client.post(self.reset_password_url, {'email':self.user.email})
        self.assertEqual(response_reset.status_code, 204)
        self.assertTrue(len(mail.outbox) > 0)
        url = [url for url in mail.outbox[0].body.splitlines() if settings.DOMAIN in url][0]
        uid, token = url.split('/')[-2:]

        confirm_data = {
            'uid': uid,
            'token': token,
            'new_password': 'Test4321',
            're_new_password': 'Test4321'
        }

        response_confirm = self.client.post(self.reset_password_confirm_url, confirm_data)
        self.assertEqual(response_confirm.status_code, 204)

        response_login = self.client.post(self.login_url, {'username':'test', 'password':'Test4321'})
        self.assertEqual(response_login.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response_login.data['access'])
        response_me = self.client.get(self.me_url)
        self.assertEqual(response_me.status_code, 200)


class UserUpdate(APITestCase):
    def setUp(self):
        self.me_url = reverse('authentication:appuser-me')
        self.user = User.objects.create(username='test', email='test@test.com', password='Test1234')

        self.updated_user = {
            'username': 'testupdated',
            'email': 'testupdated@test.com' 
        }
        
    def test_user_update(self):
        self.client.force_authenticate(self.user)

        response = self.client.get(self.me_url)
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['email'], self.user.email)

        update_response = self.client.patch(self.me_url, self.updated_user)
        self.assertEqual(update_response.status_code, 200)

        response = self.client.get(self.me_url)
        self.assertEqual(self.user.username, self.updated_user['username'])
        self.assertEqual(self.user.email, self.updated_user['email'])

    def test_user_update_validator(self):
        self.client.force_authenticate(self.user)

        self.updated_user['email'] = 'testupdated@'
        update_response = self.client.patch(self.me_url, self.updated_user)
        self.assertEqual(update_response.status_code, 400)
        self.assertEqual(update_response.data['email'][0].code, 'invalid')


class PasswordUpdate(APITestCase):
    def setUp(self):
        self.change_password_url = reverse('authentication:appuser-set-password')
        self.login_url = reverse('authentication:jwt-create')
        self.user = User.objects.create_user(username='test', email='test@test.com', password='Test1234')

        self.update_pass = {
            'new_password': 'Test4321',
            're_new_password': 'Test4321',
            'current_password': 'Test1234'
        }

    def test_change_password(self):
        response = self.client.post(self.login_url, {'username': self.user.username, 'password': self.update_pass['current_password']})
        self.assertEqual(response.status_code, 200)

        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + response.data['access'])

        update_response = self.client.post(self.change_password_url, self.update_pass)
        self.assertEqual(update_response.status_code, 204)

        response = self.client.post(self.login_url, {'username': self.user.username, 'password': self.update_pass['new_password']})
        self.assertEqual(response.status_code, 200)

    def test_change_password_validators(self):
        self.client.force_authenticate(self.user)
        
        self.update_pass['re_new_password'] = 'Test54321'
        update_response = self.client.post(self.change_password_url, self.update_pass)
        self.assertEqual(update_response.status_code, 400)
        self.assertEqual(update_response.data['non_field_errors'][0].code, 'password_mismatch')
    

class UserDelete(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='test', email='test@test.com', password='Test1234')
        self.me_url = reverse('authentication:appuser-me')
    
    def test_user_delet(self):
        self.client.force_authenticate(self.user)
        response = self.client.delete(self.me_url, {'current_password': 'Test1234'})
        self.assertEqual(response.status_code, 204)