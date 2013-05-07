from settings_global import *

# TODO set DEBUG = False
DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'knowinfect',                      # Or path to database file if using sqlite3.
        'USER': 'knowinfect',                      # Not used with sqlite3.
        'PASSWORD': '_hyph3n',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

MEDIA_ROOT = '/home/knowinfect/webapps/django/knowinfection.wsgi'

EMAIL_HOST = 'smtp.webfaction.com'
EMAIL_HOST_USER = 'inform'
EMAIL_HOST_PASSWORD = '_hyph3n'

# note that we need to send email from this address
DEFAULT_FROM_EMAIL = 'inform@knowinfection.org'
SERVER_EMAIL = 'inform@knowinfection.org'
