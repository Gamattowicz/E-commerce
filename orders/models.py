from django.db import models

from products.models import Product
from users.models import CustomUser


class DeliveryAddress(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.postal_code}, {self.country}"


class Order(models.Model):
    customer = models.ForeignKey(
        CustomUser,
        on_delete=models.PROTECT,
        related_name="orders",
        null=True,
        blank=True,
    )
    customer_name = models.CharField(max_length=255)
    delivery_address = models.ForeignKey(DeliveryAddress, on_delete=models.PROTECT)
    order_date = models.DateTimeField(auto_now_add=True)
    payment_due_date = models.DateTimeField(blank=True, null=True)
    products = models.ManyToManyField(Product, through="OrderItem")
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.pk:
            self.total_price = sum(
                item.product.price * item.quantity for item in self.order_items.all()
            )
        super().save(*args, **kwargs)

    def __str__(self):
        products_info = ", ".join(
            f"{item.product.name} x {item.quantity}" for item in self.order_items.all()
        )
        return f"{self.customer_name}, {self.order_date.strftime('%Y-%m-%d %H:%M:%S')}, {products_info}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        "orders.Order", related_name="order_items", on_delete=models.CASCADE
    )
    product = models.ForeignKey("products.Product", on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.product} x {self.quantity}"
