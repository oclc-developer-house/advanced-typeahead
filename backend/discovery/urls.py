from django.conf.urls import patterns, include, url
from django.views.decorators.cache import cache_page

from discovery import views

urlpatterns = patterns('',
    url(r'^bibs-rdf/', cache_page(60 * 15)(views.BibsRDFView.as_view()), name='bibs-rdf'),
    url(r'^subjects/', cache_page(60 * 15)(views.SubjectsView.as_view()), name='subjects'),
)
