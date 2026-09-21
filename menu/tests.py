from django.test import SimpleTestCase
from django.urls import reverse

from .views import MENU_DATA


class MenuViewsTests(SimpleTestCase):
    def test_menu_renders_all_products_in_persian(self):
        response = self.client.get(reverse("menu"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lang="fa" dir="rtl"')
        self.assertContains(response, 'class="menu-item"', count=40)
        self.assertEqual(sum(map(len, MENU_DATA.values())), 40)

    def test_qr_endpoint_returns_png(self):
        response = self.client.get(reverse("menu_qr"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertTrue(response.content.startswith(b"\x89PNG"))
