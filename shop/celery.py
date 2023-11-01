# proj/celery.py
from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from django.conf import settings

# ustawienie domyślnego modułu konfiguracji Django dla programu 'celery'
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "shop.settings")

app = Celery("shop")

# Użycie ustawień z Django w konfiguracji Celery
app.config_from_object("django.conf:settings", namespace="CELERY")

# Ładowanie zadań asynchronicznych (tasks) z wszystkich zainstalowanych aplikacji Django
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)


@app.task(bind=True)
def debug_task(self):
    print(f"Request: {self.request!r}")
