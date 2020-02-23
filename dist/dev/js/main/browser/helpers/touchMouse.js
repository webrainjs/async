"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = exports.TouchToMouse = void 0;

var _defineProperty = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/define-property"));

var _isFinite = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/number/is-finite"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var TouchToMouse =
/*#__PURE__*/
function () {
  function TouchToMouse(container, actionsPrefix, fixedTarget) {
    if (actionsPrefix === void 0) {
      actionsPrefix = '';
    }

    if (fixedTarget === void 0) {
      fixedTarget = null;
    }

    (0, _classCallCheck2.default)(this, TouchToMouse);
    var mouseDownName = "on" + actionsPrefix + "mousedown";
    var mouseMoveName = "on" + actionsPrefix + "mousemove";
    var mouseUpName = "on" + actionsPrefix + "mouseup";
    var mouseOutName = "on" + actionsPrefix + "mouseout";
    var mouseEnterName = "on" + actionsPrefix + "mouseenter"; // bind touch

    addListenerWithCoord('touchstart', mouseDownName);
    addListenerWithCoord('touchmove', mouseMoveName);
    addListener('touchend', mouseUpName); // bind mouse

    addListenerWithCoord('mousedown', mouseDownName);
    addListenerWithCoord('mousemove', mouseMoveName);
    addListener('mouseup', mouseUpName); // prevent duplicate events

    preventEvents('mouseenter');
    preventEvents('mouseout');
    window.addEventListener('mouseup', function (e) {
      callAction(mouseUpName);
      e.stopPropagation();
      e.preventDefault();
      return false;
    }, {
      bubbles: false
    });

    function preventEvents(eventType) {
      container.addEventListener(eventType, function (e) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }, {
        bubbles: false
      });
    }

    function addListener(eventType, actionName) {
      container.addEventListener(eventType, function (e) {
        callAction(actionName);
        e.stopPropagation();
        e.preventDefault();
        return false;
      }, {
        bubbles: false
      });
    }

    function addListenerWithCoord(eventType, actionName) {
      container.addEventListener(eventType, function (e) {
        var touches = e.touches;

        if (touches) {
          var touches0 = touches[0];
          callAction(actionName, touches0.pageX, touches0.pageY);
        } else {
          callAction(actionName, e.pageX, e.pageY);
        }

        e.stopPropagation();
        e.preventDefault();
        return false;
      }, {
        bubbles: false
      });
    }

    var prevTarget = null;
    var target;
    var prevX = null;
    var prevY = null;
    var isVisiblePredicate;
    var touched;
    this.callAction = callAction;

    function callAction(actionName, x, y) {
      if (!touched && actionName === mouseMoveName) {
        return;
      }

      if (actionName === mouseUpName) {
        touched = false;
        x = prevX;
        y = prevY;

        if (prevTarget && prevTarget[mouseOutName]) {
          prevTarget[mouseOutName](x, y);
        }

        target = prevTarget;
        prevTarget = null;
      } else {
        if (actionName === mouseDownName) {
          touched = true;
        }

        if (!(0, _isFinite.default)(x) || !(0, _isFinite.default)(y)) {
          return;
        }

        target = fixedTarget;

        if (!target) {
          target = document.elementFromPoint(x - document.body.scrollLeft, y - document.body.scrollTop);

          while (true) {
            if (target == null) {
              return;
            }

            if (isVisiblePredicate == null || isVisiblePredicate(target)) {
              break;
            }

            target = target.parentNode;
          }
        }

        if (target !== prevTarget) {
          if (prevTarget && prevTarget[mouseOutName]) {
            prevTarget[mouseOutName](x, y);
          }

          if (target[mouseEnterName]) {
            target[mouseEnterName](x, y);
          }

          if (target[mouseMoveName]) {
            target[mouseMoveName](x, y);
          }
        }

        prevX = x;
        prevY = y;
        prevTarget = target;
      }

      if (target && target[actionName]) {
        target[actionName](x, y);
      }
    }

    (0, _defineProperty.default)(this, 'isVisiblePredicate', {
      get: function get() {
        return isVisiblePredicate;
      },
      set: function set(value) {
        isVisiblePredicate = value;
      },
      enumerable: true,
      configurable: false
    });
  }

  (0, _createClass2.default)(TouchToMouse, null, [{
    key: "getRelativeCoord",
    value: function getRelativeCoord(relativeElement, globalCoord) {
      var rect = relativeElement.getBoundingClientRect();
      return {
        x: globalCoord.x - (rect.left + document.body.scrollLeft),
        y: globalCoord.y - (rect.top + document.body.scrollTop)
      };
    }
  }]);
  return TouchToMouse;
}();

exports.TouchToMouse = TouchToMouse;
var _default = {
  TouchToMouse: TouchToMouse
};
exports.default = _default;