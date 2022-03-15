from django.urls import path, include
from . import views as auth_views
from rest_framework.routers import DefaultRouter

app_name = 'authentication'

router = DefaultRouter()

router.register(r'users', auth_views.UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', include('djoser.urls.jwt')),
    path('jwt/blacklist/', auth_views.BlackListToken.as_view(), name='blacklist'),
]