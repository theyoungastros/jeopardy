from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^categories/create/?$', views.categories_create, name='categories_create'),
]