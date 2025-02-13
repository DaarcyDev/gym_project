from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse

# Create your views here.

@api_view(['GET'])
def test_api(request):
	return Response({"message": "Hello, world! from Django test"})