var juicer = require('juicer'),
    fs = require('fs'),
    delog = require("debug.log"),
    sass = require('node-sass'),
    less = require('less'),
    iconv = require('iconv-lite');

var method_body = [
    "var __escapehtml = {",
    "escapehash: {",
    "'<': '&lt;',",
    "'>': '&gt;',",
    "'&': '&amp;',",
    "'\"': '&quot;',",
    "\"'\": '&#x27;',",
    "'/': '&#x2f;'",
    "},",
    "escapereplace: function(k) {",
    "return __escapehtml.escapehash[k];",
    "},",
    "escaping: function(str) {",
    "return typeof(str) !== 'string' ? str : str.replace(/[&<>\"]/igm, this.escapereplace);",
    "},",
    "detection: function(data) {",
    "return typeof(data) === 'undefined' ? '' : data;",
    "}",
    "};",

    "var __throw = function(error) {",
    "if(typeof(console) !== 'undefined') {",
    "if(console.warn) {",
    "console.warn(error);",
    "return;",
    "}",

    "if(console.log) {",
    "console.log(error);",
    "return;",
    "}",
    "}",

    "throw(error);",
    "};",

    "_method = _method || {};",
    "_method.__escapehtml = __escapehtml;",
    "_method.__throw = __throw;"
].join('');

function cosoleResp(type, c) {
    c += " [" + type + ']';

    switch (type) {
        case "Need":
            delog.request(c);
            break;
        case "Compile":
        case "Embed":
            delog.process(c);
            break;
        case "Disable":
            c = "<= " + c;
        case "Error":
            delog.error(c);
            break;
        case "Local":
        case "Remote":
        case "Cache":
            delog.response(c);
            console.log('');
            break;
        case "Actually":
        default:
            delog.log(c);
    }
}

function lessCompiler(xcssfile, charset, absPath) {
    var lesstxt = iconv.decode(fs.readFileSync(xcssfile), charset);

    lesstxt = lesstxt.replace(/\@import\s+["'](.+)["']\;/g, function (t, basename) {
        var filepath = path.join(path.dirname(xcssfile), basename);
        if (!/\.[a-z]{1,}$/i.test(filepath)) {
            filepath += ".less";
        }

        if (fs.existsSync(filepath)) {
            cosoleResp("Embed", filepath);
            return iconv.decode(fs.readFileSync(filepath), charset);
        }
        else {
            return '';
        }
    });

    cosoleResp("Compile", xcssfile);

    var content = new (less.Parser)({processImports: false})
        .parse(lesstxt, function (e, tree) {
            cosoleResp("Local", absPath ? absPath : xcssfile);
            return tree.toCSS();
        });

    return content + "\n";
}

function scssCompiler(xcssfile, charset, absPath) {
    cosoleResp("Compiling", xcssfile);

    var content = sass.renderSync({
        data: iconv.decode(fs.readFileSync(xcssfile), charset),
        success: function (css, map) {
            cosoleResp("Local", absPath ? absPath : xcssfile);
        }
    });

    return content + "\n";
}

exports.jstpl = function(absPath, charset, revPath, namespace, anon) {
    namespace = namespace || '';
    anon = anon ? true : false;

    // 前后端模板一致化，如果是*.html.js格式的请求，则编译*.html为juicer的function格式返回
    if (/\.html\.js$/i.test(absPath)) {
        var htmlName = absPath.replace(/\.js$/, '');
        try {
            var compiled = juicer(fs.readFileSync(htmlName).toString())._render.toString().replace(/^function anonymous[^{]*?{([\s\S]*?)}$/igm, function ($, fn_body) {
                return 'function(_, _method) {' + method_body + fn_body + '};\n';
            });
        }
        catch (e) {
            cosoleResp('Error', 'Compile failed with error ' + e.message);
            return '';
        }

        var templateFunction = '';
        // 未声明需要哪个定义模块  OR 声明的错误 OR 声明的是 window
        if (
            !namespace ||
                'string' !== typeof namespace || !!~['window', 'global', 'self', 'parent', 'Window', 'Global'].indexOf(namespace)
            ) {
            templateFunction = 'window["/' + revPath + '"] = ' + compiled;
        }
        else {
            if (anon) {
                templateFunction = namespace + '(function(){return ' + compiled + '});';
            }
            else {
                templateFunction = namespace + '("' + revPath + '", function () {return ' + compiled + '});';
            }
        }

        cosoleResp('Compile', htmlName);
        cosoleResp('Local', absPath);

        return iconv.encode(templateFunction, charset);
    }

    return null;
}

exports.css = function(absPath, charset) {
    // 处理css, Added by jayli, Enhanced by liming.mlm
    if (/\.css$/i.test(absPath)) {
        var xcssfile = absPath.replace(/\.css$/i, '');

        // less文件解析 less.css => .less
        if (/\.less\.css$/i.test(absPath) && fs.existsSync(xcssfile)) {
            return lessCompiler(xcssfile, charset, absPath);
        }

        // scss文件解析 scss.css => scss
        if (/\.scss\.css$/i.test(absPath) && fs.existsSync(xcssfile)) {
            return scssCompiler(xcssfile, charset, absPath);
        }

        // .css => .less
        xcssfile = absPath.replace(/\.css$/i, '.less');
        if (!fs.existsSync(absPath) && fs.existsSync(xcssfile)) {
            return lessCompiler(xcssfile, charset);
        }
        // .css => .scss
        xcssfile = absPath.replace(/\.css$/i, '.scss');
        if (!fs.existsSync(absPath) && fs.existsSync(xcssfile)) {
            return scssCompiler(xcssfile, charset);
        }
    }

    return null;
}