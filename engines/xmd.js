var helper = require("../lib/util");

module.exports = function (absPath, reqOpt, param, cb) {
  var content = helper.getUnicode(absPath);

  if (content === null) {
    cb({code: "PASS Engine"});
  }
  else {
    var MIME = "application/javascript";
    var path = reqOpt.path.replace(/^\//, '');
    
    if (helper.matchPath(path, param.cmd) && !/define\(/.test(content)) {
      cb(null, "define(function(require,exports,module){\n" + content + "\n});", absPath, MIME);
    }
    else if (helper.matchPath(path, param.kmd) && !/KISSY\./.test(content)) {
      cb(null, "KISSY.add(function(S,require,exports,module){\n" + content + "\n});", absPath, MIME);
    }
    else {
      cb({code: "PASS Engine"});
    }
  }
};
