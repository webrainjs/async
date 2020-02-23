"use strict";

var _interopRequireWildcard = require("@babel/runtime-corejs3/helpers/interopRequireWildcard");

var external = _interopRequireWildcard(require("webrain"));

var externalSrc = _interopRequireWildcard(require("webrain/src/main/common/index"));

var externalJs = _interopRequireWildcard(require("webrain/dist/js/main/common/index"));

var externalMjs = _interopRequireWildcard(require("webrain/dist/mjs/main/common/index"));

describe('common > env > mjs > modules', function () {
  function deepEqual(o1, o2) {
    if (o1 === o2) {
      return true;
    }

    if (typeof o1 === 'object') {
      if (typeof o2 === 'object') {
        for (var key in o1) {
          if (key !== 'default' && key !== '__moduleExports' && key !== '__esModule') {
            if (!deepEqual(o1[key], o2[key])) {
              return false;
            }
          }
        }

        if (!deepEqual(o1.constructor, o2.constructor)) {
          return false;
        }

        return true;
      }
    }

    if (typeof o1 === 'function') {
      if (typeof o2 === 'function') {
        if (o1.name === o2.name || o1.name.match(/\w+/)[0] === o2.name.match(/\w+/)[0]) {
          return true;
        }

        return false;
      }
    }

    return false;
  }

  it('external', function () {
    assert.ok(external);
    assert.ok(externalSrc);
    assert.ok(externalJs);
    assert.ok(externalMjs);
    assert.strictEqual(external.ObservableClass.name, 'ObservableClass');
    assert.strictEqual(externalSrc.ObservableClass.name, 'ObservableClass');
    assert.strictEqual(externalJs.ObservableClass.name, 'ObservableClass');
    assert.strictEqual(externalMjs.ObservableClass.name, 'ObservableClass');
    assert.notStrictEqual(externalSrc, external);
    assert.notStrictEqual(externalJs, external);
    assert.notStrictEqual(externalMjs, external); // TODO: uncomment after webrain will completed
    // assert.ok(deepEqual(externalSrc, external))

    assert.ok(deepEqual(externalJs, external));
    assert.ok(deepEqual(externalMjs, external));

    for (var key in external) {
      if (key !== 'default' && key !== '__moduleExports' && key !== '__esModule') {
        assert.ok(external[key] === externalJs[key] && external[key] !== externalMjs[key] || external[key] !== externalJs[key] && external[key] === externalMjs[key]);
        assert.notStrictEqual(external[key], externalSrc[key]);
      }
    }
  });
});