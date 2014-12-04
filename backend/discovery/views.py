from __future__ import unicode_literals

import requests
import rdflib

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import auth


def dapi_make_request(query='', access_token=None):
    dbIds = '638'
    request_url = 'https://beta.worldcat.org/discovery/bib/search?' + 'q=' + query + '&' + 'dbIds=' + dbIds
    authorization = 'Bearer ' + access_token.access_token_string
    r = requests.get(
        url=request_url,
        headers={'Authorization': authorization, 'Accept': 'application/json'}
    )
    return r


class BibsRDFView(APIView):
    """
    Searches OCLC Discovery API and returns a result in json-ld

    """

    access_token = None

    def get(self, request, format=None):
        # first authenticate and get access token if needed
        if self.access_token is None:
            self.access_token = auth.authenticate()

        # get the query and make the request
        query = request.query_params.get('q', '')
        r = dapi_make_request(query=query, access_token=self.access_token)

        return Response(r.json())


class BibsView(APIView):
    access_token = None
    """
    Searches bibs and returns results as simple json
        title
        creator
        contributors
        subjects
    """

    def get(self, request, format=None):
        # first authenticate and get access token if needed
        if self.access_token is None:
            self.access_token = auth.authenticate()

        # get the query and make the request
        query = request.query_params.get('q', '')
        r = dapi_make_request(query=query, access_token=self.access_token)

        return Response(r.json())