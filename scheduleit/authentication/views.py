from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
User = get_user_model()
from djoser.views import UserViewSet as DjoserViewSet
from rest_framework import throttling 
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class ResetThrottle(throttling.UserRateThrottle):
    rate = '5/day'

class UserViewSet(DjoserViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    def get_throttles(self):
        if self.action == 'reset_password':
            self.throttle_classes = [ResetThrottle]
        return super().get_throttles()


class BlackListToken(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, format=None):
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response(status=status.HTTP_204_NO_CONTENT)