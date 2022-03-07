from rest_framework.response import Response
from rest_framework.views import APIView


class EndpointsView(APIView):
    def get(self, request, format=None):
        endpoints = {
            '/api/': {
                '/' : 'API Endpoints'
            }
        }
        return Response(endpoints)