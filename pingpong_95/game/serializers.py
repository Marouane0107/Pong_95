from rest_framework import serializers
from django.contrib.auth.models import User
from .models import GameResult

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class GameResultSerializer(serializers.ModelSerializer):
    winner = UserSerializer(read_only=True)
    player1 = UserSerializer(read_only=True)
    player2 = UserSerializer(read_only=True)
    player3 = UserSerializer(read_only=True)
    player4 = UserSerializer(read_only=True)

    class Meta:
        model = GameResult
        fields = ['id', 'game_type', 'player1', 'player2', 'player3', 'player4',
                  'player1_score', 'player2_score', 'player3_score', 'player4_score',
                  'winner', 'timestamp', 'is_tournament_match', 'tournament_stage']