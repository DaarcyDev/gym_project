from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.
@api_view(['GET'])
def attendance_checkin(request):
	return Response({"message": "Hello, world! from Django attendance checkin"})

@api_view(['GET'])
def attendance_history(request):
	return Response({"message": "Hello, world! from Django attendance history"})