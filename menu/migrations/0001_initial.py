import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="MenuCategory",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=100, unique=True, verbose_name="نام دسته")),
                ("code", models.CharField(blank=True, max_length=30, verbose_name="کد نمایشی")),
                ("accent", models.CharField(choices=[("lime", "سبز لیمویی"), ("orange", "نارنجی"), ("pink", "صورتی"), ("blue", "آبی"), ("purple", "بنفش"), ("yellow", "زرد")], default="lime", max_length=20, verbose_name="رنگ دسته")),
                ("sort_order", models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش")),
            ],
            options={"verbose_name": "دسته‌بندی منو", "verbose_name_plural": "دسته‌بندی‌های منو", "ordering": ("sort_order", "name")},
        ),
        migrations.CreateModel(
            name="MenuItem",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=150, verbose_name="نام آیتم")),
                ("description", models.TextField(blank=True, verbose_name="توضیحات")),
                ("price", models.PositiveIntegerField(verbose_name="قیمت (هزار تومان)")),
                ("tag", models.CharField(blank=True, max_length=50, verbose_name="برچسب")),
                ("is_available", models.BooleanField(default=True, verbose_name="موجود در منو")),
                ("sort_order", models.PositiveIntegerField(default=0, verbose_name="ترتیب نمایش")),
                ("category", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="items", to="menu.menucategory", verbose_name="دسته‌بندی")),
            ],
            options={"verbose_name": "آیتم منو", "verbose_name_plural": "آیتم‌های منو", "ordering": ("sort_order", "name")},
        ),
    ]
