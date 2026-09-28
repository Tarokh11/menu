from io import BytesIO

import qrcode
from django.http import HttpResponse
from django.shortcuts import render

from .models import MenuCategory


def menu(request):
    categories = MenuCategory.objects.prefetch_related("items").all()
    groups = [
        {
            "name": category.name,
            "code": category.code,
            "accent": category.accent,
            "items": [item for item in category.items.all() if item.is_available],
        }
        for category in categories
    ]
    groups = [group for group in groups if group["items"]]

    return render(
        request,
        "menu/menu.html",
        {"groups": groups, "item_count": sum(len(group["items"]) for group in groups)},
    )


def menu_qr(request):
    target = request.build_absolute_uri("/")
    image = qrcode.make(target, border=2)
    output = BytesIO()
    image.save(output, format="PNG")
    response = HttpResponse(output.getvalue(), content_type="image/png")
    response["Content-Disposition"] = 'inline; filename="frame-menu-qr.png"'
    return response
