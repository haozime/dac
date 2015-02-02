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
exports.filteredUrl = function (_url, filter) {
  filter = filter || {};
  var regx;
  var ori_url;
  for (var fk in filter) {
    regx = new RegExp(fk);
    if (_url.match(regx)) {
      ori_url = _url;
      _url = _url.replace(regx, filter[fk]);
    }
  }
  return _url;
}