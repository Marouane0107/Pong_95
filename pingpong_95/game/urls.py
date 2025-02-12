from django.urls import path
from .views import GameResultAPIView, SPAView

urlpatterns = [
    path('', SPAView.as_view(), name='spa-root'),
    path('api/game-results/', GameResultAPIView.as_view(), name='game_results'),
]