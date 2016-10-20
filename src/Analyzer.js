/**
 * Analyzer
 */
var Analyzer = {

  rules: [],

  tokenize: function(input) {
    input = input.replace(/^\s+/, '');
    var results = [];
    var match;
    do {

      try {
        match = this.matchPrefix(input);
        input = input.substring(match.value.length).replace(/^\s+/, '');
        results.push(match);
      } catch(error) {
        break;
      }

    } while(match && input.length > 0);

    return results;
  },

  matchPrefix: function(input) {
    var longestMatch = {
      id: null,
      value: ""
    };

    for(var i = 0; i < this.rules.length; i++) {
      var rule = this.rules[i];
      var match = input.match(rule.pattern);
      if(!match) continue;
      var lexeme = match.shift();
      if(lexeme.length > longestMatch.value.length) {
        longestMatch.value = lexeme;
        longestMatch.id = rule.id;
      }
    }

    if(!longestMatch.id) {
      throw new Error(`no matching rule for input: ${input}`);
    }

    return longestMatch;

  }

};

window.Analyzer = Analyzer;
