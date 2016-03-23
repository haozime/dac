var helper = require("../lib/util");

module.exports = function (absPath, reqOpt, param, cb) {
  var anonymous = param.anonymous;
  var packageName = '"' + helper.filteredUrl(reqOpt.path, param.filter) + '",';

  var js = "define(" + (anonymous ? '' : packageName) + "function(require,exports,module){\n" +
    helper.getUnicode(absPath) +
    "\n});";

  cb(null, js, absPath, "application/javascript");
};
