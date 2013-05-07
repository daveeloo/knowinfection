from knowinfection.stidb.models import STI, Configuration, Testing, Transmission, Symptom, Description, EmailBlocklist
from django.contrib import admin

admin.site.register(Configuration)
admin.site.register(EmailBlocklist)

admin.site.register(STI)
admin.site.register(Testing)
admin.site.register(Transmission)
admin.site.register(Symptom)
admin.site.register(Description)
