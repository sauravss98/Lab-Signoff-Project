# Generated by Django 5.0.6 on 2024-07-23 19:28

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('request', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='labrequest',
            name='staff',
        ),
        migrations.AddField(
            model_name='labrequest',
            name='staff',
            field=models.ManyToManyField(related_name='lab_requests_to_review', to=settings.AUTH_USER_MODEL),
        ),
    ]