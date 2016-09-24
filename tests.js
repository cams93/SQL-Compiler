function lex_test(input){
	
	var result = lex(input);
	var tokens = result.tokens;
	var output ="";
	for(i in tokens){
		output += JSON.stringify(tokens[i]) + "<br>";
	}
	output += "-------------------------------------------------<br>";
	output += "Errors: "+result.number_errors+"<br>";

	for(i in result.errors){
		output += JSON.stringify(result.errors[i]) + "<br>";
	}

	document.getElementById("lex-output").innerHTML= output;
}