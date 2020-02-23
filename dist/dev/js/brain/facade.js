"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.brain = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _APP_CONFIG_PATH = _interopRequireDefault(require("APP_CONFIG_PATH"));

var _brain = require("./brain");

// @ts-ignore
var brain = new _brain.Brain();
exports.brain = brain;
(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // await storeObject(
          // 	`Brain-${appConfig.type}-84495d93da914ecc8f9de2bffa9f3df5`,
          // 	brain,
          // 	b => b.p('auth').p('currentCredentials'),
          // )
          console.log('config type: ', _APP_CONFIG_PATH.default.type); // if (typeof window !== 'undefined') {
          // 	await brain.auth.login()
          // }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();