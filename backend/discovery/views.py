from __future__ import unicode_literals

import requests
import rdflib

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import auth

class BibsView(APIView):
    """
    Searches OCLC Discovery API and returns a result
    """

    access_token = None

    def get(self, request, format=None):
        # first authenticate and get access token if needed
        if self.access_token is None:
            self.access_token = auth.authenticate()

        # build URL
        query = request.query_params.get('q', 'Hamlet')
        dbIds = '638'
        request_url = 'https://beta.worldcat.org/discovery/bib/search?' + 'q=' + query + '&' + 'dbIds=' + dbIds
        authorization = 'Bearer ' + self.access_token.access_token_string
        r = requests.get(
            url=request_url,
            headers={'Authorization': authorization, 'Accept': 'text/turtle'}
        )

        g = rdflib.Graph()
        result = g.parse(data=r.text, format='turtle')
        data = ''
        for s, p, o in g:
            data = '{}{},{},{}\n'.format(data, s, p, o)

        return Response(data)

