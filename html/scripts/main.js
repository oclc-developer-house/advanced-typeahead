/*Settings*/
var settings = {
  SUBJECTS_REQUEST_URL: 'http://localhost:8000/discovery/subjects',
  SUBJECTS_QUERY_PARAM: 'q'
}

/*Utility Functions*/

// getUrlParam gets a named URL parameter from the query string and returns the value
var getUrlParam = function(name) {
  var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

// guessEntityType takes a URI for a subject returned from the OCLC dapi and
// returns a string representing the entity type, or the source of the URI.
// URIs like this:
// http://experiment.worldcat.org/entity/work/data/433936#Topic/authors_american_20th_century
// have the entity type embedded in a place that can be extracted.
var guessEntityType = function(uri) {
  etype = '';
  sources = {
    fast: 'http://id.worldcat.org/fast/',
    loc: 'http://id.loc.gov/authorities/subjects/',
    viaf: 'http://viaf.org/viaf/'
  }
  var match = RegExp('#([A-Z][A-Za-z]+)/').exec(uri);
  if (match !== null && match && match[1]) {
    etype = match[1].toLowerCase()
  } else {
    for (key in sources) {
      if (RegExp(sources[key]).exec(uri)) {
        etype = key;
        break;
      }
    }
  }
  return etype;
}


/*Templates*/
var templates = {
  suggestion: '<h3 class="{{hideHeader}}">{{nameType}}</h3><div class="term">{{value}}</div>',
  result: '<span class="result {{type}}"><a href="{{id}}">{{label}}</a></span>',
  loading: '<div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuenow="45" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Loading</div></div>',
  err: '<div>Oops, there was an error retrieving data from the server!</div>',
  noresults: '<div>Sorry, no results were found for the query <span class="query">{{query}}</span>.</div>'
}


/*View Logic*/

var selectors = {
  searchform: '#typeahead',
  searchbox: '#typeahead .search-input',
  searchvalue: '#typeahead .search-input.tt-input',
  results: '#results'
}

// searchBoxView--not really a view
var searchBoxView = {

  initialize: function() {
    $(selectors.searchform).on('submit', this.search);
  },

  renderValue: function(query) {
    $(selectors.searchbox).val(query);
  },

  renderTypeahead: function() {
    $(selectors.searchbox).advancedViafTypeahead({
      templates: {
        suggestion: Handlebars.compile(templates.suggestion)
      }  
    });
  },

  render: function(query) {
    this.renderValue(query);
    this.renderTypeahead();
  },

  search: function(ev) {
    ev.preventDefault();
    var query = $(selectors.searchvalue).val();
    history.pushState({}, '', '?q=' + query);
    $(selectors.searchbox).typeahead('close');
  },
}

// result view
var resultView = {
  initialize: function() {
    $(selectors.searchform).on('submit', {view: this}, this.submitHandler);
  },

  submitHandler: function(ev) {
    var view = ev.data.view;
    var query = $(selectors.searchvalue).val();
    view.renderLoadingSpinner();
    view.getData(query);
  },

  getData: function(query) {
    var url = settings.SUBJECTS_REQUEST_URL + '?' + settings.SUBJECTS_QUERY_PARAM + '=' + query;
    $.ajax({
      url: url,
      type: 'GET',
      datatype: 'json',
      cache: true,
      error: function(jqXHR, textStatus, errorThrown) {
        $(selectors.results).html(templates.err);
      },
      success: this.render
    });
  },

  renderLoadingSpinner: function() {
    $(selectors.results).html(templates.loading);
  },

  render: function(data) {
    resultView.clearView();
    var results_template = Handlebars.compile(templates.result);
    $.each(data.subjects, function(i, subject) {
      var entity_type = guessEntityType(subject.id);
      var context = {'id': subject.id, 'label': subject.label, 'type': entity_type};
      $(selectors.results).append(results_template(context));
    });
    if (data.subjects.length == 0) {
      var noresults_template = Handlebars.compile(templates.noresults);
      var query = $(selectors.searchvalue).val();
      $(selectors.results).append(noresults_template({'query': query}));
    }
  },

  clearView: function() {
    $(selectors.results).html('');
  }
}

/*And document ready...*/
$(document).ready(function() {
  //First get the query, if there is one.
  var query = getUrlParam('q');
  //Then initialize and render the views.
  searchBoxView.initialize();
  searchBoxView.render(query);
  resultView.initialize();
  if (query) {
    resultView.submitHandler({data: {view: resultView}});
  }

  // make sure we rebuild the page on browser navigation
  $(window).bind("popstate", function (ev) {
    var query = getUrlParam('q');
    searchBoxView.renderValue(query);
    if (query) {
      resultView.submitHandler({data: {view: resultView}});
    } else {
      resultView.clearView();
    }
  });
});