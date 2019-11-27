%lex

%%
[\s\r\n\t]+         /* skip whitespace */
\%\w+               return 'DIRECTIVE';
\$\w+               return 'VAR_NAME';
\d+b                return 'MEM_SIZE';
0x[\da-fA-F]+       return 'HEX_VALUE';
\d+                 return 'DIGIT';
const               return 'CONST_KEYWORD';
type\s+\w+          return 'TYPE_KEYWORD';
\#\w+               return 'CONST_NAME';
BE|LE               return 'ENDIAN_TYPE';
i(?:8|16|32)|float  return 'TYPE_EQ';
\w+                 return 'FN_NAME';
\{                  return '{';
\}                  return '}';
\(                  return '(';
\)                  return ')';
\=                  return '=';
\,                  return ',';

<<EOF>>   return 'EOF';
/lex

%start file

%%

file
  : expr EOF         { return ["file", $expr, $EOF]; }
  ;

expr
  : DIRECTIVE ENDIAN_TYPE expr {
    $$ = {
        type: 'directive',
        name: $DIRECTIVE,
        value: $ENDIAN_TYPE
    }
  }
  | const_block expr {
    console.log($const_block, $expr);
  }
  | type_block expr {
    console.log($type_block, $expr);
  }
  | EOF {}
  ;

type_block
  : TYPE_KEYWORD type_body {
    console.log($TYPE_KEYWORD, $type_body);
  }
  | TYPE_KEYWORD '(' params ')' type_body {
    console.log($TYPE_KEYWORD, $params, $type_body);
  }
  ;

type_body
  : '{' typedesc '}' {
        console.log($1, $2, $3);
  }
  ;

typedesc
  : '=' TYPE_EQ type_field {
        console.log($TYPE_EQ);
    }
  | '=' type_expr type_field {
        console.log($type_expr);
    }
  | TYPE_EQ VAR_NAME type_field {
        console.log($TYPE_EQ, $VAR_NAME, $type_field);
    }
  ;

type_expr
    : "{" FN_NAME "}" {
        console.log(12321);
    }

  ;

const
  : CONST_NAME '=' HEX_VALUE const  {
    console.log($CONST_NAME, $HEX_VALUE, $const);
  }
  | '}' {}
  ;

const_block
    : CONST_KEYWORD const_block_body {
        console.log($CONST_KEYWORD, $const_block_body);
    }
  ;

const_block_body
  : '{' const '}' const_block_body {
        console.log($1, $2);
  }
  ;

params
   : VAR_NAME ',' {
    console.log($VAR_NAME);
   }
   | VAR_NAME {
        console.log($VAR_NAME);
    }
   ;
