var helper = require("../lib/util");
var minimatch = require("minimatch");
var babel = require('babel-core');
var BABEL_DEFAULT_OPTIONS = {
	presets: ['es2015', 'stage-3'],
	sourceMaps: false,
	retainLines: true,
};

function extend(to, from) {
	var i;
	to = to || {};
	for(i in from) {
		to[i] = from[i];
	}
	return to;
}

module.exports = function (absPath, reqOpt, param, cb) {
	param.options.sourceRoot = absPath;
	var babelOptions = extend(BABEL_DEFAULT_OPTIONS, param.options);
  var content = helper.getUnicode(absPath);
  var code = babel.transform(content, babelOptions).code;

  if (!param.enable || content === null || /define\(/.test(content)) {
    cb({code: "PASS Engine"});
  } else {
		cb(null, "define(function(require,exports,module){" + code + "\n});", absPath, "application/javascript");
  }
};
