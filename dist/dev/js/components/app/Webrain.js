"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.openWebrainWindow = openWebrainWindow;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _WindowController = require("../../main/browser/helpers/html-controllers/WindowController");

var _ComponentWindow = require("../common/ComponentWindow");

var _WebrainWindow = _interopRequireDefault(require("./WebrainWindow.svelte"));

// @ts-ignore
var webrainWindow = new _ComponentWindow.ComponentWindow({
  windowControllerFactory: new _WindowController.WindowControllerFactory({
    windowName: 'Webrain'
  }),
  componentClass: _WebrainWindow.default
});

function openWebrainWindow() {
  return _openWebrainWindow.apply(this, arguments);
}

function _openWebrainWindow() {
  _openWebrainWindow = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            webrainWindow.windowController.show();

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _openWebrainWindow.apply(this, arguments);
}