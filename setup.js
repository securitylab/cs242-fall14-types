
var Expr = require('./lib/expr');
var Decl = require('./lib/decl');
var Pat = require('./lib/pat');
var Type = require('./lib/type');
 require('./lib/solver');


Type.Arrow(Type.Var("a"), Type.Var("a")).pretty()
Decl.parse('add (x, y) = x + y').pretty();

Type.Arrow(Type.Int, Type.Var("b")).occurs("a");
Type.Arrow(Type.Var("a"), Type.List(Type.Var("b"))).occurs("b");
