from django.db import models

class Configuration(models.Model):
    key = models.CharField(max_length=255, primary_key=True)
    value = models.CharField(max_length=4096)
    def __unicode__(self):
        return self.key

class STI(models.Model):
    name = models.CharField(max_length=128)
    emailSentence = models.CharField(max_length=2048)
    emailParagraph = models.CharField(max_length=8192)
    def __unicode__(self):
        return self.name

class Testing(models.Model):
    sti = models.ForeignKey(STI)
    testingWindow = models.CharField(max_length=1024)
    testingProcedure = models.CharField(max_length=2048)
    position = models.IntegerField()
    def __unicode__(self):
        return '|||'.join([self.testingWindow, self.testingProcedure])

class Transmission(models.Model):
    sti = models.ForeignKey(STI)
    means = models.CharField(max_length=1024)
    likelihoodText = models.CharField(max_length=128)
    # TODO create dropdown of common likelihoods?
    likelihoodValue = models.IntegerField()
    def __unicode__(self):
        return self.means

class Symptom(models.Model):
    sti = models.ForeignKey(STI)
    name = models.CharField(max_length=1024)
    appearanceInfo = models.CharField(max_length=1024)
    position = models.IntegerField()

class Description(models.Model):
    sti = models.ForeignKey(STI)
    position = models.IntegerField()
    question = models.CharField(max_length=1024)
    answer = models.CharField(max_length=4096)

class EmailBlocklist(models.Model):
    emailHashed = models.EmailField(primary_key=True)
