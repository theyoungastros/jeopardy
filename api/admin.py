from django.contrib import admin
from .models import Category, Question, Answer

class CategoryAdmin(admin.ModelAdmin):
    """
    Category Admin
    """

    list_display = ['title', 'difficulty']

admin.site.register(Category, CategoryAdmin)


class QuestionAdmin(admin.ModelAdmin):
    """
    Question Admin
    """

    list_display = ['title', 'points', 'category']

admin.site.register(Question, QuestionAdmin)


class AnswerAdmin(admin.ModelAdmin):
    """
    Answer Admin
    """

    list_display = ['title', 'question', 'correct']

admin.site.register(Answer, AnswerAdmin)