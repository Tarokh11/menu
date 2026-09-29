from django.urls import path

from menu import views

urlpatterns = [
    path("", views.menu, name="menu"),
    path("demos/hero-fresh/", views.hero_demo, name="hero_demo"),
    path("qr/", views.menu_qr, name="menu_qr"),
]
