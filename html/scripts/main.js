var entityTypes = {
  personal: 'People',
  corporate: 'Organizations',
  geographic: 'Places',
  subject: 'Topics',
  uniformtitlework: 'Works',
  uniformtitleexpression: 'Expressions',
}

var filterResponse = function(response) {
  var ret_array = [];
  var entities = {};
  for (var i=0; i<response.result.length; i++) {
    var nameType = entityTypes[response.result[i].nametype];
    var term = response.result[i].term;
    if (entities[nameType] !== 'undefined') {
      if (!entities[nameType]) {
        entities[nameType] = [];
      }
      entities[nameType].push(term);
    }
  }
  for (key in entities) {
    for (var i=0; i<entities[key].length; i++) {
      var hidden = 'hidden'
      if (i == 0) {
        hidden = ''
      }
      ret_array.push({value: entities[key][i], nameType: key, hideHeader: hidden});
    }
  }
  return ret_array;
};


$(document).ready(function() {

  var suggestEngine = new Bloodhound({
    name: 'identities',
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      ajax: {dataType: 'jsonp'},
      url: 'http://viaf.org/viaf/AutoSuggest?query=%QUERY',
      filter: filterResponse
    }
  });
 
  // kicks off the loading/processing of `local` and `prefetch`
  suggestEngine.initialize();
 
  $('#typeahead .search-input').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  },
  {
    name: 'indentities',
    displayKey: 'value',
    source: suggestEngine.ttAdapter(),
    templates: {
      suggestion: Handlebars.compile('<h3 class="{{hideHeader}}">{{nametype}}</h3><span class="term">{{value}}</span>')
    }
  });
});