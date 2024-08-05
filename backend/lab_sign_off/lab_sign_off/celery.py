import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'lab_sign_off.settings')

celery_app = Celery('lab_sign_off')
celery_app.config_from_object('django.conf:settings', namespace='CELERY')
celery_app.autodiscover_tasks()