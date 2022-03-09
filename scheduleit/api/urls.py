from django.urls import include, path
from . import views as api_views

urlpatterns = [
    path('', api_views.EndpointsView.as_view(), name='endpoints'),
    path('auth/', include('authentication.urls'))
]