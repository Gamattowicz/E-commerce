from datetime import timedelta

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone

from .models import Order


@receiver(post_save, sender=Order)
def update_order_due_date(sender, instance, created, **kwargs):
    if created:
        instance.payment_due_date = timezone.now() + timedelta(days=5)
        instance.save()
