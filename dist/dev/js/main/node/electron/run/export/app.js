"use strict";

var _server = require("../../helpers/server");

var _init = require("../init");

/* tslint:disable:no-var-requires */
var _require = require('electron'),
    app = _require.app;

if (!process.env.APP_CONFIG) {
  console.error('Environment variable APP_CONFIG is not defined', __filename);
  throw new Error('Environment variable APP_CONFIG is not defined');
}

var appConfig = require("../../../../../../configs/" + process.env.APP_CONFIG);

(0, _init.init)(app, appConfig, function () {
  var protocolName = 'app';
  app.setAsDefaultProtocolClient(protocolName);
  (0, _server.serveStatic)(app, protocolName, 'localhost', "dist/" + appConfig.type + "/sapper/export");
  return protocolName + '://localhost/app';
});