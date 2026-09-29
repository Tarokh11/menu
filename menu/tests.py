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
        self.assertContains(response, "دموی مستقل Hero")
        self.assertContains(response, "یه جرعه", html=False)
        self.assertNotContains(response, "طعمِ تازه،")

    def test_fresh_hero_concept_has_its_own_demo_page(self):
        response = self.client.get(reverse("hero_demo"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "DEMO 01")
        self.assertContains(response, "طعمِ تازه،")
        self.assertContains(response, "menu/images/hero-glass.svg")
        self.assertContains(response, "menu/demos/hero-fresh.css")

    def test_qr_endpoint_returns_png(self):
        response = self.client.get(reverse("menu_qr"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertTrue(response.content.startswith(b"\x89PNG"))
