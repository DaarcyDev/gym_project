# Generated by Django 5.1.7 on 2025-04-03 05:24

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_trainer_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='member',
            name='trainer',
        ),
    ]
