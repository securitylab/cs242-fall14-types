var adt = require('adt'), data = adt.data, only = adt.only;

// NB: in the node.js console, nullary constructors show up
// as {}.  Unfortunately it's not clear how to get the tag
// to output.

var Pat = data(function () {
  return { Var : {name: only(String)}
         , Pair : {lhs: only(this), rhs: only(this)}
         , Cons : {head: only(this), tail: only(this)}
         , Nil : {}
         }
});

module.exports = Pat;
