"use strict";

exports.__esModule = true;
exports.NetworkErrorType = exports.HttpDataType = void 0;
var HttpDataType;
exports.HttpDataType = HttpDataType;

(function (HttpDataType) {
  HttpDataType["String"] = "String";
  HttpDataType["Json"] = "Json";
  HttpDataType["FormUrlEncoded"] = "FormUrlEncoded";
  HttpDataType["MultipartFormData"] = "MultipartFormData";
})(HttpDataType || (exports.HttpDataType = HttpDataType = {}));

var NetworkErrorType;
exports.NetworkErrorType = NetworkErrorType;

(function (NetworkErrorType) {
  NetworkErrorType["UnauthorizedOrLoggedOff"] = "UnauthorizedOrLoggedOff";
  NetworkErrorType["TemporaryUnavailable"] = "TemporaryUnavailable";
  NetworkErrorType["BadConnection"] = "BadConnection";
})(NetworkErrorType || (exports.NetworkErrorType = NetworkErrorType = {}));