# Generated by Django 5.1.7 on 2025-04-02 04:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0009_trainer_email'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainer',
            name='email',
        ),
    ]
