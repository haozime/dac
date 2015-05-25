var helper = require("../lib/util");
var less = require("less");
var path = require("path");
var plugins = require("../lib/less-plugins")(less);
less.functions.functionRegistry.addMultiple(plugins.functions);

module.exports = function (pxcssfile, reqOpt, param, cb) {
  var MIME = "text/css";

  var isMap = false;
  if (/\.map$/.test(pxcssfile)) {
    isMap = true;
    pxcssfile = pxcssfile.replace(/\.map$/, '');
  }

  var xcssfile = pxcssfile.replace(/(\.less)\.css$/, "$1");
  var renderOpt = {
    paths: [],
    compress: false,
    filename: xcssfile
  };
  if (isMap || param._sourcemap) {
    renderOpt.sourceMap = {
      sourceMapBasepath: path.dirname(pxcssfile),
      sourceMapURL: path.basename(pxcssfile) + ".map"
    };
  }

  var lesstext = helper.getUnicode(xcssfile);
  if (lesstext !== null) {
    less.render(lesstext, renderOpt, function (e, result) {
      if (!e) {
        cb(e, (isMap ? result.map : result.css), xcssfile, (isMap ? "application/json" : MIME));
      }
      else {
        console.log(e);
        cb(e, "/* " + xcssfile + " */", xcssfile, MIME);
      }
    });
  }
  else {
    lesstext = helper.getUnicode(pxcssfile);
    if (lesstext !== null) {
      cb(false, lesstext, pxcssfile, MIME);
    }
    else {
      cb({code: "Not Found"});
    }
  }
};
