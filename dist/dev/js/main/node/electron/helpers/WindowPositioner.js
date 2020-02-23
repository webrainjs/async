"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.WindowPositioner = exports.WindowPosition = void 0;

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _electron = require("electron");

var WindowPosition;
exports.WindowPosition = WindowPosition;

(function (WindowPosition) {
  WindowPosition["TrayLeft"] = "trayLeft";
  WindowPosition["TrayBottomLeft"] = "trayBottomLeft";
  WindowPosition["TrayRight"] = "trayRight";
  WindowPosition["TrayBottomRight"] = "trayBottomRight";
  WindowPosition["TrayCenter"] = "trayCenter";
  WindowPosition["TrayBottomCenter"] = "trayBottomCenter";
  WindowPosition["TopLeft"] = "topLeft";
  WindowPosition["TopRight"] = "topRight";
  WindowPosition["BottomLeft"] = "bottomLeft";
  WindowPosition["BottomRight"] = "bottomRight";
  WindowPosition["TopCenter"] = "topCenter";
  WindowPosition["BottomCenter"] = "bottomCenter";
  WindowPosition["LeftCenter"] = "leftCenter";
  WindowPosition["RightCenter"] = "rightCenter";
  WindowPosition["Center"] = "center";
})(WindowPosition || (exports.WindowPosition = WindowPosition = {}));

var trayPositions = [WindowPosition.TrayLeft, WindowPosition.TrayBottomLeft, WindowPosition.TrayRight, WindowPosition.TrayBottomRight, WindowPosition.TrayCenter, WindowPosition.TrayBottomCenter]; // from here: https://raw.githubusercontent.com/jenslind/electron-positioner/master/index.js

var WindowPositioner =
/*#__PURE__*/
function () {
  function WindowPositioner(browserWindow) {
    (0, _classCallCheck2.default)(this, WindowPositioner);
    this.browserWindow = browserWindow;
    this.electronScreen = _electron.screen || window.screen;
  }

  (0, _createClass2.default)(WindowPositioner, [{
    key: "_getCoords",
    value: function _getCoords(position, trayPosition, margin) {
      var _positions;

      var screenSize = this._getScreenSize(trayPosition);

      var windowSize = this._getWindowSize();

      if (!trayPosition) {
        trayPosition = {};
      }

      if (!margin) {
        margin = 0;
      } // Positions


      var positions = (_positions = {}, _positions[WindowPosition.TrayLeft] = {
        x: Math.floor(trayPosition.x + margin),
        y: screenSize.y + margin
      }, _positions[WindowPosition.TrayBottomLeft] = {
        x: Math.floor(trayPosition.x + margin),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      }, _positions[WindowPosition.TrayRight] = {
        x: Math.floor(trayPosition.x - (windowSize[0] + margin) + trayPosition.width),
        y: screenSize.y + margin
      }, _positions[WindowPosition.TrayBottomRight] = {
        x: Math.floor(trayPosition.x - (windowSize[0] + margin) + trayPosition.width),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      }, _positions[WindowPosition.TrayCenter] = {
        x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
        y: screenSize.y + margin
      }, _positions[WindowPosition.TrayBottomCenter] = {
        x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      }, _positions[WindowPosition.TopLeft] = {
        x: screenSize.x + margin,
        y: screenSize.y + margin
      }, _positions[WindowPosition.TopRight] = {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: screenSize.y + margin
      }, _positions[WindowPosition.BottomLeft] = {
        x: screenSize.x + margin,
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      }, _positions[WindowPosition.BottomRight] = {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      }, _positions[WindowPosition.TopCenter] = {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: screenSize.y + margin
      }, _positions[WindowPosition.BottomCenter] = {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      }, _positions[WindowPosition.LeftCenter] = {
        x: screenSize.x + margin,
        y: screenSize.y + Math.floor(screenSize.height / 2) - Math.floor(windowSize[1] / 2)
      }, _positions[WindowPosition.RightCenter] = {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: screenSize.y + Math.floor(screenSize.height / 2) - Math.floor(windowSize[1] / 2)
      }, _positions[WindowPosition.Center] = {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: Math.floor((screenSize.height + screenSize.y) / 2 - windowSize[1] / 2)
      }, _positions); // Default to right if the window is bigger than the space left.
      // Because on Windows the window might get out of bounds and dissappear.

      if ((0, _indexOf.default)(trayPositions).call(trayPositions, position) >= 0 && positions[position].x + windowSize[0] + margin > screenSize.width + screenSize.x) {
        return {
          x: positions[WindowPosition.TopRight].x,
          y: positions[position].y
        };
      }

      return positions[position];
    }
  }, {
    key: "_getWindowSize",
    value: function _getWindowSize() {
      return this.browserWindow.getSize();
    }
  }, {
    key: "_getScreenSize",
    value: function _getScreenSize(trayPosition) {
      if (trayPosition) {
        return this.electronScreen.getDisplayMatching(trayPosition).workArea;
      } else {
        return this.electronScreen.getDisplayNearestPoint(this.electronScreen.getCursorScreenPoint()).workArea;
      }
    }
  }, {
    key: "move",
    value: function move(position, trayPos, margin) {
      // Get positions coords
      var coords = this._getCoords(position, trayPos, margin); // Set the windows position


      this.browserWindow.setPosition(coords.x, coords.y);
    }
  }, {
    key: "calculate",
    value: function calculate(position, trayPos, margin) {
      // Get positions coords
      var coords = this._getCoords(position, trayPos, margin);

      return {
        x: coords.x,
        y: coords.y
      };
    }
  }]);
  return WindowPositioner;
}();

exports.WindowPositioner = WindowPositioner;