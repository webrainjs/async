// @ts-ignore
import { createFunction } from 'webrain';

class ReadableStore {
  constructor(object, propertyName) {
    this._object = object;
    this._propertyName = propertyName;
  }

  subscribe(run, invalidate) {
    return this._object.propertyChanged.subscribe(event => {
      if (event.name === this._propertyName) {
        run(event.newValue);
      }
    });
  }

}

class WritableStore extends ReadableStore {
  constructor(object, propertyName) {
    super(object, propertyName);
    this.set = createFunction('o', 'v', `o["${propertyName}"] = v`);
  }

}

const STORES_PROPERTY_NAME = '192e3271-3e9a-47a7-be1b-b2aaeade9304';

function getStore(object, propertyName, storeFactory) {
  let stores = object[STORES_PROPERTY_NAME];

  if (stores == null) {
    Object.defineProperty(object, STORES_PROPERTY_NAME, {
      enumerable: false,
      configurable: false,
      writable: false,
      value: stores = {}
    });
  }

  let store = stores[propertyName];

  if (store == null) {
    stores[propertyName] = store = storeFactory(object, propertyName);
  }

  return store;
}

export function asReadable(object, propertyName) {
  if (object == null) {
    return object;
  }

  if (typeof object !== 'object' || !('propertyChanged' in object)) {
    return object[propertyName];
  }

  return getStore(object, propertyName, (o, p) => new ReadableStore(o, p));
}
export function asWriteable(object, propertyName) {
  if (object == null) {
    return object;
  }

  if (typeof object !== 'object' || !('propertyChanged' in object)) {
    return object[propertyName];
  }

  return getStore(object, propertyName, (o, p) => new WritableStore(o, p));
}