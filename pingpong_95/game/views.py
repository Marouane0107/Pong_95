from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from .models import GameResult
import json

def index(request):
    return render(request, 'game/index.html')

def game_results(request):
    results = GameResult.objects.all().select_related('player1', 'player2', 'winner')
    return render(request, 'game_results.html', {'game_results': results})

@csrf_exempt
def save_game_result(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            # Get or create players
            player1 = User.objects.get_or_create(username="Player 1")[0]
            player2 = User.objects.get_or_create(username="Player 2")[0]
            winner = player1 if data['winner'] == 1 else player2

            game_result = GameResult.objects.create(
                game_type=data['game_type'],
                player1=player1,
                player2=player2,
                player1_score=data['player1_score'],
                player2_score=data['player2_score'],
                winner=winner
            )
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)
