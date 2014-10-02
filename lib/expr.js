var adt = require('adt'), data = adt.data, only = adt.only;

// expression: variable | Int-literal | Bool-literal |
//             if expression then expression else expression |
//             [] | (\ name -> expression) | expression expression |
//             (expression, expression)
//
// Operations on Int's and Bool's are not baked in: we reuse
// applications and lambda's.
//
// For example: x + y  is treated as ((+ x) y)
//              x == y is treated as ((== x) y)
var Expr = data(function () {
  return { Var   : {name: only(String)}
         , Int   : {val: only(Number)}
         , Bool  : {val: only(Boolean)}
         , If    : {cond: only(this), then: only(this), else_: only(this)}
         , Nil   : null
         , Lambda: {name: only(String), body: only(this)}
         , App   : {fun: only(this),  arg: only(this)}
         , Pair  : {fst: only(this), snd: only(this)}
         };
});
Expr.seal();

// Pretty print expressions
Expr.prototype.pretty = function(depth) {
  depth = depth || 0;

  if (this.isVar) {
    if (/^[a-z_]\w*/.test(this.name)) {
      return this.name;
    } else {
      return '(' + this.name + ')';
    }
  } else if (this.isInt) {
    return this.val.toString();
  } else if (this.isBool) {
    return captialize(this.val.toString());
  } else if (this.isIf) {
    var cond = this.cond.pretty(depth+1);
    var then = this.then.pretty(depth+1);
    var el   = this.else_.pretty(depth+1);
    return parens(['if',cond,'then',then,'else',el].join(' '), depth);
  } else if (this.isNil) {
    return '[]';
  } else if (this.isLambda) {
    var body = this.body.pretty(depth+1);
    return parens('\\' + this.name + ' -> ' + body, depth);
  } else if (this.isApp) {
    var lhs = this.fun.pretty(depth+1);
    var rhs = this.arg.pretty(depth+1);
    return parens(lhs + ' ' + rhs, depth);
  } else if (this.isPair) {
    var fst = this.fst.pretty(0);
    var snd = this.snd.pretty(0);
    return '(' + fst + ',' + snd + ')';
  }
};

module.exports = Expr;

function captialize(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function parens(str, depth) {
  if (depth > 0) {
    return '(' + str + ')';
  }
  return str;
}
