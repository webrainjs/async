"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.HtmlController = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _helpers = require("./helpers");

var HtmlController =
/*#__PURE__*/
function () {
  function HtmlController(container) {
    (0, _classCallCheck2.default)(this, HtmlController);
    this._unsubscribers = [];
    this._container = container;
  }

  (0, _createClass2.default)(HtmlController, [{
    key: "addEventListener",
    value: function addEventListener(containerMatches, eventName, handler) {
      var _this = this;

      for (var _len = arguments.length, options = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        options[_key - 3] = arguments[_key];
      }

      var self = this;

      var _handler = function _handler() {
        var container;

        if (containerMatches) {
          container = (0, _helpers.getPatentElement)(arguments[0].target, containerMatches);

          if (!container) {
            return;
          }

          arguments[0].container = container;
        } else {
          arguments[0].container = container = self._container;
        }

        return handler.apply(container, arguments);
      };

      this._container.addEventListener(eventName, _handler, options);

      this._unsubscribers.push(function () {
        _this._container.removeEventListener(eventName, _handler, options);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _unsubscribers = this._unsubscribers;

      for (var i = 0, len = _unsubscribers.length; i < len; i++) {
        _unsubscribers[i]();
      }

      this._unsubscribers.length = 0;
    }
  }]);
  return HtmlController;
}(); // this._container.addEventListener('click', function (event) {
// 	if (event.target.nodeName === 'BUTTON'
// 		|| event.target.nodeName === 'A'
// 		|| event.target.classList.contains('js-sound-click')
// 	) {
// 		sounds.click.play()
// 	}
// })


exports.HtmlController = HtmlController;