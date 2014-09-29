#!/usr/bin/env nodejs

var fs = require('fs');
var Decl = require('./lib/decl');
var Type = require('./lib/type');
var inferTypes = require('./lib/solver').inferTypes;

function usage() {
  var s = "\
Usage: \n\
    nodejs cli.js FILE\n"
  process.stderr.write(s);
  process.exit(1);
}

if (process.argv.length != 3) {
  usage();
}

var input = fs.readFileSync(process.argv[2], 'utf8');
var decls = Decl.parse(input);

console.log('type: %s',inferTypes(decls).pretty());
