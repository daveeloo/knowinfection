from operator import itemgetter

import django.contrib.auth
from django.contrib.auth.decorators import login_required
from django.core.context_processors import csrf
from django.core import urlresolvers
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext
from django.utils import simplejson

from knowinfection.stidb.forms import STIModifyForm, STIDescriptionForm, STITransmissionForm, STISymptomForm, STITestingForm, ConfigurationEditForm, EmailPartnerForm, SelectSTIsForm
from knowinfection.stidb.models import STI, Configuration, Testing, Transmission, Symptom, Description
from knowinfection.stidb.captcha import generate_captcha_key, generate_captcha_url
from knowinfection.stidb.email import send_knowinfection_email, generate_email
from knowinfection.stidb.utilities import get_config, put_config

class AJAXStatus:
    OK = 'ok'
    ERROR = 'error'

def render_ajax(status, errors=None):
    """ Renders a response to an AJAX request.  Errors should be provided
    as a dict from erroneous_key=>error.

    Returns {'status': 'ok'} for successful requests and 
    {'status': 'error', 
    'errors': {'error_key1': 'error with key1', 
               'error_key2': 'error with key2' ...}
    """
    response = {'status': status}
    if status != AJAXStatus.OK:
        if errors is None:
            errors = {}
        response['errors'] = errors

    return HttpResponse(simplejson.dumps(response))

def render_template(request, template, data_dict=None):
    if data_dict is None:
        data_dict = {}

    data_dict['csrf_token'] = csrf(request)['csrf_token']
    return render_to_response(template, data_dict, context_instance=RequestContext(request))

def placeholder_view(request, **kwargs):
    return render_template(request, 'placeholder.html')

def homepage_view(request):
    return render_template(request, 'homepage.html')

def inform_partner_start_view(request):
    """ Display the start page for informing a partner """
    if 'inform' in request.session:
        del request.session['inform']

    return render_template(request, 'inform/start.html', {'selected': 'start'})

def inform_partner_select_stis_view(request):
    """ Have them choose some STIs, save them in the session """

    def get_select_stis_form(*args, **kwargs):
        form = SelectSTIsForm(*args, **kwargs)
        form.fields['stis'].choices = [ (sti.pk, sti.name) for sti in STI.objects.all() ]
        return form

    if request.method == "POST":
        form = get_select_stis_form(request.POST)
        if form.is_valid():
            stis = [ STI.objects.get(pk=pk) for pk in form.cleaned_data['stis'] ]
            request.session['inform'] = {'sti_pks': form.cleaned_data['stis']}

            return render_template(request, 'inform/preview.html',
                                   {'email': generate_email(stis),
                                    'selected': 'preview'})
    else:
        form = get_select_stis_form()
        if 'inform' in request.session and 'sti_pks' in request.session['inform']:
            form.fields['stis'].initial = request.session['inform']['sti_pks']

    return render_template(request, 'inform/select_stis.html', {'form': form,
                                                                'selected': 'select_stis'})

def inform_partner_send_email_view(request):
    """ given some STIs, generate a form to send it along """
    if 'inform' not in request.session or 'sti_pks' not in request.session['inform']:
        return inform_partner_start_view(request)

    if request.method == "POST":
        form = EmailPartnerForm(request.POST)
        form.captchaKey = request.POST.get('captchaKey')

        if form.is_valid():
            stis = [ STI.objects.get(pk=pk) for pk in request.session['inform']['sti_pks'] ]
            emailAddress = form.cleaned_data['emailAddress']
            send_knowinfection_email(emailAddress, stis)

            del request.session['inform']
            return render_template(request, 'inform/thank_you.html')
    else:
        form = EmailPartnerForm()

    captchaKey = generate_captcha_key()
    captchaUrl = generate_captcha_url(captchaKey)
    return render_template(request, 'inform/enter_email.html', {'form': form,
                                                                'selected': 'email_send',
                                                                'captchaKey': captchaKey,
                                                                'captchaUrl': captchaUrl })

def remove_email_view(request):
    # TODO redirect this to a form where they have to hit submit (and fill out a captcha to prevent DDoS)
    return HttpResponse("do it do it")

# ---------- Dashboard ----------
@login_required
def dashboard_view(request):
    return render_template(request, 'dashboard/homepage.html')

# ---------- Dashboard: Stats ----------
@login_required
def stats_view(request):
    return render_template(request, 'dashboard/stats.html')

# ---------- Dashboard: Configuration ----------
@login_required
def view_configuration(request):
    config = sorted([ (obj.key,obj.value) for obj in Configuration.objects.all() ], key=itemgetter(0)) 
    return render_template(request, 'dashboard/configuration.html', 
                           {'configuration': config,
                            'form': ConfigurationEditForm()})

@login_required
def modify_configuration_kv(request):
    """ Assumes an AJAX post request.  Updates the key in the config database if
    it exists.  Otherwise, creates a new key. 

    Returns a JSON dict. """
    
    if request.method == "POST":
        form = ConfigurationEditForm(request.POST, 
                                     instance=Configuration(pk=request.POST.get('key')))

        if form.is_valid():
            put_config(form.cleaned_data['key'],
                       form.cleaned_data['value'])

            return render_ajax(AJAXStatus.OK)
        else:
            return render_ajax(AJAXStatus.ERROR, form.errors)
        
        return render_ajax(AJAXStatus.ERROR)
    
@login_required
def delete_configuration_kv(request):
    """ Assumes an AJAX post request.  Deletes the key from the config
    database if it exists.  Returns an error if it does not exist.

    Returns a JSON dict. """

    if request.method == "POST":
        key = request.POST.get('key', '').strip()
        try:
            instance = Configuration.objects.get(key=key)
        except Configuration.DoesNotExist:
            return render_ajax(AJAXStatus.ERROR, {'key': ['key %s not found' % key]})
        
        instance.delete()
        return render_ajax(AJAXStatus.OK)
    
    return render_ajax(AJAXStatus.ERROR)

# ---------- Dashboard: Modify STIs ----------
@login_required
def modify_stis_view(request):
    """ View for listing all STIs """
    all_stis = STI.objects.all()
    return render_template(request, 'dashboard/stis/all.html', {'stis': all_stis})

def create_sti_dict(sti_instance):
    sti_dict = {}
    
    def obj_to_dict(obj, ignore_keys=None):
        """ Converts the object to a dict, stripping pk values and
        internal fields.  Useful for JSON serialization. """
        if ignore_keys is None:
            ignore_keys = []
        return dict( ( (k,v) for k,v in obj.__dict__.items() if not k.startswith('_') and k not in ignore_keys ) )

    sti_dict['sti'] = obj_to_dict(sti_instance, ignore_keys=['id'])

    if sti_instance.id:
        sti_dict['sti_id'] = sti_instance.id

    def get_sorted(attr, sort_key='position', reverse=False, pop_keys=['sti_id']):
        objects = getattr(sti_instance, attr).order_by(sort_key)
        if reverse:
            objects = objects.reverse()
        dicts = [ obj_to_dict(obj) for obj in objects ]
        for d in dicts:
            for k in pop_keys:
                d.pop(k)
        return dicts

    sti_dict['testing'] = get_sorted('testing_set')
    sti_dict['transmission'] = get_sorted('transmission_set', 'likelihoodValue', reverse=True)
    sti_dict['symptom'] = get_sorted('symptom_set')
    sti_dict['description'] = get_sorted('description_set')
    
    return sti_dict

@login_required
def modify_single_sti_view(request, sti_id=None):
    """ View for modifying a single STI.  This doesn't handle any
    updates.  It just renders a single STI.  

    See modify_single_sti_attributes to add/remove attributes. 

    If sti_id is provided in the
    request, use the sti it represents.  Otherwise, returns an empty STI. 

    If we're creating a new STI, then go for it"""

    if request.method == "POST":
        # we're submitting something; try either the sti_id from the URL or the sti_id from the request
        instance = STI(pk=(sti_id or request.POST.get('sti_id')))
        form = STIModifyForm(request.POST, instance=instance)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(urlresolvers.reverse('modify-single-sti', kwargs={'sti_id':form.instance.id}))
        else:
            return render_ajax(AJAXStatus.ERROR, dict(form.errors.iteritems()))

    elif sti_id is not None:
        # Just render the STI
        try:
            instance = STI.objects.get(pk=sti_id)
        except STI.DoesNotExist:
            # TODO create a pretty 404 page
            raise
    else:
        instance = STI()
    
    return render_template(request, 'dashboard/stis/single.html',
                           {'sti_dict': create_sti_dict(instance)})

attribute_map = {'sti': (STI, STIModifyForm),
                 'description': (Description, STIDescriptionForm),
                 'symptom': (Symptom, STISymptomForm),
                 'testing': (Testing, STITestingForm),
                 'transmission': (Transmission, STITransmissionForm)
                 }

@login_required
def delete_single_sti_attributes(request):
    """ Expects a request of the following format:

    {'id': 'sti primary key to be modified',
     'attributes': {'attribute_name1': ['list', 'of', 'primarykeys', 'to', 'be', 'deleted'],
                    'attribute_name2': ['list', 'of', 'primarykeys', 'to', 'be', 'deleted']}...}

    The attributes dict is JSON-encoded.
    All other attributes are left untouched.
    """
    if request.method == "POST":
        attributes = simplejson.loads(request.POST.get('attributes', '{}'))

        errors = {}
        for attr_key, (instance_clss, form_clss) in attribute_map.items():
            for instance_id in attributes.get(attr_key, []):
                instance = instance_clss(pk=instance_id)
                try:
                    instance.delete()
                except:
                    errors["%s_%s" % (attr_key, instance_id)] = ["Could not delete instance."]

        if errors:
            return render_ajax(AJAXStatus.ERROR, errors)

    return render_ajax(AJAXStatus.OK)

@login_required
def modify_single_sti_attributes(request):
    """ Expects a request of the following format:

    {'id': 'sti primary key to be modified',
     'attributes': {'attribute_name1': [{'id':'obj1', 'key1': 'value1'},
                                        {'id':'obj2', 'key1': 'value1'}],
                    'attribute_name2': [{'key1': 'value1'}] ... }

    The attributes dict is JSON-encoded.
    Only the supplied keys are modified.  All other values are unchanged.
    """

    if request.method == "POST":
        sti_id = request.POST.get('id')
        if not sti_id:
            render_ajax(AJAXStatus.ERROR, {'sti_id': ['This field is required.']})

        attributes = simplejson.loads(request.POST.get('attributes', '{}'))

        forms_to_save = []
        errors = {}
        for attr_key, (instance_clss, form_clss) in attribute_map.items():
            for obj_dict in attributes.get(attr_key, []):
                if attr_key == 'sti':
                    obj_id = sti_id
                else:
                    obj_id = obj_dict.get('id')
                    obj_dict['sti'] = sti_id

                instance = instance_clss(pk=obj_id)
                form = form_clss(obj_dict, instance=instance)
                if form.is_valid():
                    # wait until we validate all forms to save
                    forms_to_save.append(form)
                else:
                    for k,v in form.errors.iteritems():
                        errors["%s_%s_%s" % (attr_key, obj_id or 'new', k)] = v

        if errors:
            return render_ajax(AJAXStatus.ERROR, errors)
        else:
            # no errors, we're good to go
            for form in forms_to_save:
                form.save()

    return render_ajax(AJAXStatus.OK)

@login_required
def delete_single_sti_view(request):
    """ Deletes the given STI """
    if request.method == "POST":
        sti_id = request.POST.get('sti_id')
        if sti_id:
            try:
                instance = STI.objects.get(pk=sti_id)
            except STI.DoesNotExist:
                # TODO create a pretty 404 page
                raise
            instance.delete()
    
    return modify_stis_view(request)
