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
            
            # Validate required fields
            required_fields = ['game_type', 'player1_score', 'player2_score', 'winner']
            if not all(field in data for field in required_fields):
                return JsonResponse({'status': 'error', 'message': 'Missing required fields'}, status=400)

            # Get or create players
            players = {}
            for i in range(1, 5):
                username = data.get(f'player{i}_username', f'Player {i}')
                players[f'player{i}'] = User.objects.get_or_create(username=username)[0]

            # Determine winner
            winner = players.get(f'player{data["winner"]}', None)

            # Build game result fields based on type
            game_fields = {
                'game_type': data['game_type'],
                'player1': players['player1'],
                'player1_score': data['player1_score'],
                'player2': players['player2'],
                'player2_score': data['player2_score'],
                'winner': winner
            }

            if data['game_type'] == 'MP':
                game_fields.update({
                    'player3': players['player3'],
                    'player4': players['player4'],
                    'player3_score': data.get('player3_score', 0),
                    'player4_score': data.get('player4_score', 0)
                })

            # Create game result with unpacked fields
            game_result = GameResult.objects.create(**game_fields)
            
            return JsonResponse({'status': 'success', 'game_id': game_result.id})
        except Exception as e:
            logger.error(f"Error saving game result: {e}")
            return JsonResponse({'status': 'error', 'message': str(e)}, status=400)
    return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=405)