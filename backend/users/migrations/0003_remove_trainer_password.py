# Generated by Django 5.1.6 on 2025-03-06 05:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_alter_administrator_options_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trainer',
            name='password',
        ),
    ]
