import * as external from 'webrain';
import * as externalJs from 'webrain/dist/js/main/common/index';
describe('common > env > js > modules', function () {
  it('external', function () {
    assert.ok(external);
    assert.ok(externalJs);
    assert.strictEqual(external.ObservableClass.name, 'ObservableClass');
    assert.strictEqual(externalJs.ObservableClass.name, 'ObservableClass');
    assert.notStrictEqual(external, externalJs);

    for (const key in external) {
      assert.strictEqual(external[key], externalJs[key]);
    }
  });
});