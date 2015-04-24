var helper = require("../lib/util");
var juicer = require("juicer");
var pathLib = require("path");

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
  "throw(error);",
  "};",

  "_method = _method || {};",
  "_method.__escapehtml = __escapehtml;",
  "_method.__throw = __throw;"
].join('');

module.exports = function (htmljsfile, reqOpt, param, cb) {
  var _url = reqOpt.path;
  var MIME = "application/javascript";

  var htmlfile = htmljsfile.replace(/(\.html)\.js$|(\.tpl)\.js$/, "$1$2");
  var tpl = helper.getUnicode(htmlfile);
  if (tpl !== null) {
    tpl = tpl.replace(/<!--\s{0,}#def([\s\S]*?)-->/gi, '');

    tpl = tpl.replace(/<!--\s{0,}#eachInclude[^\->]*?file\s{0,}=\s{0,}(["'])\s{0,}([^"']*?)\s{0,}\1\s{1,}(.+)\s{1,}as\s{1,}(.+)[^>]*?-->/gi, function (i, m1, m2, m3, m4) {
      var tempPath = pathLib.join(htmljsfile.replace(reqOpt.path, ''), m2);
      return "{@each " + m3 + " as " + m4 + "}" + (helper.getUnicode(tempPath) || '') + "{@/each}";
    });

    var compiled = juicer(tpl)._render.toString().replace(/^function anonymous[^{]*?{([\s\S]*?)}$/img, function ($, fn_body) {
      return "function(_, _method) {" + method_body + fn_body + "};\n";
    });

    var wrapper = param.define;
    var packageName = helper.filteredUrl(_url, param.filter);
    var result = '';

    if (!wrapper || "string" !== typeof wrapper || !!~["window", "global", "self", "parent", "Window", "Global"].indexOf(wrapper)) {
      result = "window[\"" + packageName + "\"] = " + compiled;
    }
    else if (param.anonymous) {
      result = wrapper + "(function(){return " + compiled + "});";
    }
    else {
      result = wrapper + "(\"" + packageName + "\", function () {return " + compiled + "});";
    }

    cb(false, result, htmlfile, MIME);
  }
  else {
    tpl = helper.getUnicode(htmljsfile);
    if (tpl !== null) {
      cb(false, tpl, htmljsfile, MIME);
    }
    else {
      cb({code: "Not Found"});
    }
  }
};
