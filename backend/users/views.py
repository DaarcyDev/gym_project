from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse

# Create your views here.

# @api_view(['GET'])
# def test_api(request):
# 	return Response({"message": "Hello, world! from Django test"})

@api_view(['POST'])
def users_register(request):
	print("request",request.data)
	return Response({"result": "Hello, world! from Django register"})

@api_view(['GET'])
def users_login(request):
	return Response({"message": "Hello, world! from Django login"})

@api_view(['POST'])
def users_signin(request):
	print("prueba")
	print(request.data)
	user = request.data["params"]["user"]
	password = request.data["params"]["password"]
	if user == "asd" and password == "asd":
		return Response({
			"result": {
				"status": True,
				"data": {
					"access_token": "asd",
					"user": "asd",
					"email": "dummy@example.com",
					"password": "asd"
				}
			}
		})
	else:
		return Response({
			"result": {
				"status": False,
				"message": "Invalid credentials"
			}
		})

@api_view(['GET'])
def users_profile(request):
	return Response({"message": "Hello, world! from Django profile"})

@api_view(['GET'])
def users_memberships(request):
	return Response({"message": "Hello, world! from Django memberships"})

