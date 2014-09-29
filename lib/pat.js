var adt = require('adt'), data = adt.data, only = adt.only;

// NB: in the node.js console, nullary constructors show up
// as {}.  Unfortunately it's not clear how to get the tag
// to output. Use .pretty() when possible

// pattern: variable | (pattern, pattern) | (pattern : pattern) | []
var Pat = data(function () {
  return { Var : {name: only(String)}
         , Pair : {fst: only(this), snd: only(this)}
         , Cons : {head: only(this), tail: only(this)}
         , Nil : null
         };
});
Pat.seal();

// Pretty print patterns
Pat.prototype.pretty = function() {
  if (this.isVar) {
    return this.name;
  } else if (this.isPair) {
    var fst = this.fst.pretty(0);
    var snd = this.snd.pretty(0);
    return '(' + fst + ',' + snd + ')';
  } else if(this.isCons) {
    var head = this.head.pretty(0);
    var tail = this.tail.pretty(0);
    return '(' + head + ':' + tail + ')';
  } else if (this.isNil) {
    return '[]';
  }
};

module.exports = Pat;
