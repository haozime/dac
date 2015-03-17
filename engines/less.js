var helper = require("../lib/util");
var less = require("less");

module.exports = function (xcssfile, url, param, cb) {
  xcssfile = xcssfile.replace(/(\.less)\.css$/, "$1");

  var lesstext = helper.getUnicode(xcssfile);
  if (lesstext !== null) {
    less.render(lesstext, {
      paths: [],
      compress: false,
      filename: xcssfile
    }, function(e, result) {
      if (!e) {
        cb(e, result.css, xcssfile, "text/css");
      }
      else {
        console.log(e);
        cb(e, lesstext, xcssfile, "text/css");
      }
    });
  }
  else {
    cb(true);
  }
};