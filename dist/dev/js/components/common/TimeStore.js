"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.now = void 0;

var _setInterval2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-interval"));

var _now = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/date/now"));

var _store = require("svelte/store");

var now = (0, _store.writable)((0, _now.default)());
exports.now = now;
(0, _setInterval2.default)(function () {
  now.set((0, _now.default)());
}, 1000);