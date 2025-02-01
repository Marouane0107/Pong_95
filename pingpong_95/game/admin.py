from django.contrib import admin
from .models import GameResult

@admin.register(GameResult)
class GameResultAdmin(admin.ModelAdmin):
    list_display = ('game_type', 'player1', 'player2', 'winner', 'timestamp')
    list_filter = ('game_type', 'timestamp')
    search_fields = ('player1__username', 'player2__username')
