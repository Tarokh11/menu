from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse

from .models import MenuCategory, MenuItem


class MenuViewsTests(TestCase):
    def test_menu_renders_all_products_in_persian(self):
        response = self.client.get(reverse("menu:menu"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lang="fa" dir="rtl"')
        self.assertContains(response, 'class="menu-item"', count=40)
        self.assertEqual(MenuItem.objects.count(), 40)

    def test_admin_can_create_and_edit_menu_items(self):
        user = get_user_model().objects.create_superuser(username="admin", password="secret")
        self.client.force_login(user)
        category = MenuCategory.objects.first()

        response = self.client.post(
            reverse("admin:menu_menuitem_add"),
            {
                "category": category.pk,
                "name": "آیتم آزمایشی",
                "description": "توضیحات آیتم",
                "price": 180,
                "tag": "جدید",
                "is_available": "on",
                "sort_order": 99,
                "_save": "ذخیره",
            },
        )
        item = MenuItem.objects.get(name="آیتم آزمایشی")
        self.assertEqual(response.status_code, 302)

        response = self.client.post(
            reverse("admin:menu_menuitem_change", args=[item.pk]),
            {
                "category": category.pk,
                "name": "آیتم ویرایش‌شده",
                "description": "توضیحات جدید",
                "price": 190,
                "tag": "تازه",
                "is_available": "on",
                "sort_order": 99,
                "_save": "ذخیره",
            },
        )
        item.refresh_from_db()
        self.assertEqual(response.status_code, 302)
        self.assertEqual(item.name, "آیتم ویرایش‌شده")
        self.assertEqual(item.price, 190)

    def test_unavailable_items_are_not_public(self):
        item = MenuItem.objects.first()
        item.is_available = False
        item.save()

        response = self.client.get(reverse("menu:menu"))

        self.assertNotContains(response, item.name)
        self.assertContains(response, 'class="menu-item"', count=39)

    def test_qr_endpoint_returns_png(self):
        response = self.client.get(reverse("menu:menu_qr"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertTrue(response.content.startswith(b"\x89PNG"))
