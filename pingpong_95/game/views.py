from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from .models import Game
import json
from django.contrib.auth.decorators import login_required
from .models import GameScore

def index(request):
    game = Game.objects.first()
    if not game:
        game = Game.objects.create(
            player1_score=0,
            player2_score=0,
            player3_score=0,
            player4_score=0
        )
    else:
        # Reset scores when loading the page
        game.player1_score = 0
        game.player2_score = 0
        game.player3_score = 0
        game.player4_score = 0
        game.save()
    return render(request, 'game/index.html', {'game': game})

def update_game_state(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        game = get_object_or_404(Game, id=data['game_id'])
        
        # Update game state based on received data
        game.ball_x = data['ball_x']
        game.ball_y = data['ball_y']
        game.player1_y = data['player1_y']
        game.player2_y = data['player2_y']
        
        # Handle collisions and scoring on server side
        game = handle_collisions(game)
        game = handle_scoring(game)
        
        game.save()
        
        return JsonResponse({
            'ball_x': game.ball_x,
            'ball_y': game.ball_y,
            'scores': {
                'player1': game.player1_score,
                'player2': game.player2_score,
                'player3': game.player3_score,
                'player4': game.player4_score,
            }
        })

def handle_collisions(game):
    # Implement actual collision detection logic
    # Check ball collision with walls
    if game.ball_y <= 0 or game.ball_y >= game.canvas_height:
        game.ball_dy *= -1

    # Check ball collision with paddles
    paddle_width = 10
    paddle_height = 100
    
    # Left paddle collision
    if (game.ball_x <= paddle_width and 
        game.ball_y >= game.player1_y and 
        game.ball_y <= game.player1_y + paddle_height):
        game.ball_dx *= -1

    # Right paddle collision
    if (game.ball_x >= game.canvas_width - paddle_width and 
        game.ball_y >= game.player2_y and 
        game.ball_y <= game.player2_y + paddle_height):
        game.ball_dx *= -1
        
    return game

def handle_scoring(game):
    # Implement actual scoring logic
    if game.ball_x <= 0:
        game.player2_score += 1
        game.reset_ball()
    elif game.ball_x >= game.canvas_width:
        game.player1_score += 1
        game.reset_ball()
    return game

def update_score(request, player):
    game = get_object_or_404(Game, id=request.POST.get('game_id'))
    if player == 'player1':
        game.player1_score += 1
    elif player == 'player2':
        game.player2_score += 1
    elif player == 'player3':
        game.player3_score += 1
    elif player == 'player4':
        game.player4_score += 1
    game.save()
    return redirect('index')

def start_game(request):
    game = Game.objects.create()
    return redirect('index')

def end_game(request):
    game = get_object_or_404(Game, id=request.POST.get('game_id'))
    game.is_active = False
    game.save()
    return redirect('index')

@login_required
def save_score(request):
    try:
        score = int(request.POST.get('score', 0))
        if score < 0:
            return JsonResponse({'error': 'Invalid score value'}, status=400)
            
        GameScore.objects.create(
            user=request.user,
            score=score
        )
        return JsonResponse({'status': 'success'})
    except ValueError:
        return JsonResponse({'error': 'Invalid score format'}, status=400)

@login_required
def get_high_scores(request):
    scores = GameScore.objects.order_by('-score')[:10]
    return JsonResponse({
        'scores': list(scores.values('user__username', 'score'))
    })
