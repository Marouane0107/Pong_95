from channels.generic.websocket import AsyncWebsocketConsumer
import json
import re

class MatchmakingConsumer(AsyncWebsocketConsumer):
    players = []

    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        if self.channel_name in self.players:
            self.players.remove(self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("action") == "join_queue":
            if self.channel_name not in self.players:
                self.players.append(self.channel_name)
            if len(self.players) >= 2:
                player1 = self.players.pop(0)
                player2 = self.players.pop(0)
                room_name = f"{min(player1, player2)}_{max(player1, player2)}"
                room_name = re.sub(r'[^a-zA-Z0-9_]', '_', room_name)  # Sanitize
                await self.send_match_found(player1, room_name, "player1")
                await self.send_match_found(player2, room_name, "player2")

    async def send_match_found(self, player_channel, room_name, role):
        await self.channel_layer.send(
            player_channel,
            {"type": "match.found", "room_name": room_name, "role": role}
        )

    async def match_found(self, event):
        await self.send(text_data=json.dumps({
            "type": "match_found",
            "room_name": event["room_name"],
            "role": event["role"]
        }))

class GameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'game_{self.room_name}'
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.room_group_name,
            {"type": "game_state", "data": data, "sender_channel": self.channel_name}
        )

    async def game_state(self, event):
        if event["sender_channel"] != self.channel_name:
            await self.send(text_data=json.dumps(event["data"]))