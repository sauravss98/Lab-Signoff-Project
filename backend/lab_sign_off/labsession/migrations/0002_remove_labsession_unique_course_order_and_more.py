# Generated by Django 5.0.6 on 2024-07-17 10:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_alter_courses_programs_alter_courses_staff'),
        ('labsession', '0001_initial'),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='labsession',
            name='unique_course_order',
        ),
        migrations.AlterField(
            model_name='labsession',
            name='order',
            field=models.PositiveIntegerField(editable=False),
        ),
        migrations.AlterUniqueTogether(
            name='labsession',
            unique_together={('course', 'order')},
        ),
    ]