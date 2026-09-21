from django.urls import path

from menu import views

urlpatterns = [
    path("", views.menu, name="menu"),
    path("qr/", views.menu_qr, name="menu_qr"),
]
