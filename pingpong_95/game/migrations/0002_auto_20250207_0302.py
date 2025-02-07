# Generated by Django 3.0.14 on 2025-02-07 03:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='gameresult',
            name='is_tournament_match',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='gameresult',
            name='tournament_round',
            field=models.IntegerField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='gameresult',
            name='game_type',
            field=models.CharField(choices=[('PVB', 'Player vs Bot'), ('PVP', 'Player vs Player'), ('MP', 'Multiplayer'), ('TRN', 'Tournament Match')], max_length=3),
        ),
    ]
