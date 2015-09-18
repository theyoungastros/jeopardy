from django.shortcuts import render
from django.http import HttpResponse
from boiler import settings
from models import *
from serializers import *
import utils


def game(request):
    """
    Gets the main game information for the session
    """

    categories = []
    for category in Category.objects.all().order_by('?')[:6]:
        categories.append(category.serialize())

    return utils.json_response(categories, 200, "success")

def final(request):

    category = Category.objects.filter().order_by('?')[0]
    return utils.json_response(category.serialize(), 200, "success")

def answer(request):
    """
    Validates whether the answer is correct or incorrect
    """

    answer = Answer.objects.get(pk=request.GET['answer_id'])
    return utils.json_response({'correct': answer.correct}, 200, "success")