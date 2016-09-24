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
*/

var debug = true;
function instrucciones(){
    if(verificar("select")){
        if(debug) console.log("");
        select_command();
    }else if(verificar("insert")){
        if(debug) console.log("");
        insert_command();
    }else if(verificar("create")){
        if(debug) console.log("");
        if(verificar("table")) {
            if(debug) console.log("");
            create_table();
        }else if(verificar("database")){
            if(debug) console.log("");
            create_db();
        }else{
            console.log("use table or database after create");
        }
    }else{
        console.log("use select, create or insert");
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
    if(exigir("create")){
        if(debug) console.log("");
        if(exigir("database")){
            if(debug) console.log("");
            identificador();
            if(exigir(";")){
                if(debug) console.log("");
            }else{
                console.log("missing ;");
            }
        }else{
            console.log("missing database");
        }
    }else{
        console.log("missing create");
    }
}

/*
<identificador>::= cadena de caracteres que es más de 1 y menos de 5 caracteres (hasta 10). Este identificador NO esta encerrado entre comillas de ningun tipo.
*/

function identificador(){
    //regex identifier
    if(exigir("identifier")){
        if(debug) console.log("");
    }else{
        console.log("missing identifier");
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
    if(exigir("create")){
        if(debug) console.log("");
        if(exigir("table")){
            if(debug) console.log("");
            identificador();
            if(exigir("(")){
                if(debug) console.log("");
                elementos_tabla();
                if(exigir(")")){
                    if(debug) console.log("");
                    if(exigir(";")){
                        if(debug) console.log("");
                    }else{
                        console.log("missing ;");
                    }
                }else{
                    console.log("missing )");
                }
            }else{
                console.log("missing (");
            }
        }else{
            console.log("missing table");
        }
    }else{
        console.log("missing create");
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
        if(debug) console.log("");
        if(exigir(",")){
            if(debug) console.log("");
            elemento_tabla();
            elementos_tabla_prima();
        }else{
            console.log("missing ,");
        }
    }
}

/* -------------------------------------------
<elemento tabla> ::= <columna> | <restriccion>
 */

function elemento_tabla(){
    if(verificar("identifier")){
        if(debug) console.log("");
        columna();
    }else if(verificar("primary") || verificar("unique") || verificar("references") || verificar("not") || verificar("null")){
        if(debug) console.log("");
        restriccion();
    }else{
        console.log("missing column or constraint")
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
        if(debug) console.log("");
        varchar();
    }else if(verificar("bit")){
        if(debug) console.log("");
        binary();
    }else if(verificar("int")){
        if(debug) console.log("");
        integer();
    }else if(verificar("date") || cerificar("time") || verificar("datetime")){
        if(debug) console.log("");
        date_and_time();
    }else if(verificar("xml")){
        if(debug) console.log("");
        xml();
    }
}

/*
<varchar> ::= "VARCHAR" <longitud cadena>
 */

function varchar(){
    //regex varchar
    if(exigir("varchar")){
        if(debug) console.log("");
        longitud_cadena();
    }else{
        console.log("missing varchar");
    }
}

/*
<longitud cadena> ::= lambda | "("  <numero> ")"
 */

function longitud_cadena(){
    if(verificar("(")){
        if(debug) console.log("");
        if(exigir("(")){
            if(debug) console.log("");
            numero();
            if(exigir(")")){
                if(debug) console.log("");
            }else{
                console.log(")");
            }
        }else{
            console.log("(");
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
        if(debug) console.log("");
    }else{
        console.log("missing numero");
    }
}

/*
<binary> ::= "BIT"
semantica: se almacenara un 1 o un 0 unicamente
 */

function binary(){
    //regex bit
    if(exigir("bit")){
        if(debug) console.log("");
    }else{
        console.log("missing bit");
    }
}

/*
<integer> ::= "INT"
semantica:  numero entero expresado en 2 bytes.
 */

function integer(){
    //regex int
    if(exigir("int")){
        if(debug) console.log("");
    }else{
        console.log("missing int");
    }
}

/*
<date and time> ::= "DATE" | "TIME" | "DATETIME"
semantica: date indica solo una fecha, con este formato: YYYY-MM-DD
time indica solo una hora con este formato: HH:MM:SS
date time indica una fecha hora con este formato: YYYY-MM-DD HH:MM:SS
 */

function date_and_time(){
    if(exigir("value")){
        if(debug) console.log("");
    }else{
        console.log("missing date, time or date and time");
    }
}

/*
<xml> ::= "XML"
semantica: se recibira en un campo una cadena de texto que cumple las reglas de un archivo XML.
 */

function xml(){
    if(exigir("xml")){
        if(debug) console.log("");
    }else{
        console.log("missing xml");
    }
}

/*---------------------------------------------------------
<seccion de varios> ::= lambda | <constraint> <seccion de varios>
semantica: puede ser que un campo no tenga ningun constraint; pero no puede tener <PK> y <UQ> al mismo tiempo.
 */

function seccion_de_varios(){
    if(verificar("primary") || verificar("unique") || verificar("references") || verificar("not") || verificar("null")){
        if(debug) console.log("");
        constraint();
        seccion_de_varios();
    }
}

/*
<constraint> ::= <PK> | <UQ> | <FK> | <NN>
 */

function constraint(){
    if(verificar("primary")){
        if(debug) console.log("");
        pk();
    }else if(verificar("unique")){
        if(debug) console.log("");
        uq();
    }else if(verificar("references")){
        if(debug) console.log("");
        fk();
    }else if(verificar("not")){
        if(debug) console.log("");
        nn();
    }else if(verificar("null")){
        if(debug) console.log("");
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
        if(exigir("key")){
            if(debug) console.log("");
        }else{
            console.log("missing key");
        }
    }else{
        console.log("missing primary");
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
        if(debug) console.log("");
    }else{
        console.log("unique");
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
        if(debug) console.log("");
        identificador();
        if(exigir("(")){
            if(debug) console.log("");
            identificador();
            if(exigir(")")){
                if(debug) console.log("");
            }else{
                console.log("missing )")
            }
        }else{
            console.log("missing (")
        }
    }else{
        console.log("references")
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
        if(debug) console.log("");
        if(exigir("not")){
            if(debug) console.log("");
            if(exigir("null")){
                if(debug) console.log("");
            }
            else{
                console.log("missing null")
            }
        }else{
            console.log("missing not")
        }
    }else if(verificar("null")){
        if(debug) console.log("");
        if(exigir("null")){
            if(debug) console.log("");
        }else{
            console.log("missing null");
        }
    }else{
        console.log("missing not or not null")
    }
}

/*--------------------------------------------------------------------------------
<restriccion> ::= <primary key> | <foreign key> | <unique key> | <check constraint>
 */

function restriccion(){
    if(verificar(("primary"))){
        if(debug) console.log("");
        primary_key();
    }else if(verificar("references")){
        if(debug) console.log("");
        foreign_key();
    }else if(verificar("unique")){
        if(debug) console.log("");
        unique_key();
    }else if(verificar("check")){
        if(debug) console.log("");
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
        if(debug) console.log("");
        identificador();
        operador_relacional();
        value_literal();
    }else{
        console.log("missing check");
    }
}

/*
<value literal> ::= <identificador> | <numero> | <string>
semantica: identificador es el nombre de un campo en la tabla que actualmente se esta procesando. El numero es un entero y flotante.
El string es una secuencia entre comillas simples o dobles.
 */

function value_literal(){
    if(verificar("identifier")){
        if(debug) console.log("");
        identificador();
    }else if(verificar("value")){
        if(debug) console.log("");
        string();
        //numero();
    }
}

/*
<operador relacional> ::= "<" | "<=" | ">" | ">=" | "==" | "!="
 */

function operador_relacional(){
    if(verificar("<")){
        if(debug) console.log("");
        if(exigir("<")){
            if(debug) console.log("");
        }else{
            console.log("missing <");
        }
    }else if(verificar("<=")){
        if(debug) console.log("");
        if(exigir("<=")){
            if(debug) console.log("");
        }else{
            console.log("missing <=");
        }
    }else if(verificar(">")){
        if(debug) console.log("");
        if(exigir(">")){
            if(debug) console.log("");
        }else{
            console.log("missing >");
        }
    }else if(verificar(">=")){
        if(debug) console.log("");
        if(exigir(">=")){
            if(debug) console.log("");
        }else{
            console.log("missing >=");
        }
    }else if(verificar("==")){
        if(debug) console.log("");
        if(exigir("==")){
            if(debug) console.log("");
        }else{
            console.log("missing ==");
        }
    }else if(verificar("!=")){
        if(debug) console.log("");
        if(exigir("!=")){
            if(debug) console.log("");
        }else{
            console.log("missing !=");
        }
    }else{
        console.log("missing < | <= | > | >= | == | !=");
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
        if(debug) console.log("");
        listado_identificadores();
        if(exigir(")")){
            if(debug) console.log("");
        }else{
            console.log("missing )");
        }
    }else{
        console.log("missing (");
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
        if(debug) console.log("");
        if(exigir("key")){
            if(debug) console.log("");
            if(exigir("(")){
                if(debug) console.log("");
                listado_identificadores();
                if(exigir(")")){
                    if(debug) console.log("");
                    if(exigir("references")){
                        if(debug) console.log("");
                        identificador();
                        if(exigir("(")){
                            if(debug) console.log("");
                            listado_identificadores();
                            if(exigir(")")){
                                if(debug) console.log("");
                            }else{
                                console.log("missing )");
                            }
                        }else{
                            console.log("missing (");
                        }
                    }else{
                        console.log("missing references");
                    }
                }else{
                    console.log(")")
                }
            }else{
                console.log("missing (");
            }
        }else{
            console.log("missing key");
        }
    }else{
        console.log("missing foreign");
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
        if(debug) console.log("");
        if(exigir(",")){
            if(debug) console.log("");
            identificador();
            listado_identificadores_prima();
        }else{
            console.log("missing ,");
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
        if(debug) console.log("");
        listado_identificadores();
        if(exigir(")")){
            if(debug) console.log("");
        }else{
            console.log("missing )");
        }
    }else{
        console.log("missing (");
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
        if(debug) console.log("");
        if(exigir("into")){
            if(debug) console.log("");
            identificador();
            if(exigir("values")){
                if(debug) console.log("");
                if(exigir("(")){
                    if(debug) console.log("");
                    listado_valores();
                    if(exigir(")")){
                        if(debug) console.log("");
                        if(exigir(";")){
                            if(debug) console.log("");
                        }else{
                            console.log("missing ;");
                        }
                    }else{
                        console.log("missing )");
                    }
                }else{
                    console.log("missing(");
                }
            }else{
                console.log("missing values");
            }
        }else{
            console.log("missing into");
        }
    }else{
        console.log("missing insert");
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
        if(debug) console.log("");
        if(exigir(",")){
            if(debug) console.log("");
            valor();
            listado_valores_prima();
        }else{
            console.log("missing ,");
        }
    }
}

/*
<valor> ::= <string> | <numero> | <numero decimal> | "NULL"
 */

function valor(){
    if(verificar("value")){
        if(debug) console.log("");
        string();
        //numero();
        //numero_decimal();
    }else if(verificar("null")){
        if(debug) console.log("");
        if(exigir("null")){
            if(debug) console.log("");
        }else{
            console.log("missing null");
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
        if(debug) console.log("");
    }else{
        console.log("missing string");
    }
}

/*
<select command> ::= "SELECT" <values selected> "from" <listado identificadores> <condicionales> ";"
semantica: los identificadores en la seccion from son nombres de tablas definidas previamente en la base de datos.
 */

function select_command(){
    if(exigir("select")){
        if(debug) console.log("");
        values_selected();
        if(exigir("from")){
            if(debug) console.log("");
            listado_identificadores();
            condicionales();
            if(exigir(";")){
                if(debug) console.log("");
            }else{
                console.log("missing ;");
            }
        }else{
            console.log("missing from");
        }
    }else{
        console.log("missing select");
    }
}

/*
<values selected> ::= <asterisco> | <listado identificadores>
semantica: los identificadores son nombres de campos que den de estar definidos en alguna de las tablas indicadas en el "from"
 */

function values_selected(){
    if(verificar("*")){
        if(debug) console.log("");
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
        if(debug) console.log("");
    }else{
        console.log("*");
    }
}

/*
<condicionales> ::= lambda | "WHERE" <identificador> <operador relacional>  <value literal>
semantica: el identificador es el nombre de un campo que debe de estar definido en alguna de las tablsa indicadas en el FROM.
 */

function condicionales(){
    if(verificar("where")){
        if(debug) console.log("");
        if(exigir("where")){
            if(debug) console.log("");
            identificador();
            operador_relacional();
            value_literal();
        }else{
            console.log("missing where");
        }
    }
}
