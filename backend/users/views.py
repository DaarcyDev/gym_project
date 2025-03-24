from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from .models import Administrator, Trainer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password
import uuid
# Create your views here.

def create_uuid(username, name, phone_number):
    unique_string = f"{username}-{name}-{phone_number}"
    return str(uuid.uuid5(uuid.NAMESPACE_DNS, unique_string))
    

@api_view(['POST'])
def users_register(request):
	print("request",request.data)
	return Response({"result": "Hello, world! from Django register"})

@api_view(['POST'])
def admin_register(request):
	print("request",request.data)
 
	if request.method == 'POST':
		username = request.data["admin"]["username"]
		name = request.data["admin"]["name"]
		lastname = request.data["admin"]["lastname"]
		email = request.data["admin"]["email"]
		gender = request.data["admin"]["gender"]
		phone_number = request.data["admin"]["phone_number"]
		password = request.data["admin"]["password"]
		password_confirm = request.data["admin"]["password_confirm"]
		if password != password_confirm:
			return Response({
				"result": {
					"status": False,
					"data": {
						"message": "Las contraseñas no coinciden"
					}
				}
			})
		else:
			print("se registran los administradores")
			hashed_password = make_password(password) 
			admin = Administrator.objects.create(
				username=username,
				name=name,
				lastname=lastname,
				email=email,
				gender=gender,
				phone_number=phone_number,
				password=hashed_password,
				access_token= create_uuid(name, lastname, phone_number),
			)
			admin.save()

 
	return Response({
			"result": {
				"status": True,
				"data": {
					"access_token": 'test',
					"user": 'user',
					"email": 'user',
					"password": 'user'
				}
			}
		})

@api_view(['POST'])
def trainer_register(request):
	print("request",request.data)
	print("trainer_register")
	if request.method == 'POST':
		name = request.data["admin"]["name"]
		lastname = request.data["admin"]["lastname"]
		gender = request.data["admin"]["gender"]
		phone_number = request.data["admin"]["phone_number"]
		password = request.data["admin"]["password"]
		password_confirm = request.data["admin"]["password_confirm"]
		access_token_admin = request.data["admin"]["access_token_admin"]
		if password != password_confirm:
			return Response({
				"result": {
					"status": False,
					"data": {
						"message": "Las contraseñas no coinciden"
					}
				}
			})
		else:
			print("se registran los administradores")
			#buscar el administrador con el access_token_admin
			admin = Administrator.objects.get(access_token=access_token_admin)
			if admin is None:
				return Response({
					"result": {
						"status": False,
						"data": {
							"message": "No se encontro el administrador"
						}
					}
				})
			else:
				hashed_password = make_password(password)
				admin = Trainer.objects.create(
					name=name,
					lastname=lastname,
					gender=gender,
					phone_number=phone_number,
					password=hashed_password,
					access_token= create_uuid(name, lastname, phone_number),
					created_by=admin
				)
				admin.save()

 
	return Response({
			"result": {
				"status": True,
				"data": {
					"access_token": 'test',
					"user": 'user',
					"email": 'user',
					"password": 'user'
				}
			}
		})


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
					'name': user.name,
				}
			}
		})
	else:
		try:
			admin = Administrator.objects.get(username=username)
		except Administrator.DoesNotExist:
			admin = None
		if admin is not None and check_password(password, admin.password):
			print("check_password(password, admin.password)",check_password(password, admin.password))
			return Response({
				"result": {
					"status": True,
					"data": {
						"access_token": admin.access_token,
						"user": admin.username,
						"email": admin.email,
						"type": "admin",
						"name": admin.name,
					}
				}
			})
		else:
			try:
				trainer = Trainer.objects.get(name=username)
			except Trainer.DoesNotExist:
				trainer = None
			if trainer is not None and check_password(password, trainer.password):
				print("check_password(password, trainer.password)",check_password(password, trainer.password))
				return Response({
					"result": {
						"status": True,
						"data": {
							"access_token": trainer.access_token,
							"user": trainer.username,
							"type": "trainer",
							"name": trainer.name,
							"lastname": trainer.lastname,
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
			# return Response({
			# 	"result": {
			# 		"status": False,
			# 		"data": {
			# 			"message": "Usuario o contraseña incorrectos"
			# 		}
			# 	}
			# })
  
@api_view(['GET'])
def users_profile(request):
	return Response({"message": "Hello, world! from Django profile"})

@api_view(['GET'])
def users_memberships(request):
	return Response({"message": "Hello, world! from Django memberships"})

