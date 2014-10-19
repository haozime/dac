var Parser = require('less').Parser;
var parser = new Parser({
  processImports: false
});

var path = require('path');
var fs = require('fs');
var debug = require('mace').debug('dac:less');

exports.compress = function (rootdir, file) {
  // /a/b/c.less.css
  var dirname = path.dirname(file) + path.sep;

  function load (lesstxt) {
    return lesstxt.replace(/@import\s+(["'])(\S+?)\1;?/mg, function (t, f, file) {
      if (relpath[0] === '.') {
        file = path.resolve(dirname, file);
      }
      var filepath = path.join(rootdir, file);
      if (!/\.[a-z]{1,}$/i.test(filepath)) {
        filepath += ".less";
      }
      debug.log('compress less %s start', filepath);
      try {
        return fs.readFileSync(file).toString();
      } catch(e) {
        debug.error(e);
        return '';
      }
    });
  }
  return parser.parse(load('@import "'+file+'"'), function (e, tree) {
    if (e) {
      debug.error(e);
      return "/*Compress less error : " + file + "*/";
    }
    debug.done('compress less %s success', file);
    return tree.toCSS();
  }) + "\n";
}