from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse

# Create your views here.

# @api_view(['GET'])
# def test_api(request):
# 	return Response({"message": "Hello, world! from Django test"})

@api_view(['GET'])
def users_register(request):
	return Response({"message": "Hello, world! from Django register"})

@api_view(['GET'])
def users_login(request):
	return Response({"message": "Hello, world! from Django login"})

@api_view(['POST'])
def users_signin(request):
	return Response({
		"result": {
			"access_token": "asd",
			"status": True,
			"user": "asd",
			"password": "asd"
		}
	})

@api_view(['GET'])
def users_profile(request):
	return Response({"message": "Hello, world! from Django profile"})

@api_view(['GET'])
def users_memberships(request):
	return Response({"message": "Hello, world! from Django memberships"})

