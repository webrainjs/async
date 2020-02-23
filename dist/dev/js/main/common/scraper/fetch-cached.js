"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.fetchCached = fetchCached;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

/*
* Returns a fetch function wrapped with cache to be used as normal fetch
*/
// https://github.com/janneh/fetch-cached
function fetchCached(_ref) {
  var _fetch = _ref.fetch,
      cache = _ref.cache;

  if (!_fetch) {
    throw Error('fetch is a required option');
  }

  if (!cache) {
    throw Error('cache is a required option');
  }

  function cachedResponse(url, body) {
    if (!body) {
      return null;
    }

    return _promise.default.resolve({
      ok: true,
      url: url,
      status: 200,
      statusText: 'OK',
      json: function json() {
        return _promise.default.resolve(JSON.parse(body));
      },
      text: function text() {
        return _promise.default.resolve(body);
      },
      textConverted: function textConverted() {
        return _promise.default.resolve(body);
      }
    });
  }

  function cachingFetch(key, url, options) {
    return _fetch(url, options).then(function (response) {
      response.clone().text().then(function (value) {
        cache.set(key, value);
      });
      return _promise.default.resolve(response);
    });
  }

  return function cachedFetch(url, options) {
    if (options === void 0) {
      options = {};
    }

    // return plain fetch for non-GET requests
    // if (options.method && options.method !== 'GET') {
    // 	return _fetch(url, options)
    // }
    var key = url + '\n' + (0, _stringify.default)(options);
    return cache.get(key).then(function (data) {
      return cachedResponse(url, data);
    }).then(function (cached) {
      // return the cached result if it exist
      if (cached) {
        return cached;
      } // return fetch request after setting cache


      return cachingFetch(key, url, options);
    });
  };
}