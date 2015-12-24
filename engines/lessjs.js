var lessLayer = require("./less");
var CleanCSS = require("clean-css");
var helper = require("../lib/util");

var toString = function (compiled) {
  var styles = new CleanCSS().minify(compiled).styles;
  styles = styles.replace(/(")/g, function (all, q) {
    return '\\' + q;
  });
  return '"' + styles + '"';
};

module.exports = function (absPath, reqOpt, param, cb) {
  absPath = absPath.replace(/\.js$/, '');

  var MIME = "application/javascript";

  if (/\.less\.css$/.test(absPath)) {
    lessLayer(absPath, reqOpt, param, function (err, compiled, pxcssfile) {
      if (err) {
        cb(err);
      }
      else {
        cb(null, helper.wrapper(toString(compiled), reqOpt.path, param), pxcssfile, MIME);
      }
    });
  }
  else {
    var compiled = helper.getUnicode(absPath);
    if (compiled) {
      cb(null, helper.wrapper(toString(compiled), reqOpt.path, param), absPath, MIME);
    }
    else {
      cb({code: "Not Found"});
    }
  }
};
