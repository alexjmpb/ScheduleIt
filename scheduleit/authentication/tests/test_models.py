from django.test import TestCase
from authentication.models import AppUser
from PIL import Image
from django.conf import settings
import os
from django.core.files.uploadedfile import SimpleUploadedFile


class UserTest(TestCase):
    def setUp(self):
        self.superuser = AppUser.objects.create_superuser(username='admin', email="admin@email.com", password='Test2002')
        self.user = AppUser.objects.create_user(username='user', email="user@email.com", password='Test2002')


    def test_superuser_creation(self):
        self.get_superuser = AppUser.objects.get(username='admin')
        self.assertEqual(self.superuser, self.get_superuser)
        self.assertTrue(self.get_superuser.is_staff)
        self.assertTrue(self.get_superuser.is_active)

    
    def test_user_creation(self):
        self.get_user = AppUser.objects.get(username='user')
        self.assertEqual(self.user, self.get_user)
        self.assertFalse(self.get_user.is_staff)
        self.assertTrue(self.get_user.is_active)
        self.assertEqual(self.get_user.image.name, 'users/default-user.jpg')


    def test_user_image(self):
        self.image = SimpleUploadedFile(name='test-image.jpg', content=open('media/test-image.jpg', 'rb').read(), content_type='image/jpeg')
        self.user_with_image = AppUser.objects.create_user(username='user_image', email='userimage@email.com', password='Test2002', image=self.image)
        self.pillow_user_image = Image.open(self.user_with_image.image)

        self.assertLessEqual(a=self.pillow_user_image.width, b=400)
        self.assertLessEqual(a=self.pillow_user_image.height, b=400)

    