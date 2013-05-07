from django import forms

from knowinfection.stidb.models import STI, Configuration, Description, Testing, Symptom, Transmission
from knowinfection.stidb.captcha import validate_captcha

def genstrip(keyname, emptyok=False):
    def f(self):
        val = self.cleaned_data[keyname].strip()
        if not emptyok and not val:
            raise forms.ValidationError("%s must be non-empty" % keyname)
        return val

    return f

def genconvert(keyname, typ, emptyok=False):
    def f(self):
        if keyname not in self.cleaned_data and not empthyok:
            raise forms.ValidationError("%s must be non-empty" % keyname)

        try:
            val = typ(self.cleaned_data[keyname])
        except:
            raise forms.ValidationError("%s must be of type %s" % (keyname, typ.__name__))

        return val

    return f

class STIModifyForm(forms.ModelForm):
    class Meta:
        model = STI

    clean_name = genstrip('name')
    clean_emailBlurb = genstrip('emailBlurb', emptyok=True)

class STIDescriptionForm(forms.ModelForm):
    class Meta:
        model = Description

    clean_question = genstrip('question')
    clean_answer = genstrip('answer')

    clean_position = genconvert('position', int)

class STITestingForm(forms.ModelForm):
    class Meta:
        model = Testing
    
    clean_testingWindow = genstrip('testingWindow')
    clean_testingProcedure = genstrip('testingProcedure')

    clean_position = genconvert('position', int)

class STITransmissionForm(forms.ModelForm):
    class Meta:
        model = Transmission

    clean_means = genstrip('means')
    clean_likelihoodText = genstrip('likelihoodText')
    clean_likelihoodValue = genconvert('likelihoodValue', int)

class STISymptomForm(forms.ModelForm):
    class Meta:
        model = Symptom

    clean_name = genstrip('name')
    clean_appearanceInfo = genstrip('appearanceInfo')

    clean_position = genconvert('position', int)

class ConfigurationEditForm(forms.ModelForm):
    class Meta:
        model = Configuration

    clean_key = genstrip('key')

class SelectSTIsForm(forms.Form):
    stis = forms.MultipleChoiceField(widget=forms.CheckboxSelectMultiple())

    def clean_stis(self):
        keys = self.cleaned_data['stis']

        # make sure they reference legit STIs
        try:
            for k in keys:
                STI.objects.get(pk=k)
        except STI.DoesNotExist:
            raise forms.ValidationError("all STI references must be valid")

        return keys

# TODO preview form (checkbox at least)

class EmailPartnerForm(forms.Form):
    emailAddress = forms.EmailField()
    captchaKey = forms.CharField(widget=forms.widgets.HiddenInput)
    captchaValue = forms.CharField(max_length=10)

    def clean_captchaValue(self):
        key = self.cleaned_data['captchaKey']
        guessedValue = self.cleaned_data['captchaValue']

        if not validate_captcha(key, guessedValue):
            raise forms.ValidationError("value is incorrect, please try again")

        return key
