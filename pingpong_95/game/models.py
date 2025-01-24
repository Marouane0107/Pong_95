from django.db import models

class Game(models.Model):
    player1_score = models.IntegerField(default=0)
    player2_score = models.IntegerField(default=0)
    player3_score = models.IntegerField(default=0)
    player4_score = models.IntegerField(default=0)
    ball_x = models.FloatField(default=400)  # Initial ball position
    ball_y = models.FloatField(default=250)
    ball_speed_x = models.FloatField(default=5)
    ball_speed_y = models.FloatField(default=5)
    player1_y = models.FloatField(default=200)
    player2_y = models.FloatField(default=200)
    player3_x = models.FloatField(default=400)
    player4_x = models.FloatField(default=400)
    game_mode = models.CharField(max_length=20, default='pvp')  # 'pvp', 'bot', 'multi'
    is_active = models.BooleanField(default=True)
    last_hit = models.CharField(max_length=20, null=True, blank=True)

    def __str__(self):
        return f"Game {self.id} - Player1: {self.player1_score}, Player2: {self.player2_score}, Player3: {self.player3_score}, Player4: {self.player4_score}"

class GameScore(models.Model):
    player_name = models.CharField(max_length=100)
    score = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.player_name} - {self.score}"
