from django.db import models


class Category(models.Model):

    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )

    title = models.CharField(max_length=32)
    difficulty = models.CharField(choices=DIFFICULTY_CHOICES, max_length=10)

    def __unicode__(self):
        return self.title

    class Meta:
        verbose_name_plural = "categories"


    def serialize(self):

        d = {}
        d['id'] = self.pk
        d['title'] = self.title
        d['difficulty'] = self.difficulty

        questions = []
        for question in Question.objects.filter(category=self):
            questions.append(question.serialize())
        d['questions'] = questions

        return d


class Question(models.Model):

    title = models.CharField(max_length=255)
    points = models.IntegerField()
    category = models.ForeignKey(Category)

    def __unicode__(self):
        return self.title

    def serialize(self):
        d = {}
        d['id'] = self.pk
        d['title'] = self.title
        d['points'] = self.points

        answers = []
        for answer in Answer.objects.filter(question=self).order_by('?'):
            answers.append(answer.serialize())
        d['answers'] = answers


        return d


class Answer(models.Model):

    title = models.CharField(max_length=255)
    question = models.ForeignKey(Question)
    correct = models.BooleanField(default=False)

    def __unicode__(self):
        return "%s [from question %s]" % (self.title, self.question.title)

    def serialize(self):
        d = {}
        d['title'] = self.title
        d['id'] = self.pk
        # d['correct'] = self.correct
        
        return d

