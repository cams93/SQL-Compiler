// create instance of compiler lex module
var Analyzer_SQL = Object.create(Analyzer, {
  'rules': {
    name: 'rules',
    value: SQL_Lex
  }
});

// create instance of compiler parser module
var Parser_SQL = Object.create(Parser);
Parser_SQL.bindFunctions(SQL_Fns);

function lex_test(input) {

  // create instances of compiler modules
  var tokens = Analyzer_SQL.tokenize(input);
  Parser_SQL.parse(tokens);

  var output = "";
  document.getElementById("lex-output").innerHTML = output;
  try {
    console.log("input: " + input);
    console.log("tokens");
    console.log(tokens);
    // var symbols_table = syntactic(tokens);
    // var intermediate_code = getIntermediateCode();
  } catch (error) {
    document.getElementById("result-text").className = "red-text darken-2";
    document.getElementById("result-text").innerHTML = error;
    return;
  }

  vkbeautify.xml('<databases></databases>', 4);

  document.getElementById("result-text").className = "blue-text text-darken-2";
  document.getElementById("result-text").innerHTML = "Procesamiento correcto";

  output += "-------------------------------------------------<br>";
  output += "Lexical Analizer<br>";
  output += "-------------------------------------------------<br>";
  for (var i = 0; i < tokens.length; i++) {
    console.log('data');
    output += JSON.stringify(tokens[i]) + "<br>";
  }
  output += "-------------------------------------------------<br>";
  // output += "Errors: "+result.number_errors+"<br>";

  // for(i in result.errors){
  //  output += JSON.stringify(result.errors[i]) + "<br>";
  // }
  output += "-------------------------------------------------<br>";
  output += "Syntactic Analizer<br>";
  output += "-------------------------------------------------<br>";
  for (i in Parser_SQL.symbolsTable) {
    var key =  Parser_SQL.symbolsTable[i];
    var keyIndex = parseInt(key.replace('s',''),10);
    output += JSON.stringify(key) + " " + Parser_SQL.symbols[keyIndex] + "<br>";

  }

  output += "-------------------------------------------------<br>";
  output += "Intermediate Code<br>";
  output += "-------------------------------------------------<br>";
  for(i = 0; i < Parser_SQL.code.length; i++){
    output += JSON.stringify(Parser_SQL.code[i]) + "<br>";
  }

  var xmlDoc = document.implementation.createDocument(null,null,null);
  var databases = xmlDoc.createElement('databases');
  xmlDoc.appendChild(databases);

  for(i = 0; i < Parser_SQL.code.length; i++){
    switch(Parser_SQL.code[i]){
      //Create database
      case 1000:
        databases.appendChild(writeDatabase(Parser_SQL.code[++i]));
        break;
      case 1001:
        break;
    }
  }
  console.log(xmlDoc);
  document.getElementById("lex-output").innerHTML = output;

  //output of xml
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
      readXml(this);
      }
  };
  xhttp.open("GET", "docs/databases.xml", true);
  xhttp.send();
}


/**
 * @name readXml
 * @description
 * # recieves an xhttp response of an xml file
 * # in here is where all function that write directly to xml execute
 */

function readXml(xml) {
  var xmlDoc = xml.responseXML;
  var databases = xmlDoc.getElementsByTagName('databases')[0];



  //CREATE DATABASE MANOLO;
  //missing verification if that db already exists
  db = writeCreateDatabase('manolo', xmlDoc);
  databases.appendChild(db);


  var uglyXML = new XMLSerializer().serializeToString(databases);
  var niceXML = vkbeautify.xml(uglyXML, 4);
  console.log(niceXML);
  document.getElementById("xml").innerHTML = niceXML;
}

constraint = {
  nn: 0
};

function writeCreateField(tableName, fieldName,
  dataType, constraint) {

  var table = xmlDoc.getElementsByTagName(tableName)[0];
  var fields = table.getAttribute('fields');
  var field = xmlDoc.createElement(fieldName);
  var type = xmlDoc.createElement(dataType);
  var constraints = xmlDoc.createElement('constraints');

}

$(function() {
  $('#boton').click();
});
