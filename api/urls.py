from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^game/?$', views.game, name='game'),
    url(r'^answer/?$', views.answer, name='answer'),
    url(r'^final/?$', views.final, name='final'),
]