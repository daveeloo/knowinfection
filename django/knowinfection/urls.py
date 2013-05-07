from django.conf.urls.defaults import *

# next two lines are for enabling admin
from django.contrib import admin
admin.autodiscover()

from knowinfection import settings

urlpatterns = \
    patterns('',
             (r'^', include('knowinfection.stidb.urls')),
             (r'^admin/', include(admin.site.urls)),
             
             (r'^media/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_DOC_ROUTE}),
             
)

