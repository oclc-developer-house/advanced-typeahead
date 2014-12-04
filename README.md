#Advanced Type Ahead

## User Story:

User starts to type in a word and a drop down menu showing entities broken out by type appears. The entities are selectable.

## Acceptance:

Produces a deduped list with a variety of entity types.

## Usage:

### Python Django backend

Requirements:

* [oclc-auth-python](https://github.com/OCLC-Developer-Network/oclc-auth-python)
* [Django v 1.7](https://docs.djangoproject.com/en/1.7/topics/install/)
    * sudo pip install Django
* [Django REST Framework](http://www.django-rest-framework.org/#installation)
    * sudo pip install djangorestframework
    * sudo pip install markdown (optional)
* [Requests module](http://docs.python-requests.org/en/latest/user/install/)
    * sudo pip install requests
* [RDF Library](http://rdflib.readthedocs.org/en/latest/)
    * sudo pip install rdflib