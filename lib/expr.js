var adt = require('adt'), data = adt.data, only = adt.only;

var Expr = data(function () {
  return { Var   : {name: only(String)}
         , Int   : {val: only(Number)}
         , Bool  : {val: only(Boolean)}
         , If    : {cond: only(this), then: only(this), els: only(this)}
         , Nil   : {}
         , Lambda: {name: only(String), body: only(this)}
         , App   : {fun: only(this),  arg: only(this)}
         , Pair  : {fst: only(this), snd: only(this)}
         }
});

Expr.prototype.pretty = function() {
  // TODO
};

module.exports = Expr;

require('./eval');
