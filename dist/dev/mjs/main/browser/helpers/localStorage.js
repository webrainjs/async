/* tslint:disable:no-empty */
import { deepSubscribe, DeferredCalc, ObjectSerializer } from 'webrain/src/main/common/index.ts';
export const localStorageWrapper = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local && {
  getItem: key => new Promise(resolve => {
    chrome.storage.local.get([key], result => resolve(result[key]));
  }),
  setItem: (key, value) => new Promise(resolve => {
    chrome.storage.local.set({
      [key]: value
    }, resolve);
  })
} || typeof localStorage !== 'undefined' && localStorage || null;
export async function storeWindowState(name, win) {
  const storageKey = `window-state-${name}`;
  const stateStr = await localStorageWrapper.getItem(storageKey);
  const state = stateStr && JSON.parse(stateStr);

  if (state) {
    win.moveTo(state.x, state.y);
    win.resizeTo(state.width, state.height);
  }

  const saveState = async () => {
    await localStorageWrapper.setItem(storageKey, JSON.stringify({
      x: win.screenLeft,
      y: win.screenTop,
      width: win.outerWidth,
      height: win.outerHeight
    }));
  };

  win.addEventListener('resize', saveState, false);
}
export async function storeObject(storageKey, object, ruleBuilder) {
  if (typeof window === 'undefined') {
    return null;
  }

  const serializedStr = await localStorageWrapper.getItem(storageKey);

  if (serializedStr) {
    const serialized = JSON.parse(serializedStr);
    ObjectSerializer.default.deSerialize(serialized, {
      valueFactory: () => object
    });
  }

  const deferredSave = new DeferredCalc(function () {
    this.calc();
  }, async function (done) {
    // tslint:disable-next-line:no-shadowed-variable
    const serialized = ObjectSerializer.default.serialize(object);
    await localStorageWrapper.setItem(storageKey, JSON.stringify(serialized));
    done();
  }, () => {}, {
    throttleTime: 1000,
    maxThrottleTime: 10000,
    minTimeBetweenCalc: 5000
  });
  return deepSubscribe({
    object,

    changeValue() {
      deferredSave.invalidate();
    },

    ruleBuilder
  });
}