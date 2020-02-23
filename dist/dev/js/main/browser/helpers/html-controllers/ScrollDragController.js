"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ScrollDragController = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _HtmlController2 = require("./HtmlController");

var ScrollDragController =
/*#__PURE__*/
function (_HtmlController) {
  (0, _inherits2.default)(ScrollDragController, _HtmlController);

  function ScrollDragController(_ref) {
    var _context, _context2, _context3, _context4;

    var _this;

    var container = _ref.container,
        scrollMatches = _ref.scrollMatches,
        noDragMatches = _ref.noDragMatches,
        _ref$throttlePixels = _ref.throttlePixels,
        throttlePixels = _ref$throttlePixels === void 0 ? 5 : _ref$throttlePixels;
    (0, _classCallCheck2.default)(this, ScrollDragController);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ScrollDragController).call(this, container));
    _this._throttlePixels = throttlePixels;
    _this._scrollMatches = scrollMatches;
    _this._noDragMatches = noDragMatches;

    _this.addEventListener(scrollMatches, 'mousedown', (0, _bind.default)(_context = _this.mousedown).call(_context, (0, _assertThisInitialized2.default)(_this)));

    _this.addEventListener(scrollMatches, 'mousemove', (0, _bind.default)(_context2 = _this.mousemove).call(_context2, (0, _assertThisInitialized2.default)(_this)));

    _this.addEventListener(null, 'mouseup', (0, _bind.default)(_context3 = _this.mouseup).call(_context3, (0, _assertThisInitialized2.default)(_this)));

    _this.addEventListener(null, 'click', (0, _bind.default)(_context4 = _this.click).call(_context4, (0, _assertThisInitialized2.default)(_this)));

    return _this;
  }

  (0, _createClass2.default)(ScrollDragController, [{
    key: "mousedown",
    value: function mousedown(event) {
      var scroll = event.container;

      if (scroll && (!this._noDragMatches || !this._noDragMatches(event.target) || document.elementFromPoint(event.pageX, event.pageY) === scroll)) {
        this._pushed = 1;
        this._moved = false;
        this._lastClientX = event.clientX;
        this._lastClientY = event.clientY; // event.preventDefault()
      }
    }
  }, {
    key: "mouseup",
    value: function mouseup(event) {
      this._pushed = 0;

      if (this._moved) {
        event.preventDefault();
      }
    }
  }, {
    key: "click",
    value: function click(event) {
      if (this._moved) {
        event.preventDefault();
        this._moved = false;
      }
    }
  }, {
    key: "mousemove",
    value: function mousemove(event) {
      var scroll = event.container;

      if (scroll && this._pushed && (Math.abs(this._lastClientX - event.clientX) > this._throttlePixels || Math.abs(this._lastClientY - event.clientY) > this._throttlePixels)) {
        this._moved = true;
        (this._scroller = scroll._scroller || scroll).scrollLeft -= this._newScrollX = -this._lastClientX + (this._lastClientX = event.clientX);
        this._scroller.scrollTop -= this._newScrollY = -this._lastClientY + (this._lastClientY = event.clientY);

        if (scroll === document.body) {
          (this._scroller = document.documentElement).scrollLeft -= this._newScrollX;
          this._scroller.scrollTop -= this._newScrollY;
        }
      }
    }
  }]);
  return ScrollDragController;
}(_HtmlController2.HtmlController);

exports.ScrollDragController = ScrollDragController;