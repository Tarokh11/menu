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
        self.assertContains(response, "یه جرعه", html=False)
        self.assertNotContains(response, "طعمِ تازه،")
        self.assertNotContains(response, "menu/demos/demo-01/style.css")

    def test_demo_01_changes_only_the_hero_component(self):
        response = self.client.get(reverse("demo_01"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Demo 01")
        self.assertContains(response, "یه جرعه")
        self.assertContains(response, 'class="menu-item"', count=40)
        self.assertContains(response, "پاتوق خوشمزه‌ها")
        self.assertContains(response, "VITA®")
        self.assertContains(response, "menu/demos/demo-01/images/orange-juice.webp")
        self.assertContains(response, "menu/demos/demo-01/images/juice-splash.webp")
        self.assertContains(response, "menu/demos/demo-01/images/strawberry.webp")
        self.assertContains(response, "menu/demos/demo-01/style.css")

    def test_demo_gallery_links_to_saved_concepts(self):
        response = self.client.get(reverse("demo_index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Demo 01")
        self.assertContains(response, reverse("demo_01"))

    def test_qr_endpoint_returns_png(self):
        response = self.client.get(reverse("menu_qr"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertTrue(response.content.startswith(b"\x89PNG"))


class BlueDesignTests(SimpleTestCase):
    def test_blue_design_keeps_menu_and_has_active_switch(self):
        response = self.client.get(reverse("demo_02"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'class="menu-item"', count=40)
        self.assertContains(response, "تازگی رو")
        self.assertNotContains(response, 'class="item-favorite"')
        self.assertNotContains(response, 'class="item-details"')
        self.assertNotContains(response, 'class="product-dialog"')
        self.assertContains(response, "menu/demos/demo-02/themes.js")
        self.assertContains(response, "menu/demos/demo-02/style.css")
        self.assertContains(response, 'href="/demos/demo-02/" aria-current="page"')

    def test_design_is_reachable_from_original_and_gallery(self):
        for name in ("menu", "demo_01", "demo_index"):
            response = self.client.get(reverse(name))
            self.assertContains(response, reverse("demo_02"))
