from django.urls import path

from menu import views

urlpatterns = [
    path("", views.menu, name="menu"),
    path("demos/", views.demo_index, name="demo_index"),
    path("demos/demo-01/", views.demo_01, name="demo_01"),
    path("demos/demo-02/", views.demo_02, name="demo_02"),
    path("demos/hero-fresh/", views.hero_demo, name="hero_demo"),
    path("qr/", views.menu_qr, name="menu_qr"),
]
