function lex_test(input){

	var output ="";
	document.getElementById("lex-output").innerHTML= output;
	try{
		console.log("input: "+input);
		var result = lex(input);
		var tokens = result.tokens;
		console.log("tokens");
		console.log(tokens);
	    var symbols_table = syntactic(tokens);
		var intermediate_code = getIntermediateCode();
	}
	catch(error){
		document.getElementById("result-text").className = "red-text darken-2";
		document.getElementById("result-text").innerHTML = error;
		return;
	}

	var niceXML = vkbeautify.xml('<databases></databases>', 4);
	document.getElementById("xml").innerHTML = niceXML;


	document.getElementById("result-text").className = "blue-text text-darken-2";
	document.getElementById("result-text").innerHTML = "Procesamiento correcto";

    output += "-------------------------------------------------<br>";
    output += "           Lexical Analizer<br>";
    output += "-------------------------------------------------<br>";
	for(i in tokens){
		output += JSON.stringify(tokens[i]) + "<br>";
	}
	output += "-------------------------------------------------<br>";
	output += "Errors: "+result.number_errors+"<br>";

	for(i in result.errors){
		output += JSON.stringify(result.errors[i]) + "<br>";
	}
    output += "-------------------------------------------------<br>";
    output += "Syntactic Analizer<br>";
    output += "-------------------------------------------------<br>";
    for(i in symbols_table){
        output += JSON.stringify(symbols_table[i]) + "<br>";
    }
	output += "-------------------------------------------------<br>";
	output += "Intermediate Code<br>";
	output += "-------------------------------------------------<br>";
	for(i in intermediate_code){
		output += JSON.stringify(intermediate_code[i]) + "<br>";
	}

	document.getElementById("lex-output").innerHTML= output;

	//output of xml
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	    readXml(this);
	    }
	};
	xhttp.open("GET", "databases.xml", true);
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
    db = writeCreateDatabase('manolo',xmlDoc);
    databases.appendChild(db);


    var uglyXML = new XMLSerializer().serializeToString(databases);
    var niceXML = vkbeautify.xml(uglyXML, 4);
    console.log(niceXML);
    document.getElementById("xml").innerHTML = niceXML;
}


/**
 * @name writeCreateDatabase
 * @description
 * # function that create a new database in xml format
 * @param {string} dbName Name of the new database
 * @param {xml.responseXML} xmlDoc xml to access the XML DOM
 * @returns {xml} new database in xml format
 */
function writeCreateDatabase(dbName, xmlDoc){

	var db = xmlDoc.createElement('database');
	var genInfo = xmlDoc.createElement('general_information');
	var name = xmlDoc.createTextNode(dbName);
	var dbName = xmlDoc.createElement('name_database');
	var tables = xmlDoc.createElement('tables');

	dbName.appendChild(name);
	genInfo.appendChild(dbName);
	db.appendChild(genInfo);
	db.appendChild(tables);

	return db;	
}


/**
 * @name writeCreateTable
 * @description
 * # function that create a new table in xml format
 * @param {string} dbName Name of the database where table will be created
 * @param {string} tableName Name of the table that will be created
 * @param {array} fileds array containing data of fields
 * @param {object} field object containing data of field
 * @param {string} field.name name of field
 * @param {string} field.dataType dataType of field
 * @param {object} field.constraint object containing details of constraint
 * @param {xml.responseXML} xmlDoc xml to access the XML DOM
 * @returns {xml} new database in xml format
 */
function writeCreateTable(dbName, tableName, fields, xmlDoc){
	var db = xmlDoc.getElementsByTagName(dbName)[0];
	var ammount = xmlDoc.createElement('ammount-field');
	var fields = xmlDoc.createElement('fields');



}


constraint={
	nn:0
}

function writeCreateField(tableName, fieldName, 
	dataType, constraint){
	
	var table = xmlDoc.getElementsByTagName(tableName)[0];
	var fields = table.getAttribute('fields');
	var field = xmlDoc.createElement(fieldName);
	var type = xmlDoc.createElement(dataType);
	var constraints = xmlDoc.createElement('constraints');

}