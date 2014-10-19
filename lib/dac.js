var fs = require('fs');
var path = require("path");
var util = require('mace');
var debug = util.debug('dac');
var url = require('url');
exports = module.exports = function (rootdir, filepath) {
  var extname = pathname.match(/\.[\.a-z]+$/i);
  if (!extname || typeof extname !== 'string') {
    return false;
  }
  var engine = exports.engine(extname);
  if (!engine) {
    return false;
  }
  return engine.compress.apply(null, arguments);
};

exports.engine = function (extname) {
  var enginePath = __dirname + '/engine/' + config.supports[extname[0]]  + '.js'; 
  try {
    return require(enginePath);
  } catch (e) {
    return false;
  }
}
exports.config = {
  'rootdir': '',
  'supports': {
    ".html": "juicer",
    ".htm":"juicer",
    "":'juicer',
    ".less.css": "less",
    ".sass.css": "sass",
    ".html.js": "jpl",
    ".tpl.js": "jpl",
    ".htm.js": "jpl"
  }
};