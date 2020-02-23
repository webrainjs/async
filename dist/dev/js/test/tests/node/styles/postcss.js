"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var postcss = require(_path.default.resolve('env/rollup/postcss'));

require('../../../../styles/index.js');

require('../../../../styles/themes.js');

describe('node > styles > postcss', function () {
  this.timeout(120000);
  var stylesDir = './src/styles/';

  function jsToCss(content, filename) {
    return postcss.convert.jsToCss(content, filename);
  }

  function cssToJs(content, filename) {
    return postcss.convert.cssToJs(content, filename);
  }

  function jsStyleToCss(filename) {
    filename = _path.default.resolve(stylesDir, filename);

    var content = _fs.default.readFileSync(filename, 'utf-8');

    return jsToCss(content, filename);
  }

  function styleToCss(filename) {
    return jsToCss("\n\t\t\timport style from '" + filename + "'\n\t\t\texport default style\n\t\t", _path.default.resolve(stylesDir, '__fake__.js'));
  }

  function themeToCss(filename, componentId) {
    return jsToCss("\n\t\t\timport style from '" + filename + "'\n\t\t\texport default style('" + componentId + "')\n\t\t", _path.default.resolve(stylesDir, '__fake__.js'));
  }

  xit('themes',
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
            return themeToCss('./themes.js', '');

          case 2:
            css = _context.sent;
            assert.ok(css);
            assert.strictEqual(typeof css, 'string', css); // console.log(css)

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  })));
  it('global',
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
            return styleToCss('./index.js');

          case 2:
            css = _context2.sent;
            assert.ok(css);
            assert.strictEqual(typeof css, 'string'); // console.log(css)

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  })));
});