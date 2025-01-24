from django.db import models
from django.utils import timezone

class Player(models.Model):
    name = models.CharField(max_length=100)
    games_played = models.IntegerField(default=0)
    won_games_count = models.IntegerField(default=0)
    total_score = models.IntegerField(default=0)
    highest_score = models.IntegerField(default=0)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.name} (Won: {self.won_games_count}/{self.games_played})"

class Game(models.Model):
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    player3_score = models.IntegerField(default=0)
    player4_score = models.IntegerField(default=0)
    ball_x = models.FloatField(default=400)
    ball_y = models.FloatField(default=250)
    ball_speed_x = models.FloatField(default=5)
    ball_speed_y = models.FloatField(default=5)
    player1_y = models.FloatField(default=200)
    player2_y = models.FloatField(default=200)
    player3_x = models.FloatField(default=400)
    player4_x = models.FloatField(default=400)
    game_mode = models.CharField(max_length=20, default='pvp')
    is_active = models.BooleanField(default=True)
    last_hit = models.CharField(max_length=20, null=True, blank=True)
    player1 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player1', null=True)
    player2 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player2', null=True)
    player3 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player3', null=True)
    player4 = models.ForeignKey(Player, on_delete=models.CASCADE, related_name='games_as_player4', null=True)
    winner = models.ForeignKey(Player, on_delete=models.SET_NULL, related_name='games_won_as_winner', null=True)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Game {self.id} - Winner: {self.winner.name if self.winner else 'In Progress'}"

class GameScore(models.Model):
    player = models.ForeignKey(
        'Player',  # Use string reference to avoid circular import
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='player_scores'  # Changed related_name
    )
    game = models.ForeignKey(
        'Game',  # Use string reference to avoid circular import
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='game_scores'  # Keep this related_name
    )
    score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.player.name if self.player else 'Unknown'} - {self.score} points"
