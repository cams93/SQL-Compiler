var fns = {};

/**
 * ENTRY POINT FOR GRAMMAR
 */
fns.init = function() {
  if(fns._expect("CREATE")) {
    return fns.createCommand();
  }
  else if (fns._expect("INSERT")) {
    return fns.insertCommand();
  }
  else if (fns._expect("SELECT")) {
    return fns.selectCommand();
  }
  else {
    throw new Error("Invalid command");
  }
}

fns.createCommand = function() {
  fns._consume("CREATE");
  if(fns._expect("DATABASE")) {
    fns.createDBCommand();
  }
  else if (fns._expect("TABLE")) {
    fns.createTableCommand();
  }
  else {
    throw new Error("error: expected 'database' or 'table'");
  }
}


fns.createDBCommand = function() {
  fns._consume("DATABASE");
  var token = fns._consume("IDENTIFIER");
  var tokenId = fns._getSymbol(token);
  fns._code.push(1000, tokenId,1001);
  fns._consume("SEMICOLON");
}

fns.createTableCommand = function() {
  fns._consume("TABLE");
  var token = fns._consume("IDENTIFIER");
  var tokenId = fns._getSymbol(token);
  fns._consume("LEFT_PARENTHESIS");
  // INSERT CODIGO INTERMEDIO DE CREATE_TABLE aqui
  fns._code.push(2000, tokenId, 2001,2002);
  fns.elementos_tabla();
  fns._consume("RIGHT_PARENTHESIS");
  fns._consume("SEMICOLON");
}

// <select command> ::= "SELECT" <values selected> "from" <listado identificadores> <condicionales> ";"
fns.selectCommand = function() {
  fns._consume("SELECT");
  fns._code.push(5000);
  // INSERT CODIGO INTERMEDIO DE SELECT aqui
  fns.values_selected();
  fns._consume("FROM");
  fns.listado_identificadores();
  if(fns._expect("WHERE")) {
    fns.conditionals();
  }
  fns._consume("SEMICOLON");
  fns._code.push(5001);
}

// <insert command> ::= "INSERT" "INTO" <identificador> "VALUES" "(" <listado valores>  ")" ";"
fns.insertCommand = function(){
  fns._consume("INSERT");
  fns._consume("INTO");
  var tableName = fns._consume("IDENTIFIER");
  var tableNameId = fns._getSymbol(tableName);
  fns._code.push(3000, tableNameId);
  fns._consume("VALUES");
  fns._consume("LEFT_PARENTHESIS");
  fns.listado_valores();
  fns._consume("RIGHT_PARENTHESIS");
  fns._consume("SEMICOLON");
  fns._code.push(3001);
}

fns.elementos_tabla = function() {
  if(fns._expect("IDENTIFIER")) {
    fns.columna();
    fns.elementos_tabla_prima();
  }
  else {
    fn.constraint();
  }
}

// <elementos tabla prima> ::= lambda | "," <elemento tabla> <elementos tabla prima>
fns.elementos_tabla_prima = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.elementos_tabla();
  }
}

// <columna> ::= <identificador> <tipo datos> <seccion varios>
fns.columna = function() {
  var token = fns._consume("IDENTIFIER");
  var symbolId = fns._getSymbol(token);

  if(fns._expect("VARCHAR")) {
    fns._consume("VARCHAR");
    if(fns._expect("LEFT_PARENTHESIS")) {
      fns._consume("LEFT_PARENTHESIS");
      var number = fns._consume("NUMBER");
      fns._consume("RIGHT_PARENTHESIS");
    }
  }
  else if(fns._expect("DATA_TYPE")) {
    var type = fns._consume("DATA_TYPE");
  }

  fns.inlineConstraint();
  // INSERTAR CODIGO INTERMEDIO CREAR CAMPO AQUI
}

fns.inlineConstraint = function() {
  if(fns._expect("PRIMARY")) {
    fns.PK();
  }
  else if(fns._expect("NOT")) {
    fns.NN();
  }
  else if(fns._expect("UNIQUE")) {
    fns.UQ();
  }
  else if(fns._expect("REFERENCES")) {
    fns.REFERENCES();
  }
}

fns.PK = function() {
  fns._consume("PRIMARY");
  fns._consume("KEY");
  // INSERTAR CODIGO INTERMEDIO PRIMARY KEY AQUI
}

fns.UQ = function(){
  fns._consume("UNIQUE");
  // INSERTAR CODIGO INTERMEDIO UNIQUE AQUI
}

// <FK> ::= "references" <identificador> "(" <identificador> ")"
fns.REFERENCES = function() {
  fns._consume("REFERENCES");
  var tableName = fns._consume("IDENTIFIER");
  var tableNameId = fns._getSymbol(tableName);
  fns._consume("LEFT_PARENTHESIS");
  var fieldName = fns._consume("IDENTIFIER");
  var fieldNameId = fns._getSymbol(fieldName);
  fns._consume("RIGHT_PARENTHESIS");

  // INSERTAR CODIGO INTERMEDIO REFERENCES AQUI
}

fns.NN = function(){
  fns._consume("NOT");
  fns._consume("NULL");
  // INSERTAR CODIGO INTERMEDIO NOT NULL AQUI
}

// <restriccion> ::= <primary key> | <foreign key> | <unique key> | <check constraint>
fns.constraint = function() {
  if(fns._expect("PRIMARY")) {
    fns.primary_key();
  }
  else if(fns._expect("FOREIGN")) {
    fns.foreign_key();
  }
  else if(fns._expect("UNIQUE")) {
    fns.unique_key();
  }
  else if(fns._expect("CHECK")) {
    fns.check_constraint();
  }
}

//<primary key>::= <PK> "(" <listado identificadores>  ")"
fns.primary_key = function() {
  fns.PK();
  fns._consume("LEFT_PARENTHESIS");
  fns.listado_identificadores();
  fns._consume("RIGHT_PARENTHESIS");
  // INSERTAR CODIGO INTERMEDIO PRIMARY KEY AQUI
}

// <unique key> ::= <UQ> "(" <listado identificadores>  ")"
fns.unique_key = function(){
  fns.UQ();
  fns._consume("LEFT_PARENTHESIS");
  fns.listado_identificadores();
  fns._consume("RIGHT_PARENTHESIS");
  // INSERTAR CODIGO INTERMEDIO UNIQUE KEY AQUI
}

//<check_constraint> ::= "check" <identificador> <operador relacional>  <value literal>
fns.check_constraint = function() {
  fns._consume("CHECK");
  var fieldName = fns._consume("IDENTIFIER");
  var fieldNameId = fns._getSymbol(fieldName);
  fns.relational_operator();
  fns.value_literal();
}

// <foreign Key>::=  "foreign" "key" "(" <listado identificadores>  ")" "references" <identificador> "(" <listado identificadores>  ")"
fns.FOREIGN_KEY = function() {
  fns._consume("FOREIGN");
  fns._consume("KEY");
  if(fns_._expect("LEFT_PARENTHESIS")) {
    fns._consume("LEFT_PARENTHESIS");
    fns.listado_identificadores();
    fns._consume("RIGHT_PARENTHESIS");
  }
  fns._consume("REFERENCES");
  var tableName = fns._consume("IDENTIFIER");
  var tableNameId = fns._getSymbol(tableName);
  fns._consume("LEFT_PARENTHESIS");
  fns.listado_identificadores();
  fns._consume("RIGHT_PARENTHESIS");
  // INSERTAR CODIGO INTERMEDIO FOREIGN KEY AQUI
}

fns.listado_identificadores = function() {
  fns._code.push(2502);
  fns.listado_identificadores_entry();
  fns._code.push(2503);
}

fns.listado_identificadores_entry = function() {
  if(fns._expect("IDENTIFIER")) {
    fns.identifier();
    fns.listado_identificadores_prima();
  }
  else {
    throw new Error("must provide one or more identifiers");
  }
}

fns.listado_identificadores_prima = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.listado_identificadores_entry();
  }
}

fns.identifier = function() {
  var token = fns._consume("IDENTIFIER");
  var symbolId = fns._getSymbol(token);
  fns._code.push(symbolId);
}

// <operador relacional> ::= "<" | "<=" | ">" | ">=" | "==" | "!="
fns.relational_operator = function() {
  if(fns._expect("LESS_THAN")) {
    fns.lessThan();
  }
  else if(fns._expect("LESS_THAN_EQUALS")) {
    fns.lessThanEqual();
  }
  else if(fns._expect("MORE_THAN")) {
    fns.moreThan();
  }
  else if(fns._expect("MORE_THAN_EQUALS")) {
    fns.moreThanEqual();
  }
  else if(fns._expect("EQUALS")) {
    fns.equals();
  }
  else if(fns._expect("NOT_EQUAL")) {
    fns.notEquals();
  }
  else {
    throw new Error("expected relational operator");
  }
}

// <
fns.lessThan = function() {
  fns._consume("LESS_THAN");
  fns._code.push(110);
}

// <=
fns.lessThanEqual = function() {
  fns._consume("LESS_THAN_EQUALS");
  fns._code.push(113);
}

// >
fns.moreThan = function() {
  fns._consume("MORE_THAN");
  fns._code.push(111);
}

// >=
fns.moreThanEqual = function() {
  fns._consume("MORE_THAN_EQUALS");
  fns._code.push(114);
}

// ==
fns.equals = function() {
  fns._consume("EQUALS");
  fns._code.push(112);
}

// !=
fns.notEquals = function() {
  fns._consume("NOT_EQUAL");
  fns._code.push(115);
}

fns.value_literal = function() {
  if(fns._expect("IDENTIFIER")) {
    fns.identifier();
  }
  else if(fns._expect("NUMBER")) {
    fns.number();
  }
  else if(fns._expect("STRING")) {
    fns.string();
  }
  else {
    throw new Error("expected value");
  }
}

fns.string = function() {
  var token = fns._consume("STRING");
  var symbolId = fns._getSymbol(token);
  fns._code.push(symbolId);
}

fns.number = function() {
  var token = fns._consume("NUMBER");
  var symbolId = fns._getSymbol(token);
  fns._code.push(symbolId);
}

fns.listado_valores = function() {
  fns._code.push(2500);
  fns.listado_valores_entry();
  fns._code.push(2501);
}

fns.listado_valores_entry = function() {
  fns.value_literal();
  fns.listado_valores_prima();
}

fns.listado_valores_prima = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.listado_valores_entry();
  }
}

fns.values_selected = function() {
  if(fns._expect("ASTERISK")) {
    fns._consume("ASTERISK");
    fns._code.push(2504);
  }
  else if(fns._expect("IDENTIFIER")) {
    fns.listado_identificadores();
  }
  else {
    throw new Error("expected * or one or more identifiers");
  }
}

// <condicionales> ::= lambda | "WHERE" <identificador> <operador relacional>  <value literal>
fns.conditionals = function() {
  fns._consume("WHERE");
  fns._code.push(3500);
  fns.identifier();
  fns.relational_operator();
  fns.value_literal();
  fns._code.push(3501);
}

window.SQL_Fns = fns;
