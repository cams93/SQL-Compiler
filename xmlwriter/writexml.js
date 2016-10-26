/**
 * @name writeCreateDatabase
 * @description
 * # function that create a new database in xml format
 * @param {string} dbName Name of the new database
 * @returns {XML} new structure of xml
 */
function writeDatabase (dbName){
	var xmlDoc = document.implementation.createDocument(null,null,null);
	var db = xmlDoc.createElement('database');
	var genInfo = xmlDoc.createElement('general-information');
	var name = xmlDoc.createTextNode(dbName);
	var dbName1 = xmlDoc.createElement('name-database');
	var tables = xmlDoc.createElement('tables');

	dbName1.appendChild(name);
	genInfo.appendChild(dbName1);
	db.appendChild(genInfo);
	db.appendChild(tables);

	return db;
}

function saveDatabase(db, mainNode){
	mainNode.appendChild(db);
}


function getDatabase(dbName, mainNode){
	var dbs = mainNode.getElementsByTagName('database');
	for (var i = 0; i < dbs.length; i++) {
		var db = dbs[i].getElementsByTagName('name-database')[0];
		if(db.textContent === dbName){
			return dbs[i];
		}else {
			throw new Error('no database was found');
		}
	}

}
/**
 * @name writeCreateTable
 * @description
 * # function that create a new table in xml format
 * @param {string} tableName Name of the table that will be created
 * @returns {xml} new database in xml format
 */
function writeTable(tableName){

	var xmlDoc = document.implementation.createDocument(null,null,null);
	var table = xmlDoc.createElement('table');
	var genInfo = xmlDoc.createElement('general_information');
	table.appendChild(genInfo);
	//create name
	var nameTable = xmlDoc.createElement("name-table");
	var name = xmlDoc.createTextNode(tableName);
	nameTable.appendChild(name);
	genInfo.appendChild(nameTable);
	//ammount field
	var ammount = xmlDoc.createElement('ammount-field');
	var n = xmlDoc.createTextNode("0");
	ammount.appendChild(n);
	genInfo.appendChild(ammount);


	var fields = xmlDoc.createElement('fields');
	genInfo.appendChild(fields);

	var constraints = xmlDoc.createElement('constraints');
	genInfo.appendChild(constraints);
	return table;
}

/**
 * @name writeField
 * @description
 * # function that create a new field in xml format
 * @param {string} fieldName Name of the new field
 * @param {string} dataTyoe Name of the new dataType
 * @returns {xml} new field in xml format
 */
function writeField(fieldName, dataType) {
	var xmlDoc = document.implementation.createDocument(null,null,null);
	var field = xmlDoc.createElement('field');

	//field name
	var fName = xmlDoc.createElement('field-name');
	var name = xmlDoc.createTextNode(fieldName);
	fName.appendChild(name);

	//field datatype
	var fDataType = xmlDoc.createElement('data-type');
	var datatype = xmlDoc.createTextNode(dataType);
	fDataType.appendChild(datatype);

	//field constraint
	var constraints = xmlDoc.createElement('constraints');
	//var fConst = xmlDoc.createElement('constraint');
	field.appendChild(fName);
	field.appendChild(fDataType);
	field.appendChild(constraints);
	return field;
}

/**
 * @name writeNNConstraint
 * @description
 * # function that creates an NN constraint
 * @returns {xml} new constraint in xml format
 */
function writeNNConstraint(){
	var xmlDoc = document.implementation.createDocument(null,null,null);
	var constraint = xmlDoc.createElement('NN');
	return constraint;
}

/**
 * @name writePKConstraint
 * @description
 * # function that creates an PK constraint
 * @returns {xml} new constraint in xml format
 */
function writePKConstraint(){
	var xmlDoc = document.implementation.createDocument(null,null,null);
	var constraint = xmlDoc.createElement('PK');
	return constraint;
}

/**
 * @name writeUQConstraint
 * @description
 * # function that creates an UQ constraint
 * @returns {xml} new constraint in xml format
 */
function writeUQConstraint(){
	var xmlDoc = document.implementation.createDocument(null,null,null);
	return xmlDoc.createElement('UQ');
}

/**
 * @name writeFKConstraint
 * @description
 * # function that creates an FK constraint
 * @param {string} tableName Name of the foreing table
 * @param {string} fieldName Name of the foreing field
 * @returns {xml} new constraint in xml format
 */
function writeFKConstraint(tableName, fieldName){
	var xmlDoc = document.implementation.createDocument(null,null,null);
	var constraint = xmlDoc.createElement('FK');

	var tname = xmlDoc.createElement('table-name');
	var name = xmlDoc.createTextNode(tableName);
	tname.appendChild(name);

	var fname = xmlDoc.createElement('field-name');
	var fName = xmlDoc.createTextNode(fieldName);
	fname.appendChild(fName);
	constraint.appendChild(tname);
	constraint.appendChild(fname);
	return constraint;
}

/**
 * @name addTable
 * @description
 * # function that append a table object to db object
 * @param {xml} db xml object
 * @param {xml} table xml table
 */
function addTable(db, table){
	var a = db.getElementsByTagName('tables')[0];
	console.log(a);
	a.appendChild(table);

}

//alias main
window.createXML = function createXML() {
	var xmlDoc = document.implementation.createDocument(null,null,null);
	var mainNode = xmlDoc.createElement('databases');
	//create table fierro
	var db = writeDatabase('fierro');

	saveDatabase(db, mainNode);

	var db = getDatabase('fierro',mainNode);
	console.log(db);



	//create table persons
	var personsTable = writeTable('persons');
	addTable(db, personsTable);

	var f1 = writeField('id','int');
	var f2 = writeField('name','varchar');
	var c1 = writeUQConstraint();
	var c2 = writePKConstraint();
	f1.appendChild(c1);
	f1.appendChild(c2);



	var uglyXML = new XMLSerializer().serializeToString(xmlDoc);
	var niceXML = vkbeautify.xml(uglyXML, 4);
	console.log(niceXML);
}
