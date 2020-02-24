"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.showNotificationWindowFactory = showNotificationWindowFactory;
exports.showNotificationApiFactory = showNotificationApiFactory;
exports.showNotificationFactory = showNotificationFactory;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _NotificationWindowsController = require("../../../main/browser/helpers/html-controllers/NotificationWindowsController");

var _WindowController = require("../../../main/browser/helpers/html-controllers/WindowController");

var _ComponentWindow = require("../ComponentWindow");

function showNotificationWindowFactory(_ref) {
  var windowOptions = _ref.windowOptions,
      componentClass = _ref.componentClass;
  var win;
  return (
    /*#__PURE__*/
    function () {
      var _showNotification = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(props) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!props) {
                  _context.next = 8;
                  break;
                }

                if (!win) {
                  win = new _ComponentWindow.ComponentWindow({
                    windowControllerFactory: new _WindowController.WindowControllerFactory((0, _extends2.default)({
                      windowFeatures: 'width=110,height=110,' + 'titlebar=no,resizable=no,movable=yes,alwaysOnTop=yes,fullscreenable=no,' + 'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,' + 'dialog=yes,modal=yes,dependent=yes'
                    }, windowOptions, {
                      windowControllerOptions: (0, _extends2.default)({
                        windowName: componentClass.name,
                        storeWindowState: false
                      }, windowOptions.windowControllerOptions)
                    })),
                    componentClass: componentClass,
                    props: props
                  });
                } else {
                  win.setProps(props);
                }

                if (win.windowController) {
                  _context.next = 5;
                  break;
                }

                console.error('Cannot create windowController');
                return _context.abrupt("return");

              case 5:
                _NotificationWindowsController.notificationWindowsController.show(win.windowController.win);

                _context.next = 9;
                break;

              case 8:
                if (win) {
                  win.close();
                }

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function showNotification(_x) {
        return _showNotification.apply(this, arguments);
      }

      return showNotification;
    }()
  );
}

function showNotificationApiFactory(_ref2) {
  var defaultOptions = _ref2.defaultOptions;
  var notification;
  return (
    /*#__PURE__*/
    function () {
      var _showNotification2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2(options) {
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (notification) {
                  notification.close();
                  notification = null;
                }

                if (options) {
                  options = (0, _extends2.default)({}, defaultOptions, {}, options);
                  notification = new Notification(options.title, options);

                  if (options.onclick) {
                    notification.addEventListener('click', options.onclick);
                  }

                  if (options.onclose) {
                    notification.addEventListener('close', options.onclose);
                  }
                }

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function showNotification(_x2) {
        return _showNotification2.apply(this, arguments);
      }

      return showNotification;
    }()
  );
}

function showNotificationFactory(options) {
  if (typeof window !== 'undefined' && window.isElectron && options.notificationWindow) {
    return showNotificationWindowFactory(options.notificationWindow);
  } else if (options.notificationApi) {
    var showNotification = showNotificationApiFactory({
      defaultOptions: options.notificationApi.defaultOptions
    });
    return (
      /*#__PURE__*/
      function () {
        var _ref3 = (0, _asyncToGenerator2.default)(
        /*#__PURE__*/
        _regenerator.default.mark(function _callee3(props) {
          return _regenerator.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.t0 = showNotification;
                  _context3.t1 = props;

                  if (!_context3.t1) {
                    _context3.next = 6;
                    break;
                  }

                  _context3.next = 5;
                  return options.notificationApi.getOptions(props);

                case 5:
                  _context3.t1 = _context3.sent;

                case 6:
                  _context3.t2 = _context3.t1;
                  return _context3.abrupt("return", (0, _context3.t0)(_context3.t2));

                case 8:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        return function (_x3) {
          return _ref3.apply(this, arguments);
        };
      }()
    );
  }
}