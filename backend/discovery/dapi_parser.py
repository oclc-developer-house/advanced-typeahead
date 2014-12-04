import rdflib
from rdflib import Namespace

DISCOVERY = Namespace('http://worldcat.org/vocab/discovery/')
SCHEMA = Namespace('http://schema.org/')

class DapiResultsList(object):
    graph = None
    resultTerms = []

    def __init__(self, graph):
        self.graph = graph

    def getResultObjects(self):
        if not self.resultTerms:
            rList = []
            for s, o in self.graph.subject_objects(predicate=DISCOVERY.hasPart):
                rList.append(o)
            self.resultTerms = rList
        return self.resultTerms

    def parseResults(self, parser):
        if not self.resultTerms:
            self.getResultObjects()
        results = []
        for term in self.resultTerms:
            results.append(parser.parse(term))
        return results


class AbstractParser(object):
    graph = None
    fields = {}

    def __init__(self, graph):
        self.graph = graph

    def parse(self, term):
        """
        Subclasses should implement this method to parse
        data attached to the rdflib term object that's
        passed in and return a dict object containing
        fields.
        """
        fields = {}
        self.fields = fields
        return self.fields


class SubjectGetter(AbstractParser):
    """
    Pulls item subjects out of the graph for the item passed in via
    term
    """
    def parse(self, term):
        fields = {'subjects': []}
        g = self.graph
        itemDesc = [o for o in g[term:SCHEMA.about]][0]
        for itemSubject in g[itemDesc:SCHEMA.about]:
            try:
                itemSubjectName = [o for o in g[itemSubject:SCHEMA.name]][0]
            except IndexError:
                pass
            else:
                itemSubjectId = unicode(itemSubject)
                itemSubjectRepresentation = {
                    'label': itemSubjectName,
                    'id': itemSubjectId
                }
                fields['subjects'].append(itemSubjectRepresentation)
        self.fields = fields
        return self.fields
