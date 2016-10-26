var fns = {};

/**
 * DATA TYPES CODE MAP
 */
fns.dataTypesMap = {
  "VARCHAR": 100,
  "BIT": 101,
  "INTEGER": 102,
  "DATE":  103,
  "DATETIME":  104,
  "TIME":  105,
  "XML": 106
};

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
  fns._code.push(1000, tokenId, 1001);
  fns._consume("SEMICOLON");
}

// <create table>::= "create" "table" <identificador> "(" <elementos tabla> ")"  ";"
fns.createTableCommand = function() {
  fns._consume("TABLE");
  var token = fns._consume("IDENTIFIER");
  var tokenId = fns._getSymbol(token);
  fns._consume("LEFT_PARENTHESIS");
  fns._code.push(2000, tokenId);
  fns.tableElements();
  fns.constraintsList();
  fns._consume("RIGHT_PARENTHESIS");
  fns._consume("SEMICOLON");
  fns._code.push(2010);
}

// <select command> ::= "SELECT" <values selected> "from" <listado identificadores> <condicionales> ";"
fns.selectCommand = function() {
  fns._consume("SELECT");
  fns._code.push(5000);
  fns.valuesSelected();
  fns._consume("FROM");
  fns.identifiersList();
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
  fns.valuesList();
  fns._consume("RIGHT_PARENTHESIS");
  fns._consume("SEMICOLON");
  fns._code.push(3001);
}

fns.tableElements = function() {
  fns._code.push(2001);
  fns.tableElementsEntry();
  fns._code.push(2007);
}

fns.tableElementsEntry = function() {
  if(fns._expect("IDENTIFIER")) {
    fns.columna();
    fns.tableElementsEntryPrime();
  }
}

// <elementos tabla prima> ::= lambda | "," <elemento tabla> <elementos tabla prima>
fns.tableElementsEntryPrime = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.tableElementsEntry();
  }
}

// <columna> ::= <identificador> <tipo datos> <seccion varios>
fns.columna = function() {
  var token = fns._consume("IDENTIFIER");
  var tokenId = fns._getSymbol(token);

  fns._code.push(2002, tokenId);

  if(fns._expect("VARCHAR")) {
    fns._consume("VARCHAR");
    fns._code.push(100);
    if(fns._expect("LEFT_PARENTHESIS")) {
      fns._consume("LEFT_PARENTHESIS");
      var number = fns._consume("NUMBER");
      fns._consume("RIGHT_PARENTHESIS");
      var numberId = fns._getSymbol(number);
      fns._code.push(numberId);
    }
    else {
      // default condition LENGTH is 1
      fns._code.push(1);
    }
  }
  else if(fns._expect("DATA_TYPE")) {
    var typeToken = fns._consume("DATA_TYPE");
    fns._code.push(fns.dataTypesMap[typeToken.value])
  }

  fns.inlineConstraint();

  fns._code.push(2006);
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
  fns._code.push(151);
}

fns.UQ = function(){
  fns._consume("UNIQUE");
  fns._code.push(154);
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
  fns._code.push(152, tableNameId, fieldNameId, 153);
}

fns.NN = function(){
  fns._consume("NOT");
  fns._consume("NULL");
  fns._code.push(150);
}

fns.constraintsList = function() {
  fns._code.push(2008);
  fns.constraintsListEntry();
  fns._code.push(2009);
}

fns.constraintsListEntry = function() {
  if(fns._expect("PRIMARY") || fns._expect("FOREIGN") || fns._expect("UNIQUE") || fns._expect("CHECK")) {
    fns._code.push(2101);
    fns.constraint();
    fns._code.push(2102);
    fns.constraintsListEntryPrime();
  }
}

fns.constraintsListEntryPrime = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.constraintsListEntry();
  }
}

// <restriccion> ::= <primary key> | <foreign key> | <unique key> | <check constraint>
fns.constraint = function() {
  if(fns._expect("PRIMARY")) {
    fns.primaryKeyConstraint();
  }
  else if(fns._expect("FOREIGN")) {
    fns.foreignKeyConstraint();
  }
  else if(fns._expect("UNIQUE")) {
    fns.uniqueKeyConstraint();
  }
  else if(fns._expect("CHECK")) {
    fns.checkConstraint();
  }
}

//<primary key>::= <PK> "(" <listado identificadores>  ")"
fns.primaryKeyConstraint = function() {
  fns.PK();
  fns._code.push(2103);
  fns._consume("LEFT_PARENTHESIS");
  fns.identifiersList();
  fns._consume("RIGHT_PARENTHESIS");
  fns._code.push(2104);
}

// <unique key> ::= <UQ> "(" <listado identificadores>  ")"
fns.uniqueKeyConstraint = function(){
  fns.UQ();
  fns._code.push(2107);
  fns._consume("LEFT_PARENTHESIS");
  fns.identifiersList();
  fns._consume("RIGHT_PARENTHESIS");
  fns._code.push(2108);
}

//<check_constraint> ::= "check" <identificador> <operador relacional>  <value literal>
fns.checkConstraint = function() {
  fns._consume("CHECK");
  fns._code.push(156, 2109);
  var fieldName = fns._consume("IDENTIFIER");
  var fieldNameId = fns._getSymbol(fieldName);
  fns._code.push(fieldNameId);
  fns.relational_operator();
  fns.value_literal();
  fns._code.push(2110);
}

// <foreign Key>::=  "foreign" "key" "(" <listado identificadores>  ")" "references" <identificador> "(" <listado identificadores>  ")"
fns.foreignKeyConstraint = function() {
  fns._consume("FOREIGN");
  fns._consume("KEY");
  fns._code.push(2105);
  if(fns._expect("LEFT_PARENTHESIS")) {
    fns._consume("LEFT_PARENTHESIS");
    fns.identifiersList();
    fns._consume("RIGHT_PARENTHESIS");
  }
  fns._consume("REFERENCES");
  var tableName = fns._consume("IDENTIFIER");
  var tableNameId = fns._getSymbol(tableName);
  fns._code.push(tableNameId);
  fns._consume("LEFT_PARENTHESIS");
  fns.identifiersList();
  fns._consume("RIGHT_PARENTHESIS");
  fns._code.push(2106);
}

fns.identifiersList = function() {
  fns._code.push(2502);
  fns.identifiersListEntry();
  fns._code.push(2503);
}

fns.identifiersListEntry = function() {
  if(fns._expect("IDENTIFIER")) {
    fns.identifier();
    fns.identifiersListEntryPrime();
  }
  else {
    throw new Error("must provide one or more identifiers");
  }
}

fns.identifiersListEntryPrime = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.identifiersListEntry();
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

// valores*
fns.valuesList = function() {
  fns._code.push(2500);
  fns.valuesListEntry();
  fns._code.push(2501);
}

// <listado valores> ::= <valor> <listado valores prima>
fns.valuesListEntry = function() {
  fns.value_literal();
  fns.valuesListEntryPrime();
}

// <listado valores prima> ::= lambda | "," <valor> <listado valores prima>
fns.valuesListEntryPrime = function() {
  if(fns._expect("COMMA")) {
    fns._consume("COMMA");
    fns.valuesListEntry();
  }
}

// <values selected> ::= <asterisco> | <listado identificadores>
fns.valuesSelected = function() {
  if(fns._expect("ASTERISK")) {
    fns._consume("ASTERISK");
    fns._code.push(2504);
  }
  else if(fns._expect("IDENTIFIER")) {
    fns.identifiersList();
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

window.SQL_Fns = fns;
