from authliboclc import wskey

from django.conf import settings


class AuthenticationError(Exception):
    def __init__(self, code='', msg='', url=''):
        self.code = code
        self.msg = msg
        self.url = url


def authenticate():
    """
    Retrieves a token from OCLC with Client Credentials grant and
    returns the token.
    """
    key = settings.KEY
    secret = settings.SECRET
    authenticating_institution_id = settings.AUTHENTICATING_INSTITUTION_ID
    context_institution_id = settings.CONTEXT_INSTITUTION_ID

    # Configure the wskey library object
    my_wskey = wskey.Wskey(
        key=key,
        secret=secret,
        options={'services': ['WorldCatDiscoveryAPI']})

    # Get an access token
    access_token = my_wskey.get_access_token_with_client_credentials(
        authenticating_institution_id=authenticating_institution_id,
        context_institution_id=context_institution_id
    )

    if (access_token.access_token_string == None):
        raise AuthenticationError(
            code=access_token.error_code,
            msg=access_token.error_message,
            url=access_token.url
        )

    return access_token


