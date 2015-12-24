var fsLib = require("fs");
var isUtf8 = require("is-utf8");
var iconv = require("iconv-lite");

/* 读取文件并返回Unicode编码的字符串，以便在Node.js环境下进行文本处理 */
exports.getUnicode = function (filePath) {
  if (fsLib.existsSync(filePath)) {
    var buff = fsLib.readFileSync(filePath);
    return isUtf8(buff) ? buff.toString() : iconv.decode(buff, "gbk");
  }
  else {
    return null;
  }
};

/* 获取应用filter规则后的url */
exports.filteredUrl = function (_url, _filter) {
  _filter = _filter || {};
  var jsonstr = JSON.stringify(_filter).replace(/\\{2}/g, '\\');
  var filter = [];
  jsonstr.replace(/[\{\,]"([^"]*?)"/g, function (all, key) {
    filter.push(key);
  });

  var regx, ori_url;
  for (var k = 0, len = filter.length; k < len; k++) {
    regx = new RegExp(filter[k]);
    if (regx.test(_url)) {
      ori_url = _url;
      _url = _url.replace(regx, _filter[filter[k]]);
    }
  }
  return _url;
};

exports.wrapper = function (compiled, _url, param) {
  var result = '';
  var wrapper = param.define;
  var anonymous = param.anonymous;
  var packageName = '"' + exports.filteredUrl(_url, param.filter) + '"';

  if (wrapper) {
    result = wrapper + '(';

    if (!anonymous) {
      result += packageName + ',';
    }

    if (wrapper == "define") {
      result += "function(require,exports,module){module.exports=";
    }
    else {
      result += "function(){return ";
    }

    result += compiled + "});";
  }
  else {
    result = "window[" + packageName + "]=" + compiled;
  }

  return result;
}
