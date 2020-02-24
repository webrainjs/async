"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var sapper = _interopRequireWildcard(require("SAPPER_MODULE/app"));

require("./initClientLog");

var _WebrainGraph = require("./components/dev/webrain/WebrainGraph");

var _APP_CONFIG_PATH = _interopRequireDefault(require("APP_CONFIG_PATH"));

var _Webrain = require("./components/app/Webrain");

var _facade = require("./brain/facade");

var _WindowController = require("./main/browser/helpers/html-controllers/WindowController");

/* eslint-env browser */
// noinspection NpmUsedModulesInstalled
// // region for Chrome App:
// if (!window.history.replaceState) {
// 	window.history.replaceState = () => {}
// }
// if (!window.history.pushState) {
// 	window.history.pushState = () => {}
// }
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
(0, _WindowController.createWindowController)(window, {
  windowName: 'Main',
  storeWindowState: true,
  resizable: true
});
_facade.brain.mainWindow.win = window;

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