"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.md5 = md5;
exports.escapeJs = escapeJs;
exports.escapeHtml = escapeHtml;
exports.delay = delay;
exports.removeExcessSpaces = removeExcessSpaces;
exports.getGlobalScope = getGlobalScope;
exports.globalScope = void 0;

var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _helpersCjs = require("./helpers-cjs");

// @ts-ignore
function md5(str) {
  var spark = new _helpersCjs.SparkMD5();
  spark.append(str);
  return spark.end();
}

function escapeJs(str) {
  return str && str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}

function escapeHtml(str) {
  return _helpersCjs.html.escape(str);
}

function delay(timeMilliseconds) {
  return new _promise.default(function (resolve) {
    return (0, _setTimeout2.default)(resolve, timeMilliseconds);
  });
}

var _spacesRegex = new RegExp('\\s+');

var _spacesWithoutNewLinesRegex = new RegExp('[^\\S\\n]+');

var _fixNewLines = new RegExp('([^\\S\\n]*\\n[^\\S\\n]*)');

function removeExcessSpaces(text, keepLines) {
  if (!text) {
    return text;
  }

  if (keepLines) {
    var _context;

    text = (0, _trim.default)(_context = text.replace(_spacesWithoutNewLinesRegex, ' ')).call(_context);
    text = text.replace(_fixNewLines, '\\r\\n');
    text = text.replace(new RegExp('((\\r\\n){' + keepLines + '})[\\r\\n]*'), '$1');
  } else {
    var _context2;

    text = (0, _trim.default)(_context2 = text.replace(_spacesRegex, ' ')).call(_context2);
  }

  return text;
}

function getGlobalScope() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return null;
}

var globalScope = getGlobalScope();
exports.globalScope = globalScope;