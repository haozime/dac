var debug = require('mace').debug('dac:load');
exports.compress = function (rootdir, file) {
  var filepath = require('path').join(rootdir, file);
  debug.log('load local file %s start', filepath);
  try {
    return require('fs').readFileSync(filepath).toString();
  } catch (e) {
    debug.error('load local file %s failed', filepath);
    debug.error(e);
    return '/*Load failed '+filepath+'*/';
  }
}