# Generated by Django 5.1.7 on 2025-04-02 04:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_trainer_username'),
    ]

    operations = [
        migrations.AddField(
            model_name='trainer',
            name='email',
            field=models.EmailField(default=1, max_length=254, unique=True),
            preserve_default=False,
        ),
    ]
