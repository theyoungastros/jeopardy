from django import forms
from api.models import Category

class CategoryForm(forms.Form):

    CORRECT_CHOICES = (
        ('1', 'Choice 1'),
        ('2', 'Choice 2'),
        ('3', 'Choice 3'),
        ('4', 'Choice 4'),
    )

    category_title = forms.CharField(label="Category Title", max_length=32, widget=forms.TextInput(attrs={'class': 'category-title'}))
    category_difficulty = forms.ChoiceField(label="Difficulty", choices=Category.DIFFICULTY_CHOICES)

    question1 = forms.CharField(label="Question 1 (100)", max_length=255, widget=forms.Textarea())
    question1_answer1 = forms.CharField(label="Choice 1", max_length=255)
    question1_answer2 = forms.CharField(label="Choice 2", max_length=255)
    question1_answer3 = forms.CharField(label="Choice 3", max_length=255)
    question1_answer4 = forms.CharField(label="Choice 4", max_length=255)
    correct_answer1 = forms.ChoiceField(label="Correct Answer", choices=CORRECT_CHOICES)

    question2 = forms.CharField(label="Question 2 (200)", max_length=255, widget=forms.Textarea())
    question2_answer1 = forms.CharField(label="Choice 1", max_length=255)
    question2_answer2 = forms.CharField(label="Choice 2", max_length=255)
    question2_answer3 = forms.CharField(label="Choice 3", max_length=255)
    question2_answer4 = forms.CharField(label="Choice 4", max_length=255)
    correct_answer2 = forms.ChoiceField(label="Correct Answer", choices=CORRECT_CHOICES)

    question3 = forms.CharField(label="Question 3 (300)", max_length=255, widget=forms.Textarea())
    question3_answer1 = forms.CharField(label="Choice 1", max_length=255)
    question3_answer2 = forms.CharField(label="Choice 2", max_length=255)
    question3_answer3 = forms.CharField(label="Choice 3", max_length=255)
    question3_answer4 = forms.CharField(label="Choice 4", max_length=255)
    correct_answer3 = forms.ChoiceField(label="Correct Answer", choices=CORRECT_CHOICES)

    question4 = forms.CharField(label="Question 4 (400)", max_length=255, widget=forms.Textarea())
    question4_answer1 = forms.CharField(label="Choice 1", max_length=255)
    question4_answer2 = forms.CharField(label="Choice 2", max_length=255)
    question4_answer3 = forms.CharField(label="Choice 3", max_length=255)
    question4_answer4 = forms.CharField(label="Choice 4", max_length=255)
    correct_answer4 = forms.ChoiceField(label="Correct Answer", choices=CORRECT_CHOICES)

    question5 = forms.CharField(label="Question 5 (500)", max_length=255, widget=forms.Textarea())
    question5_answer1 = forms.CharField(label="Choice 1", max_length=255)
    question5_answer2 = forms.CharField(label="Choice 2", max_length=255)
    question5_answer3 = forms.CharField(label="Choice 3", max_length=255)
    question5_answer4 = forms.CharField(label="Choice 4", max_length=255)
    correct_answer5 = forms.ChoiceField(label="Correct Answer", choices=CORRECT_CHOICES)



