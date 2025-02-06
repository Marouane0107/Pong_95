from django.views import View
from django.conf import settings
import os
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .models import GameResult
from .serializers import GameResultSerializer, UserSerializer
from django.middleware.csrf import get_token
from django.http import FileResponse, JsonResponse, Http404
import logging


class SPAView(View):
    def get(self, request, *args, **kwargs):
        try:
            # Get path to index.html
            index_path = os.path.join(settings.BASE_DIR, 'static/html/index.html')
            
            # Set CSRF token in cookie
            response = FileResponse(open(index_path, 'rb'))
            response.set_cookie('csrftoken', get_token(request))
            
            return response
            
        except FileNotFoundError:
            raise Http404("index.html not found")

    def options(self, request, *args, **kwargs):
        response = JsonResponse({'csrfToken': get_token(request)})
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Headers'] = 'X-CSRFToken'
        return response

class GameResultViewSet(viewsets.ModelViewSet):
    queryset = GameResult.objects.all().select_related('player1', 'player2', 'winner')
    serializer_class = GameResultSerializer


class GameResultAPIView(APIView):
    def get(self, request):
        results = GameResult.objects.all().select_related('player1', 'player2', 'winner')
        serializer = GameResultSerializer(results, many=True)
        return Response(serializer.data)

    def post(self, request):
        try:
            data = request.data
            logging.debug(f"Received data: {data}")
            
            # Validate required fields
            required_fields = ['game_type', 'player1_score', 'player2_score', 'winner']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                logging.error(f"Missing required fields: {missing_fields}")
                return Response(
                    {'status': 'error', 'message': f'Missing required fields: {missing_fields}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get or create players
            players = {}
            for i in range(1, 5):
                username = data[f'player{i}']
                players[str(i)] = User.objects.get_or_create(username=username)[0]

            # Determine winner
            winner_number = data.get('winner')
            winner = players.get(str(winner_number), None)

            # Build game result fields
            game_fields = {
                'game_type': data['game_type'],
                'player1': players['1'],
                'player1_score': data['player1_score'],
                'player2': players['2'],
                'player2_score': data['player2_score'],
                'winner': winner
            }

            if data['game_type'] == 'MP':
                game_fields.update({
                    'player3': players['3'],
                    'player4': players['4'],
                    'player3_score': data.get('player3_score', 0),
                    'player4_score': data.get('player4_score', 0)
                })

            game_result = GameResult.objects.create(**game_fields)
            serializer = GameResultSerializer(game_result)
            return Response({
                'status': 'success',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)

        except KeyError as e:
            logging.error(f"Missing field: {str(e)}")
            return Response(
                {'status': 'error', 'message': f'Missing field: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            logging.error(f"Exception occurred: {str(e)}")
            return Response(
                {'status': 'error', 'message': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )