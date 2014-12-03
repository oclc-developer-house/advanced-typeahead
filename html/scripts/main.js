/*entityTypes maps from the nametype contained in the VIAF response to
a more presentable entity type.
*/
var entityTypes = {
  personal: 'People',
  corporate: 'Organizations',
  geographic: 'Places',
  subject: 'Topics',
  uniformtitlework: 'Works',
  uniformtitleexpression: 'Expressions',
}

/*
filterResponse is our function that filters the response from VIAF
and puts it into a data structure to be sent to the typeahead template.
In this case it groups response results by entity type before adding
them to the return array that feeds the typeahead dropdown.
*/
var filterResponse = function(response) {
  var ret_array = [];
  var entities = {};
  if (response.result !== null) {
    $.each(response.result, function(i, result) {
      var nameType = entityTypes[result.nametype];
      var term = result.term;
      if (entities[nameType] !== 'undefined') {
       if (!entities[nameType]) {
          entities[nameType] = [];
        }
        entities[nameType].push(term);
      }
    });
    for (key in entities) {
      $.each(entities[key], function(i, term) {
        var hidden = 'hidden'
        if (i == 0) {
          hidden = ''
        }
        ret_array.push({value: term, nameType: key, hideHeader: hidden});
      });
    }
  }
  return ret_array;
};

/*suggestEngine is our Bloodhound typeahead suggestion object, which
servers as the typeahead data source*/
var suggestEngine = new Bloodhound({
  name: 'identities',
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  /* limit to 10 items at a time because that's all we can get
  from VIAF */
  limit: 10,
  remote: {
    ajax: {dataType: 'jsonp'},
    url: 'http://viaf.org/viaf/AutoSuggest?query=%QUERY',
    filter: filterResponse
  }
});


//jquery document ready function
$(document).ready(function() {
  suggestEngine.initialize();
 
  $('#typeahead .search-input').typeahead({
    hint: true,
    minLength: 3
  },
  {
    name: 'indentities',
    displayKey: 'value',
    source: suggestEngine.ttAdapter(),
    templates: {
      suggestion: Handlebars.compile('<h3 class="{{hideHeader}}">{{nameType}}</h3><div class="term">{{value}}</div>')
    }
  });
});