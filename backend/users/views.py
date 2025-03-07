from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import HttpResponse
from django.contrib.auth import authenticate
from .models import Administrator
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
	username = request.data["params"]["user"]
	password = request.data["params"]["password"]
	user = authenticate(username=username, password=password)
	print(user)
	if user is not None:
		token = "8ff75e23-9ea4-4da9-9231-9d731e3ac486"
		return Response({
			"result": {
				"status": True,
				"data": {
					"access_token": token,
					"user": user.username,
					"email": user.email,
					"password": user.password
				}
			}
		})
	else:
		try:
			admin = Administrator.objects.get(username=username, password=password)
		except Administrator.DoesNotExist:
			admin = None
		if admin is not None:
			return Response({
				"result": {
					"status": True,
					"data": {
						"access_token": admin.acces_token,
						"user": admin.username,
						"email": admin.email,
						"password": admin.password
					}
				}
			})
		else:
			return Response({
				"result": {
					"status": False,
					"data": {
						"message": "Usuario o contraseña incorrectos"
					}
				}
			})
  
@api_view(['GET'])
def users_profile(request):
	return Response({"message": "Hello, world! from Django profile"})

@api_view(['GET'])
def users_memberships(request):
	return Response({"message": "Hello, world! from Django memberships"})

