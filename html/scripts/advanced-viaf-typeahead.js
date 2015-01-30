/*
advanced-viaf-typeahead.js

jQuery plugin that adds an "advanced" VIAF typeahead to a text input
form field, which groups returned VIAF headings by entity type.

Requirements:

typeahead.js
handlebars.js

*/

(function($) {
  /*entityTypes maps from the nametype contained in the VIAF response to
  a more readable entity type.
  */
  var entityTypes = {
    personal: 'People',
    corporate: 'Organizations',
    geographic: 'Places',
    subject: 'Topics',
    uniformtitlework: 'Works',
    uniformtitleexpression: 'Expressions',
  }

  var defaultSuggestTemplate = '<h3 class="{{hideHeader}}">{{nameType}}</h3><div class="term">{{value}}</div>';

  /*
  filterResponse is our function that filters the response from VIAF
  and puts it into a data structure to be sent to the typeahead template.
  In this case it groups response results by entity type before adding
  them to the return array that feeds the typeahead dropdown.
  */
  var filterResponse = function(response) {
    var ret_array = [];
    var entities = {};
    // we only return anything if we got something in the response
    if (response.result !== null) {
      // first loop through the response and group terms by entities
      $.each(response.result, function(i, result) {
        var nameType = entityTypes[result.nametype];
        var term = result.term;
        if (entities[nameType] !== 'undefined') {
          if (!entities[nameType]) {
            entities[nameType] = [];
          }
          // basic deduping
          if ($.inArray(term, entities[nameType]) == -1) {
            entities[nameType].push(term);
          }
        }
      });
      // now append grouped terms to the return array
      for (key in entities) {
        $.each(entities[key], function(i, term) {
          // make sure we hide the entity type header if this isn't the first
          // result in the group
          var hidden = i == 0 ? '' : 'hidden';
          ret_array.push({value: term, nameType: key, hideHeader: hidden});
        });
      }
    }
    return ret_array;
  }

  $.fn.advancedViafTypeahead = function(options) {
    var settings = $.extend({
      /* max limit is 10 items at a time because that's all we can get
      from VIAF */
      limit: 10,
      hint: true,
      highlight: false,
      minLength: 3,
      name: 'entities',
      templates: {
        suggestion: Handlebars.compile(defaultSuggestTemplate)
      }
    }, options);

    /*suggestEngine is our Bloodhound typeahead suggestion object, which
    serves as the typeahead data source*/
    var suggestEngine = new Bloodhound({
      name: settings.name,
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      limit: settings.limit,
      remote: {
        ajax: {dataType: 'jsonp'},
        url: 'http://viaf.org/viaf/AutoSuggest?query=%QUERY',
        filter: filterResponse
      }
    });

    suggestEngine.initialize();    

    this.typeahead({
      hint: settings.hint,
      minLength: settings.minLength
    },
    {
      name: settings.name,
      displayKey: 'value',
      source: suggestEngine.ttAdapter(),
      templates: settings.templates
    });

    return this;
  }
}(jQuery));