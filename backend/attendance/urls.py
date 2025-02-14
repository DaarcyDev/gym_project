from django.contrib import admin
from django.urls import path
from attendance import views

urlpatterns = [
    # path('test/', views.test_api),
	path('checkin/' , views.attendance_checkin),
	path('history/' , views.attendance_history),
]
