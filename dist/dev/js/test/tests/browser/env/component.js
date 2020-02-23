"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _component = _interopRequireDefault(require("./src/component.svelte"));

describe('browser > env > component', function () {
  var testElem;
  beforeEach(function () {
    testElem = document.createElement('test');
    document.body.appendChild(testElem);
  });

  function createComponent(props) {
    return new _component.default({
      target: document.querySelector('test'),
      props: (0, _extends2.default)({}, props)
    });
  }

  it('should initialize the count when no data is given', function () {
    var component = createComponent();
    assert.strictEqual(component.count, 4); // assert.strictEqual(component.value, 4)
  });
  it('should start the count with given data', function () {
    var component = createComponent({
      count: 5
    });
    assert.strictEqual(component.count, 5); // assert.strictEqual(component.value, 4)
  });
});