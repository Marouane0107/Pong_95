from django.contrib import admin

# Register your models here.
from .models import Game, Player, GameScore

admin.site.register(Game)
admin.site.register(Player)

