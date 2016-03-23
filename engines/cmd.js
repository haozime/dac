var helper = require("../lib/util");

module.exports = function (absPath, reqOpt, param, cb) {
  var content = helper.getUnicode(absPath);

  var regxStr = "define\\(" + (param.ignore ? ('|' + param.ignore) : '');
  if (new RegExp(regxStr).test(content) || !param.enable) {
    cb({msg: "PASS Engine"});
  }
  else {
    cb(null, "define(function(require,exports,module){\n" + content + "\n});", absPath, "application/javascript");
  }
};
