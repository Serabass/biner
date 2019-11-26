%lex

%%

\xA4\x03  return 'NAME_THREAD';
\x6A\x01  return 'FADE';
\x2C\x04  return 'SET_TOTAL_MISSIONS';
\x0D\x03  return 'SET_TOTAL_MISSIONS_POINTS';
\xF0\x01  return 'SET_MAX_WANTED_LEVEL';
\xED\x02  return 'SET_TOTAL_HIDDEN_PACKAGES';
\x11\x01  return 'SET_WB_CHECK';
\xC0\x00  return 'SET_CURRENT_TIME';
\xE4\x04  return 'REQUEST_COLLISION_AT';
\xCB\x03  return 'LOAD_SCENE_OR_SET_CAMPOS';
\x53\x00  return 'CREATE_PLAYER_AT';
\xF5\x01  return 'CREATE_EMULATED_ACTOR_FROM_PLAYER';
\x17\x04  return 'START_MISSION';

\x02..     return 'var';
\x04.      return 'int8';
\x05..     return 'int16';
\x06....   return 'float';

.{8}      return 'b8';
.         return 'b1';

<<EOF>>   return 'EOF';
/lex

%%

file
  : expr EOF         { return ["file", $1, $2]; }
  ;

expr
  : FADE value value expr {
        $$ = {
            opcode: "FADE",
            n1: $2,
            n2: $3,
            next: $4
        };
   }
  | NAME_THREAD string8 expr {
        $$ = {
            opcode: "NAME_THREAD",
            name: $2,
            next: $3
        };
  }
  | SET_TOTAL_MISSIONS value expr {
        $$ = {
            opcode: "SET_TOTAL_MISSIONS",
            value: $2,
            next: $3
        };
   }
  | SET_TOTAL_MISSIONS_POINTS value expr {
        $$ = {
            opcode: "SET_TOTAL_MISSIONS_POINTS",
            value: $2,
            next: $3
        };
  }
  | SET_MAX_WANTED_LEVEL value expr {
        $$ = {
            opcode: "SET_MAX_WANTED_LEVEL",
            value: $2,
            next: $3
        };
  }
  | SET_TOTAL_HIDDEN_PACKAGES value expr {
        $$ = {
            opcode: "SET_TOTAL_HIDDEN_PACKAGES",
            value: $2,
            next: $3
        };
  }
  | SET_WB_CHECK value expr {
        $$ = {
            opcode: "SET_WB_CHECK",
            value: $2,
            next: $3
        };
  }
  | SET_CURRENT_TIME value value expr {
        $$ = {
            opcode: "SET_CURRENT_TIME",
            hours: $2,
            minutes: $3,
            next: $4
        };
  }
  | REQUEST_COLLISION_AT value value expr {
        $$ = {
            opcode: "REQUEST_COLLISION_AT",
            v1: $2,
            v2: $3,
            next: $4
        };
  }
  | CREATE_PLAYER_AT value value value value value expr {
        $$ = {
            opcode: "CREATE_PLAYER_AT",
            model: $2,
            x: $3,
            y: $4,
            z: $5,
            var: $6,
            next: $7
        };
  }
  | CREATE_EMULATED_ACTOR_FROM_PLAYER value value expr {
        $$ = {
            opcode: "CREATE_EMULATED_ACTOR_FROM_PLAYER",
            v1: $2,
            v2: $3,
            next: $4,
        };
  }
  | START_MISSION value expr {
        $$ = {
            opcode: "START_MISSION",
            missionIndex: $2,
            next: $3,
        };
  }
  | b8 {
        console.log($1.charCodeAt(0).toString(16), $1.charCodeAt(1).toString(16));
  }
  | EOF { }
  ;

value
  : int8 {
      $$ = {
        type: 'int8',
        value: $1.charCodeAt(1)
      }
  }
  | var {
      $$ = {
        type: 'var',
        value: [$1.charCodeAt(1), $1.charCodeAt(2)]
      }
  }
  | int16 {
      $$ = {
        type: 'int16',
        value: [$1.charCodeAt(1), $1.charCodeAt(2)]
      }
  }
  | float {
      var buf = Buffer.from($1.substr(1), 'binary');
      $$ = {
        type: 'float',
        value: Math.round(buf.readFloatLE() * 100) / 100
      }
  }
  ;

string8
  : b8  {
        var str = $1.replace(/\x00[\s\S]+?$/mg, "");
        $$ = { type: 'string', value: str }
  }
  ;
