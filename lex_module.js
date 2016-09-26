/* Analizador Léxico para SQL
 *	
 * Autor:
 * Carlos Augusto Mendoza Sánchez
 */


/*
 * Función - Clase para el analizador léxico.
 */
function lex(s){
	/* Expresiones regulares para clasificar tokens.
	 */
	var commands_regex = /(select|insert|create)/i;
	var reserved_regex = /(table|database|into|from|where|values|null|varchar|primary|unique|references|not|check|foreign|key|int|bit|date|time|datetime|xml)/i;
	var symbols_regex = /(\(|\)|,|;|\*)/i;
	var values_regex = /(\"[A-Za-z0-9.\-_]*\"|\'[A-Za-z0-9.\-_]*\'|^[0-9]*$)/i;
	var operadors_double_regex  = /(<=|>=|!=|==)/i;
	var operadors_regex  = /(<|>|=)/i;
	var identifiers_regex = /^([a-zA-Z]){1,10}$/i;
	/* Expresiones regulares para clasificar values.
	 */
	var string_regex = new RegExp("^\w*$");
	var number_regex = new RegExp("^\d*$");
	var binary_regex = new RegExp("^[0-1]+$");
	var date_regex = new RegExp("/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])/");
	var dateTime_regex = new RegExp("/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/");
	var valueNull_regex = new RegExp("null$","i");
	var decimal_regex = new RegExp("/^\d*\.\d*$/");

	/* Expresión global para descomponer el String en tokens sin clasificar.
	 */
	var G_expresion = /(select|insert|create|table|database|\"[A-Za-z0-9.\-_]*\"|\'[A-Za-z0-9.\-_]*\'|^[0-9]*$|<=|>=|!=|==|into|from|where|values|null|varchar|primary|unique|references|not|check|foreign|key|int|bit|date|time|datetime|xml|\w+|\S)/gi;

	/*Funciones para detectar tipo*/
	function isCommand(s){
		return commands_regex.test(s);
	}

	function isReserved(s){
		return reserved_regex.test(s);
	}

	function isSymbol(s){
		return symbols_regex.test(s);
	}

	function isValue(s){
		return values_regex.test(s);
	}

	function isOperatorDouble(s){
		return operadors_double_regex.test(s);
	}

	function isOperator(s){
		return operadors_regex.test(s);
	}

	function isIdentifier(s){
		return identifiers_regex.test(s);
	}

	/* ---------------------------- Main ------------------------------------ */
	var tokens;
	var number_errors = 0;
	var errors = [];
	tokens = s.match(G_expresion);

	//Clasificar tokens
	for(var i = 0; i < tokens.length; i++){
		var token = {value: null, type: null};
		token.value = tokens[i];

		if(isCommand(token.value)){
			token.type = "command";
			token.value = token.value.toLowerCase();
			tokens[i] = token;
		}else if(isReserved(token.value)){
			token.type = "reserved";
			token.value = token.value.toLowerCase();
			tokens[i] = token;
		}else if(isSymbol(token.value)){
			token.type = "symbol";
			tokens[i] = token;
		}else if(isValue(token.value)){
			token.type = "value";
			tokens[i] = token;
		}else if(isOperatorDouble(token.value)) {
			token.type = "operator";
			tokens[i] = token;
		}else if(isOperator(token.value)){
			token.type = "operator";
			tokens[i] = token;
		}else if(isIdentifier(token.value)){
			token.type = "identifier";
			token.value = token.value.toLowerCase();
			tokens[i] = token;
		}else{
			//Salir al primer caracter que no cumple con la grámatica y marcar error.
			var error = "Error en col " + (s.search(token.value) + 1) + ": Identificador '"+token.value+"' no válido.";
			errors.push(error);
			number_errors++;
		}
	}

	return {
		tokens:tokens,
		errors:errors,
		number_errors:number_errors
	}
}


/*Función basura (prueba)*/
var isCommand = function(s){
	s = s.toLowerCase();
	var commands = [];
	commands["select"] = true;
	commands["create"] = true;
	commands["insert"] = true;
	commands["delete"] = true;

	return(commands[s]);
};