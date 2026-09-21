from io import BytesIO

import qrcode
from django.http import HttpResponse
from django.shortcuts import render


MENU = [
    {
        "name": "Charred Miso Salmon",
        "description": "Lacquered salmon, citrus kosho, crispy rice and young herbs.",
        "price": "24",
        "category": "Mains",
        "tag": "Chef's pick",
        "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "Midnight Truffle Pasta",
        "description": "Fresh tagliolini, black truffle, parmesan cream and cracked pepper.",
        "price": "21",
        "category": "Mains",
        "tag": "Vegetarian",
        "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "Fire-Roasted Carrots",
        "description": "Labneh, dukkah, orange blossom honey and coriander oil.",
        "price": "11",
        "category": "Small plates",
        "tag": "To share",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "Blood Orange Fizz",
        "description": "Blood orange, rosemary, soda and a pinch of sea salt.",
        "price": "8",
        "category": "Drinks",
        "tag": "Zero proof",
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "Olive Oil Cloud",
        "description": "Vanilla bean cream, estate olive oil, sea salt and citrus zest.",
        "price": "10",
        "category": "Sweet",
        "tag": "New",
        "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85",
    },
]


def menu(request):
    categories = ["All", *dict.fromkeys(item["category"] for item in MENU)]
    return render(request, "menu/menu.html", {"items": MENU, "categories": categories})


def menu_qr(request):
    target = request.build_absolute_uri("/")
    image = qrcode.make(target, border=2)
    output = BytesIO()
    image.save(output, format="PNG")
    response = HttpResponse(output.getvalue(), content_type="image/png")
    response["Content-Disposition"] = 'inline; filename="table-menu-qr.png"'
    return response
