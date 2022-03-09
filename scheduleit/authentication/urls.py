from django.urls import path, include
from . import views as auth_views

app_name = 'authentication'

urlpatterns = [
    path('', include('djoser.urls')),
    path('', include('djoser.urls.jwt')),
    path('jwt/blacklist/', auth_views.BlackListToken.as_view(), name='blacklist'),
]