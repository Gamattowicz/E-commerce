from django.conf import settings
from django.core.mail import send_mail
from django.db import transaction
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response

from users.permissions import IsClient

from .models import Order
from .serializers import OrderSerializer
from .tasks import send_payment_reminder
from .utils import get_countdown


class OrderCreateView(CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsClient]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        with transaction.atomic():
            self.perform_create(serializer)

        headers = self.get_success_headers(serializer.data)

        response_data = {
            "total_price": serializer.instance.total_price,
            "payment_due_date": serializer.instance.payment_due_date,
        }

        return Response(response_data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        with transaction.atomic():
            order = serializer.save(customer=self.request.user)
        customer_email = order.customer.email

        subject = "Order confirmation"
        message = f"Hello, {order.customer_name}!\n\nThank you for making your order. Your order no. {order.id} has been received and is being processed."
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [customer_email]

        send_mail(subject, message, from_email, recipient_list)
        countdown = get_countdown(order.payment_due_date)
        send_payment_reminder.apply_async((order.id,), countdown=countdown)
