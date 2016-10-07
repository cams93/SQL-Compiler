function lex_test(input){
	
	var result = lex(input);
	var tokens = result.tokens;
    var symbols_table = syntactic(tokens);
	var intermediate_code = getIntermediateCode();

	var output ="";
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
}