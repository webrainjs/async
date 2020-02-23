"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var sapper = _interopRequireWildcard(require("SAPPER_MODULE/app"));

require("./initClientLog");

var _WebrainGraph = require("./components/dev/webrain/WebrainGraph");

var _APP_CONFIG_PATH = _interopRequireDefault(require("APP_CONFIG_PATH"));

var _Webrain = require("./components/app/Webrain");

var _WindowController = require("./main/browser/helpers/html-controllers/WindowController");

/* eslint-env browser */
// noinspection NpmUsedModulesInstalled
// import {brain} from './brain/facade' // TODO
var appWindow;
var appOrigin;
window.addEventListener('message', function (e) {
  if (e.data === 'init') {
    appWindow = e.source;
    appOrigin = e.origin;
    console.log("appWindow subscribed: " + appOrigin);
  }
});

_WebrainGraph.webrainGraph.init();

sapper.start({
  target: document.querySelector('#sapper')
});
(0, _WindowController.createWindowController)({
  windowName: 'Main',
  storeWindowState: true,
  win: window
}); // brain.mainWindow.win = window // TODO

if (window.tray) {
  window.tray.subscribe('click', function (e) {
    if (e.id === 'icon') {
      // brain.mainWindow.show() // TODO
      window.widget.updateState({
        isVisible: true
      });
    }
  });
}

if (_APP_CONFIG_PATH.default.dev) {
  window.addEventListener('keydown', function (e) {
    if (e.key === 'F10') {
      (0, _Webrain.openWebrainWindow)();
    }
  });
}

if (!window.minimize) {
  window.minimize = function () {
    if (appWindow) {
      appWindow.postMessage('minimize', appOrigin);
      return true;
    }

    return false;
  };
} // Prevent to close window:
// if (window.minimize) {
// 	window.onbeforeunload = function () {
// 		return window.minimize() !== false || void 0
// 	}
// }