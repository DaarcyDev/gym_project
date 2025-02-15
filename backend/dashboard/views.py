from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def dashboard_attendance(request):
	return Response({"message": "Hello, world! from Django dashboard attendance"})

@api_view(['GET'])
def dashboard_sales(request):
	return Response({"message": "Hello, world! from Django dashboard sales"})

@api_view(['GET'])
def dashboard_memberships(request):
	return Response({"message": "Hello, world! from Django dashboard memberships"})
