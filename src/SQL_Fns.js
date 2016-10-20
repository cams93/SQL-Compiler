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
  // INSERT CODIGO INTERMEDIO DE SELECT aqui
  fns.values_selected();
  listado_identificadores();
  fns.conditionals();
  fns._consume("SEMICOLON");
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
      var number = fns._consume("DIGITS");
      fns._consume("RIGHT_PARENTHESIS");
    }
  }
  else if(fns._expect("DATA_TYPE")) {
    var type = fns._consume("DATA_TYPE");
  }

  fns.inlineConstraint();

  // INSERTAR CODIGO INTERMEDIO CREAR CAMPO AQUI

  console.log("TYPE " + type);
  fns._code.push(symbolId);
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
    fns.listado_identificadores();
  }
}

fns.identifier = function() {
  var token = fns._consume("IDENTIFIER");
  var symbolId = fns._getSymbol(token);
  // INSERTAR CODIGO INTERMEDIO IDENTIFIER AQUI
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
  // INSERTAR CODIGO INTERMEDIO < AQUI
}

// <=
fns.lessThanEqual = function() {
  fns._consume("LESS_THAN_EQUALS");
  // INSERTAR CODIGO INTERMEDIO <= AQUI
}

// >
fns.moreThan = function() {
  fns._consume("MORE_THAN");
  // INSERTAR CODIGO INTERMEDIO > AQUI
}

// >=
fns.moreThanEqual = function() {
  fns._consume("MORE_THAN_EQUALS");
  // INSERTAR CODIGO INTERMEDIO >= AQUI
}

// ==
fns.equals = function() {
  fns._consume("EQUALS");
  // INSERTAR CODIGO INTERMEDIO == AQUI
}

// !=
fns.notEquals = function() {
  fns._consume("NOT_EQUAL");
  // INSERTAR CODIGO INTERMEDIO != AQUI
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
  // INSERTAR CODIGO INTERMEDIO STRING AQUI
  fns._code.push(symbolId);
}

fns.number = function() {
  var token = fns._consume("NUMBER");
  var symbolId = fns._getSymbol(token);
  // PARSEA EL VALOR DEL TOKEN
  var token = parseInt(token);
  // INSERTAR CODIGO INTERMEDIO NUMBER AQUI

  fns._code.push(symbolId);
}

fns.listado_valores = function() {
  fns.value_literal();
  fns.listado_valores_prima();
}

fns.listado_valores_prima = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.listado_valores();
  }
}

fns.values_selected = function() {
  if(fns._expect("ASTERISK")) {
    fns._consume("ASTERISK");
  }
  else if(fns._expect("IDENTIFIER")) {
    fns.listado_identificadores();
  }
  else {
    throw new Error("expected * or one or more identifiers");
  }
}

fns.conditionals = function() {
  if(fns._expect("WHERE")) {
    fns._consume("WHERE");
    // INSERT CODIGO INTERMEDIO DE CREATE_DB aqui
    fns.relational_operator();
    fns.value_literal();
  }
}

fns.insertCommand = function(){
  if(fns._expect("INSERT")){
    fns._consume("INSERT");
    if(fns._expect("INTO")){
      fns._consume("INTO");
      var tableName = fns._consume("IDENTIFIER");
      var tableNameId = fns._getSymbol(tableName);
      //insert intermediate code here
      fns._code.push(3000, tableNameId);
      if(fns._expect("VALUES")){
        fns._consume("VALUES");
        if(fns._expect("LEFT_PARENTHESIS")){
          fns._consume("LEFT_PARENTHESIS");
          fns._code.push(3007);
          fns.listado_valores();
          if(fns._expect("RIGHT_PARENTHESIS")){
            fns._consume("RIGHT_PARENTHESIS");
            fns._code.push(3008);
            if(fns._expect("SEMICOLON")){
              //insert intermediate code here
              fns._code.push(3001);
            }
          }
        }
      }
    }
  }
}




window.SQL_Fns = fns;


