/* eslint-disable */
'use strict';

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _trim = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/trim"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _freeze = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/freeze"));

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _require = require('electron'),
    remote = _require.remote,
    ipcRenderer = _require.ipcRenderer,
    BrowserWindow = _require.BrowserWindow;

var remoteWindow = remote.getCurrentWindow();
var appConfig = ipcRenderer.sendSync('app-config');
console.log('preload');

function delay(timeMilliseconds) {
  return new _promise.default(function (resolve) {
    return (0, _setTimeout2.default)(resolve, timeMilliseconds);
  });
}

function initWindow(window, remoteWindow) {
  var _context, _context6;

  // region appConfig
  (0, _defineProperty.default)(window, 'appConfig', {
    writable: false,
    enumerable: true,
    configurable: false,
    value: (0, _freeze.default)((0, _assign.default)({}, appConfig))
  }); // region window actions

  remoteWindow.wid;
  var open = (0, _bind.default)(_context = window.open).call(_context, window);

  window.open = function () {
    var _context2, _context3;

    var childWindow = open.apply(void 0, arguments);
    var allWindows = remote.BrowserWindow.getAllWindows();
    var remoteChildWindow = allWindows[allWindows.length - 1];
    var featuresStr = arguments.length <= 2 ? undefined : arguments[2];
    var features = (0, _reduce.default)(_context2 = (0, _map.default)(_context3 = featuresStr.split(',')).call(_context3, function (o) {
      var _context4;

      return (0, _map.default)(_context4 = o.split('=')).call(_context4, function (o2) {
        return (0, _trim.default)(o2).call(o2);
      });
    })).call(_context2, function (a, o) {
      var value = o[1];
      a[o[0]] = !(value === '0' || value === 'no');
      return a;
    }, {});
    remoteChildWindow.setAlwaysOnTop(!!features.alwaysOnTop);
    remoteChildWindow.setResizable(!!features.resizable);
    remoteChildWindow.setMovable(!!features.movable);
    remoteChildWindow.setFullScreenable(!!features.fullscreenable); // not needed:
    // initWindow(childWindow, remoteChildWindow)
    // fix electron bug with close about:blank windows
    // see: https://github.com/electron/electron/issues/20086

    childWindow.close =
    /*#__PURE__*/
    (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee() {
      var href;
      return _regenerator.default.wrap(function _callee$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!remoteChildWindow.isDestroyed()) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return");

            case 2:
              href = childWindow.location.href;
              childWindow.location.href = 'http://0.0.0.0/';
              remoteChildWindow.hide();
              _context5.prev = 5;

            case 6:
              if (!(href === childWindow.location.href)) {
                _context5.next = 11;
                break;
              }

              _context5.next = 9;
              return delay(50);

            case 9:
              _context5.next = 6;
              break;

            case 11:
              _context5.next = 15;
              break;

            case 13:
              _context5.prev = 13;
              _context5.t0 = _context5["catch"](5);

            case 15:
              if (!remoteChildWindow.isDestroyed()) {
                _context5.next = 17;
                break;
              }

              return _context5.abrupt("return");

            case 17:
              remoteChildWindow.close();

            case 18:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee, null, [[5, 13]]);
    }));
    return childWindow;
  };

  window.maximize = function () {
    remoteWindow.maximize();
  };

  window.minimize = function () {
    remoteWindow.minimize();
  };

  window.restore = function () {
    remoteWindow.restore();
  };

  var focus = (0, _bind.default)(_context6 = window.focus).call(_context6, window);

  window.focus = function () {
    remoteWindow.show();
    focus.apply(void 0, arguments);
  }; // endregion
  // region tray


  window.tray = function () {
    return {
      updateState: function updateState(state) {
        ipcRenderer.send('tray_state', state);
      },
      subscribe: function subscribe(eventName, listener) {
        ipcRenderer.on('tray_on' + eventName, function (event) {
          for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
          }

          listener.apply(void 0, args);
        });
      }
    };
  }();

  window.tray.subscribe('click', function (e) {
    console.log(e);
  }); // endregion
  // region Dev

  if (appConfig.dev && appConfig.dev.devTools) {
    window.dev = {
      openDevTools: function openDevTools() {
        remoteWindow.webContents.openDevTools({
          mode: 'undocked',
          activate: true
        });
      }
    };
    window.addEventListener('keydown', function (e) {
      if (e.key === 'F12') {
        window.dev.openDevTools();
      }
    });
  } // endregion

}

initWindow(window, remoteWindow);