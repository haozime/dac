var helper = require("../lib/util");
var babel  = require("babel-core");
var es2015 = require("babel-preset-es2015");
var stage3 = require("babel-preset-stage-3");

var BABEL_DEFAULT_OPTIONS = {
  presets: [es2015, stage3],
  sourceMaps: false,
  retainLines: true
};

module.exports = function (absPath, reqOpt, param, cb) {
  var content = typeof absPath == "object" ? absPath.content : helper.getUnicode(absPath);

  if (content === null) {
    cb({code: "PASS Engine"});
  }
  else if (!param.enable) {
    cb(null, content, absPath, "application/javascript");
  }
  else {
    var babelOptions = helper.extend(BABEL_DEFAULT_OPTIONS, param.options);
    cb(null, babel.transform(content, babelOptions).code, absPath, "application/javascript");
  }
};
