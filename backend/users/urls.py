from django.contrib import admin
from django.urls import path
from users import views

urlpatterns = [
    # path('test/', views.test_api),
    path('register/', views.users_register),
    path('login/', views.users_login),
    path('profile/', views.users_profile),
    path('memberships/', views.users_memberships),
]
