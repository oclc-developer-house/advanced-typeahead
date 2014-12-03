from django.conf.urls import patterns, include, url

from discovery import views

urlpatterns = patterns('',
    url(r'^bibs/', views.BibsView.as_view(), name='bib'),
)
