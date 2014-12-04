/*Utility Functions*/

var getUrlParam = function(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}


/*Templates*/
var templates = {
  suggestion: '<h3 class="{{hideHeader}}">{{nameType}}</h3><div class="term">{{value}}</div>',
}


/*View Logic*/

// searchBoxView--not really a view
var searchBoxView = {
  selectors: {
    searchform: '#typeahead',
    searchbox: '#typeahead .search-input',
    searchvalue: '#typeahead .search-input.tt-input'
  },

  initialize: function() {
    $(this.selectors.searchform).on('submit', {view: this}, this.search);
  },

  renderValue: function(query) {
    if (query) {
      $(this.selectors.searchbox).val(query);
    }
  },

  renderTypeahead: function() {
    $(this.selectors.searchbox).advancedViafTypeahead({
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
    var view = ev.data.view;
    var query = $(view.selectors.searchvalue).val();
    history.pushState({}, '', '?q=' + query);
    $(view.selectors.searchbox).typeahead('close');
  },
}

// result view
var resultView = {
  selector: '#result',

  render: function() {

  }
}


/*And document ready...*/
$(document).ready(function() {
  /*First get the query, if there is one.*/
  var query = getUrlParam('q');
  searchBoxView.initialize();
  searchBoxView.render(query);
});