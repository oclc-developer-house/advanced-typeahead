from __future__ import unicode_literals

import requests
import rdflib

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import auth
import dapi_parser


def dapi_make_request(query='', access_token=None, accept_header='application/json'):
    """
    Makes request to discovery api and returns results based on the
    provided accept header.
    """
    dbIds = '638'
    request_url = 'https://beta.worldcat.org/discovery/bib/search?' + 'q=' + query + '&' + 'dbIds=' + dbIds
    authorization = 'Bearer ' + access_token.access_token_string
    r = requests.get(
        url=request_url,
        headers={'Authorization': authorization, 'Accept': accept_header}
    )
    return r


class BibsRDFView(APIView):
    """
    Searches OCLC Discovery API and returns a result in json-ld, for
    debugging purposes
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


class SubjectsView(APIView):
    access_token = None
    """
    Searches bibs and returns a list of subjects belonging to all
    results
    """

    def get(self, request, format=None):
        # first authenticate and get access token if needed
        if self.access_token is None:
            self.access_token = auth.authenticate()

        # get the query and make the request
        query = request.query_params.get('q', '')
        r = dapi_make_request(
            query=query,
            access_token=self.access_token,
            accept_header='text/turtle')

        # parse the response
        g = rdflib.Graph().parse(data=r.text, format='turtle')
        sg = dapi_parser.SubjectGetter(g)
        drl = dapi_parser.DapiResultsList(g)
        ret_val = {'subjects': []}
        for result in drl.parseResults(sg):
            ret_val['subjects'].extend(result['subjects'])

        return Response(ret_val)