
var Expr = require('./lib/expr');
var Decl = require('./lib/decl');
var Pat = require('./lib/pat');

var Set = require('immutable').Set;

Decl.parse("f (x:xs) = x\nf [] = []");
