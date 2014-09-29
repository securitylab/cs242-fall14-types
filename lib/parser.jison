%{
var Expr = require('./expr');
var Decl = require('./decl');
var Pat = require('./pat');
%}

%lex

id			[a-z_]\w*

%%

"if" return 'if';
"then" return 'then';
"else" return 'else';
"[]" return '[]';
"True" return 'True';
"False" return 'False';
"\\" return '\\';
"->" return '->';
"=" return '=';
"==" return '==';
"+" return '+';
":" return ':';
"," return ',';
"(" return '(';
")" return ')';
"Int" return 'Int';
"Bool" return 'Bool';
[0-9]+\b  return 'INT';
{id} return 'NAME';
<<EOF>> return "EOF";
\n+ return 'NL';
\s+ /* skip */

/lex

%start Prog

%%

Prog
    : Decls EOF
    { $$ = $1; return $$; }
    | Decls NL EOF
    { $$ = $1; return $$; }
    ;

Decls
    : Decls NL Decl
    { $1.push($3); $$ = $1; }
    | Decl
    { $$ = [$1]; }
    ;

Decl
    : NAME Pat '=' Expr
        {$$ = Decl.Decl($1, $2, $4);}
    ;

Pat
    : NAME
        {$$ = Pat.Var($1);}
    | '(' Pat ',' Pat ')'
        {$$ = Pat.Pair($2, $4);}
    | '(' Pat ':' Pat ')'
        {$$ = Pat.Cons($2, $4);}
    | '[]'
        {$$ = Pat.Nil();}
    ;

Expr
    : '\\' NAME '->' Expr
        {$$ = Expr.Lambda($2, $4);}
    | 'if' Expr 'then' Expr 'else' Expr
        {$$ = Expr.If($2, $4, $6);}
    | Expr '+' Expr
        {$$ = Expr.App(Expr.App(Expr.Var("+"), $1), $3);}
    | Expr '==' Expr
        {$$ = Expr.App(Expr.App(Expr.Var("=="), $1), $3);}
    | FExpr
        {$$ = $1;}
    ;

FExpr
    : FExpr AExpr
        {$$ = Expr.App($1, $2);}
    | AExpr
        {$$ = $1;}
    ;

AExpr
    : INT
        {$$ = Expr.Int(parseInt($1));}
    | NAME
        {$$ = Expr.Var($1);}
    | 'True'
        {$$ = Expr.Bool(true);}
    | 'False'
        {$$ = Expr.Bool(false);}
    | '[]'
        {$$ = Expr.Nil();}
    | '(' Expr ',' Expr ')'
        {$$ = Expr.Pair($2, $4);}
    | '(' Expr ')'
        {$$ = $2;}
    ;
