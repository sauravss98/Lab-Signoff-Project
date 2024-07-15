# Generated by Django 5.0.6 on 2024-07-15 13:03

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('course', '0002_alter_courses_programs_alter_courses_staff'),
        ('program', '0002_alter_programs_program_name'),
        ('user', '0007_staff_student'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='staff',
            name='course',
        ),
        migrations.RemoveField(
            model_name='student',
            name='course',
        ),
        migrations.AddField(
            model_name='staff',
            name='courses',
            field=models.ManyToManyField(related_name='staff_courses', to='course.courses'),
        ),
        migrations.AddField(
            model_name='staff',
            name='program',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='staffs', to='program.programs'),
        ),
        migrations.AddField(
            model_name='student',
            name='courses',
            field=models.ManyToManyField(related_name='student_courses', to='course.courses'),
        ),
        migrations.AddField(
            model_name='student',
            name='program',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='students', to='program.programs'),
        ),
    ]
