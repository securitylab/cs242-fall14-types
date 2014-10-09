var _ = require('underscore');

// General implementation of typing contexts (or substitutions)
//
// External API
// 
// # Creating contexts:
//
// - You create immutable and mutable contexts with the Ctx()and
//   MutCtx() constructors, respectively.
// - You can pass the constructor another context (mutable or
//   otherwise) and it will 'clone' it.
//
// # Adding elements to context:
//
// - Use the 'add' method. E.g., ctx.add("x", type). If the context
//   is immutable it add will return a new context; if it is mutable
//   it will update the context and return it.
//
// # Checking if a name is in the context:
//
// - Use the 'binds' method to check if a name is mapped in the
//   context.
//
// # Getting type for a name:
//
// - Use the 'get' method to get the type for a certain name. E.g.,
//   ctx.get("x");
//
// # Get array representation:
//
// - Use the 'toArray' method to get a copy of the internal mapping.
//   The array will contain objects with two properties 'name' and
//   'type'.

function Ctx(arr) {
  if (!this instanceof Ctx) {
    return new Ctx(arr);
  }

  if (arr instanceof Ctx) {
    var ctx = arr.clone();
    this.arr        = ctx.arr;
    this._immutable = ctx._immutable;
  } else {
    this.arr       = arr || [];
    this._immutable = false;
  }
}

Ctx.prototype.add = function(name, type) {
  if (this._immutable) {
    // Clone context
    var ctx = this.clone();
    ctx.mutable();
    ctx.add(name, type)
    ctx.immutable();
    return ctx;
  }
  if (this.binds(name)) {
    var t = _.find(this.arr, function(t) { return t.name === name; });
    t.type = type;
  } else {
    this.arr.push({name : name, type: type});
  }

  return this;
};

Ctx.prototype.binds = function(name) {
  return _.some(this.arr, function(t) {
    return t.name === name;
  });
};

Ctx.prototype.get = function(name) {
  return _.find(this.arr, function(t) {
    return t.name === name;
  }).type;
};

Ctx.prototype.immutable = function() {
  this._immutable = true;
  return this;
};

Ctx.prototype.mutable = function() {
  this._immutable = false;
  return this;
};

Ctx.prototype.clone = function() {
  var arr = [];
  _.each(this.arr, function(t) {
    arr.push({name: t.name, type: t.type});
  });
  var ctx = new Ctx(arr);
  ctx._immutable = this._immutable;
  return ctx;
};

Ctx.prototype.toArray = function() {
  return this.arr.slice(0);
};


// Expose two context types: immutable (Ctx) and mutable (MutCtx).
// Can create a new context by passing an object of either type to
// either contructor.
exports.Ctx = function(arr) {
  var ctx = new Ctx(arr);
  return ctx.immutable();
};

exports.MutCtx = function(arr) {
  var ctx = new Ctx(arr);
  return ctx.mutable();
};
