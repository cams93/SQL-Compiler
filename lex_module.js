/* Analizador Léxico para SQL
 *	
 * Autores:
 * -Carlos Augusto Mendoza Sánchez
 * -César Alejandro Robles Soltero
 */


/*
 * Función - Clase para el analizador léxico.
 */
function lex(s){
	/* Expresiones regulares para clasificar tokens. 
	 TODO: Checar si las expresiones están completas.
	*/
	var commands_regex = /(select|insert|create)/i;
	var reserved_regex = /(table|database|into|from|where|values|null|varchar|primary|unique|references|not|check|foreign|key|int|bit|date|time|datetime|xml)/i;
	var symbols_regex = /(\(|\)|,|;|\*)/i;
	var values_regex = /(\"\w*\"|\'\w*\')/i;
	var operadors_regex  = /(<|>|!|=)/i;
	var identifiers_regex = /^([a-zA-Z]){3,10}$/i;
	
	/* Expresión global para descomponer el String en tokens sin clasificar.
		TODO: Checar si se pueden concatenar las variables de las expresiones.
	*/
	var G_expresion = /(select|insert|create|table|database|\"\w*\"|\'\w*\'|into|from|where|values|null|varchar|primary|unique|references|not|check|foreign|key|int|bit|date|time|datetime|xml|\w+|\S)/gi;

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