"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.toFormUrlEncoded = toFormUrlEncoded;
exports.toFormData = toFormData;
exports.prepareHttpRequest = prepareHttpRequest;

var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _http = require("./contracts/http");

// from: https://stackoverflow.com/a/37562814/5221762
function toFormUrlEncoded(args) {
  var formBody = [];

  for (var key in args) {
    if (Object.prototype.hasOwnProperty.call(args, key) && args[key] != null) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(args[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
  }

  return formBody.join('&');
}

function toFormData(args) {
  var formData = new FormData();

  for (var key in args) {
    if (Object.prototype.hasOwnProperty.call(args, key) && args[key] != null) {
      formData.append(key, args[key]);
    }
  }

  return formData;
}

function prepareHttpRequest(request) {
  if (request.method !== 'GET') {
    switch (request.dataType) {
      case _http.HttpDataType.FormUrlEncoded:
        request.data = toFormUrlEncoded(request.data);
        request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        break;

      case _http.HttpDataType.MultipartFormData:
        request.data = toFormData(request.data); // request.headers['Content-Type'] = 'multipart/form-data; boundary="d0987012-5c8b-471d-b79b-81fabac23628"'

        break;

      case _http.HttpDataType.Json:
        request.data = (0, _stringify.default)(request.data);
        request.headers['Content-Type'] = 'application/json; charset=UTF-8';
        break;

      default:
        throw new Error('Unknown dataType: ' + request.dataType);
    }
  }

  switch (request.responseDataType) {
    case _http.HttpDataType.String:
      request.headers.Accept = 'text/plain';
      break;

    case _http.HttpDataType.Json:
      request.headers.Accept = 'application/json';
      break;

    default:
      throw new Error('Unknown dataType: ' + request.responseDataType);
  }

  request.url = new _url.default(request.url, this.urlBase).href;
}