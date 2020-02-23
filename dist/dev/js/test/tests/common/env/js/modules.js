"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var external = _interopRequireWildcard(require("webrain"));

var externalJs = _interopRequireWildcard(require("webrain/dist/js/main/common/index"));

describe('common > env > js > modules', function () {
  it('external', function () {
    assert.ok(external);
    assert.ok(externalJs);
    assert.strictEqual(external.ObservableClass.name, 'ObservableClass');
    assert.strictEqual(externalJs.ObservableClass.name, 'ObservableClass');
    assert.notStrictEqual(external, externalJs);

    for (var key in external) {
      assert.strictEqual(external[key], externalJs[key]);
    }
  });
});