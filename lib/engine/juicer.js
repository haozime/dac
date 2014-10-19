var J = require('juicer');
var fs = require('fs');
var path = require('path');
var debug = require('mace').debug('dac:juicer');

require('./_juicerExtends.js').extend(J);

exports.compress = function (rootdir, file, scope) {
  var dirname = path.dirname(file) + path.sep;
  function load (tpltxt) {
    return tpltxt.replace(/\{\@include\s+[\/\\a-z0-9\_\.]+\}/, function ($, file) {
      if (file[0] === '.') {
        file = path.resolve(dirname, file);
      }
      var filepath = path.join(rootdir, file);
      if (!/\.[a-z]{1,}$/i.test(filepath)) {
        filepath += ".html";
      }

      try {
        // need circle load check
        return load(fs.readFileSync(filepath).toString());
      } catch(e) {
        debug.error(e);
        return '/*Error compress juicer ' + filepath + '*/';
      }
    });
  }
  try {
    return J(load('{@include ' + file + '}'), scope || {});
  } catch (e) {
    debug.error(e);
    return false;
  }
};