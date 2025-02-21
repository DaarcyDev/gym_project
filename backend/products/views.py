from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
# Create your views here.
@api_view(['GET'])
def products_list(request):
	return Response({"message": "Hello, world! from Django products list"})

@api_view(['POST'])
def products_create(request):
	return Response({"message": "Hello, world! from Django products create"})

@api_view(['PUT'])
def products_update(request):
	return Response({"message": "Hello, world! from Django products update"})

@api_view(['DELETE'])
def products_delete(request):
	return Response({"message": "Hello, world! from Django products delete"})

@api_view(['GET'])
def products_details(request):
	return Response({"message": "Hello, world! from Django products detail"})

@api_view(['GET'])
def products_sales(request):
	return Response({"message": "Hello, world! from Django products sales"})