var helper = require("../lib/util");
var babel  = require("babel-core");

var BABEL_DEFAULT_OPTIONS = {
  presets: ["es2015", "stage-3"],
  sourceMaps: false,
  retainLines: true
};

function extend(to, from) {
  var i;
  to = to || {};
  for (i in from) {
    to[i] = from[i];
  }
  return to;
}

module.exports = function (absPath, reqOpt, param, cb) {
  var content = typeof absPath == "object" ? absPath.content : helper.getUnicode(absPath);

  if (content === null) {
    cb({code: "PASS Engine"});
  }
  else if (!param.enable) {
    cb(null, content, absPath, "application/javascript");
  }
  else {
    //param.options.sourceRoot = absPath;
    //var babelOptions = extend(BABEL_DEFAULT_OPTIONS, param.options);
    //var code = babel.transform(content, babelOptions).code;
    cb(null, "var a = 1;", absPath, "application/javascript");
  }
};
