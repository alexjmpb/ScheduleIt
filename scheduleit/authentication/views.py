from rest_framework import permissions
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
User = get_user_model()

class BlackListToken(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, format=None):
        token = RefreshToken(request.data.get('refresh'))
        token.blacklist()
        return Response(status=status.HTTP_204_NO_CONTENT)