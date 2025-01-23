
from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),  # Add a URL pattern for the index view
]
