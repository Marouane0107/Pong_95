from django.urls import path
from .views import save_game_result, index, game_results

urlpatterns = [
    path('', index, name='index'),
    path('save-game-result/', save_game_result, name='save_game_result'),
    path('game-results/', game_results, name='game_results'),
]