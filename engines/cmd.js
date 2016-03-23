var helper = require("../lib/util");
var minimatch = require("minimatch");

module.exports = function (absPath, reqOpt, param, cb) {
  var content = helper.getUnicode(absPath);

  if (content === null || /define\(/.test(content) || !param.enable || param.ignore.some(function (rule) {
      return minimatch(reqOpt.path.replace(/^\//, ''), rule);
    })) {
    cb({code: "PASS Engine"});
  }
  else {
    cb(null, "define(function(require,exports,module){\n" + content + "\n});", absPath, "application/javascript");
  }
};
