from django import forms
from api.models import Category

class CategoryForm(forms.Form):

    CORRECT_CHOICES = (
        ('1', 'Choice 1'),
        ('2', 'Choice 2'),
        ('3', 'Choice 3'),
        ('4', 'Choice 4'),
    )

    # Category Model
    category_title = forms.CharField(label="Category Title", max_length=32, widget=forms.TextInput(attrs={'class': 'category-title'}))
    category_difficulty = forms.ChoiceField(label="Difficulty", choices=Category.DIFFICULTY_CHOICES)

    # Question Model
    question1 = forms.CharField(label="Question 1 (100)", max_length=255, widget=forms.Textarea())
    question1_answer1 = forms.CharField(label="Choice 1", max_length=255)
    question1_answer2 = forms.CharField(label="Choice 2", max_length=255)
    question1_answer3 = forms.CharField(label="Choice 3", max_length=255)
    question1_answer4 = forms.CharField(label="Choice 4", max_length=255)

    correct_answer = forms.ChoiceField(label="Correct Answer", choices=CORRECT_CHOICES)

