from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^create/?$', views.create, name='create'),
    url(r'^generate/?$', views.generate, name='generate'),
]