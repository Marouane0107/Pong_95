# Generated by Django 3.0.14 on 2025-02-13 14:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0006_auto_20250212_1532'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='gameresult',
            name='tournament_round',
        ),
    ]
