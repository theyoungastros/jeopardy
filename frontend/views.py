from django.shortcuts import render
from django.http import HttpResponse
from boiler import settings
from api.models import *
import utils
from api.serializers import *

def index(request):

    return render(request, 'frontend/index.html', {})