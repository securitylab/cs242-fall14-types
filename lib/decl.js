var adt = require('adt'), data = adt.data, only = adt.only;

var Expr = require('./expr');
var Pat = require('./pat');
var Decl = data(function() {
  return { Decl : {name : only(String), pat : only(Pat), body : only(Expr)}
         }
});

module.exports = Decl;

Decl.parse = require('./parser').parse;
