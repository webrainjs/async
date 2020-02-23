"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _init = require("../init");

var _debug = _interopRequireDefault(require("../../../../../../configs/debug"));

/* tslint:disable:no-var-requires */
var _require = require('electron'),
    app = _require.app;

(0, _init.init)(app, _debug.default, function () {
  return "http://localhost:" + _debug.default.sapper.port + "/app/";
});