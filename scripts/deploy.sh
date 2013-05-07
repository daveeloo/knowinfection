#!/bin/bash

echo "Syncing django..."
rsync --exclude .svn --exclude .DS_Store --delete --recursive django/knowinfection django/templates django/django.wsgi knowinfect@knowinfect.webfactional.com:~/webapps/django

echo "Syncing media..."
rsync --exclude .svn --exclude .DS_Store --delete --recursive django/media/* knowinfect@knowinfect.webfactional.com:~/webapps/static_content

echo "Syncing config..."
scp conf/settings_production.py knowinfect@knowinfect.webfactional.com:~/webapps/django/knowinfection/settings.py
rsync --exclude .svn --exclude .DS_Store --delete --recursive  conf/apache2/conf knowinfect@knowinfect.webfactional.com:~/webapps/django/apache2

echo "Cool!  Now you might need to restart Apache."
