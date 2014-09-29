var adt = require('adt'), data = adt.data, only = adt.only;

var Type = data(function () {
  return { Arrow : {from: only(this), to: only(this)}
         , Int : {}
         , Bool : {}
         , List : {elem: only(this)}
         , Pair : {fst: only(this), snd: only(this)}
         }
});

module.exports = Type;
