from django.urls import path, include
from .views import CalendarObjectViewSet, ExceptionViewSet, RecurringPatternViewSet, CalendarMonthView, CalendarYearView, CalendarDayView
from rest_framework.routers import DefaultRouter


object_router = DefaultRouter()
object_router.register(r'objects', CalendarObjectViewSet, basename='objects')
object_router.register(r'exceptions', ExceptionViewSet, basename='exceptions')
object_router.register(r'recurring_patterns', RecurringPatternViewSet, basename='Recurring_patterns')

urlpatterns = [
    path('', include(object_router.urls)),
    path('<int:year>/', include([
        path('', CalendarYearView.as_view(), name='calendar-year'),
        path('<int:month>/', include([
            path('', CalendarMonthView.as_view(), name='calendar-month'),
            path('<int:day>/', CalendarDayView.as_view(), name='calendar-day')
        ]))
    ]))
]