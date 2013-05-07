from django.utils import simplejson

from knowinfection.stidb.models import Configuration

def get_config(key, encoded=False):
    """ Gets an item from the configuration.  If the item is encoded,
    decodes it.  If the key isn't found, returns None """
    try:
        instance = Configuration.objects.get(key=key)
    except Configuration.DoesNotExist:
        return None

    if encoded:
        return simplejson.loads(instance.value)
    return instance.value

def put_config(key, value, encoded=False):
    """ Puts a key/value pair in the configuration, encoding if necessary. """
    if encoded:
        value = simplejson.dumps(value)

    try:
        instance = Configuration.objects.get(pk=key)
    except Configuration.DoesNotExist:
        instance = Configuration(pk=key)

    instance.value = value
    instance.save()
