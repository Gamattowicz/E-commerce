from datetime import timedelta

from django.utils import timezone


def get_countdown(payment_due_date):
    countdown_time = payment_due_date - timedelta(days=1)
    now = timezone.now()
    if countdown_time > now:
        return (countdown_time - now).total_seconds()
    return 0
