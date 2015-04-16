var helper = require("../lib/util");
var less = require("less");

module.exports = function (pxcssfile, reqOpt, param, cb) {
  var MIME = "text/css";

  var xcssfile = pxcssfile.replace(/(\.less)\.css$/, "$1");
  var lesstext = helper.getUnicode(xcssfile);
  if (lesstext !== null) {
    less.render(lesstext, {
      paths: [],
      compress: false,
      filename: xcssfile
    }, function (e, result) {
      if (!e) {
        cb(e, result.css, xcssfile, MIME);
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
