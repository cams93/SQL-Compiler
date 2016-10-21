/**
 * Parser
 */
var Parser = {

  symbols: [],
  symbolsTable: {},
  fns: {},
  stream: [],
  code: [],
  pos: 0,

  bindFunctions: function(fns) {
    this.fns = fns;
    this.fns._expect = this.expect.bind(this);
    this.fns._consume = this.consume.bind(this);
    this.fns._getSymbol = this.getSymbol.bind(this);
    this.fns._code = this.code;
    this.fns._symbols = this.symbols;
    this.fns._symbolsTable = this.symbolsTable;
  },

  parse: function(stream) {
    this.stream = stream;
    this.pos = 0;
    this.symbols = [];
    this.code = [];
    this.symbolsTable = {};
    this.bindFunctions(this.fns);
    this.fns.init();
  },

  expect: function(id, throwError = false, debug = true) {
    var token = this.stream[this.pos];
    if(debug) console.log('CHECANDO', id, token);
    if(token) {
      if(token.id === id) {
        return token;
      }
      else {
        if(throwError) {
          throw new Error(`parsing error: unexpected token, expected ${id}`);
        }
      }
    }
    else {
      throw new Error("parsing error: no tokens left");
    }
  },

  consume: function(id, searhcInSymbols = false) {
    var result = this.expect(id, true, false);
    console.log('CONSUMIENDO', id);
    if(result) {
      this.pos += 1;
      if(searhcInSymbols) return this.getSymbol(result);
      return result;
    }
  },

  getSymbol: function(token) {
    if(this.symbolsTable.hasOwnProperty[token.value]) {
      return fns.symbolsTable[token.value];
    }
    else {
      var len = this.symbols.length;
      this.symbols.push(token.value);
      this.symbolsTable[token.value] = 's' + len;
      return this.symbolsTable[token.value];
    }
  }

};

window.Parser = Parser;
