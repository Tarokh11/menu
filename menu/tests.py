from django.test import SimpleTestCase
from django.urls import reverse


class MenuViewsTests(SimpleTestCase):
    def test_menu_renders(self):
        response = self.client.get(reverse("menu"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'lang="fa" dir="rtl"')

    def test_qr_endpoint_returns_png(self):
        response = self.client.get(reverse("menu_qr"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "image/png")
        self.assertTrue(response.content.startswith(b"\x89PNG"))
