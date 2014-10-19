var J = require('juicer');
require('./_juicerExtends.js').extend(J);
var fs = require('fs');
var path = require('path');
var debug = require('mace').debug('dac:jpl');
var method_body = [
  "var __escapehtml = {",
  "escapehash: {",
  "'<': '&lt;',",
  "'>': '&gt;',",
  "'&': '&amp;',",
  "'\"': '&quot;',",
  "\"'\": '&#x27;',",
  "'/': '&#x2f;'",
  "},",
  "escapereplace: function(k) {",
  "return __escapehtml.escapehash[k];",
  "},",
  "escaping: function(str) {",
  "return typeof(str) !== 'string' ? str : str.replace(/[&<>\"]/igm, this.escapereplace);",
  "},",
  "detection: function(data) {",
  "return typeof(data) === 'undefined' ? '' : data;",
  "}",
  "};",

  "var __throw = function(error) {",
  "if(typeof(console) !== 'undefined') {",
  "if(console.warn) {",
  "console.warn(error);",
  "return;",
  "}",

  "if(console.log) {",
  "console.log(error);",
  "return;",
  "}",
  "}",

  "throw(error);",
  "};",

  "_method = _method || {};",
  "_method.__escapehtml = __escapehtml;",
  "_method.__throw = __throw;"
].join('');

exports.compress = function(rootdir, file, pkgPath, define, anonymous) {
  define = define || 'window';
  anonymous = !!anonymous;
  var dirname = path.dirname(file) + path.sep;
  function load (tpltxt) {
    return tpltxt.replace(/\{\@include\s+[\/\\a-z0-9\_\.]+\}/, function ($, file) {
      if (file[0] === '.') {
        file = path.resolve(dirname, file);
      }
      var filepath = path.join(rootdir, file);
      if (!/\.[a-z]{1,}$/i.test(filepath)) {
        filepath += ".html";
      }

      try {
        // circle load check
        return load(fs.readFileSync(filepath).toString());
      } catch(e) {
        debug.error(e);
        return '/*Error compress juicer ' + filepath + '*/';
      }
    });
  }
  try {
    var compiled = J(load('{@include ' + file + '}'))._render.toString().replace(/^function anonymous[^{]*?{([\s\S]*?)}$/igm, function ($, fn_body) {
      return 'function(_, _method) {' + method_body + fn_body + '};\n';
    });
  } catch (e) {
    debug.error(e);
    return '/*Error compress juicer ' + path.join(rootdir, file) + '*/';
  }
  var templateFunction = '';
  if (
    !define || 
    'string' !== typeof define || 
    !!~[
        'window'
      , 'global'
      , 'self'
      , 'parent'
      , 'Window'
      , 'Global'
    ].indexOf(define)
  ) {
    debug('no define method found for %s using window as default',pkgPath);
    return ';window["' + pkgPath + '"]' + compiled;
  }
  if (anonymous) {
    debug('define anonymous package with %s', pkgPath);
    return define + '(function () {return ' + compiled + ';});';
  }
  debug('using define with pkgPath %s ', pkgPath);
  return define+ '("'+pkgPath+'", function () {return '+compiled+';});';
};