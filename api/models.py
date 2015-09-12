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


class Question(models.Model):

    title = models.CharField(max_length=255)
    points = models.IntegerField()
    category = models.ForeignKey(Category)

    def __unicode__(self):
        return self.title


class Answer(models.Model):

    title = models.CharField(max_length=255)
    question = models.ForeignKey(Question)
    correct = models.BooleanField(default=False)

    def __unicode__(self):
        return "%s [from question %s]" % (self.title, self.question.title)


