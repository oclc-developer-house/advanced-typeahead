#Advanced Type Ahead

## User Story:

User starts to type in a word and a drop down menu showing entities broken out by type appears. The entities are selectable.

## Acceptance:

Produces a deduped list with a variety of entity types.

## Usage:

Currently the project is in two parts: an HTML/CSS/JS frontend (in the html folder) and a Python Django backend (in the backend folder).

### HTML/CSS/JS Frontend

Place this on a web server and visit index.html. It also works running it from your filesystem. Needed libraries not loaded from a cdn are included in html/scripts.

### Python Django Backend

Requirements:

* [oclc-auth-python](https://github.com/OCLC-Developer-Network/oclc-auth-python)
* [Django v 1.7](https://docs.djangoproject.com/en/1.7/topics/install/)
* [Django REST Framework](http://www.django-rest-framework.org/#installation)
* [Requests module](http://docs.python-requests.org/en/latest/user/install/)
* [RDF Library](http://rdflib.readthedocs.org/en/latest/)
* [Django CORS Headers](https://pypi.python.org/pypi/django-cors-headers)

Install the dependencies:

    git clone https://github.com/OCLC-Developer-Network/oclc-auth-python.git
    cd oclc-auth-python
    sudo python setup.py install
    cd ..
    sudo pip install Django
    sudo pip install djangorestframework
    sudo pip install markdown
    sudo pip install requests
    sudo pip install rdflib
    sudo pip install django-cors-headers

Install the application

    git clone 

OCLC Discovery API Authorization:

You'll need to rename backend/backend/settings/authentication_template.py to backend/backend/settings/authentication.py and fill in the blanks with your OCLC WSkey details.

Running the Django Server:

Launch the Django dev server by running backend/devstart.sh. It's set to listen on localhost:8000. 

Note that default Django settings from spinning up a basic project are used, and the secret key is currently included in settings/base.py, so under no circumstances should this be used in a production environment as-is.
