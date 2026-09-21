from io import BytesIO

import qrcode
from django.http import HttpResponse
from django.shortcuts import render


MENU = [
    {
        "name": "سالمون میسو گریل",
        "description": "سالمون تازه، سس میسو و مرکبات، برنج کریسپی و سبزی‌های معطر.",
        "price": "۶۸۰,۰۰۰",
        "category": "غذای اصلی",
        "tag": "پیشنهاد سرآشپز",
        "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "پاستای ترافل سیاه",
        "description": "تالیولینی تازه، ترافل سیاه، کرم پارمزان و فلفل سیاه تازه.",
        "price": "۵۴۰,۰۰۰",
        "category": "غذای اصلی",
        "tag": "گیاهی",
        "image": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "هویج کبابی روی آتش",
        "description": "لبنه، دُقه، عسل شکوفه پرتقال و روغن گشنیز.",
        "price": "۲۸۰,۰۰۰",
        "category": "پیش‌غذا",
        "tag": "برای اشتراک",
        "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "فیز پرتقال خونی",
        "description": "پرتقال خونی، رزماری، سودا و کمی نمک دریایی.",
        "price": "۱۹۰,۰۰۰",
        "category": "نوشیدنی",
        "tag": "بدون الکل",
        "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1000&q=85",
    },
    {
        "name": "ابر روغن زیتون",
        "description": "کرم وانیل، روغن زیتون بکر، نمک دریایی و پوست مرکبات.",
        "price": "۲۳۰,۰۰۰",
        "category": "دسر",
        "tag": "تازه",
        "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=1000&q=85",
    },
]


def menu(request):
    categories = ["همه", *dict.fromkeys(item["category"] for item in MENU)]
    return render(request, "menu/menu.html", {"items": MENU, "categories": categories})


def menu_qr(request):
    target = request.build_absolute_uri("/")
    image = qrcode.make(target, border=2)
    output = BytesIO()
    image.save(output, format="PNG")
    response = HttpResponse(output.getvalue(), content_type="image/png")
    response["Content-Disposition"] = 'inline; filename="table-menu-qr.png"'
    return response
