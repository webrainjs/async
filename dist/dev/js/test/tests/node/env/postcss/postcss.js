"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var postcss = require(_path.default.resolve('env/rollup/postcss'));

var _require = require('require-from-memory'),
    requireFromString = _require.requireFromString;

var postcssJsSyntax = require('postcss-js-syntax').default;

describe('node > styles > postcss', function () {
  this.timeout(120000);

  function removeSpaces(str) {
    return str.replace(/[\t-\r ;\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/g, '');
  }

  function assertCss(actual, excepted) {
    assert.strictEqual(removeSpaces(actual), removeSpaces(excepted));
  }

  function jsToCss(content, filename) {
    return postcss.convert.jsToCss(content, filename);
  }

  function cssToJs(content, filename) {
    return postcss.convert.cssToJs(content, filename);
  }

  it('cssToJs', function () {
    var js = cssToJs('.x { color: #00f; }', 'file.css');
    assert.deepStrictEqual(js, {
      '.x': {
        color: '#00f'
      }
    }); // console.log(js)
  });
  it('jsToCss',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var css;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return jsToCss('module.exports = { ".x": { "color": "#00f" } }', 'file.js');

          case 2:
            css = _context.sent;
            assertCss(css, '\n.x {\n\tcolor: #00f;\n}\n');

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('jsToCss es6',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var css;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return jsToCss('export default { ".x": { "color": "#00f" } }', 'file.js');

          case 2:
            css = _context2.sent;
            assertCss(css, '\n.x {\n\tcolor: #00f;\n}\n');

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
  it('jsToCss import + babel',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var css;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return jsToCss("\n\t\t\timport style from '../../../style.js'\n\t\t\texport default { \n\t\t\t\t'.x': { \n\t\t\t\t\tcontent: JSON.stringify(style) \n\t\t\t\t}\n\t\t\t }\n\t\t", _path.default.resolve(__dirname, 'assets/x/y/z/file.js'));

          case 2:
            css = _context3.sent;
            // console.log(css)
            assertCss(css, '.x{content:{"css":{"@font-face":{"color":"#f0f"}},"test1":"test1","test2":"test2"}}');

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  })));
  xit('calc',
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var css;
    return _regenerator.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return jsToCss('module.exports = { ".x": { "width": "calc(5pt / 2)" } }', 'file.js');

          case 2:
            css = _context4.sent;
            assertCss(css, '\n.x {\n\twidth: 2.5pt;\n}\n');

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  })));
});