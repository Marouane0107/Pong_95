from django.db import models
from django.contrib.auth.models import User

class GameResult(models.Model):
    GAME_TYPES = [
        ('TRN', 'Tournament Match'),
        ('MM', 'Matchmaking'),
    ]

    game_type = models.CharField(max_length=4, choices=GAME_TYPES)
    # user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player1_games')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='player2_games')
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='won_games')
    timestamp = models.DateTimeField(auto_now_add=True)
    # Tournament fields
    is_tournament_match = models.BooleanField(default=False)
    tournament_stage = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return f"{self.game_type} Game - {self.timestamp}"