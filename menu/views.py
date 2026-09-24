from io import BytesIO

import qrcode
from django.http import HttpResponse
from django.shortcuts import render

from .catalog import MENU_DATA


def menu(request):
    groups = []
    for category, entries in MENU_DATA.items():
        items = [
            {"name": name, "description": description, "price": price, "tag": tag}
            for name, description, price, tag in entries
        ]
        groups.append({"name": category, "items": items})
    return render(request, "menu/menu.html", {
        "groups": groups, "item_count": sum(len(group["items"]) for group in groups),
    })


def menu_qr(request):
    image = qrcode.make(request.build_absolute_uri("/"), border=4)
    output = BytesIO()
    image.save(output, format="PNG")
    response = HttpResponse(output.getvalue(), content_type="image/png")
    response["Content-Disposition"] = 'inline; filename="rooz-shab-menu.png"'
    return response
