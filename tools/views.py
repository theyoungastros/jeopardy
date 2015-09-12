from django.shortcuts import render
from django.http import HttpResponse
from boiler import settings
from api.models import *
import utils
from .forms import CategoryForm
from api import utils as api_utils


def categories_create(request):

    template_url = 'tools/categories_create.html'
    messages = []

    if request.method == "POST":
        form = CategoryForm(request.POST)

        if not form.is_valid():
            return render(request, template_url, {'form': form, 'messages': messages})

        category = Category()
        category.title = request.POST['category_title']
        category.difficulty = request.POST['category_difficulty']
        category.save()

        question1 = Question(
            title=request.POST['question1'],
            category=category,
            points=100,
        )
        question1.save()

        question1_answer1 = Answer(
            title=request.POST['question1_answer1'],
            question=question1,
            correct=request.POST['correct_answer'] == '1',
        ).save()

        question1_answer2 = Answer(
            title=request.POST['question1_answer2'],
            question=question1,
            correct=request.POST['correct_answer'] == '2',
        ).save()

        question1_answer3 = Answer(
            title=request.POST['question1_answer3'],
            question=question1,
            correct=request.POST['correct_answer'] == '3',
        ).save()

        question1_answer4 = Answer(
            title=request.POST['question1_answer4'],
            question=question1,
            correct=request.POST['correct_answer'] == '4',
        ).save()




        messages.append({"type": "success", "body": "Category Created Successfully"})
        form = CategoryForm()
      



    else:
        form = CategoryForm()

    return render(request, template_url, {'form': form, 'messages': messages})




