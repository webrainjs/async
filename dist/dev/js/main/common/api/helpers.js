"use strict";

exports.__esModule = true;
exports.toFormUrlEncoded = toFormUrlEncoded;
exports.toFormData = toFormData;

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