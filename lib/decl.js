var adt = require('adt'), data = adt.data, only = adt.only;

var Expr = require('./expr');
var Pat = require('./pat');

// declaration: name pattern = expression
var Decl = data(function() {
  return { Decl : {name : only(String), pat : only(Pat), body : only(Expr)} };
});
Decl.seal();

// Pretty print declarations
Decl.prototype.pretty = function() {
  return this.name + ' = ' + this.pat.pretty() + ' = ' + this.body.pretty();
};

// Pretty print a program
// A program is a list of declarations, separated by newline
// XXX never monkeypatch Array.prototype in real code
Array.prototype.pretty = function() {
  var arr = [];
  var isDecl = false;
  this.forEach(function (decl) {
    isDecl = isDecl || decl instanceof Decl;
    arr.push(decl.pretty());
  });
  return isDecl ? arr.join('\n') : '[' + arr.toString() + ']';
};

module.exports = Decl;

Decl.parse = require('./parser').parse;
