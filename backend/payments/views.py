from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.
@api_view(['GET'])
def payments(request):
	return Response({"message": "Hello, world! from Django payments"})

@api_view(['POST'])
def income_report(request):
	return Response({"message": "Hello, world! from Django income report"})