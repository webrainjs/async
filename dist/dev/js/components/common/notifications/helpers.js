"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.showNotificationFactory = showNotificationFactory;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _NotificationWindowsController = require("../../../main/browser/helpers/html-controllers/NotificationWindowsController");

var _WindowController = require("../../../main/browser/helpers/html-controllers/WindowController");

var _ComponentWindow = require("../ComponentWindow");

function showNotificationFactory(_ref) {
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
                      windowName: componentClass.name,
                      windowFeatures: 'width=110,height=110,' + 'titlebar=no,resizable=no,movable=yes,alwaysOnTop=yes,fullscreenable=no,' + 'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,' + 'dialog=yes,modal=yes,dependent=yes',
                      storeWindowState: false
                    }, windowOptions)),
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