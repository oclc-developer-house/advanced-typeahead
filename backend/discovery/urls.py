from django.conf.urls import patterns, include, url

from discovery import views

urlpatterns = patterns('',
    url(r'^bibs-rdf/', views.BibsRDFView.as_view(), name='bibs-rdf'),
    url(r'^subjects/', views.SubjectsView.as_view(), name='subjects'),
)
