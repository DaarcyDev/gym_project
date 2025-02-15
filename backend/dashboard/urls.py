from django.contrib import admin
from django.urls import path
from dashboard import views

urlpatterns = [
	# path('products_list/' , views.products_list),
	path('dashboard_attendance/' , views.dashboard_attendance),
	path('dashboard_sales/' , views.dashboard_sales),
	path('dashboard_memberships/' , views.dashboard_memberships),
]
