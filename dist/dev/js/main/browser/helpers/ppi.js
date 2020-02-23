"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getPPI = getPPI;

var _parseFloat2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/parse-float"));

var _ppi = null;

function getPPI() {
  if (!_ppi) {
    // create an empty element
    var div = document.createElement('div'); // give it an absolute size of one inch

    div.style.width = '1in'; // append it to the body

    var body = window.document.body;
    body.appendChild(div); // read the computed width

    var ppi = document.defaultView.getComputedStyle(div, null).getPropertyValue('width'); // remove it again

    body.removeChild(div); // and return the value

    _ppi = (0, _parseFloat2.default)(ppi);
  }

  return _ppi;
}