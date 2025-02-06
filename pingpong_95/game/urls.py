from django.urls import path
from .views import GameResultAPIView, SPAView

urlpatterns = [
    # SPA root view
    path('', SPAView.as_view(), name='spa-root'),
    
    # API endpoints
    path('api/game-results/', GameResultAPIView.as_view(), name='game_results'),
]