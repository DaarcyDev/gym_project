from django.contrib import admin
from django.urls import path
from products import views

urlpatterns = [
	path('products_list/' , views.products_list),
	path('products_create/' , views.products_create),
	path('products_update/' , views.products_update),
	path('products_delete/' , views.products_delete),
	path('products_details/' , views.products_details),
	path('products_sales/' , views.products_sales),
]
