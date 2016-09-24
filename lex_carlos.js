//Identifier
var identifier = new RegExp("^[a-zA-Z]{1,10}$");

//Values
/************************************/
var string = new RegExp("^\w*$");
var number = new RegExp("^\d*$");
var binary = new RegExp("^[0-1]+$");
var date = new RegExp("/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/");
var dateTime = new RegExp("/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/");
var valueNull = new RegExp("null$","i");
var decimal = new RegExp("/^\d*\.\d*$/");
/************************************/

//Identifier max 10 characters
function isIdentifier(string){
    if(identifier.test(string)){
        console.log("yes");
        return true;
    }
    console.log("no");
    return false;
}