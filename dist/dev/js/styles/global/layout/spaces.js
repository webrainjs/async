"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _reduce = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/reduce"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _constants = _interopRequireDefault(require("../../app/templates/constants"));

var _templates = _interopRequireDefault(require("../../helpers/templates"));

var _context, _context2, _context3, _context4;

function space(_ref) {
  var type = _ref.type,
      side = _ref.side,
      size = _ref.size;
  var result = {};
  result[type + "-" + side] = size;
  return result;
}

function spaces(_ref2) {
  var type = _ref2.type,
      name = _ref2.name,
      size = _ref2.size;
  var result = [];
  result.push([0, "." + type + "-all-" + name, (0, _extends2.default)({}, space({
    type: type,
    side: 'left',
    size: size
  }), {}, space({
    type: type,
    side: 'right',
    size: size
  }), {}, space({
    type: type,
    side: 'top',
    size: size
  }), {}, space({
    type: type,
    side: 'bottom',
    size: size
  }))]);
  result.push([1, "." + type + "-left-right-" + name, (0, _extends2.default)({}, space({
    type: type,
    side: 'left',
    size: size
  }), {}, space({
    type: type,
    side: 'right',
    size: size
  }))]);
  result.push([2, "." + type + "-top-bottom-" + name, (0, _extends2.default)({}, space({
    type: type,
    side: 'top',
    size: size
  }), {}, space({
    type: type,
    side: 'bottom',
    size: size
  }))]);
  result.push([3, "." + type + "-left-" + name, space({
    type: type,
    side: 'left',
    size: size
  })]);
  result.push([4, "." + type + "-right-" + name, space({
    type: type,
    side: 'right',
    size: size
  })]);
  result.push([5, "." + type + "-top-" + name, space({
    type: type,
    side: 'top',
    size: size
  })]);
  result.push([6, "." + type + "-bottom-" + name, space({
    type: type,
    side: 'bottom',
    size: size
  })]);
  return result;
}

var rules = (0, _reduce.default)(_context = (0, _sort.default)(_context2 = (0, _map.default)(_context3 = (0, _concat.default)(_context4 = []).call(_context4, spaces({
  type: 'padding',
  name: 'double',
  size: _constants.default.space.double
}), spaces({
  type: 'padding',
  name: 'base',
  size: _constants.default.space.base
}), spaces({
  type: 'padding',
  name: 'half',
  size: _constants.default.space.half
}), spaces({
  type: 'padding',
  name: 'quarter',
  size: _constants.default.space.quarter
}), spaces({
  type: 'padding',
  name: 'zero',
  size: 0
}), spaces({
  type: 'margin',
  name: 'double',
  size: _constants.default.space.double
}), spaces({
  type: 'margin',
  name: 'base',
  size: _constants.default.space.base
}), spaces({
  type: 'margin',
  name: 'half',
  size: _constants.default.space.half
}), spaces({
  type: 'margin',
  name: 'quarter',
  size: _constants.default.space.quarter
}), spaces({
  type: 'margin',
  name: 'zero',
  size: 0
}))).call(_context3, function (o, i) {
  o.push(i);
  return o;
})).call(_context2, function (o1, o2) {
  var i;

  if ((i = o1[0] - o2[0]) !== 0) {
    return i;
  }

  return o1[3] - o2[3];
})).call(_context, function (a, o) {
  a[o[1]] = o[2];
  return a;
}, {});
module.exports = [_templates.default.important(rules)];