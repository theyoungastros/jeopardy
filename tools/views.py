from django.shortcuts import render
from django.http import HttpResponse
from boiler import settings
from api.models import *
import utils
from .forms import CategoryForm
from api import utils as api_utils
from random import randint


def create(request):

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

        questions = {}

        for q in range(1, 6):

            questions[q] = Question(
                title=request.POST['question%s' % q],
                category=category,
                points= 100 * q,
            )
            questions[q].save()

            answers = {}
            for a in range(1, 5):

                answers[a] = Answer(
                    title=request.POST['question%s_answer%s' % (q, a)],
                    question=questions[q],
                    correct=request.POST['correct_answer%s' % q] == '1',
                )
                answers[a].save()

        messages.append({"type": "success", "body": "Category Created Successfully"})
        form = CategoryForm()
      
    else:
        form = CategoryForm()

    return render(request, template_url, {'form': form, 'messages': messages})




def generate(request):

    category = Category()
    category.title = "Temp Category"
    category.difficulty = "easy"
    category.save()

    questions = {}

    for q in range(1, 6):

        questions[q] = Question(
            title="Lorem Ipsum",
            category=category,
            points= 100 * q,
        )
        questions[q].save()

        answers = {}

        correct_answer = randint(1,4)

        for a in range(1, 5):

            answers[a] = Answer(
                title="Correct" if correct_answer == a else "Incorrect",
                question=questions[q],
                correct=True if correct_answer == a else False,
            )
            answers[a].save()

    return HttpResponse("Generate Success")