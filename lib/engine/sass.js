var sass = require('node-sass');
var fs = require('fs');
var path = require('path');
var debug = require('mace').debug('dac:sass');
exports.compress = function (rootdir, file) {
  file = path.join(rootdir, file);
  debug.warn('sass compress %s start', file);
  try {
    return sass.renderSync({
      data: fs.readFileSync(file).toString(),
      success: function () {
        debug.done('sass compress %s success', file);
      }
    }) + '\n';
  } catch(e) {
    debug.error(e);
    return '/* Compress sass error : ' + file + '*/';
  }
}