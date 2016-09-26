//Identifier
var identifier = new RegExp("^[a-zA-Z]{1,10}$");

//Values
/************************************/
var string_regex = new RegExp("^\w*$");
var number_regex = new RegExp("^\d*$");
var binary_regex = new RegExp("^[0-1]+$");
var date_regex = new RegExp("/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/");
var dateTime_regex = new RegExp("/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/");
var valueNull_regex = new RegExp("null$","i");
var decimal_regex = new RegExp("/^\d*\.\d*$/");
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