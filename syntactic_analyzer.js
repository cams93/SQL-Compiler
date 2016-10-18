/*
SQL gramatica
Sinopsis:
create database
create table
insert
select

poner por donde paso la gramatica - console.log
tabla de simbolos llena sin identificar que es cada cosa
verificar es o no se true o false
exigir consumes mueves el index

//exige palabra reservada o simbolos seguir la secuencia
exigir identificador y valores guardar en la tabla de simbolos
nombre | tipo de dato
2/2/2      fecha
y pasas al siguiente token
<instrucciones> ::= <create db> | <create table> | <insert command> | <select command>

TEST 1 = create database pepito;
TEST 2 = create table tamigos (nom varchar(30) not null primary key, edad int null, fecha date);
TEST 3 = insert into tamigos values('jesus', 40, '1976-09-14');
TEST 4 = select nom,edad from tamigos where edad>30;

un mismo archivo para todas las bases de datos
el archivo se va a llamar databases.xml
si no existe lo generamos
si existe lo abrimos y checamos si existe una base de datos con el mismo nombre y lanzamos error
si no existe  modificamos el archivo xml
cerrar el archivo xml

create table (campos)
*/

var debug = true;
var index = 0;
var symbolN = 0;
var tokens;
var end;
var symbols_table;
var symbol;
var intermediate_code;

lex_test(document.getElementById('lexinput').value);

function syntactic(s){
    index = 0;
    tokens = s;
    end = false;
    symbols_table = {};
    intermediate_code = [];
    symbol = {};
    instrucciones();
    console.log("symbols");
    console.log(symbols_table);
    console.log("code");
    console.log(intermediate_code);
    return symbols_table;
}

function getIntermediateCode(){
    return intermediate_code;
}

function verificar(token){
    if(end){
        return false;
    }
    return (tokens[index].value == token || token == "identifier" || token == "value");
}

function exigir(token){
    if(end){
        return false;
    }else if(index >= tokens.length){
        throw new Error("the command is incomplete");
        end = true;
        return false;
    }else if(token == "identifier" || token == "value"){
        symbol.type = tokens[index].type;
        symbol.value = tokens[index].value;
        symbols_table['s'+symbolN] = symbol;
        symbolN++;
        symbol = {};
        index++;
        return true;
    }else if(tokens[index].value == token){
        index++;
        return true;
    }
    return false;
}

/*
<instrucciones> ::= <create db> | <create table> | <insert command> | <select command>
*/

function instrucciones(){
    if(verificar("select")){
        if(debug) console.log("verificar select in instrucciones");
        select_command();
    }else if(verificar("insert")){
        if(debug) console.log("verificar insert in instrucciones");
        insert_command();
    }else if(exigir("create")){
        if(debug) console.log("exigir create in instrucciones");
        if(verificar("table")) {
            if(debug) console.log("verificar table in instrucciones");
            create_table();
        }else if(verificar("database")){
            if(debug) console.log("verificar database in instrucciones");
            create_db();
        }else{
            throw new Error("use table or database after create");
        }
    }else{
        throw new Error("use select, create or insert");
    }
}

/*
<create db>::= "create" "database" <identificador> ";"
semantica: genera archivo XML con la meta informacion basica de una base de datos relacional vacia.
<database>
  <general_information>
    <name_database/>
  </general_information>
  <tables/>
</database>
 */

function create_db(){
    if(exigir("database")){
        if(debug) console.log("exigir database in create_db");
        identificador();
        if(exigir(";")){
            if(debug) console.log("exigir ; in create_db");
            intermediate_code.push(1);
            intermediate_code.push('s'+(symbolN-1));
        }else{
            throw new Error("missing ;");
        }
    }else{
        throw new Error("missing database");
    }
}

/*
<identificador>::= cadena de caracteres que es más de 1 y menos de 5 caracteres (hasta 10). Este identificador NO esta encerrado entre comillas de ningun tipo.
*/

function identificador(){
    //regex identifier
    if(exigir("identifier")){
        if(debug) console.log("exigir indentifier in identificador");
    }else{
        throw new Error("missing identifier");
    }
}

/*
<create table>::= "create" "table" <identificador> "(" <elementos tabla> ")"  ";"
semantica: Despues de este comando en el mismo metaarchivo de la base de datos se agrega mas informacion que describe la base de datos.
Se afecta el nodo <tables>
<tables>
  <table>
    <general_information>
      <name_table/>
      <amount_field/>
      <fields>
        <field>
          <name_field/>
          <data_type/>
          <constraints>
            <constraint> <!- only 1 of the next nodes -->
              <NN/> <!- boolean value , 1= not null, 0= allow null -->
              <PK/> <!- boolean value - 1 = is part of the pk, 0= is not part of the pk -->
              <UQ/> <!- number of the UQ, because each table could have more than one unique key -->
              <Fk>
                <table_name/>
                <field_name/>
              </FK>
            </constraint>
          </constraints>
        </field>
      </fields>
      <constraints>
        <constraint id= "##">
          <type /> <!-- could be PK, FK, UQ, CK -->
          <local_fields>      <!-- apply for PK, FK, UQ, CK -->
            <local_field/>
          </local_fields>
          <table_references/> <!-- apply for FK-->
          <foreign_fields>    <!-- apply for FK -->
            <foreign_field/>
          </foreign_fields>
          <condition>         <!-- apply for CK -->
            <operator/>
            <value type="v/f" />    <!-- v only for values, f if the value is other field -->
          </condition>
        </constraint>
      </constraints>
    </general information>
    <values/>
  </table>
</tables>
 */

function create_table(){
    if(exigir("table")){
        if(debug) console.log("exigir table in create_table");
        identificador();
        if(exigir("(")){
            if(debug) console.log("exigir ( in create_table");
            elementos_tabla();
            if(exigir(")")){
                if(debug) console.log("exigir ) in create_table");
                if(exigir(";")){
                    if(debug) console.log("exigir ; in create_table");
                }else{
                    throw new Error("missing ;");
                }
            }else{
                throw new Error("missing )");
            }
        }else{
            throw new Error("missing (");
        }
    }else{
        throw new Error("missing table");
    }
}
/*
<elementos tabla> ::= <elemento tabla> <elementos tabla prima>
 */

function elementos_tabla(){
    elemento_tabla();
    elementos_tabla_prima();
}

/*
<elementos tabla prima> ::= lambda | "," <elemento tabla> <elementos tabla prima>
 */

function elementos_tabla_prima() {
    if(verificar(",")){
        if(debug) console.log("verificar , in elementos_tabla_prima");
        if(exigir(",")){
            if(debug) console.log("exigir , in elementos_tabla_prima");
            elemento_tabla();
            elementos_tabla_prima();
        }else{
            throw new Error("missing ,");
        }
    }
}

/* -------------------------------------------
<elemento tabla> ::= <columna> | <restriccion>
 */

function elemento_tabla(){
    if(verificar("identifier")){
        if(debug) console.log("verificar identifier in elemento_tabla");
        columna();
    }else if(verificar("primary") || verificar("unique") || verificar("references") || verificar("not") || verificar("null")){
        if(debug) console.log("verificar primary | unique | references | not | null in elemento_tabla");
        restriccion();
    }else{
        throw new Error("missing column or constraint")
    }
}

/*
<columna> ::= <identificador> <tipo datos> <seccion varios>
 */

function columna(){
    identificador();
    tipo_datos();
    seccion_de_varios();
}

/*
<tipo datos> ::=  <varchar> | <binary> | <integer> | <date and time> | <XML>
 */

function tipo_datos(){
    if(verificar("varchar")){
        if(debug) console.log("verificar varchar in tipo_datos");
        varchar();
    }else if(verificar("bit")){
        if(debug) console.log("verificar bit in tipo_datos");
        binary();
    }else if(verificar("int")){
        if(debug) console.log("verificar int in tipo_datos");
        integer();
    }else if(verificar("date") || verificar("time") || verificar("datetime")){
        if(debug) console.log("verificar date | time | datetime in tipo_datos");
        date_and_time();
    }else if(verificar("xml")){
        if(debug) console.log("verificar xml in tipo_datos");
        xml();
    }
}

/*
<varchar> ::= "VARCHAR" <longitud cadena>
 */

function varchar(){
    //regex varchar
    if(exigir("varchar")){
        if(debug) console.log("exigir varchar ");
        longitud_cadena();
    }else{
        throw new Error("missing varchar");
    }
}

/*
<longitud cadena> ::= lambda | "("  <numero> ")"
 */

function longitud_cadena(){
    if(verificar("(")){
        if(debug) console.log("verificar ( in longitud_cadena");
        if(exigir("(")){
            if(debug) console.log("exigir ( in longitud_cadena");
            numero();
            if(exigir(")")){
                if(debug) console.log("exigir ) in longitud_cadena");
            }else{
                throw new Error("missing )");
            }
        }else{
            throw new Error("missing (");
        }
    }
}

/*
<numero> ::= solo se permitira de 1<= x <= 99.
De no indicarse la longitud de la cadena esta sera de 1.
 */

function numero(){
    //regex numero
    if(exigir("value")){
        if(debug) console.log("exigir value in numero");
    }else{
        throw new Error("missing numero");
    }
}

/*
<binary> ::= "BIT"
semantica: se almacenara un 1 o un 0 unicamente
 */

function binary(){
    //regex bit
    if(exigir("bit")){
        if(debug) console.log("exigir bit in binary");
    }else{
        throw new Error("missing bit");
    }
}

/*
<integer> ::= "INT"
semantica:  numero entero expresado en 2 bytes.
 */

function integer(){
    //regex int
    if(exigir("int")){
        if(debug) console.log("exigir int in integer");
    }else{
        throw new Error("missing int");
    }
}

/*
<date and time> ::= "DATE" | "TIME" | "DATETIME"
semantica: date indica solo una fecha, con este formato: YYYY-MM-DD
time indica solo una hora con este formato: HH:MM:SS
date time indica una fecha hora con este formato: YYYY-MM-DD HH:MM:SS
 */

function date_and_time(){
    if(verificar("date")){
        if(debug) console.log("verificar date in in date_and_time");
        if(exigir("date")){
            if(debug) console.log("exigir date in in date_and_time");
        }
    }else if(verificar("time")){
        if(debug) console.log("verificar time in in date_and_time");
        if(exigir("time")){
            if(debug) console.log("exigir time in in date_and_time");
        }
    }else if(verificar("datetime")){
        if(debug) console.log("verificar datetime in in date_and_time");
        if(exigir("datetime")){
            if(debug) console.log("exigir datetime in in date_and_time");
        }
    }else{
        throw new Error("missing date, time or date and time");
    }
}

/*
<xml> ::= "XML"
semantica: se recibira en un campo una cadena de texto que cumple las reglas de un archivo XML.
 */

function xml(){
    if(exigir("xml")){
        if(debug) console.log("exigir xml in xml");
    }else{
        throw new Error("missing xml");
    }
}

/*---------------------------------------------------------
<seccion de varios> ::= lambda | <constraint> <seccion de varios>
semantica: puede ser que un campo no tenga ningun constraint; pero no puede tener <PK> y <UQ> al mismo tiempo.
 */

function seccion_de_varios(){
    if(verificar("primary") || verificar("unique") || verificar("references") || verificar("not") || verificar("null")){
        if(debug) console.log("verificar primary | unique | references | not | null in seccion_de_varios");
        constraint();
        seccion_de_varios();
    }
}

/*
<constraint> ::= <PK> | <UQ> | <FK> | <NN>
 */

function constraint(){
    if(verificar("primary")){
        if(debug) console.log("verificar primary in constraint");
        pk();
    }else if(verificar("unique")){
        if(debug) console.log("verificar unique in constraint");
        uq();
    }else if(verificar("references")){
        if(debug) console.log("verificar references in constraint");
        fk();
    }else if(verificar("not")){
        if(debug) console.log("verificar not in constraint");
        nn();
    }else if(verificar("null")){
        if(debug) console.log("verificar null in constraint");
        nn();
    }
}

/*
<PK>::= "primary" "key"
semantica: llave primaria, debe indicar explicitamente la restriccion de no permitir nulos
  <constraint> <!- only 1 of the next nodes -->
    <PK/> <!- boolean value - 1 = is part of the pk, 0= is not part of the pk -->
  </constraint>
 */

function pk(){
    if(exigir("primary")){
        if(debug) console.log("exigir primary in pk");
        if(exigir("key")){
            if(debug) console.log("exigir key in pk");
        }else{
            throw new Error("missing key");
        }
    }else{
        throw new Error("missing primary");
    }
}

/*
<UQ> ::= "unique"
semantica: llave candidata, debe indicar explicitamente la restriccion de no permitir nulos
  <constraint> <!- only 1 of the next nodes -->
    <UQ/> <!- number of the UQ, because each table could have more than one unique key -->
  </constraint>
 */

function uq(){
    if(exigir("unique")){
        if(debug) console.log("exigir unique in uq");
    }else{
        throw new Error("unique");
    }
}

/*
<FK> ::= "references" <identificador> "(" <identificador> ")"
semantica: el primer identificador es el nombre de una tabla y el segundo el nombre de un campo que debe de ser el UNICO que forme la llave primaria
de esa tabla indicada ( en el primer identificador). Ese campo ademas debe de ser del mismo tipo de dato .
            <constraint> <!- only 1 of the next nodes -->
              <Fk id="##" >
                <table name/>
                <field name/>
              </FK>
            </constraint>
 */

function fk(){
    if(exigir("references")){
        if(debug) console.log("exigir refrences in fk");
        identificador();
        if(exigir("(")){
            if(debug) console.log("exigir ( in fk");
            identificador();
            if(exigir(")")){
                if(debug) console.log("exigir ) in fk");
            }else{
                throw new Error("missing )")
            }
        }else{
            throw new Error("missing (")
        }
    }else{
        throw new Error("references")
    }
}

/*
<NN>::= "NOT" "NULL" | "NULL"
            <constraint> <!- only 1 of the next nodes -->
              <NN/> <!- boolean value , 1= not null, 0= allow null -->
            </constraint>
 */

function nn(){
    if(verificar("not")){
        if(debug) console.log("verificar not in nn");
        if(exigir("not")){
            if(debug) console.log("exigir not in nn");
            if(exigir("null")){
                if(debug) console.log("exigir null in nn");
            }
            else{
                throw new Error("missing null")
            }
        }else{
            throw new Error("missing not")
        }
    }else if(verificar("null")){
        if(debug) console.log("verificar null in nn");
        if(exigir("null")){
            if(debug) console.log("exigir null in nn");
        }else{
            throw new Error("missing null");
        }
    }else{
        throw new Error("missing not or not null")
    }
}

/*--------------------------------------------------------------------------------
<restriccion> ::= <primary key> | <foreign key> | <unique key> | <check constraint>
 */

function restriccion(){
    if(verificar(("primary"))){
        if(debug) console.log("verificar primary in restriccion");
        primary_key();
    }else if(verificar("references")){
        if(debug) console.log("verificar references in restriccion");
        foreign_key();
    }else if(verificar("unique")){
        if(debug) console.log("verificar unique in restriccion");
        unique_key();
    }else if(verificar("check")){
        if(debug) console.log("verificar check in restriccion");
        check_constraint();
    }
}

/*
<check constraint> ::= "check" <identificador> <operador relacional>  <value literal>
semantica: Este constraint solo se aplica al momento de insertar un nuevo registro y al actualizar el valor de una tabla.
el primer identificador es el nombre de un campo en esa tabla. A nivel de tabla todos los registros debe de cumplir a nivel REGISTRO esta restriccion.
        <constraint id= "##">
          <type /> <!-- could be PK, FK, UQ, CK -->
          <local_fields>      <!-- apply for PK, FK, UQ, CK -->
            <local_field/>
          </local_fields>
          <condition>         <!-- apply for CK -->
            <operator/>
            <value type="v/f" />    <!-- v only for values, f if the value is other field -->
          </condition>
        </constraint>
 */

function check_constraint(){
    if(exigir("check")){
        if(debug) console.log("exigir check in check_constraint");
        identificador();
        operador_relacional();
        value_literal();
    }else{
        throw new Error("missing check");
    }
}

/*
<value literal> ::= <identificador> | <numero> | <string>
semantica: identificador es el nombre de un campo en la tabla que actualmente se esta procesando. El numero es un entero y flotante.
El string es una secuencia entre comillas simples o dobles.
 */

function value_literal(){
    if(verificar("identifier")){
        if(debug) console.log("verificar identifier in value_literal");
        identificador();
    }else if(verificar("value")){
        if(debug) console.log("verificar value in value_literal");
        string();
        //numero();
    }
}

/*
<operador relacional> ::= "<" | "<=" | ">" | ">=" | "==" | "!="
 */

function operador_relacional(){
    if(verificar("<")){
        if(debug) console.log("verificar < in operador_relacional");
        if(exigir("<")){
            if(debug) console.log("exigir < in operador_relacional");
        }else{
            throw new Error("missing <");
        }
    }else if(verificar("<=")){
        if(debug) console.log("verificar <= in operador_relacional");
        if(exigir("<=")){
            if(debug) console.log("exigir <= in operador_relacional");
        }else{
            console.log("missing <=");
        }
    }else if(verificar(">")){
        if(debug) console.log("verificar > in operador_relacional");
        if(exigir(">")){
            if(debug) console.log("exigir > in operador_relacional");
        }else{
            throw new Error("missing >");
        }
    }else if(verificar(">=")){
        if(debug) console.log("verificar >= in operador_relacional");
        if(exigir(">=")){
            if(debug) console.log("exigir >= in operador_relacional");
        }else{
            throw new Error("missing >=");
        }
    }else if(verificar("==")){
        if(debug) console.log("verificar == in operador_relacional");
        if(exigir("==")){
            if(debug) console.log("exigir == in operador_relacional");
        }else{
            throw new Error("missing ==");
        }
    }else if(verificar("!=")){
        if(debug) console.log("verificar != in operador_relacional");
        if(exigir("!=")){
            if(debug) console.log("exigir != in operador_relacional");
        }else{
            throw new Error("missing !=");
        }
    }else{
        throw new Error("missing < | <= | > | >= | == | !=");
    }
}

/*
<primary key>::= <PK> "(" <listado identificadores>  ")"
semantica: todos los identificadores son nombres de campos. todos esos campos no deben de permitir nulos.
la combinacion de los valores de esos campos es la que NO se puede repetir en la tabla actual.
Este constraint solo se aplica al momento de insertar un nuevo registro y al actualizar el valor de una tabla.
  <constraint id= "##">
    <type /> <!-- could be PK, FK, UQ, CK -->
    <local_fields>      <!-- apply for PK, FK, UQ, CK -->
      <local_field/>
    </local_fields>
  </constraint>
 */

function primary_key(){
    pk();
    if(exigir("(")){
        if(debug) console.log("exigir ( in primary_key");
        listado_identificadores();
        if(exigir(")")){
            if(debug) console.log("exigir ) in primary_key");
        }else{
            throw new Error("missing )");
        }
    }else{
        throw new Error("missing (");
    }
}

/*
<foreign Key>::=  "foreign" "key" "(" <listado identificadores>  ")" "references" <identificador> "(" <listado identificadores>  ")"
semantica:todos los identificadores son nombres de campos. El siguiente identificador debe ser el nombre de una tabla, incluso esa misma y el
siguiente listado de identificadores son tambien nombres de campos, los cuales pueden ser la llave primaria de la tabla indicada anteriormente o
formar parte de una llave candidata. Esta restriccion se aplica al momento de insertar un nuevo registro y al actualizar el valor de una tabla.
  <constraint id= "##">
    <type /> <!-- could be PK, FK, UQ, CK -->
    <local_fields>      <!-- apply for PK, FK, UQ, CK -->
      <local_field/>
    </local_fields>
    <table references/> <!-- apply for FK-->
    <foreign_fields>    <!-- apply for FK -->
      <foreign_field/>
    </foreign_fields>
  </constraint>
 */

function foreign_key(){
    if(exigir("foreign")){
        if(debug) console.log("exigir foreign in foreign_key");
        if(exigir("key")){
            if(debug) console.log("exigir key in foreign_key");
            if(exigir("(")){
                if(debug) console.log("exigir ( in foreign_key");
                listado_identificadores();
                if(exigir(")")){
                    if(debug) console.log("exigir ) in foreign_key");
                    if(exigir("references")){
                        if(debug) console.log("exigir references in foreign_key");
                        identificador();
                        if(exigir("(")){
                            if(debug) console.log("exigir ( in foreign_key");
                            listado_identificadores();
                            if(exigir(")")){
                                if(debug) console.log("exigir ) in foreign_key");
                            }else{
                                throw new Error("missing )");
                            }
                        }else{
                            throw new Error("missing (");
                        }
                    }else{
                        throw new Error("missing references");
                    }
                }else{
                    throw new Error(")")
                }
            }else{
                throw new Error("missing (");
            }
        }else{
            throw new Error("missing key");
        }
    }else{
        throw new Error("missing foreign");
    }
}

/*
<listado identificadores> ::= <identificador> <listado identificadores prima>
 */

function listado_identificadores(){
    identificador();
    listado_identificadores_prima();
}

/*
<listado identificadores prima> ::= lambda | "," <identificador> <listado identificadores prima>
 */

function listado_identificadores_prima(){
    if(verificar(",")){
        if(debug) console.log("verificar , in listado_identificadores_prima");
        if(exigir(",")){
            if(debug) console.log("exigir , in listado_identificadores_prima");
            identificador();
            listado_identificadores_prima();
        }else{
            throw new Error("missing ,");
        }
    }
}

/*
<unique key> ::= <UQ> "(" <listado identificadores>  ")"
semantica: Este constraint solo se aplica al momento de insertar un nuevo registro y al actualizar el valor de una tabla.
todos los campos debe de tener explicitamente la indicacion de que no permiten nulos.
  <constraint id= "##">
    <type /> <!-- could be PK, FK, UQ, CK -->
    <local_fields>      <!-- apply for PK, FK, UQ, CK -->
      <local_field/>
    </local_fields>
  </constraint>
 */

function unique_key(){
    uq();
    if(exigir("(")){
        if(debug) console.log("exigir ( in unique_key");
        listado_identificadores();
        if(exigir(")")){
            if(debug) console.log("exigir ) in unique_key");
        }else{
            throw new Error("missing )");
        }
    }else{
        throw new Error("missing (");
    }
}

/*
<insert command> ::= "INSERT" "INTO" <identificador> "VALUES" "(" <listado valores>  ")" ";"
semantica: El identificador es el nombre de una tabla de la base de datos actual. El listado de valores debe de ser igual a la cantidad de campos
que tiene esa tabla. los valores indicados deben de ser del tipo de dato que son los campos declarados en la tabla al momento del "create table"
Si uno de esos valores es la literal NULL entonces se debe de verificar que el campo al que corresponde ese valor permita nulos.
 */

function insert_command(){
    if(exigir("insert")){
        if(debug) console.log("exigir insert in insert_command");
        if(exigir("into")){
            if(debug) console.log("exigir into in insert_command");
            identificador();
            if(exigir("values")){
                if(debug) console.log("exigir values in insert_command");
                if(exigir("(")){
                    if(debug) console.log("exigir ( in insert_command");
                    listado_valores();
                    if(exigir(")")){
                        if(debug) console.log("exigir ) in insert_command");
                        if(exigir(";")){
                            if(debug) console.log("exigir ; in insert_command");
                        }else{
                            throw new Error("missing ;");
                        }
                    }else{
                        throw new Error("missing )");
                    }
                }else{
                    throw new Error("missing(");
                }
            }else{
                throw new Error("missing values");
            }
        }else{
            throw new Error("missing into");
        }
    }else{
        throw new Error("missing insert");
    }
}

/*
<listado valores> ::= <valor> <listado valores prima>
 */

function listado_valores(){
    valor();
    listado_valores_prima();
}

/*
<listado valores prima> ::= lambda | "," <valor> <listado valores prima>
 */

function listado_valores_prima(){
    if(verificar(",")){
        if(debug) console.log("verificar , in listado_valores_prima");
        if(exigir(",")){
            if(debug) console.log("exigir , in listado_valores_prima");
            valor();
            listado_valores_prima();
        }else{
            throw new Error("missing ,");
        }
    }
}

/*
<valor> ::= <string> | <numero> | <numero decimal> | "NULL"
 */

function valor(){
    if(verificar("value")){
        if(debug) console.log("verificar value in valor");
        string();
        //numero();
        //numero_decimal();
    }else if(verificar("null")){
        if(debug) console.log("verificar null in valor");
        if(exigir("null")){
            if(debug) console.log("exigir null in valor");
        }else{
            throw new Error("missing null");
        }
    }
}

/*
<string> ::= las cadenas son secuencias de caracteres encerrados entre comillas dobles o simples.
semantica: las cadenas pueden ser simplemente palabras o que cumplen un formato especifico. Si estos formatos son los
reconocidos para DATE, TIME o DATETIME, entonces seran manejados posteriormente como uno de esos tipos.
 */

function string(){
    if(exigir("value")){
        if(debug) console.log("exigir value in string");
    }else{
        throw new Error("missing string");
    }
}

/*
<select command> ::= "SELECT" <values selected> "from" <listado identificadores> <condicionales> ";"
semantica: los identificadores en la seccion from son nombres de tablas definidas previamente en la base de datos.
 */

function select_command(){
    if(exigir("select")){
        if(debug) console.log("exigir select in select_command");
        values_selected();
        if(exigir("from")){
            if(debug) console.log("exigir from in select_command");
            listado_identificadores();
            condicionales();
            if(exigir(";")){
                if(debug) console.log("exigir ; in select_command");
            }else{
                throw new Error("missing ;");
            }
        }else{
            throw new Error("missing from");
        }
    }else{
        throw new Error("missing select");
    }
}

/*
<values selected> ::= <asterisco> | <listado identificadores>
semantica: los identificadores son nombres de campos que den de estar definidos en alguna de las tablas indicadas en el "from"
 */

function values_selected(){
    if(verificar("*")){
        if(debug) console.log("verificar * in values_selected");
        asterisco();
    }else{
        listado_identificadores();
    }
}

/*
<asterisco> ::= "*"
 */

function asterisco(){
    if(exigir("*")){
        if(debug) console.log("exigir * in asterisco");
    }else{
        throw new Error("missing *");
    }
}

/*
<condicionales> ::= lambda | "WHERE" <identificador> <operador relacional>  <value literal>
semantica: el identificador es el nombre de un campo que debe de estar definido en alguna de las tablsa indicadas en el FROM.
 */

function condicionales(){
    if(verificar("where")){
        if(debug) console.log("verificar where in condicionales");
        if(exigir("where")){
            if(debug) console.log("exigir where in condicionales");
            identificador();
            operador_relacional();
            value_literal();
        }else{
            throw new Error("missing where");
        }
    }
}
