from rest_framework import serializers

from .models import DeliveryAddress, Order, OrderItem


class DeliveryAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryAddress
        fields = ["street", "city", "postal_code", "country"]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["product", "quantity"]


class OrderSerializer(serializers.ModelSerializer):
    delivery_address = DeliveryAddressSerializer(write_only=True)
    order_items = OrderItemSerializer(many=True, write_only=True)
    total_price = serializers.ReadOnlyField()
    payment_due_date = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = [
            "customer_name",
            "delivery_address",
            "order_items",
            "total_price",
            "payment_due_date",
        ]
        read_only_fields = ("customer",)

    def create(self, validated_data):
        delivery_address_data = validated_data.pop("delivery_address")
        delivery_address = DeliveryAddress.objects.create(**delivery_address_data)

        order_items_data = validated_data.pop("order_items")
        order = Order.objects.create(
            delivery_address=delivery_address, **validated_data
        )

        for order_item_data in order_items_data:
            OrderItem.objects.create(order=order, **order_item_data)

        return order
