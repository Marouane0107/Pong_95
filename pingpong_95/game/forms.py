from django import forms
from .models import GameResult

class GameResultForm(forms.ModelForm):
    class Meta:
        model = GameResult
        fields = ['game_type', 'player1', 'player2', 'player3', 'player4', 
                 'player1_score', 'player2_score', 'player3_score', 'player4_score', 'winner', 'is_tournament_match', 'tournament_stage', 'tournament_round']
