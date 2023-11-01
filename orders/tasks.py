from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from .models import Order


@shared_task
def send_payment_reminder(order_id):
    try:
        order = Order.objects.get(id=order_id)
        customer_email = order.customer.email

        subject = "Payment Reminder"
        message = f"Hello, {order.customer_name}!\n\nJust a reminder that the payment deadline for your order no. {order.id} x is tomorrow."
        from_email = settings.DEFAULT_FROM_EMAIL
        recipient_list = [customer_email]

        send_mail(subject, message, from_email, recipient_list)
    except Order.DoesNotExist:
        pass
