# Django Menu

Each branch contains a different menu design, while the runtime structure is shared.

## Local development

```sh
cp .env.example .env
docker compose up --build
```

The application listens on the host port configured by `HOST_PORT`.

## مدیریت منو

پس از اجرای سرویس، برای ساخت حساب مدیر اجرا کنید:

```sh
docker compose exec web python manage.py createsuperuser
```

سپس وارد `/admin/` شوید. از بخش «دسته‌بندی‌های منو» دسته بسازید یا ویرایش کنید
و از بخش «آیتم‌های منو» آیتم‌ها را اضافه، ویرایش یا ناموجود کنید. تغییرات بلافاصله
در منوی عمومی نمایش داده می‌شوند. قیمت به‌صورت عدد صحیح بر حسب هزار تومان ثبت
می‌شود.

## استفاده در پروژه‌های Django دیگر

اپ منو مستقل از پروژه است: کپی/نصب پوشه `menu`، افزودن `"menu"` به
`INSTALLED_APPS` و افزودن مسیرهای زیر به `urls.py` پروژه کافی است. برای پنل
ادمین، اپ‌ها و middlewareهای پیش‌فرض Django شامل `admin`, `auth`, `contenttypes`,
`sessions`, `messages` را هم فعال کنید.

```python
from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("menu.urls")),
]
```

اپ مسیرهای خودش را در `menu/urls.py` تعریف می‌کند و به تنظیمات `restaurant` این
مخزن وابسته نیست.

When running multiple branch copies on one machine, use a different `HOST_PORT`
and `SQLITE_VOLUME` for each copy. The Compose service binds to `127.0.0.1`,
which keeps it behind a reverse proxy on a server.

## Server deployment

Terminate HTTPS at the server's reverse proxy and set these values in `.env`:

```dotenv
DJANGO_SECRET_KEY=<random value with at least 50 characters>
DJANGO_ALLOWED_HOSTS=menu.example.com
DJANGO_SECURE_SSL_REDIRECT=1
DJANGO_SESSION_COOKIE_SECURE=1
DJANGO_CSRF_COOKIE_SECURE=1
DJANGO_SECURE_HSTS_SECONDS=31536000
DJANGO_SECURE_HSTS_INCLUDE_SUBDOMAINS=1
DJANGO_SECURE_HSTS_PRELOAD=1
DJANGO_BEHIND_PROXY=1
```

Keep `.env` private and use a unique `SQLITE_VOLUME` per deployment. Static
files are collected at container startup and served by WhiteNoise.

## Tests

```sh
docker compose run --rm web python manage.py test
```

Generated `staticfiles/`, SQLite databases, virtual environments, and `.env` files are deployment-only and must not be committed.
