%lex

%%

[.\n\s*]+          {/* skip over text not in quotes */ }

"<"                          { return '<'; }
">"                          { return '>'; }
\{[\dA-F-]+\}                { return 'GUID'; }
"{"                          { return '{'; }
"}"                          { return '}'; }
[A-Z_]+                      { return 'WORD'; }
\-?\d+\.\d+                  { return 'FLOAT'; }
\-?\d+                       { return 'INT'; }
\"[^"]*\"                    { return 'STRING'; }
[\w-_\.]+                    { return 'FILENAME'; }
[a-zA-Z_]+\$[a-zA-Z_]+       { return 'VAR'; }
[a-zA-Z/=+]+                 { return 'BASE64'; }
<<EOF>>                      { return 'EOF'; }
/lex

%start file

%%

file
  : expr EOF         { $$ = ["file", $1, $2]; }
  ;

expr
  : group { $$ = ["GROUP", $1]; }
  | param { $$ = ["PARAM", $1]; }
  ;

group
  : '<' WORD param '>' { $$ = ["GROUP", $2, $3]; }
  ;

param
  : param param      { $$ = ["PARAM PARAM", $1, $2]; }
  | numeric          { $$ = ["numeric", $1]; }
  | attr             { $$ = ["attr", $1]; }
  | GUID             { $$ = ["GUID", $1]; }
  | STRING           { $$ = ["string", $1]; }
  | BASE64           { $$ = ["BASE64", $1]; }
  | FILENAME         { $$ = ["FILENAME", $1]; }
  | VAR              { $$ = ["VAR", $1]; }
  | ''               { }
  ;

numeric
  : INT               { $$ = ["int", $1] }
  | FLOAT             { $$ = ["float", parseFloat($1)] }
  ;

attr
  : WORD value          { $$ = ["attr word", $1, $2] }
  | group               { $$ = ["group", $1] }
  ;

value
  : param param { $$ = ["param param", $1]; }
  | param { $$ = ["param", $1]; }
  ;
