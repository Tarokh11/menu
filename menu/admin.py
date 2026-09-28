from django.contrib import admin

from .models import MenuCategory, MenuItem


@admin.register(MenuCategory)
class MenuCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "code", "accent", "sort_order")
    list_editable = ("code", "accent", "sort_order")
    search_fields = ("name", "code")
    ordering = ("sort_order", "name")


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "price", "tag", "is_available", "sort_order")
    list_filter = ("category", "is_available")
    list_editable = ("price", "tag", "is_available", "sort_order")
    search_fields = ("name", "description")
    ordering = ("category__sort_order", "sort_order", "name")
    list_per_page = 50
