from django.contrib import admin
from django.urls import path
from payments import views

urlpatterns = [
    # path('test/', views.test_api),
	path('payments/' , views.payments),
	path('income_report/' , views.income_report),
]
