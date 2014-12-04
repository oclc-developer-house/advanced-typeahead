/*Settings*/
var settings = {
  SUBJECTS_REQUEST_URL: 'http://localhost:8000/discovery/subjects',
  SUBJECTS_QUERY_PARAM: 'q'
}

/*Utility Functions*/

var getUrlParam = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


/*Templates*/
var templates = {
  suggestion: '<h3 class="{{hideHeader}}">{{nameType}}</h3><div class="term">{{value}}</div>',
  result: '<span class="result"><a href="{{id}}">{{label}}</a></span>'
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
    if (query) {
      $(selectors.searchbox).val(query);
    }
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
        $(selectors.results).html('<div>Oops, there was an error retrieving data from the server!</div>');
      },
      success: this.render
    });
  },

  render: function(data) {
    $(selectors.results).html('');
    var results_template = Handlebars.compile(templates.result);
    $.each(data.subjects, function(i, subject) {
      var context = {'id': subject.id, 'label': subject.label};
      $(selectors.results).append(results_template(context));
    });
  }
}


/*And document ready...*/
$(document).ready(function() {
  /*First get the query, if there is one.*/
  var query = getUrlParam('q');
  searchBoxView.initialize();
  searchBoxView.render(query);
  resultView.initialize();
  if (query) {
    resultView.getData(query);
  }
});