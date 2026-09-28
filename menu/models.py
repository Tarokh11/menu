from django.db import models


class MenuCategory(models.Model):
    ACCENT_CHOICES = [
        ("lime", "سبز لیمویی"),
        ("orange", "نارنجی"),
        ("pink", "صورتی"),
        ("blue", "آبی"),
        ("purple", "بنفش"),
        ("yellow", "زرد"),
    ]

    name = models.CharField("نام دسته", max_length=100, unique=True)
    code = models.CharField("کد نمایشی", max_length=30, blank=True)
    accent = models.CharField("رنگ دسته", max_length=20, choices=ACCENT_CHOICES, default="lime")
    sort_order = models.PositiveIntegerField("ترتیب نمایش", default=0)

    class Meta:
        ordering = ("sort_order", "name")
        verbose_name = "دسته‌بندی منو"
        verbose_name_plural = "دسته‌بندی‌های منو"

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    category = models.ForeignKey(
        MenuCategory,
        on_delete=models.PROTECT,
        related_name="items",
        verbose_name="دسته‌بندی",
    )
    name = models.CharField("نام آیتم", max_length=150)
    description = models.TextField("توضیحات", blank=True)
    price = models.PositiveIntegerField("قیمت (هزار تومان)")
    tag = models.CharField("برچسب", max_length=50, blank=True)
    is_available = models.BooleanField("موجود در منو", default=True)
    sort_order = models.PositiveIntegerField("ترتیب نمایش", default=0)

    class Meta:
        ordering = ("sort_order", "name")
        verbose_name = "آیتم منو"
        verbose_name_plural = "آیتم‌های منو"

    def __str__(self):
        return self.name
