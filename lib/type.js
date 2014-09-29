var _   = require('underscore');
var adt = require('adt'), data = adt.data, only = adt.only;
var Ctx = require('./ctx').Ctx;

// type: type-variable | type -> type | Int | Bool | [type] | (type, type)
var Type = data(function () {
  return { Var : {name: only(String)}
         , Arrow : {from: only(this), to: only(this)}
         , Int : null
         , Bool : null
         , List : {elem: only(this)}
         , Pair : {fst: only(this), snd: only(this)}
         };
});

// Single substitution.
// @param {String}      name, of type varialb
// @param {Type}        type, to be substituded for
// @returns {Type} new type with name replaced by type
Type.prototype.subst = function(name, type) {
  var s = Ctx().add(name, type);
  return this.multiSubst(s);
};

// Pretty print substitution.
// @param {Ctx}         multiSubst, the substitution
// @returns {String} prettified substituion map, one per line
function substToString(multiSubst) {
  return _.map(multiSubst.toArray(), function(s) {
    return '[' + s.name + ' :-> ' + s.type.pretty() + ']';
  }).join('\n');
}

// Apply multiple substitutions.
// @param {Ctx}      subst, the typing context
// @returns {Type} new type with all names replaced the corresponding types
Type.prototype.multiSubst = function(subst) {
  if (this.isVar && subst.binds(this.name)) {
    return subst.get(this.name);
  } else if (this.isArrow) {
    return Type.Arrow(this.from.multiSubst(subst), this.to.multiSubst(subst));
  } else if (this.isList) {
    return Type.List(this.elem.multiSubst(subst));
  } else if (this.isPair) {
    return Type.Pair(this.fst.multiSubst(subst), this.snd.multiSubst(subst));
  } else {
    return this;
  }
};

// Pretty print types
Type.prototype.pretty = function(n) {
  n = (n === undefined) ? -1 : n;
  function paren(m, str) {
    if (m > n) return str;
    return "(" + str + ")";
  }
  if (this.isVar) {
    return this.name;
  } else if (this.isArrow) {
    return paren(1, this.from.pretty(1) + " -> " + this.to.pretty(0));
  } else if (this.isInt) {
    return "Int";
  } else if (this.isBool) {
    return "Bool";
  } else if (this.isList) {
    return "[" + this.elem.pretty(0) + "]";
  } else if (this.isPair) {
    return "(" + this.fst.pretty(0) + ", " + this.snd.pretty(0) + ")";
  }
};

module.exports = Type;
