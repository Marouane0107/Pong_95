from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('update-game-state/', views.update_game_state, name='update_game_state'),
    path('start-game/', views.start_game, name='start_game'),
    path('end-game/', views.end_game, name='end_game'),
    path('update-score/<str:player>/', views.update_score, name='update_score'),
]
