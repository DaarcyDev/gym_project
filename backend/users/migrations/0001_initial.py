# Generated by Django 5.1.6 on 2025-03-07 05:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Administrator',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('lastname', models.CharField(max_length=128)),
                ('gender', models.CharField(choices=[('male', 'Hombre'), ('female', 'Mujer')], max_length=10)),
                ('phoneNumber', models.CharField(max_length=15)),
                ('password', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'db_table': 'administrators',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Member',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150, unique=True)),
                ('lastname', models.CharField(max_length=128)),
                ('gender', models.CharField(choices=[('male', 'Hombre'), ('female', 'Mujer')], max_length=10)),
                ('phoneNumber', models.CharField(max_length=15)),
                ('create_at', models.DateTimeField(auto_now_add=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='members', to='users.administrator')),
            ],
            options={
                'db_table': 'members',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Attendance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attendances', to='users.member')),
            ],
            options={
                'db_table': 'attendances',
                'ordering': ['-timestamp'],
            },
        ),
        migrations.CreateModel(
            name='Trainer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=150)),
                ('lastname', models.CharField(max_length=128)),
                ('gender', models.CharField(choices=[('male', 'Hombre'), ('female', 'Mujer')], max_length=10)),
                ('phoneNumber', models.CharField(max_length=15)),
                ('password', models.CharField(max_length=128)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='trainers', to='users.administrator')),
            ],
            options={
                'db_table': 'trainers',
                'ordering': ['-created_at'],
            },
        ),
        migrations.AddField(
            model_name='member',
            name='trainer',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='members', to='users.trainer'),
        ),
    ]
