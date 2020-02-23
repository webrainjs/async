"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.scraper = void 0;

var _padEnd = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/pad-end"));

var _FetchHttpClient = require("../../common/api/FetchHttpClient");

var _fetchCached = require("../../common/scraper/fetch-cached");

var _Scraper = require("../../common/scraper/Scraper");

var _cache = require("./cache");

var _helpersCjs = require("./helpers-cjs");

// @ts-ignore
var httpClient = new _FetchHttpClient.FetchHttpClient({
  fetch: (0, _fetchCached.fetchCached)({
    fetch: _helpersCjs.nodeFetch,
    cache: (0, _cache.createCache)('Scraper', 0)
  })
});
var startCount = 0;
httpClient.loadingObservable.subscribe(function (e) {
  var _context;

  startCount++;
  console.log('START ' + (0, _padEnd.default)(_context = startCount.toString()).call(_context, 5, ' ') + e.url);
});
var endCount = 0;
httpClient.loadedObservable.subscribe(function (e) {
  var _context2;

  endCount++;
  console.log('END   ' + (0, _padEnd.default)(_context2 = endCount.toString()).call(_context2, 5, ' ') + e.url);
});
httpClient.errorObservable.subscribe(function (e) {
  var _context3;

  endCount++;
  console.log('ERROR ' + (0, _padEnd.default)(_context3 = endCount.toString()).call(_context3, 5, ' ') + e.url);
});
var scraper = new _Scraper.Scraper({
  httpClient: new _FetchHttpClient.FetchHttpClient({
    fetch: (0, _fetchCached.fetchCached)({
      fetch: _helpersCjs.nodeFetch,
      cache: (0, _cache.createCache)('Scraper', 0)
    })
  })
});
exports.scraper = scraper;