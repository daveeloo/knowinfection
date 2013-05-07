from django.conf.urls.defaults import patterns, url

import django.contrib.auth.views

from knowinfection.stidb import views

urlpatterns = \
    patterns( '',
              url(r'^$', views.homepage_view, name='homepage'),
              url(r'^inform$', views.inform_partner_start_view, name='inform-partners'),
              url(r'^inform/start$', views.inform_partner_start_view, name='inform-partners-start'),
              url(r'^inform/select$', views.inform_partner_select_stis_view, name='inform-select'),              
              url(r'^inform/send$', views.inform_partner_send_email_view, name='inform-send'),

              url(r'^stis/(?P<sti_id>\d+)$', views.placeholder_view, name='view-single-sti'),
              url(r'^testing$', views.placeholder_view, name='info-testing'),
              url(r'^health$', views.placeholder_view, name='info-sexual-health'),
              url(r'^health/(?P<sti_id>\d+)$', views.placeholder_view, name='sti-info-single'),
              url(r'^about$', views.placeholder_view, name='about'),
              url(r'^contact$', views.placeholder_view, name='contact'),
              url(r'^getinvolved$', views.placeholder_view, name='get-involved'),
              url(r'^share$', views.placeholder_view, name='spread-the-word'),
              url(r'^optout$', views.remove_email_view, name='remove-email'),
              url(r'^report$', views.placeholder_view, name='report-abuse'),
              url(r'^feedback$', views.placeholder_view, name='submit-feedback'),

              url(r'^dashboard$', views.dashboard_view, name='dashboard'),
              url(r'^dashboard/login$', django.contrib.auth.views.login, kwargs={'template_name': 'dashboard/login.html'}, name='login'),
              url(r'^dashboard/logout$', django.contrib.auth.views.logout, kwargs={'next_page': '/knowinfection/dashboard'}, name='logout'),
              url(r'^dashboard/configuration$', views.view_configuration, name='view-configuration'),
              url(r'^dashboard/configuration/modify$', views.modify_configuration_kv, name='modify-configuration-kv'),
              url(r'^dashboard/configuration/delete$', views.delete_configuration_kv, name='delete-configuration-kv'),
              url(r'^dashboard/stats$', views.stats_view, name='stats'),
              url(r'^dashboard/stis$', views.modify_stis_view, name='modify-stis'),
              url(r'^dashboard/stis/new$', views.modify_single_sti_view, name='new-sti'),
              url(r'^dashboard/stis/modify/(?P<sti_id>\d+)$', views.modify_single_sti_view, name='modify-single-sti'),
              url(r'^dashboard/stis/modify$', views.modify_single_sti_attributes, name='modify-single-sti-attributes'),
              url(r'^dashboard/stis/delete$', views.delete_single_sti_attributes, name='delete-single-sti-attributes'),
              url(r'^dashboard/stis/delete', views.delete_single_sti_view, name='delete-single-sti')
)
