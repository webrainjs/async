'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sparkMd5 = _interopDefault(require('spark-md5'));
var htmlEscaper = _interopDefault(require('html-escaper'));
var electron = require('electron');

let LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Trace"] = 1] = "Trace";
  LogLevel[LogLevel["Debug"] = 2] = "Debug";
  LogLevel[LogLevel["Info"] = 4] = "Info";
  LogLevel[LogLevel["UserAction"] = 8] = "UserAction";
  LogLevel[LogLevel["Action"] = 16] = "Action";
  LogLevel[LogLevel["UserWarning"] = 32] = "UserWarning";
  LogLevel[LogLevel["UserError"] = 64] = "UserError";
  LogLevel[LogLevel["Warning"] = 128] = "Warning";
  LogLevel[LogLevel["Error"] = 256] = "Error";
  LogLevel[LogLevel["Fatal"] = 512] = "Fatal";
  LogLevel[LogLevel["None"] = 0] = "None";
  LogLevel[LogLevel["Any"] = 1023] = "Any";
})(LogLevel || (LogLevel = {}));

let ActionMode;

(function (ActionMode) {
  ActionMode[ActionMode["Default"] = 0] = "Default";
  ActionMode[ActionMode["Always"] = 1] = "Always";
  ActionMode[ActionMode["Never"] = 2] = "Never";
})(ActionMode || (ActionMode = {}));

/* tslint:disable:no-var-requires */
// @ts-ignore
// @ts-ignore
// don't mix require and import/export; see: https://github.com/rollup/rollup/issues/1058#issuecomment-254187433

var helpersCjs = {
  SparkMD5: sparkMd5,
  html: htmlEscaper
};
var helpersCjs_1 = helpersCjs.SparkMD5;
var helpersCjs_2 = helpersCjs.html;

// @ts-ignore
function md5(str) {
  const spark = new helpersCjs_1();
  spark.append(str);
  return spark.end();
}
function escapeJs(str) {
  return str && str.replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
}
function escapeHtml(str) {
  return helpersCjs_2.escape(str);
}
function delay(timeMilliseconds) {
  return new Promise(resolve => setTimeout(resolve, timeMilliseconds));
}

const _spacesRegex = new RegExp('\\s+');

const _spacesWithoutNewLinesRegex = new RegExp('[^\\S\\n]+');

const _fixNewLines = new RegExp('([^\\S\\n]*\\n[^\\S\\n]*)');

function removeExcessSpaces(text, keepLines) {
  if (!text) {
    return text;
  }

  if (keepLines) {
    text = text.replace(_spacesWithoutNewLinesRegex, ' ').trim();
    text = text.replace(_fixNewLines, '\\r\\n');
    text = text.replace(new RegExp('((\\r\\n){' + keepLines + '})[\\r\\n]*'), '$1');
  } else {
    text = text.replace(_spacesRegex, ' ').trim();
  }

  return text;
}
function getGlobalScope() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return null;
}
const globalScope = getGlobalScope();

function canDoAction(actionMode, allowedLevels, level) {
  return actionMode === ActionMode.Always || actionMode !== ActionMode.Never && (allowedLevels & level) !== 0;
}
class LogHandler {
  constructor({
    name,
    logger,
    allowLogLevels,
    maxQueueSize,
    throttleMaxQueueSize,
    throttleTime
  }) {
    this._queue = [];
    this.name = name;
    this._logger = logger;
    this.allowLogLevels = allowLogLevels || LogLevel.Any;
    this._maxQueueSize = maxQueueSize || 10;
    this._throttleMaxQueueSize = throttleMaxQueueSize || 5;
    this._throttleTime = throttleTime || 0;
  }

  init() {}

  canLog(logEvent) {
    return canDoAction(logEvent.handlersModes ? logEvent.handlersModes[this.name] || ActionMode.Default : ActionMode.Default, this.allowLogLevels, logEvent.level);
  }

  onError(logEvents, error) {
    handleLogErrorHandler(logEvents, error, this._logger, newLogEvent => {
      if (!newLogEvent.handlersModes) {
        newLogEvent.handlersModes = {};
      }

      newLogEvent.handlersModes[this.name] = ActionMode.Never;
    });
  }

  enqueueLog(logEvent) {
    const canLog = this.canLog(logEvent);

    while (this._queue.length > this._maxQueueSize && !this.canLog(this._queue[0])) {
      this._queue.shift();
    }

    this._queue.push(logEvent);

    if (!canLog || this._inProcess) {
      return;
    } // noinspection JSIgnoredPromiseFromCall


    this.handleLogs();
  }

  async handleLogs() {
    if (this._inProcess) {
      return;
    }

    try {
      do {
        if (this._throttleTime && this._queue.length < this._throttleMaxQueueSize) {
          await delay(this._throttleTime);
        }

        if (!this._queue.length) {
          break;
        }

        const logEvents = this._queue.splice(0);

        try {
          await this.handleLog(logEvents);
        } catch (err) {
          this.onError(logEvents, err);
        }
      } while (this._queue.some(o => this.canLog(o)));
    } finally {
      this._inProcess = false;
    }
  }

}
function handleLogErrorHandler(logEvents, error, logger, changeNewLogEvent) {
  const _changeNewLogEvent = newLogEvent => {
    changeNewLogEvent(newLogEvent);
    return newLogEvent;
  }; // for (let i = 0, len = logEvents.length; i < len; i++) {
  // 	const logEvent = logEvents[i]
  // 	logger.log(_changeNewLogEvent({
  // 		level: logEvent.level,
  // 		message: logEvent.message,
  // 		error: logEvent.error,
  // 		stack: logEvent.stack,
  // 		time: logEvent.time,
  // 		writeConsoleMode: logEvent.writeConsoleMode,
  // 		sendLogMode: logEvent.sendLogMode,
  // 		writeFileMode: logEvent.writeFileMode,
  // 	}))
  // }


  const lastLogEvent = logEvents[logEvents.length - 1];
  logger.log(_changeNewLogEvent({
    level: LogLevel.Error,
    messagesOrErrors: ['Logger self error', error],
    handlersModes: lastLogEvent.handlersModes
  }));
}

class EmitEventHandler extends LogHandler {
  constructor(logger, allowLogLevels) {
    super({
      name: 'emitEvent',
      logger,
      allowLogLevels
    });
  }

  async handleLog(logEvents) {
    for (let i = 0, len = logEvents.length; i < len; i++) {
      await this._logger.onLog(logEvents[i]);
    }
  }

}

function isIterable(value) {
  return value != null && typeof value[Symbol.iterator] === 'function';
}
function isIterator(value) {
  return value != null && typeof value[Symbol.iterator] === 'function' && typeof value.next === 'function';
}
function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable

const EMPTY = function EMPTY() {};
function checkIsFuncOrNull(func) {
  // PROF: 66 - 0.1%
  if (func != null && typeof func !== 'function') {
    throw new Error(`Value is not a function or null/undefined: ${func}`);
  }

  return func;
}

const allowCreateFunction = (() => {
  try {
    const func = new Function('a', 'b', 'return a + b');
    return !!func;
  } catch (err) {
    return false;
  }
})();

const createFunctionCache = {}; // tslint:disable-next-line:ban-types

function createFunction(alternativeFuncFactory, ...args) {
  const id = args[args.length - 1] + '';
  let func = createFunctionCache[id];

  if (!func) {
    createFunctionCache[id] = func = allowCreateFunction ? Function(...args) : alternativeFuncFactory();
  }

  return func;
}
function equalsObjects(o1, o2) {
  if (o1 === o2) {
    return true;
  }

  if (o1 && typeof o1 === 'object' && typeof o1.equals === 'function') {
    return o1.equals(o2);
  }

  if (o2 && typeof o2 === 'object' && typeof o2.equals === 'function') {
    return o2.equals(o1);
  }

  return false;
}

function isThenable(value) {
  return value != null && typeof value.then === 'function';
}
function isAsync(value) {
  return isThenable(value) || isIterator(value);
}
let ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["Immediate"] = 1] = "Immediate";
  ResolveResult[ResolveResult["Deferred"] = 2] = "Deferred";
  ResolveResult[ResolveResult["Error"] = 4] = "Error";
  ResolveResult[ResolveResult["ImmediateError"] = 5] = "ImmediateError";
  ResolveResult[ResolveResult["DeferredError"] = 6] = "DeferredError";
})(ResolveResult || (ResolveResult = {}));

function resolveIterator(iterator, isError, onImmediate, onDeferred, customResolveValue) {
  if (!isIterator(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
    const body = () => {
      while (true) {
        let iteratorResult;

        if (isThrow) {
          isThrow = false;
          iteratorResult = iterator.throw(nextValue);
        } else {
          iteratorResult = iterator.next(nextValue);
        }

        if (iteratorResult.done) {
          nextOnImmediate(iteratorResult.value, isError);
          return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
        }

        const result = _resolveValue(iteratorResult.value, false, (o, nextIsError) => {
          nextValue = o;
          isThrow = nextIsError;
        }, (o, nextIsError) => {
          iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
        }, customResolveValue);

        if ((result & ResolveResult.Deferred) !== 0) {
          return result;
        }
      }
    };

    try {
      return body();
    } catch (err) {
      nextOnImmediate(err, true);
      return ResolveResult.ImmediateError;
    }
  }

  return iterate(void 0, false, onImmediate, onDeferred);
}
function resolveThenable(thenable, isError, onImmediate, onDeferred) {
  if (!isThenable(thenable)) {
    return ResolveResult.None;
  }

  let result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred;
  let deferred;
  (thenable.thenLast || thenable.then).call(thenable, value => {
    if (deferred) {
      onDeferred(value, isError);
    } else {
      result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
      onImmediate(value, isError);
    }
  }, err => {
    if (deferred) {
      onDeferred(err, true);
    } else {
      result = ResolveResult.ImmediateError;
      onImmediate(err, true);
    }
  });
  deferred = true;
  return result;
}

function _resolveValue(value, isError, onImmediate, onDeferred, customResolveValue) {
  const nextOnImmediate = (o, nextIsError) => {
    if (nextIsError) {
      isError = true;
    }

    value = o;
  };

  const nextOnDeferred = (val, nextIsError) => {
    _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue);
  };

  while (true) {
    {
      const result = resolveThenable(value, isError, nextOnImmediate, nextOnDeferred);

      if ((result & ResolveResult.Deferred) !== 0) {
        return result;
      }

      if ((result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }
    {
      const result = resolveIterator(value, isError, nextOnImmediate, nextOnDeferred, customResolveValue);

      if ((result & ResolveResult.Deferred) !== 0) {
        return result;
      }

      if ((result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }

    if (value != null && customResolveValue != null) {
      const newValue = customResolveValue(value);

      if (newValue !== value) {
        value = newValue;
        continue;
      }
    }

    onImmediate(value, isError);
    return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
  }
}

function resolveValue(value, onImmediate, onDeferred, customResolveValue) {
  return _resolveValue(value, false, onImmediate, onDeferred, customResolveValue);
}
function resolveValueFunc(func, onImmediate, onDeferred, customResolveValue) {
  try {
    return resolveValue(func(), onImmediate, onDeferred, customResolveValue);
  } catch (err) {
    onImmediate(err, true);
    return ResolveResult.ImmediateError;
  }
}

let ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
  ThenableSyncStatus["Rejected"] = "Rejected";
})(ThenableSyncStatus || (ThenableSyncStatus = {}));

function createResolved(value, customResolveValue) {
  const thenable = new ThenableSync(null, customResolveValue);
  thenable.resolve(value);
  return thenable;
}
function createRejected(error, customResolveValue) {
  const thenable = new ThenableSync(null, customResolveValue);
  thenable.reject(error);
  return thenable;
}
class ThenableSync {
  constructor(executor, customResolveValue) {
    if (customResolveValue != null) {
      this._customResolveValue = customResolveValue;
    }

    if (executor) {
      try {
        executor(this.resolve.bind(this), this.reject.bind(this));
      } catch (err) {
        this.reject(err);
      }
    }
  } // region resolve


  resolve(value) {
    if (this._status != null) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`);
    }

    this._resolve(value);
  }

  _resolve(value) {
    const {
      _status
    } = this;

    if (_status != null && _status !== ThenableSyncStatus.Resolving) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`);
    }

    const result = resolveValue(value, (o, e) => {
      if (e) {
        this._reject(o);
      } else {
        value = o;
      }
    }, (o, e) => {
      if (e) {
        this._reject(o);
      } else {
        this._resolve(o);
      }
    }, this._customResolveValue);

    if ((result & ResolveResult.Deferred) !== 0) {
      this._status = ThenableSyncStatus.Resolving;
      return;
    }

    if ((result & ResolveResult.Error) !== 0) {
      return;
    }

    this._status = ThenableSyncStatus.Resolved;
    this._value = value;
    const {
      _onfulfilled
    } = this;

    if (_onfulfilled) {
      this._onfulfilled = void 0;
      this._onrejected = void 0;

      for (let i = 0, len = _onfulfilled.length; i < len; i++) {
        _onfulfilled[i](value);
      }
    }
  } // endregion
  // region reject


  reject(error) {
    if (this._status != null) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`);
    }

    this._reject(error);
  }

  _reject(error) {
    const {
      _status
    } = this;

    if (_status != null && _status !== ThenableSyncStatus.Resolving) {
      throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`);
    }

    const result = resolveValue(error, o => {
      error = o;
    }, o => {
      this._reject(o);
    }, this._customResolveValue);

    if ((result & ResolveResult.Deferred) !== 0) {
      this._status = ThenableSyncStatus.Resolving;
      return;
    }

    this._status = ThenableSyncStatus.Rejected;
    this._error = error;
    const {
      _onrejected
    } = this;

    if (_onrejected) {
      this._onfulfilled = void 0;
      this._onrejected = void 0;

      for (let i = 0, len = _onrejected.length; i < len; i++) {
        _onrejected[i](error);
      }
    }
  } // endregion
  // region then


  _then(onfulfilled, onrejected, lastExpression, customResolveValue) {
    const reject = error => {
      if (!onrejected) {
        if (lastExpression) {
          throw error;
        }

        return ThenableSync.createRejected(error, customResolveValue);
      }

      let isError;

      error = (() => {
        try {
          return onrejected(error);
        } catch (err) {
          isError = true;
          return err;
        }
      })();

      const result = resolveAsync(error, null, null, !lastExpression, customResolveValue);

      if (isThenable(result)) {
        return isError ? result.then(o => createRejected(o, customResolveValue)) : result;
      }

      if (lastExpression) {
        if (!isError) {
          return result;
        }

        throw result;
      }

      return isError ? createRejected(result, customResolveValue) : createResolved(result, customResolveValue);
    };

    switch (this._status) {
      case ThenableSyncStatus.Resolved:
        {
          let {
            _value
          } = this;

          if (!onfulfilled) {
            return lastExpression ? _value : this;
          }

          let isError;

          _value = (() => {
            try {
              return onfulfilled(_value);
            } catch (err) {
              isError = true;
              return err;
            }
          })();

          if (isError) {
            const result = resolveAsync(_value, null, null, !lastExpression, customResolveValue);

            if (isThenable(result)) {
              return result.then(o => reject(o), onrejected);
            }

            return reject(result);
          } else {
            const result = resolveAsync(_value, null, onrejected, !lastExpression, customResolveValue);
            return lastExpression || isThenable(result) ? result : createResolved(result, customResolveValue);
          }
        }

      case ThenableSyncStatus.Rejected:
        if (!onrejected && !lastExpression && (!customResolveValue || customResolveValue === this._customResolveValue)) {
          return this;
        }

        return reject(this._error);

      default:
        {
          if (!onfulfilled && !onrejected && (!customResolveValue || customResolveValue === this._customResolveValue)) {
            return this;
          }

          const result = new ThenableSync(null, customResolveValue);
          let {
            _onrejected
          } = this;

          if (!_onrejected) {
            this._onrejected = _onrejected = [];
          }

          const rejected = onrejected ? value => {
            let isError;

            value = (() => {
              try {
                return onrejected(value);
              } catch (err) {
                isError = true;
                return err;
              }
            })();

            if (isError) {
              result.reject(value);
            } else {
              result.resolve(value);
            }
          } : value => {
            result.reject(value);
          };

          _onrejected.push(rejected);

          let {
            _onfulfilled
          } = this;

          if (!_onfulfilled) {
            this._onfulfilled = _onfulfilled = [];
          }

          _onfulfilled.push(onfulfilled ? value => {
            let isError;

            value = (() => {
              try {
                return onfulfilled(value);
              } catch (err) {
                isError = true;
                return err;
              }
            })();

            if (isError) {
              resolveValue(value, rejected, rejected, customResolveValue);
            } else {
              result.resolve(value);
            }
          } : value => {
            result.resolve(value);
          });

          return result;
        }
    }
  }

  then(onfulfilled, onrejected, customResolveValue) {
    return this._then(onfulfilled, onrejected, false, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
  }

  thenLast(onfulfilled, onrejected, customResolveValue) {
    return this._then(onfulfilled, onrejected, true, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
  } // endregion
  // region static helpers
  // endregion


}
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = isThenable;
ThenableSync.resolve = resolveAsync;
function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  // Optimization
  if (!onfulfilled && !isAsync(input)) {
    if (input != null && customResolveValue) {
      const newInput = customResolveValue(input);

      if (input === newInput) {
        return input;
      }

      input = newInput;
    } else {
      return input;
    }
  }

  return _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}

function _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  let result;
  let isError;

  let onResult = (o, e) => {
    result = o;
    isError = e;
  };

  let thenable;

  const createThenable = () => {
    if (!thenable) {
      thenable = new ThenableSync((resolve, reject) => {
        onResult = (o, e) => {
          if (e) {
            reject(o);
          } else {
            resolve(o);
          }
        };
      }, customResolveValue);
    }

    return thenable;
  };

  const resolveOnResult = (o, e) => {
    const handler = e ? onrejected : onfulfilled;

    if (handler) {
      if ((resolveValueFunc(() => handler(o), (o2, e2) => {
        onResult(o2, e2);
      }, (o2, e2) => {
        onResult(o2, e2);
      }, customResolveValue) & ResolveResult.Deferred) !== 0) {
        result = createThenable();
      }
    } else {
      onResult(o, e);
    }
  };

  if ((resolveValue(input, resolveOnResult, resolveOnResult, customResolveValue) & ResolveResult.Deferred) !== 0) {
    return createThenable();
  }

  if (isError) {
    if (dontThrowOnImmediateError) {
      return ThenableSync.createRejected(result, customResolveValue);
    }

    throw result;
  }

  return result;
}

const webrainOptions = {
  equalsFunc(oldValue, newValue) {
    if (oldValue instanceof Date) {
      return newValue instanceof Date && oldValue.getTime() === newValue.getTime();
    }

    return equalsObjects(oldValue, newValue);
  },

  debugInfo: true
};

class Observable {
  call(func) {
    return func(this);
  }

}

Observable.prototype.autoConnect = function (connectPredicate, connectFunc) {
  let disconnect;
  return this.subscribe(value => {
    if (connectPredicate && connectPredicate(value) || !connectPredicate && value) {
      if (!disconnect) {
        disconnect = connectFunc();
      }
    } else if (disconnect) {
      disconnect();
    }
  });
};

function subject(base) {
  // eslint-disable-next-line no-shadow
  // tslint:disable-next-line:no-shadowed-variable
  return class Subject extends base {
    get hasSubscribers() {
      return !!(this._subscribers && this._subscribers.length);
    }

    get subscribersCount() {
      return this._subscribers && this._subscribers.length;
    }

    subscribe(subscriber, description) {
      if (!subscriber) {
        return null;
      }

      if (description) {
        subscriber.description = description;
      }

      const {
        _subscribers
      } = this;

      if (!_subscribers) {
        this._subscribers = [subscriber];
      } else {
        _subscribers[_subscribers.length] = subscriber;
      }

      return () => {
        if (!subscriber) {
          return;
        } // tslint:disable-next-line:no-shadowed-variable


        const {
          _subscribers
        } = this;
        const len = _subscribers.length;

        const index = _subscribers.indexOf(subscriber);

        if (index >= 0) {
          if (this._subscribersInProcess === _subscribers) {
            const subscribers = new Array(len - 1);

            for (let i = 0; i < index; i++) {
              subscribers[i] = _subscribers[i];
            }

            for (let i = index + 1; i < len; i++) {
              subscribers[i - 1] = _subscribers[i];
            }

            this._subscribers = subscribers;
          } else {
            for (let i = index + 1; i < len; i++) {
              _subscribers[i - 1] = _subscribers[i];
            }

            _subscribers.length = len - 1;
          }
        }

        subscriber = null;
      };
    }

    emit(value) {
      const {
        _subscribers
      } = this;

      if (!_subscribers) {
        return this;
      }

      if (this._subscribersInProcess !== _subscribers) {
        this._subscribersInProcess = _subscribers;
      }

      for (let i = 0, len = _subscribers.length; i < len; i++) {
        _subscribers[i](value);
      }

      if (this._subscribersInProcess === _subscribers) {
        this._subscribersInProcess = null;
      }

      return this;
    }

  };
}
const Subject = subject(Observable); // export function createSubjectClass(base, ...extensions) {
// 	for (const extension of extensions) {
// 		base = extension(base)
// 	}
//
// 	return base
// }

function behavior(base) {
  return class Behavior extends base {
    constructor(value) {
      super();

      if (typeof value !== 'undefined') {
        this.value = value;
      }
    }

    subscribe(subscriber, description) {
      if (!subscriber) {
        return null;
      }

      if (description) {
        subscriber.description = description;
      }

      let unsubscribe = super.subscribe(subscriber);
      const {
        value
      } = this;

      if (typeof value !== 'undefined') {
        subscriber(value);
      }

      return () => {
        const _unsubscribe = unsubscribe;

        if (!_unsubscribe) {
          return;
        }

        unsubscribe = null;

        try {
          // eslint-disable-next-line no-shadow
          // tslint:disable-next-line:no-shadowed-variable
          const {
            value,
            unsubscribeValue
          } = this;

          if (typeof unsubscribeValue !== 'undefined' && unsubscribeValue !== value) {
            subscriber(unsubscribeValue);
          }
        } finally {
          _unsubscribe();
        }
      };
    }

    emit(value) {
      this.value = value;
      super.emit(value);
      return this;
    }

  };
}
const BehaviorSubject = behavior(Subject);

// tslint:disable-next-line:no-shadowed-variable

function createHasSubscribersSubjectDefault(hasSubscribers) {
  const subject = new BehaviorSubject(hasSubscribers);
  subject.unsubscribeValue = null;
  return subject;
}

function hasSubscribers(base, createHasSubscribersSubject = createHasSubscribersSubjectDefault) {
  return class HasSubscribers extends base {
    subscribe(subscriber, description) {
      if (!subscriber) {
        return null;
      }

      if (description) {
        subscriber.description = description;
      } // eslint-disable-next-line no-shadow
      // tslint:disable-next-line:no-shadowed-variable


      const {
        hasSubscribers
      } = this;
      const unsubscribe = super.subscribe(subscriber);

      if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
        this._hasSubscribersSubject.emit(true);
      }

      return () => {
        // eslint-disable-next-line no-shadow
        // tslint:disable-next-line:no-shadowed-variable
        const {
          hasSubscribers
        } = this;
        unsubscribe();

        if (hasSubscribers && this._hasSubscribersSubject && !this.hasSubscribers) {
          this._hasSubscribersSubject.emit(false);
        }
      };
    }

    get hasSubscribersObservable() {
      let {
        _hasSubscribersSubject
      } = this;

      if (!_hasSubscribersSubject) {
        this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers);
      }

      return _hasSubscribersSubject;
    }

  };
}
const HasSubscribersSubject = hasSubscribers(Subject);

// 	if (inputItems == null) {
// 		return output
// 	}
//
// 	if (Array.isArray(inputItems)) {
// 		for (const item of inputItems) {
// 			expandAndDistinct(item, output, map)
// 		}
// 		return output
// 	}
//
// 	if (!map[inputItems]) {
// 		map[inputItems] = true
// 		output[output.length] = inputItems
// 	}
//
// 	return output
// }

class PropertyChangedSubject extends HasSubscribersSubject {
  constructor(object) {
    super();
    this._object = object;
  }

  onPropertyChanged(...eventsOrPropertyNames) {
    for (let i = 0, len = eventsOrPropertyNames.length; i < len; i++) {
      let event = eventsOrPropertyNames[i];

      if (event == null) {
        event = {};
      }

      if (typeof event !== 'object') {
        const value = this._object[event];
        event = {
          name: event,
          oldValue: value,
          newValue: value
        };
      }

      this.emit(event);
    }

    return this;
  }

}
class PropertyChangedObject {
  /** @internal */
  constructor() {
    Object.defineProperty(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }
  /** @internal */


  _setUnsubscriber(propertyName, unsubscribe) {
    const {
      __meta
    } = this;
    const {
      unsubscribers
    } = __meta;

    if (unsubscribers) {
      const oldUnsubscribe = unsubscribers[propertyName];

      if (unsubscribe !== oldUnsubscribe) {
        if (oldUnsubscribe) {
          unsubscribers[propertyName] = unsubscribe;
          oldUnsubscribe();
        } else if (unsubscribe) {
          unsubscribers[propertyName] = unsubscribe;
        }
      }
    } else if (unsubscribe) {
      __meta.unsubscribers = {
        [propertyName]: unsubscribe
      };
    }
  } // region propertyChanged


  get propertyChanged() {
    let {
      propertyChanged
    } = this.__meta;

    if (!propertyChanged) {
      this.__meta.propertyChanged = propertyChanged = new PropertyChangedSubject(this);
    }

    return propertyChanged;
  }

  get propertyChangedIfCanEmit() {
    const {
      propertyChangedDisabled,
      propertyChanged
    } = this.__meta;
    return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
  } // endregion


}

class ObservableClass extends PropertyChangedObject {
  /** @internal */
  constructor() {
    super();
    Object.defineProperty(this, '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }

}
/** @internal */

function _setExt(name, getValue, setValue, options, object, newValue) {
  if (!options) {
    return _set(name, getValue, setValue, object, newValue);
  }

  const oldValue = getValue ? getValue.call(object) : object.__fields[name];
  const equalsFunc = options.equalsFunc || webrainOptions.equalsFunc;

  if (oldValue === newValue || equalsFunc && equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  const fillFunc = options.fillFunc;

  if (fillFunc && oldValue != null && newValue != null && fillFunc.call(object, oldValue, newValue)) {
    return false;
  }

  const convertFunc = options.convertFunc;

  if (convertFunc) {
    newValue = convertFunc.call(object, oldValue, newValue);
  } // if (oldValue === newValue) {
  // 	return false
  // }


  const beforeChange = options.beforeChange;

  if (beforeChange) {
    beforeChange.call(object, oldValue, newValue);
  }

  if (setValue) {
    setValue.call(object, newValue);
  } else {
    object.__fields[name] = newValue;
  }

  if (!options || !options.suppressPropertyChanged) {
    const {
      propertyChangedIfCanEmit
    } = object;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name,
        oldValue,
        newValue
      });
    }
  }

  const afterChange = options.afterChange;

  if (afterChange) {
    afterChange.call(object, oldValue, newValue);
  }

  return true;
}
/** @internal */

function _set(name, getValue, setValue, object, newValue) {
  const oldValue = getValue.call(object);

  if (oldValue === newValue || webrainOptions.equalsFunc && webrainOptions.equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  setValue.call(object, newValue);
  const {
    propertyChangedDisabled,
    propertyChanged
  } = object.__meta;

  if (!propertyChangedDisabled && propertyChanged) {
    propertyChanged.emit({
      name,
      oldValue,
      newValue
    });
  }

  return true;
}

/* tslint:disable:no-identical-functions */
function mergeMapWrappers(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  let changed = false;
  const addItems = [];

  const fill = (olderItem, newerItem) => {
    let setItem = EMPTY;
    merge(EMPTY, olderItem, newerItem, o => {
      setItem = o;
    }, preferCloneOlder, preferCloneNewer, options);

    if (setItem === EMPTY) {
      throw new Error('setItem === NONE');
    }

    return setItem;
  };

  if (older === newer) {
    // [- n n]
    newer.forEachKeys(key => {
      if (!base.has(key)) {
        addItems.push([key, fill(EMPTY, newer.get(key))]);
      }
    });
  } else {
    // [- - n]
    newer.forEachKeys(key => {
      if (!base.has(key) && !older.has(key)) {
        addItems.push([key, fill(EMPTY, newer.get(key))]);
      }
    }); // [- o *]

    older.forEachKeys(key => {
      if (!base.has(key)) {
        if (!newer.has(key)) {
          addItems.push([key, fill(older.get(key), EMPTY)]);
        } else {
          addItems.push([key, fill(older.get(key), newer.get(key))]);
        }
      }
    });
  }

  const deleteItems = []; // [b * *]

  base.forEachKeys(key => {
    changed = merge(base.get(key), older.has(key) ? older.get(key) : EMPTY, newer.has(key) ? newer.get(key) : EMPTY, o => {
      if (o === EMPTY) {
        deleteItems.push(key);
      } else {
        base.set(key, o);
      }
    }, preferCloneOlder, preferCloneNewer, options) || changed;
  });
  let len = deleteItems.length;

  if (len > 0) {
    changed = true;

    for (let i = len - 1; i >= 0; i--) {
      base.delete(deleteItems[i]);
    }
  }

  len = addItems.length;

  if (len > 0) {
    changed = true;

    for (let i = 0; i < len; i++) {
      base.set.apply(base, addItems[i]);
    }
  }

  return changed;
}
class MergeObjectWrapper {
  constructor(object, keyAsValue) {
    this._object = object;

    if (keyAsValue) {
      this._keyAsValue = true;
    }
  }

  delete(key) {
    delete this._object[key];
  }

  forEachKeys(callbackfn) {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        callbackfn(key);
      }
    }
  }

  get(key) {
    return this._keyAsValue ? key : this._object[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this._object, key);
  }

  set(key, value) {
    this._object[key] = this._keyAsValue ? true : value;
  }

}
class MergeMapWrapper {
  constructor(map) {
    this._map = map;
  }

  delete(key) {
    this._map.delete(key);
  }

  forEachKeys(callbackfn) {
    for (const key of this._map.keys()) {
      callbackfn(key);
    }
  }

  get(key) {
    return this._map.get(key);
  }

  has(key) {
    return this._map.has(key);
  }

  set(key, value) {
    this._map.set(key, value);
  }

}
function createMergeMapWrapper(target, source, arrayOrIterableToMap) {
  if (source[Symbol.toStringTag] === 'Map') {
    return new MergeMapWrapper(source);
  }

  if (arrayOrIterableToMap && (Array.isArray(source) || isIterable(source))) {
    return createMergeMapWrapper(target, arrayOrIterableToMap(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source);
  }

  throw new Error(`${target.constructor.name} cannot be merge with ${source.constructor.name}`);
} // 10039 cycles

function mergeMaps(createSourceMapWrapper, merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  const baseWrapper = createSourceMapWrapper(base, base);
  const olderWrapper = older === base ? baseWrapper : createSourceMapWrapper(base, older);
  const newerWrapper = newer === base ? baseWrapper : newer === older ? olderWrapper : createSourceMapWrapper(base, newer);
  return mergeMapWrappers(merge, baseWrapper, olderWrapper, newerWrapper, preferCloneOlder, preferCloneNewer, options);
}

let nextObjectId = 1;
function getNextObjectId() {
  return nextObjectId++;
}
const UNIQUE_ID_PROPERTY_NAME = '458d576952bc489ab45e98ac7f296fd9';
function hasObjectUniqueId(object) {
  return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME);
}
function canHaveUniqueId(object) {
  return !Object.isFrozen(object) || hasObjectUniqueId(object);
}
function getObjectUniqueId(object) {
  // PROF: 129 - 0.3%
  if (object == null) {
    return null;
  }

  const id = object[UNIQUE_ID_PROPERTY_NAME];

  if (id != null) {
    return id;
  }

  if (Object.isFrozen(object)) {
    return null;
  }

  const uniqueId = getNextObjectId();
  Object.defineProperty(object, UNIQUE_ID_PROPERTY_NAME, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: uniqueId
  });
  return uniqueId;
} // tslint:disable-next-line:ban-types

function fillCollection(collection, arrayOrIterable, add) {
  if (Array.isArray(arrayOrIterable)) {
    for (let i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    for (const item of arrayOrIterable) {
      add(collection, item);
    }
  }

  return collection;
}
function fillSet(set, arrayOrIterable) {
  return fillCollection(set, arrayOrIterable, (c, o) => c.add(o));
}
function fillMap(map, arrayOrIterable) {
  return fillCollection(map, arrayOrIterable, (c, o) => c.set.apply(c, o));
}
function fillObjectKeys(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, (c, o) => c[o] = true);
}

const typeMetaPropertyNameBase = '043a558080e94cbda1add09753c28772';
let typeMetaPropertyNameIndex = 0;
class TypeMetaCollection {
  // noinspection JSUnusedLocalSymbols
  constructor(proto) {
    this._typeMetaPropertyName = typeMetaPropertyNameBase + typeMetaPropertyNameIndex++;

    if (proto) {
      this._proto = proto;
    }
  }

  getMeta(type) {
    let meta;
    const {
      _typeMetaPropertyName
    } = this;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      meta = type[_typeMetaPropertyName];
    }

    if (typeof meta === 'undefined') {
      const {
        _proto
      } = this;

      if (_proto) {
        return _proto.getMeta(type);
      }
    }

    return meta;
  }

  putType(type, meta) {
    if (!type || typeof type !== 'function') {
      throw new Error(`type (${type}) should be function`);
    }

    const {
      _typeMetaPropertyName
    } = this;
    let prevMeta;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      prevMeta = type[_typeMetaPropertyName];
      delete type[_typeMetaPropertyName];
    }

    Object.defineProperty(type, _typeMetaPropertyName, {
      configurable: true,
      enumerable: false,
      writable: false,
      value: meta
    });
    return prevMeta;
  }

  deleteType(type) {
    const {
      _typeMetaPropertyName
    } = this;
    let prevMeta;

    if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
      prevMeta = type[_typeMetaPropertyName];
      delete type[_typeMetaPropertyName];
    }

    return prevMeta;
  }

}
class TypeMetaCollectionWithId extends TypeMetaCollection {
  constructor(proto) {
    super(proto);
    this._typeMap = {};
  }

  getType(uuid) {
    const type = this._typeMap[uuid];

    if (typeof type === 'undefined') {
      const {
        _proto
      } = this;

      if (_proto) {
        return _proto.getType(uuid);
      }
    }

    return type;
  }

  putType(type, meta) {
    const uuid = meta && meta.uuid;

    if (!uuid || typeof uuid !== 'string') {
      throw new Error(`meta.uuid (${uuid}) should be a string with length > 0`);
    }

    const prevType = this._typeMap[uuid];

    if (prevType && prevType !== type) {
      throw new Error(`Same uuid (${uuid}) used for different types: ` + `${typeToDebugString(prevType)}, ${typeToDebugString(type)}`);
    }

    const prevMeta = super.putType(type, meta);
    this._typeMap[uuid] = type;
    return prevMeta;
  }

  deleteType(typeOrUuid) {
    let uuid;
    let type;

    if (typeof typeOrUuid === 'function') {
      const meta = this.getMeta(typeOrUuid);
      uuid = meta && meta.uuid;
      type = typeOrUuid;
    } else if (typeof typeOrUuid === 'string') {
      type = this.getType(typeOrUuid);
      uuid = typeOrUuid;
    } else {
      throw new Error(`typeOrUuid (${typeOrUuid == null ? typeOrUuid : typeof typeOrUuid}) is not a Function or String`);
    }

    const prevMeta = super.deleteType(type);
    delete this._typeMap[uuid];
    return prevMeta;
  }

}

class MergeSetWrapper {
  constructor(set) {
    this._set = set;
  }

  delete(key) {
    this._set.delete(key);
  }

  forEachKeys(callbackfn) {
    for (const key of this._set) {
      callbackfn(key);
    }
  }

  get(key) {
    return key;
  }

  has(key) {
    return this._set.has(key);
  }

  set(key, value) {
    this._set.add(value);
  }

}
function createMergeSetWrapper(target, source, arrayOrIterableToSet) {
  if (source[Symbol.toStringTag] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && (Array.isArray(source) || isIterable(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source, true);
  }

  throw new Error(`${target.constructor.name} cannot be merge with ${source.constructor.name}`);
}

/* tslint:disable:no-nested-switch ban-types use-primitive-type */

class ValueState {
  constructor(mergerState, target, preferClone, selfAsValue, refs) {
    this.mergerState = mergerState;
    this.target = target;
    this.preferClone = preferClone;
    this.selfAsValue = selfAsValue;
    this.refs = refs;
    const {
      options
    } = this.mergerState;
    this.type = options && options.valueType || target.constructor;
  }

  resolveRef() {
    if (this._isRef == null) {
      if (this.selfAsValue) {
        this._isRef = false;
      } else {
        const ref = this.getRef();

        if (ref) {
          this.target = ref;
          this._isRef = true;
        } else {
          this._isRef = false;
        }
      }
    }
  }

  get isRef() {
    this.resolveRef();
    return this._isRef;
  }

  getRef() {
    const {
      refs
    } = this;

    if (refs) {
      const id = getObjectUniqueId(this.target);

      if (id != null) {
        const ref = refs[id];
        return ref;
      }
    }

    return null;
  }

  setRef(refObj) {
    const id = getObjectUniqueId(this.target);

    if (id != null) {
      let {
        refs
      } = this;

      if (refs == null) {
        this.refs = refs = [];
      }

      refs[id] = refObj;
    }
  }

  get meta() {
    let {
      _meta
    } = this;

    if (!_meta) {
      _meta = this.mergerState.mergerVisitor.getMeta(this.type);

      if (!_meta) {
        throw new Error(`Class (${this.type && this.type.name}) have no type meta`);
      }

      this._meta = _meta;
    }

    return _meta;
  }

  get merger() {
    let {
      _merger
    } = this;

    if (!_merger) {
      const {
        meta
      } = this;
      _merger = meta.merger;

      if (!_merger) {
        throw new Error(`Class (${this.type && this.type.name}) type meta have no merger`);
      }

      this._merger = _merger;
    }

    return _merger;
  }

  get merge() {
    const {
      merger
    } = this;

    if (!merger.merge) {
      throw new Error(`Class (${this.type && this.type.name}) merger have no merge method`);
    }

    return merger.merge;
  }

  get mustBeCloned() {
    let {
      _mustBeCloned
    } = this;

    if (_mustBeCloned == null) {
      const {
        options
      } = this.mergerState;
      const valueType = options && options.valueType;
      let metaPreferClone = this.meta.preferClone;

      if (typeof metaPreferClone === 'function') {
        metaPreferClone = metaPreferClone(this.target);
      }

      this._mustBeCloned = _mustBeCloned = (metaPreferClone != null ? metaPreferClone : this.preferClone && !this.isRef && !this.mergerState.mergerVisitor.getStatus(this.target)) || valueType && valueType !== this.target.constructor;
    }

    return _mustBeCloned;
  }

  get cloneInstance() {
    let {
      _cloneInstance
    } = this;

    if (_cloneInstance == null) {
      const {
        target,
        type
      } = this;
      const {
        options
      } = this.mergerState;

      _cloneInstance = (options && options.valueFactory || this.meta.valueFactory || (() => (!options || !options.valueType || this.target.constructor === (options && options.valueType)) && new type()))(target);

      if (!_cloneInstance) {
        throw new Error(`Class (${typeToDebugString(type)}) cannot be clone`);
      }

      if (_cloneInstance === target) {
        throw new Error(`Clone result === Source for (${typeToDebugString(type)})`);
      }

      if (_cloneInstance.constructor !== type) {
        throw new Error(`Clone type !== (${typeToDebugString(type)})`);
      }

      this._cloneInstance = _cloneInstance;
    }

    return _cloneInstance;
  }

  canMerge(source, target) {
    const canMerge = this.merger.canMerge;

    if (canMerge) {
      if (target == null) {
        target = this.target;

        if (this.isRef || source.isRef) {
          return target === source.target ? null : false;
        }
      }

      const result = canMerge(target, source.target);

      if (result == null) {
        return null;
      }

      if (typeof result !== 'boolean') {
        throw new Error(`Unknown canMerge() result (${result.constructor.name}) for ${this.type.name}`);
      }

      return result;
    }

    return this.target.constructor === source.constructor;
  }

  get clone() {
    let {
      _clone
    } = this;

    if (_clone == null) {
      const {
        target
      } = this;

      if (this.mustBeCloned) {
        _clone = this.cloneInstance;
        const canMergeResult = this.canMerge(this, _clone);

        switch (canMergeResult) {
          case null:
            break;

          case true:
            const {
              mergerVisitor,
              options
            } = this.mergerState;
            this.setRef(_clone); // mergerVisitor.setStatus(_clone, ObjectStatus.Cloned)

            const {
              preferClone,
              refs
            } = this;
            this.merge(mergerVisitor.getNextMerge(preferClone, preferClone, refs, refs, refs, options), _clone, target, target, () => {
              throw new Error(`Class (${this.type.name}) cannot be merged with clone`);
            }, preferClone, preferClone // options,
            );
            break;

          case false:
            if (this.merger.merge) {
              throw new Error(`Class (${this.type.name}) cannot be merged with clone`);
            }

            break;
        }
      } else {
        _clone = target;
      }

      this._clone = _clone;
    }

    return _clone;
  }

}

class MergeState {
  // noinspection DuplicatedCode
  constructor(mergerVisitor, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
    this.mergerVisitor = mergerVisitor;
    this.base = base;
    this.older = older;
    this.newer = newer;
    this.set = set;
    this.preferCloneBase = preferCloneBase;
    this.preferCloneOlder = preferCloneOlder;
    this.preferCloneNewer = preferCloneNewer;
    this.refsBase = refsBase;
    this.refsOlder = refsOlder;
    this.refsNewer = refsNewer;
    this.options = options;
  }

  get baseState() {
    let {
      _baseState
    } = this;

    if (_baseState == null) {
      const {
        options
      } = this;
      this._baseState = _baseState = new ValueState(this, this.base, this.preferCloneBase, options && options.selfAsValueBase, this.refsBase);
    }

    return _baseState;
  }

  set baseState(value) {
    this._baseState = value;
  }

  get olderState() {
    let {
      _olderState
    } = this;

    if (_olderState == null) {
      const {
        options
      } = this;
      this._olderState = _olderState = new ValueState(this, this.older, this.preferCloneOlder, options && options.selfAsValueOlder, this.refsOlder);
    }

    return _olderState;
  }

  set olderState(value) {
    this._olderState = value;
  }

  get newerState() {
    let {
      _newerState
    } = this;

    if (_newerState == null) {
      const {
        options
      } = this;
      this._newerState = _newerState = new ValueState(this, this.newer, this.preferCloneNewer, options && options.selfAsValueNewer, this.refsNewer);
    }

    return _newerState;
  }

  set newerState(value) {
    this._newerState = value;
  }

  fillOlderNewer() {
    const {
      olderState,
      newerState
    } = this; // this.mergerVisitor.setStatus(olderState.clone, ObjectStatus.Merged)
    // const idNewer = getObjectUniqueId(newerState.target as any)
    // if (idNewer != null) {
    // 	refsNewer[idNewer] = olderState.clone
    // }

    const older = olderState.clone;
    newerState.setRef(older);
    const {
      options,
      set,
      preferCloneNewer,
      refsOlder,
      refsNewer
    } = this;
    let isSet;
    const result = olderState.merge(this.mergerVisitor.getNextMerge(preferCloneNewer, preferCloneNewer, refsOlder, refsNewer, refsNewer, options), older, newerState.target, newerState.target, set ? o => {
      // if (idNewer != null) {
      // 	refsNewer[idNewer] = o
      // }
      set(o);
      isSet = true;
    } : () => {
      throw new Error(`Class ${olderState.type.name} does not need cloning.` + 'You should use "preferClone: false" in merger options for this class');
    }, preferCloneNewer, preferCloneNewer // options,
    );

    if (isSet) {
      return;
    }

    if (result || newerState.mustBeCloned) {
      set(older);
      return;
    }

    set(newerState.target);
  }

  mergeWithBase(olderState, newerState) {
    const {
      baseState
    } = this;
    const base = baseState.clone; // baseState.setRef(base)

    olderState.setRef(base);
    newerState.setRef(base);
    const {
      options,
      set
    } = this;
    const {
      refs: refsBase
    } = baseState;
    const {
      preferClone: preferCloneOlder,
      refs: refsOlder
    } = olderState;
    const {
      preferClone: preferCloneNewer,
      refs: refsNewer
    } = newerState;
    let isSet;
    const result = baseState.merge(this.mergerVisitor.getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options), base, olderState.target, newerState.target, // for String() etc., that cannot be changed
    set ? o => {
      baseState.setRef(o);
      olderState.setRef(o);
      newerState.setRef(o);
      set(o);
      isSet = true;
    } : () => {
      if (baseState.mustBeCloned) {
        throw new Error(`Class ${baseState.type.name} does not need cloning.` + 'You should use "preferClone: false" in merger options for this class');
      } else {
        isSet = true;
      }
    }, preferCloneOlder, preferCloneNewer // options,
    );

    if (isSet) {
      return !!set;
    }

    if (!result) {
      return false;
    }

    if (baseState.mustBeCloned) {
      set(base);
    }

    return true;
  }

}

function mergePreferClone(o1, o2) {
  if (o1 || o2) {
    return true;
  }

  return o1 == null ? o2 : o1;
}

var ObjectStatus;

(function (ObjectStatus) {
  ObjectStatus[ObjectStatus["Cloned"] = 1] = "Cloned";
  ObjectStatus[ObjectStatus["Merged"] = 2] = "Merged";
})(ObjectStatus || (ObjectStatus = {}));

class MergerVisitor {
  // public refs: IRef[]
  constructor(getMeta) {
    this.getMeta = getMeta;
  }

  getStatus(object) {
    const {
      statuses
    } = this;

    if (!statuses) {
      return null;
    }

    const id = getObjectUniqueId(object);

    if (id == null) {
      throw new Error(`object is primitive: ${object}`);
    }

    return statuses[id];
  }

  setStatus(object, status) {
    let {
      statuses
    } = this;

    if (!statuses) {
      this.statuses = statuses = [];
    }

    const id = getObjectUniqueId(object);

    if (id == null) {
      throw new Error(`object is primitive: ${object}`);
    }

    statuses[id] = status;
    return object;
  } // noinspection JSUnusedLocalSymbols


  getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
    return (next_base, next_older, next_newer, next_set, next_preferCloneOlder, next_preferCloneNewer, next_options) => this.merge(next_base, next_older, next_newer, next_set, next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder, next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer, next_options, // next_options == null || next_options === options
    // 	? options
    // 	: (options == null ? next_options : {
    // 		...options,
    // 		...next_options,
    // 	}),
    refsBase, refsOlder, refsNewer);
  }

  merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options, refsBase, refsOlder, refsNewer) {
    let preferCloneBase = null;

    if (base === newer) {
      if (base === older) {
        return false;
      }

      preferCloneBase = preferCloneNewer;
      preferCloneNewer = preferCloneOlder;
      newer = older;
    }

    if (isPrimitive(newer)) {
      if (set) {
        set(newer);
        return true;
      }

      return false;
    }

    if (base === older) {
      preferCloneBase = preferCloneOlder = mergePreferClone(preferCloneBase, preferCloneOlder);
    }

    if (older === newer) {
      preferCloneOlder = preferCloneNewer = mergePreferClone(preferCloneOlder, preferCloneNewer);
    }

    const mergeState = new MergeState(this, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options); // region refs

    if (!isPrimitive(base) && mergeState.baseState.isRef) {
      mergeState.newerState.resolveRef();

      if (mergeState.baseState.target === mergeState.newerState.target) {
        if (!isPrimitive(older)) {
          mergeState.olderState.resolveRef();

          if (mergeState.baseState.target === mergeState.olderState.target) {
            return false;
          }
        }

        mergeState.baseState = mergeState.newerState;
        mergeState.newerState = mergeState.olderState;
        newer = mergeState.newerState.target;
      }

      if (!isPrimitive(older)) {
        mergeState.olderState.resolveRef();

        if (mergeState.baseState.target === mergeState.olderState.target) {
          mergeState.olderState.preferClone = mergePreferClone(mergeState.baseState.preferClone, mergeState.olderState.preferClone);
          mergeState.baseState = mergeState.olderState;
        }

        older = mergeState.olderState.target;
      }

      base = mergeState.baseState.target;
    }

    if (!isPrimitive(older)) {
      mergeState.olderState.resolveRef();
      mergeState.newerState.resolveRef();

      if ((mergeState.olderState.isRef || mergeState.newerState.isRef) && mergeState.olderState.target === mergeState.newerState.target) {
        mergeState.newerState.preferClone = mergePreferClone(mergeState.olderState.preferClone, mergeState.newerState.preferClone);
        mergeState.olderState = mergeState.newerState;
      }

      older = mergeState.olderState.target;
      newer = mergeState.newerState.target;
    } // endregion


    const fillOlderNewer = () => {
      switch (mergeState.olderState.canMerge(mergeState.newerState)) {
        case null:
          if (mergeState.olderState.mustBeCloned) {
            set(mergeState.newerState.clone);
          } else {
            if (mergeState.newerState.mustBeCloned) {
              set(mergeState.olderState.target);
            } else {
              set(mergeState.newerState.target);
            }
          }

          break;

        case false:
          set(mergeState.newerState.clone);
          break;

        case true:
          mergeState.fillOlderNewer();
          return true;
      }
    };

    if (isPrimitive(base)) {
      if (set) {
        if (isPrimitive(older) || older === newer) {
          set(mergeState.newerState.clone);
        } else {
          fillOlderNewer();
        }

        return true;
      }

      return false;
    }

    if (!set && mergeState.baseState.mustBeCloned) {
      return false;
    }

    if (isPrimitive(older)) {
      switch (mergeState.baseState.canMerge(mergeState.newerState)) {
        case null:
          if (set) {
            set(older);
            return true;
          }

          break;

        case false:
          if (set) {
            set(mergeState.newerState.clone);
            return true;
          }

          break;

        case true:
          if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
            if (set) {
              set(older);
              return true;
            }

            return false;
          }

          return true;
      }

      return false;
    }

    switch (mergeState.baseState.canMerge(mergeState.newerState)) {
      case false:
        if (set) {
          fillOlderNewer();
          return true;
        }

        return false;

      case null:
        switch (mergeState.baseState.canMerge(mergeState.olderState)) {
          case null:
            return false;

          case false:
            if (set) {
              set(mergeState.olderState.clone);
              return true;
            }

            return false;

          case true:
            return mergeState.mergeWithBase(mergeState.olderState, mergeState.olderState);
        }

        throw new Error('Unreachable code');
    }

    switch (mergeState.baseState.canMerge(mergeState.olderState)) {
      case null:
        return mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState);
      // if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
      // 	if (set) {
      // 		throw new Error('base != newer; base == older; base == newer')
      // 	}
      // 	return false
      // }
      // return true

      case false:
        if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
          if (set) {
            set(mergeState.olderState.clone);
            return true;
          }

          return false;
        }

        return true;

      case true:
        return mergeState.mergeWithBase(mergeState.olderState, mergeState.newerState);
    }

    throw new Error('Unreachable code');
  }

} // endregion
// region TypeMetaMergerCollection

class TypeMetaMergerCollection extends TypeMetaCollection {
  constructor({
    proto,
    customMeta
  } = {}) {
    super(proto || TypeMetaMergerCollection.default);
    this.customMeta = customMeta;
  }

  getMeta(type) {
    return this.customMeta && this.customMeta(type) || super.getMeta(type);
  }

  static makeTypeMetaMerger(type, meta) {
    return {
      valueFactory: () => new type(),
      ...meta,
      merger: {
        canMerge(target, source) {
          return target._canMerge ? target._canMerge(source) : target.constructor === source.constructor;
        },

        merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
          return base._merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options);
        },

        ...(meta ? meta.merger : {})
      }
    };
  }

  putMergeableType(type, meta) {
    return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, meta));
  }

}
TypeMetaMergerCollection.default = new TypeMetaMergerCollection();
function registerMergeable(type, meta) {
  TypeMetaMergerCollection.default.putMergeableType(type, meta);
}
function registerMerger(type, meta) {
  TypeMetaMergerCollection.default.putType(type, meta);
}

function createPrimitiveTypeMetaMerger(meta) {
  return {
    preferClone: false,
    ...meta,
    merger: {
      merge(merge, base, older, newer, set) {
        set(newer.valueOf());
        return true;
      },

      ...(meta ? meta.merger : {})
    }
  };
}

function registerMergerPrimitive(type, meta) {
  registerMerger(type, createPrimitiveTypeMetaMerger(meta));
} // endregion
// region ObjectMerger

const primitiveTypeMetaMerger = createPrimitiveTypeMetaMerger();
const observableObjectProperties = ['propertyChanged'];
class ObjectMerger {
  constructor(typeMeta) {
    this.typeMeta = new TypeMetaMergerCollection({
      proto: typeMeta
    });
    this.merge = this.merge.bind(this);
  }

  merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
    const merger = new MergerVisitor(type => this.typeMeta.getMeta(type));
    const mergedValue = merger.merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options);
    return mergedValue;
  }

} // endregion
// region Primitive Mergers
// Handled in MergerVisitor:

ObjectMerger.default = new ObjectMerger();
ObjectMerger.observableOnly = new ObjectMerger(new TypeMetaMergerCollection({
  customMeta: type => {
    const prototype = type.prototype;

    for (let i = 0, len = observableObjectProperties.length; i < len; i++) {
      if (Object.prototype.hasOwnProperty.call(prototype, observableObjectProperties[i])) {
        return primitiveTypeMetaMerger;
      }
    }

    return null;
  }
}));

function isPrimitive(value) {
  return !canHaveUniqueId(value) || typeof value === 'function'; // value == null
  // || typeof value === 'number'
  // || typeof value === 'boolean'
}

registerMerger(String, {
  merger: {
    canMerge(target, source) {
      target = target.valueOf();
      source = source.valueOf();

      if (typeof source !== 'string') {
        return false;
      }

      if (target === source) {
        return null;
      }

      return true;
    },

    merge(merge, base, older, newer, set) {
      // base = base.valueOf()
      // older = older.valueOf()
      // newer = newer.valueOf()
      // if (base === newer) {
      // 	if (base === older) {
      // 		return false
      // 	}
      // 	set(older)
      // 	return true
      // }
      set(newer.valueOf());
      return true;
    }

  },
  preferClone: false
});
registerMergerPrimitive(Number);
registerMergerPrimitive(Boolean);
registerMergerPrimitive(Array);
registerMergerPrimitive(Error); // endregion
// region Array
// @ts-ignore
// registerMerger<any[], any[]>(Array, {
// 	merger: {
// 		canMerge(target: any[], source: any[]): boolean {
// 			return Array.isArray(source)
// 		},
// 		merge(
// 			merge: IMergeValue,
// 			base: any[],
// 			older: any[],
// 			newer: any[],
// 			set?: (value: any[]) => void,
// 			preferCloneOlder?: boolean,
// 			preferCloneNewer?: boolean,
// 			options?: IMergeOptions,
// 		): boolean {
// 			let changed = false
// 			const lenBase = base.length
// 			const lenOlder = older.length
// 			const lenNewer = newer.length
// 			for (let i = 0; i < lenNewer; i++) {
// 				if (i < lenBase) {
// 					if (i < lenOlder) {
// 						changed = merge(base[i], older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 							|| changed
// 					} else {
// 						changed = merge(base[i], newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 							|| changed
// 					}
// 				} else if (i < lenOlder) {
// 					changed = merge(EMPTY, older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 						|| changed
// 				} else {
// 					changed = merge(EMPTY, newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 						|| changed
// 				}
// 			}
// 		},
// 	},
// 	preferClone: o => Array.isFrozen(o) ? true : null,
// })
// endregion
// region Object

registerMerger(Object, {
  merger: {
    canMerge(target, source) {
      return source.constructor === Object;
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(createMergeMapWrapper, merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  },
  preferClone: o => Object.isFrozen(o) ? true : null
}); // endregion
// region Date

registerMerger(Date, {
  merger: {
    canMerge(target, source) {
      if (source.constructor !== Date) {
        return false;
      }

      return target.getTime() === source.getTime() ? null : false;
    }

  },
  valueFactory: source => new Date(source)
}); // endregion
// region Set

registerMerger(Set, {
  merger: {
    canMerge(target, source) {
      return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => fillSet(new Set(), arrayOrIterable)), merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  } // valueFactory: (source: Set<any>) => new Set(source),

}); // endregion
// region Map

registerMerger(Map, {
  merger: {
    // tslint:disable-next-line:no-identical-functions
    canMerge(target, source) {
      return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new Map(), arrayOrIterable)), merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  } // valueFactory: (source: Map<any, any>) => new Map(source),

}); // endregion

class SerializerVisitor {
  constructor(typeMeta) {
    this._typeMeta = typeMeta;
    this.serialize = this.serialize.bind(this);
  }

  addType(uuid) {
    // tslint:disable-next-line:prefer-const
    let {
      types,
      typesMap
    } = this;

    if (!typesMap) {
      this.typesMap = typesMap = {};
      this.types = types = [];
    }

    let typeIndex = typesMap[uuid];

    if (typeIndex == null) {
      typeIndex = types.length;
      types[typeIndex] = uuid;
      typesMap[uuid] = typeIndex;
    }

    return typeIndex;
  }

  addObject(object, serialize) {
    // tslint:disable-next-line:prefer-const
    let {
      objects,
      objectsMap
    } = this;

    if (!objectsMap) {
      this.objectsMap = objectsMap = [];
      this.objects = objects = [];
    }

    const id = getObjectUniqueId(object);
    let ref = objectsMap[id];

    if (ref == null) {
      const index = objects.length;
      ref = {
        id: index
      };
      objectsMap[id] = ref;
      const data = {};
      objects[index] = data;
      serialize(data);
    }

    return ref;
  }

  serializeObject(out, value, options) {
    const meta = this._typeMeta.getMeta(options && options.valueType || value.constructor);

    if (!meta) {
      throw new Error(`Class (${value.constructor.name}) have no type meta`);
    }

    const uuid = meta.uuid;

    if (!uuid) {
      throw new Error(`Class (${value.constructor.name}) type meta have no uuid`);
    }

    const serializer = meta.serializer;

    if (!serializer) {
      throw new Error(`Class (${value.constructor.name}) type meta have no serializer`);
    }

    if (!serializer.serialize) {
      throw new Error(`Class (${value.constructor.name}) serializer have no serialize method`);
    }

    out.type = this.addType(uuid);
    out.data = serializer.serialize(this.getNextSerialize(options), value, options);
  } // noinspection JSUnusedLocalSymbols


  getNextSerialize(options) {
    return (next_value, next_options) => this.serialize(next_value, next_options // next_options == null || next_options === options
    // 	? options
    // 	: (options == null ? next_options : {
    // 		...options,
    // 		...next_options,
    // 	}),
    );
  }

  serialize(value, options) {
    if (value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
      return value;
    }

    return this.addObject(value, out => {
      this.serializeObject(out, value, options);
    });
  }

} // tslint:disable-next-line:no-shadowed-variable no-empty

const LOCKED = function LOCKED() {};

class DeSerializerVisitor {
  constructor(typeMeta, types, objects) {
    this._countDeserialized = 0;
    this._typeMeta = typeMeta;
    this._types = types;
    this._objects = objects;
    const len = objects.length;
    const instances = new Array(len);

    for (let i = 0; i < len; i++) {
      instances[i] = null;
    }

    this._instances = instances;
    this.deSerialize = this.deSerialize.bind(this);
  }

  assertEnd() {
    const {
      _types,
      _objects,
      _instances,
      _typeMeta
    } = this;

    const getDebugObject = (deserialized, id) => {
      const object = _objects[id];
      const uuid = _types[object.type];

      const type = _typeMeta.getType(uuid); // noinspection HtmlUnknownTag


      return {
        type: type == null ? `<Type not found: ${uuid}>` : type.name,
        data: object.data,
        deserialized: deserialized == null ? deserialized : deserialized.constructor.name
      };
    };

    if (this._countDeserialized !== _instances.length) {
      throw new Error(`${_instances.length - this._countDeserialized} instances is not deserialized\r\n` + JSON.stringify(_instances.map((o, i) => [o, i]).filter(o => !o[0] || o[0] === LOCKED || ThenableSync.isThenable(o[0])).map(o => getDebugObject(o[0], o[1]))));
    }
  } // noinspection JSUnusedLocalSymbols


  getNextDeSerialize(options) {
    return (next_serializedValue, next_onfulfilled, next_options) => this.deSerialize(next_serializedValue, next_onfulfilled, next_options // next_options == null || next_options === options
    // 	? options
    // 	: (options == null ? next_options : {
    // 		...options,
    // 		...next_options,
    // 	}),
    );
  }

  deSerialize(serializedValue, onfulfilled, options) {
    if (onfulfilled) {
      const input_onfulfilled = onfulfilled;

      onfulfilled = value => {
        const result = input_onfulfilled(value);
        onfulfilled = null;
        return result;
      };
    }

    if (serializedValue == null || typeof serializedValue === 'number' || typeof serializedValue === 'string' || typeof serializedValue === 'boolean') {
      if (onfulfilled) {
        return ThenableSync.resolve(onfulfilled(serializedValue));
      }

      return serializedValue;
    }

    const id = serializedValue.id;

    if (id != null) {
      let cachedInstance = this._instances[id];

      if (cachedInstance) {
        if (cachedInstance === LOCKED) {
          this._instances[id] = cachedInstance = new ThenableSync();
        }

        if (onfulfilled) {
          if (cachedInstance instanceof ThenableSync) {
            cachedInstance.thenLast(onfulfilled);
          } else {
            return ThenableSync.resolve(onfulfilled(cachedInstance));
          }
        }

        return cachedInstance;
      }

      this._instances[id] = LOCKED;
      serializedValue = this._objects[id];
    }

    let type = options && options.valueType;

    if (!type) {
      const typeIndex = serializedValue.type;

      if (typeof typeIndex !== 'number') {
        throw new Error(`Serialized value have no type field: ${JSON.stringify(serializedValue, null, 4)}`);
      }

      const uuid = this._types[typeIndex];

      if (typeof uuid !== 'string') {
        throw new Error(`type uuid not found for index (${typeIndex}): ${JSON.stringify(serializedValue, null, 4)}`);
      }

      type = this._typeMeta.getType(uuid);

      if (!type) {
        throw new Error(`type not found for uuid (${uuid}): ${JSON.stringify(serializedValue, null, 4)}`);
      }
    }

    const meta = this._typeMeta.getMeta(type);

    if (!meta) {
      throw new Error(`Class (${typeToDebugString(type)}) have no type meta`);
    }

    const serializer = meta.serializer;

    if (!serializer) {
      throw new Error(`Class (${typeToDebugString(type)}) type meta have no serializer`);
    }

    if (!serializer.deSerialize) {
      throw new Error(`Class (${typeToDebugString(type)}) serializer have no deSerialize method`);
    }

    let factory = options && options.valueFactory || meta.valueFactory || ((...args) => new type(...args));

    if (id != null && !factory) {
      throw new Error(`valueFactory not found for ${typeToDebugString(type)}. ` + 'Any object serializers should have valueFactory');
    }

    let instance;
    const iteratorOrValue = serializer.deSerialize(this.getNextDeSerialize(options), serializedValue.data, (...args) => {
      if (!factory) {
        throw new Error('Multiple call valueFactory is forbidden');
      }

      instance = factory(...args);
      factory = null;
      return instance;
    }, options);

    const resolveInstance = value => {
      const cachedInstance = this._instances[id];
      this._instances[id] = value;

      if (cachedInstance instanceof ThenableSync) {
        cachedInstance.resolve(value);
      }
    };

    const resolveValue = value => {
      if (id != null) {
        if (!factory && instance !== value) {
          throw new Error(`valueFactory instance !== return value in serializer for ${typeToDebugString(type)}`);
        }

        resolveInstance(value);
        this._countDeserialized++;
      }

      if (onfulfilled) {
        return ThenableSync.resolve(onfulfilled(value));
      }

      return value;
    };

    const valueOrThenFunc = ThenableSync.resolve(iteratorOrValue, resolveValue);

    if (id != null && !factory && ThenableSync.isThenable(valueOrThenFunc)) {
      resolveInstance(instance);

      if (onfulfilled) {
        return ThenableSync.resolve(onfulfilled(instance));
      }

      return instance;
    }

    return valueOrThenFunc;
  }

} // endregion
// region TypeMetaSerializerCollection

class TypeMetaSerializerCollection extends TypeMetaCollectionWithId {
  constructor(proto) {
    super(proto || TypeMetaSerializerCollection.default);
  }

  static makeTypeMetaSerializer(type, meta) {
    return {
      uuid: type.uuid,
      // valueFactory: (...args) => new (type as new (...args: any[]) => TObject)(...args),
      ...meta,
      serializer: {
        serialize(serialize, value, options) {
          return value.serialize(serialize, options);
        },

        *deSerialize(deSerialize, serializedValue, valueFactory, options) {
          const value = valueFactory();
          yield value.deSerialize(deSerialize, serializedValue, options);
          return value;
        },

        ...(meta ? meta.serializer : {})
      }
    };
  }

  putSerializableType(type, meta) {
    return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, meta));
  }

}
TypeMetaSerializerCollection.default = new TypeMetaSerializerCollection();
function registerSerializable(type, meta) {
  TypeMetaSerializerCollection.default.putSerializableType(type, meta);
}
function registerSerializer(type, meta) {
  TypeMetaSerializerCollection.default.putType(type, meta);
} // endregion
// region ObjectSerializer

class ObjectSerializer {
  constructor(typeMeta) {
    this.typeMeta = new TypeMetaSerializerCollection(typeMeta);
  }

  serialize(value, options) {
    const serializer = new SerializerVisitor(this.typeMeta);
    const serializedValue = serializer.serialize(value, options);

    if (!serializedValue || typeof serializedValue !== 'object') {
      return serializedValue;
    }

    const serializedData = {
      data: serializedValue
    };

    if (serializer.types) {
      serializedData.types = serializer.types;
    }

    if (serializer.objects) {
      serializedData.objects = serializer.objects;
    }

    return serializedData;
  }

  deSerialize(serializedValue, options) {
    if (!serializedValue || typeof serializedValue !== 'object') {
      return serializedValue;
    }

    const {
      types,
      objects,
      data
    } = serializedValue;

    if (!Array.isArray(types)) {
      throw new Error(`serialized value types field is not array: ${types}`);
    }

    const deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects);
    const value = deSerializer.deSerialize(data, null, options);
    deSerializer.assertEnd();
    return value;
  }

} // endregion
// region Primitive Serializers
// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean
// region Helpers

ObjectSerializer.default = new ObjectSerializer();
function serializeArray(serialize, value, length) {
  if (length == null) {
    length = value.length;
  }

  const serializedValue = [];

  for (let i = 0; i < length; i++) {
    serializedValue[i] = serialize(value[i]);
  }

  return serializedValue;
}
function deSerializeArray(deSerialize, serializedValue, value) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    const index = i;

    if (ThenableSync.isThenable(deSerialize(serializedValue[index], o => {
      value[index] = o;
    }))) {
      value[index] = null;
    }
  }

  return value;
}
function serializeIterable(serialize, value) {
  const serializedValue = [];

  for (const item of value) {
    serializedValue.push(serialize(item));
  }

  return serializedValue;
}
function* deSerializeIterableOrdered(serializedValue, add) {
  for (let i = 0, len = serializedValue.length; i < len; i++) {
    yield add(serializedValue[i]);
  }
}
// region Object

function serializeObject(serialize, value, options) {
  const keepUndefined = options && options.objectKeepUndefined;
  const serializedValue = {};

  for (const key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      const item = value[key];

      if (keepUndefined || typeof item !== 'undefined') {
        serializedValue[key] = serialize(item);
      }
    }
  }

  return serializedValue;
}
function deSerializeObject(deSerialize, serializedValue, value) {
  for (const key in serializedValue) {
    if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
      // tslint:disable-next-line:no-collapsible-if
      if (ThenableSync.isThenable(deSerialize(serializedValue[key], o => {
        value[key] = o;
      }))) {
        value[key] = null;
      }
    }
  }

  return value;
} // noinspection SpellCheckingInspection

registerSerializer(Object, {
  uuid: '88968a59178c4e73a99f801e8cdfc37d',
  serializer: {
    serialize(serialize, value, options) {
      return serializeObject(serialize, value, options);
    },

    deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    }

  },
  valueFactory: () => ({})
}); // endregion
// region Primitive as object

function serializePrimitiveAsObject(serialize, object) {
  const value = object.valueOf();

  if (value === object) {
    throw new Error(`value is not primitive as object: ${value && value.constructor.name}`);
  }

  return value; // return {
  // 	value: serialize(value),
  // 	object: serializeObject(serialize, object, options) as any,
  // }
}
function deSerializePrimitiveAsObject(deSerialize, serializedValue, valueFactory) {
  const object = valueFactory(serializedValue); // deSerializeObject(deSerialize, serializedValue.object as any, object)

  return object;
}
const primitiveAsObjectSerializer = {
  serialize: serializePrimitiveAsObject,
  deSerialize: deSerializePrimitiveAsObject
}; // @ts-ignore
// noinspection SpellCheckingInspection

registerSerializer(String, {
  uuid: '96104fd7d6f84a32b8f2feaa4f3666d8',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Number, {
  uuid: 'dea0de4018014025b6a4b6f6c7a4fa11',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Boolean, {
  uuid: 'e8d1ac82a0fa4431a23e3d8f954f736f',
  serializer: primitiveAsObjectSerializer
}); // endregion
// region Array

registerSerializer(Array, {
  uuid: 'f8c84ed084634f45b14a228967dfb0de',
  serializer: {
    serialize(serialize, value, options) {
      if (options && options.arrayAsObject) {
        return serializeObject(serialize, value, options);
      }

      return serializeArray(serialize, value, options && options.arrayLength);
    },

    deSerialize(deSerialize, serializedValue, valueFactory, options) {
      const value = valueFactory();

      if (options && options.arrayAsObject) {
        return deSerializeObject(deSerialize, serializedValue, value);
      }

      return deSerializeArray(deSerialize, serializedValue, value);
    }

  },
  valueFactory: () => []
}); // endregion
// region Set

registerSerializer(Set, {
  uuid: '17b11d99ce034349969e4f9291d0778c',
  serializer: {
    serialize(serialize, value) {
      return serializeIterable(serialize, value);
    },

    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      yield deSerializeIterableOrdered(serializedValue, o => deSerialize(o, val => {
        value.add(val);
      }));
      return value;
    }

  } // valueFactory: () => new Set(),

}); // endregion
// region Map

registerSerializer(Map, {
  uuid: 'fdf40f2159b74cb2804f3d18ebb19b57',
  serializer: {
    serialize(serialize, value) {
      return serializeIterable(item => [serialize(item[0]), serialize(item[1])], value);
    },

    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      yield deSerializeIterableOrdered(serializedValue, item => deSerialize(item[0], key => deSerialize(item[1], val => {
        value.set(key, val);
      })));
      return value;
    }

  } // valueFactory: () => new Map(),

}); // endregion
// region Date

registerSerializer(Date, {
  uuid: '7a6c01dba6b84822a9a586e4d3a4460b',
  serializer: {
    serialize(serialize, value) {
      return value.getTime();
    },

    deSerialize(deSerialize, serializedValue, valueFactory) {
      return valueFactory(serializedValue);
    }

  } // valueFactory: (value: number|string|Date) => new Date(value),

}); // endregion
// endregion

class ObservableObject extends ObservableClass {}
registerMerger(ObservableObject, {
  merger: {
    canMerge(target, source) {
      return source instanceof Object;
    },

    merge(merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps((target, source) => new MergeObjectWrapper(source), merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }

  },
  preferClone: o => Object.isFrozen(o) ? true : null
});
registerSerializer(ObservableObject, {
  uuid: '1380d053394748e58406c1c0e62a2be9',
  serializer: {
    serialize(serialize, value, options) {
      return serializeObject(serialize, value, options);
    },

    deSerialize(deSerialize, serializedValue, valueFactory) {
      const value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    }

  },
  valueFactory: () => new ObservableObject()
});

/* tslint:disable:no-shadowed-variable */
let now;

if (typeof performance !== 'undefined' && performance.now) {
  now = performance.now.bind(performance);
} else {
  const start = process.hrtime();

  now = function now() {
    const end = process.hrtime(start);
    return end[0] * 1000 + end[1] / 1000000;
  };
}

const VALUE_PROPERTY_DEFAULT = '';

class Debugger {
  constructor() {
    this._dependencySubject = new Subject();
    this._connectorSubject = new Subject();
    this._invalidatedSubject = new Subject();
    this._calculatedSubject = new Subject();
    this._deepSubscribeSubject = new Subject();
    this._deepSubscribeLastValueSubject = new Subject();
    this._errorSubject = new Subject();
  } // region onDependencyChanged


  get dependencyObservable() {
    return this._dependencySubject;
  }

  onDependencyChanged(target, value, parent, key, keyType) {
    if (this._dependencySubject.hasSubscribers) {
      this._dependencySubject.emit({
        target,
        value,
        parent,
        key,
        keyType
      });
    }
  } // endregion
  // region onConnectorChanged


  get connectorObservable() {
    return this._connectorSubject;
  }

  onConnectorChanged(target, targetKey, value, parent, key, keyType) {
    if (this._connectorSubject.hasSubscribers) {
      this._connectorSubject.emit({
        target,
        targetKey,
        value,
        parent,
        key,
        keyType
      });
    }
  } // endregion
  // region onInvalidated


  get invalidatedObservable() {
    return this._invalidatedSubject;
  }

  onInvalidated(target, value) {
    if (this._invalidatedSubject.hasSubscribers) {
      this._invalidatedSubject.emit({
        target,
        value
      });
    }
  } // endregion
  // region onCalculated


  get calculatedObservable() {
    return this._calculatedSubject;
  }

  onCalculated(target, oldValue, newValue) {
    if (this._calculatedSubject.hasSubscribers) {
      this._calculatedSubject.emit({
        target,
        newValue,
        oldValue
      });
    }
  } // endregion
  // region onDeepSubscribe


  get deepSubscribeObservable() {
    return this._deepSubscribeSubject;
  }

  onDeepSubscribe(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule, oldIsLeaf, newIsLeaf, target) {
    if (this._deepSubscribeSubject.hasSubscribers) {
      this._deepSubscribeSubject.emit({
        key,
        oldValue,
        newValue,
        parent,
        changeType,
        keyType,
        propertiesPath,
        rule,
        oldIsLeaf,
        newIsLeaf,
        target
      });
    }
  } // endregion
  // region onDeepSubscribeLastValue


  get deepSubscribeLastValueHasSubscribers() {
    return this._deepSubscribeLastValueSubject.hasSubscribers;
  }

  get deepSubscribeLastValueObservable() {
    return this._deepSubscribeLastValueSubject;
  }

  onDeepSubscribeLastValue(unsubscribedValue, subscribedValue, target) {
    if (this._deepSubscribeLastValueSubject.hasSubscribers) {
      this._deepSubscribeLastValueSubject.emit({
        unsubscribedValue,
        subscribedValue,
        target
      });
    }
  } // endregion
  // region onError


  get errorObservable() {
    return this._errorSubject;
  }

  onError(target, newValue, oldValue, err) {
    if (this._errorSubject.hasSubscribers) {
      this._errorSubject.emit({
        target,
        newValue,
        oldValue,
        error: err
      });
    }
  } // endregion


}
Debugger.Instance = new Debugger();

const timingDefault = {
  now: Date.now,
  setTimeout: typeof window === 'undefined' ? setTimeout : setTimeout.bind(window),
  clearTimeout: typeof window === 'undefined' ? clearTimeout : clearTimeout.bind(window)
};

// Is slower than simple object
// export class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
// 	public name: string
// 	public oldValue: TValue
// 	public newValue: TValue
//
// 	constructor(name, oldValue: TValue, newValue: TValue) {
// 		this.name = name
// 		this.oldValue = oldValue
// 		this.newValue = newValue
// 	}
// }
class PropertyChangedEvent {
  constructor(name, oldValue, getNewValue) {
    this.name = name;
    this.oldValue = oldValue;
    this._getNewValue = getNewValue;
  }

  get newValue() {
    return this._getNewValue();
  }

}

class ObservableObjectBuilder {
  constructor(object) {
    this.object = object || new ObservableClass();
  }

  writable(name, options, initValue) {
    const {
      setOptions,
      hidden
    } = options || {};
    const {
      object
    } = this;
    const {
      __fields
    } = object;

    if (__fields) {
      __fields[name] = object[name];
    } else if (typeof initValue !== 'undefined') {
      throw new Error("You can't set initValue for prototype writable property");
    } // optimization


    const getValue = options && options.getValue || createFunction(() => function () {
      return this.__fields[name];
    }, `return this.__fields["${name}"]`);
    const setValue = options && options.setValue || createFunction(() => function (v) {
      this.__fields[name] = v;
    }, 'v', `this.__fields["${name}"] = v`);
    const set = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
    Object.defineProperty(object, name, {
      configurable: true,
      enumerable: !hidden,

      get() {
        return getValue.call(this);
      },

      set(newValue) {
        set(this, newValue);
      }

    });

    if (__fields && typeof initValue !== 'undefined') {
      const value = __fields[name];

      if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(object, value, initValue) : value !== initValue) {
        object[name] = initValue;
      }
    }

    return this;
  }

  readable(name, options, initValue) {
    return this.updatable(name, options, initValue);
  }

  updatable(name, options, initValue) {
    const hidden = options && options.hidden;
    const {
      object
    } = this;
    const {
      __fields
    } = object;

    if (__fields) {
      __fields[name] = object[name];
    }

    let factory = options && options.factory;

    if (!factory && !__fields && typeof initValue !== 'undefined') {
      factory = o => o;
    }

    const update = options && options.update; // optimization

    const getValue = options && options.getValue || createFunction(() => function () {
      return this.__fields[name];
    }, `return this.__fields["${name}"]`);
    let setValue;

    if (update || factory) {
      setValue = options && options.setValue || createFunction(() => function (v) {
        this.__fields[name] = v;
      }, 'v', `this.__fields["${name}"] = v`);
    }

    let setOnUpdate;

    if (update) {
      // tslint:disable-next-line
      const setOptions = options && options.setOptions;
      setOnUpdate = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
    }

    let setOnInit;

    if (factory) {
      const setOptions = { ...(options && options.setOptions),
        suppressPropertyChanged: true
      };
      setOnInit = setOptions ? _setExt.bind(null, name, getValue, setValue, setOptions) : _set.bind(null, name, getValue, setValue);
    }

    const createInstanceProperty = instance => {
      const attributes = {
        configurable: true,
        enumerable: !hidden,

        get() {
          return getValue.call(this);
        }

      };

      if (update) {
        attributes.set = function (value) {
          const newValue = update.call(this, value);

          if (typeof newValue !== 'undefined') {
            setOnUpdate(this, newValue);
          }
        };
      }

      Object.defineProperty(instance, name, attributes);
    };

    const initializeValue = options && options.init;

    if (factory) {
      const init = function () {
        const factoryValue = factory.call(this, initValue);
        createInstanceProperty(this);

        if (initializeValue) {
          initializeValue.call(this, factoryValue);
        }

        return factoryValue;
      };

      const initAttributes = {
        configurable: true,
        enumerable: !hidden,

        get() {
          const factoryValue = init.call(this);

          if (typeof factoryValue !== 'undefined') {
            const oldValue = getValue.call(this);

            if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(this, oldValue, factoryValue) : oldValue !== factoryValue) {
              setOnInit(this, factoryValue);
            }
          }

          return factoryValue;
        }

      };

      if (update) {
        initAttributes.set = function (value) {
          // tslint:disable:no-dead-store
          const factoryValue = init.call(this);
          const newValue = update.call(this, value);

          if (typeof newValue !== 'undefined') {
            const oldValue = getValue.call(this);

            if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue !== newValue) {
              setOnInit(this, newValue);
            }
          }
        };
      }

      Object.defineProperty(object, name, initAttributes);

      if (__fields) {
        const oldValue = __fields[name];
        const {
          propertyChangedIfCanEmit
        } = object;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(name, oldValue, () => object[name]));
        }
      }
    } else {
      createInstanceProperty(object);

      if (__fields && typeof initValue !== 'undefined') {
        const oldValue = __fields[name];

        if (initializeValue) {
          initializeValue.call(this, initValue);
        }

        if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(object, oldValue, initValue) : oldValue !== initValue) {
          __fields[name] = initValue;
          const {
            propertyChangedIfCanEmit
          } = object;

          if (propertyChangedIfCanEmit) {
            propertyChangedIfCanEmit.onPropertyChanged({
              name,
              oldValue,
              newValue: initValue
            });
          }
        }
      }
    }

    return this;
  }

  delete(name) {
    const {
      object
    } = this;
    const oldValue = object[name];

    object._setUnsubscriber(name, null);

    delete object[name];
    const {
      __fields
    } = object;

    if (__fields) {
      delete __fields[name];

      if (typeof oldValue !== 'undefined') {
        const {
          propertyChangedIfCanEmit
        } = object;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name,
            oldValue
          });
        }
      }
    }

    return this;
  }

} // Test:
// export const obj = new ObservableObjectBuilder()
// 	.writable<number, 'prop1'>('prop1')
// 	.readable<string, 'prop2'>('prop2')
// 	.readable<string, 'prop3'>('prop3')
// 	.delete('prop3')
// 	.object
//
// export const x = obj.prop1 + obj.prop2 + obj.propertyChanged + obj.prop3
// const builder = new ObservableObjectBuilder(true as any)
//
// export function writable<T = any>(
// 	options?: IWritableFieldOptions,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }
// class Class extends ObservableClass {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }

class CalcPropertyState extends ObservableClass {
  constructor(calcOptions, initValue) {
    super();
    this.calcOptions = calcOptions;
    this.value = initValue;
  }

}
new ObservableObjectBuilder(CalcPropertyState.prototype).writable('input').writable('value');
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']

let ValueChangeType;

(function (ValueChangeType) {
  ValueChangeType[ValueChangeType["None"] = 0] = "None";
  ValueChangeType[ValueChangeType["Unsubscribe"] = 1] = "Unsubscribe";
  ValueChangeType[ValueChangeType["Subscribe"] = 2] = "Subscribe";
  ValueChangeType[ValueChangeType["Changed"] = 3] = "Changed";
})(ValueChangeType || (ValueChangeType = {}));

let ValueKeyType;

(function (ValueKeyType) {
  ValueKeyType[ValueKeyType["Property"] = 0] = "Property";
  ValueKeyType[ValueKeyType["ValueProperty"] = 1] = "ValueProperty";
  ValueKeyType[ValueKeyType["MapKey"] = 2] = "MapKey";
  ValueKeyType[ValueKeyType["CollectionAny"] = 3] = "CollectionAny";
  ValueKeyType[ValueKeyType["ChangeCount"] = 4] = "ChangeCount";
})(ValueKeyType || (ValueKeyType = {}));

let RuleType;

(function (RuleType) {
  RuleType[RuleType["Nothing"] = 0] = "Nothing";
  RuleType[RuleType["Never"] = 1] = "Never";
  RuleType[RuleType["Action"] = 2] = "Action";
  RuleType[RuleType["If"] = 3] = "If";
  RuleType[RuleType["Any"] = 4] = "Any";
  RuleType[RuleType["Repeat"] = 5] = "Repeat";
})(RuleType || (RuleType = {}));

let RuleRepeatAction;

(function (RuleRepeatAction) {
  RuleRepeatAction[RuleRepeatAction["Never"] = 0] = "Never";
  RuleRepeatAction[RuleRepeatAction["Next"] = 1] = "Next";
  RuleRepeatAction[RuleRepeatAction["Fork"] = 2] = "Fork";
  RuleRepeatAction[RuleRepeatAction["All"] = 3] = "All";
})(RuleRepeatAction || (RuleRepeatAction = {}));

function ruleTypeToString(ruleType) {
  switch (ruleType) {
    case RuleType.Never:
      return 'Never';

    case RuleType.Action:
      return 'Action';

    case RuleType.Any:
      return 'Any';

    case RuleType.If:
      return 'If';

    case RuleType.Nothing:
      return 'Nothing';

    case RuleType.Repeat:
      return 'Repeat';

    default:
      throw new Error('Unknown RuleType: ' + ruleType);
  }
}

function ruleToString(rule, customDescription, nestedRulesStr) {
  const description = customDescription || this.description || ruleTypeToString(this.type);
  return `${description}${nestedRulesStr ? '(' + nestedRulesStr + ')' : ''}${this.next ? ' > ' + this.next : ''}`;
}

class Rule {
  constructor(type, description) {
    this.type = type;

    if (description != null) {
      this.description = description;
    }
  }

  clone() {
    const {
      type,
      subType,
      description,
      next,
      toString
    } = this;
    const clone = {
      type,
      subType,
      description,
      toString
    };

    if (next != null) {
      clone.next = next.clone();
    }

    return clone;
  }

  toString() {
    return ruleToString();
  }

}
class RuleNothing extends Rule {
  constructor() {
    super(RuleType.Nothing);
    this.description = 'nothing';
  }

}
RuleNothing.instance = Object.freeze(new RuleNothing());
class RuleNever extends Rule {
  constructor() {
    super(RuleType.Never);
    this.description = 'never';
  }

  get next() {
    return null;
  } // tslint:disable-next-line:no-empty


  set next(value) {}

  clone() {
    return this;
  }

}
RuleNever.instance = Object.freeze(new RuleNever());

const ANY = '*';

let ListChangedType;

(function (ListChangedType) {
  ListChangedType[ListChangedType["Removed"] = 0] = "Removed";
  ListChangedType[ListChangedType["Added"] = 1] = "Added";
  ListChangedType[ListChangedType["Set"] = 2] = "Set";
  ListChangedType[ListChangedType["Resorted"] = 3] = "Resorted";
  ListChangedType[ListChangedType["Moved"] = 4] = "Moved";
})(ListChangedType || (ListChangedType = {})); // export interface IObservableList<T> extends IListChanged<T>, IList<T> {
// }

let MapChangedType;

(function (MapChangedType) {
  MapChangedType[MapChangedType["Removed"] = 0] = "Removed";
  MapChangedType[MapChangedType["Added"] = 1] = "Added";
  MapChangedType[MapChangedType["Set"] = 2] = "Set";
})(MapChangedType || (MapChangedType = {}));

let SetChangedType;

(function (SetChangedType) {
  SetChangedType[SetChangedType["Removed"] = 0] = "Removed";
  SetChangedType[SetChangedType["Added"] = 1] = "Added";
})(SetChangedType || (SetChangedType = {}));

/* tslint:disable:no-identical-functions */


function getFirstExistProperty(object, propertyNames) {
  for (let i = 0, len = propertyNames.length; i < len; i++) {
    const propertyName = propertyNames[i];

    if ( propertyName in object ) {
      return propertyName;
    }
  }

  return null;
}

function subscribeObjectValue(propertyNames, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!(object instanceof Object)) {
    changeItem(null, void 0, object, ValueChangeType.Subscribe, null);
    return null;
  }

  if (object.constructor === Object || Array.isArray(object)) {
    changeItem(null, void 0, object, ValueChangeType.Subscribe, null);
    return () => {
      changeItem(null, object, void 0, ValueChangeType.Unsubscribe, null);
    };
  }

  let subscribePropertyName;

  const getSubscribePropertyName = () => {
    if ( !(VALUE_PROPERTY_DEFAULT in object) ) {
      return null;
    }

    const propertyName = getFirstExistProperty(object, propertyNames);

    if (propertyName == null) {
      return VALUE_PROPERTY_DEFAULT;
    }

    return propertyName;
  };

  const subscribeProperty = (propertyName, isFirst) => {
    subscribePropertyName = propertyName;

    if (propertyName == null) {
      changeItem(null, void 0, object, ValueChangeType.Subscribe, null);
    } else {
      const value = object[propertyName];

      if (typeof value !== 'undefined') {
        changeItem(propertyName, void 0, value, ValueChangeType.Subscribe, ValueKeyType.ValueProperty);
      }

      if (isFirst) {
        changeItem(propertyName, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.ValueProperty);
      }
    }
  };

  const unsubscribeProperty = isLast => {
    if (subscribePropertyName == null) {
      changeItem(null, object, void 0, ValueChangeType.Unsubscribe, null);
    } else {
      if (isLast) {
        changeItem(subscribePropertyName, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty);
      }

      const value = object[subscribePropertyName];

      if (typeof value !== 'undefined') {
        changeItem(subscribePropertyName, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty);
      }
    }

    subscribePropertyName = null;
  };

  const {
    propertyChanged
  } = object;
  let unsubscribe;
  let subscribed;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(({
      name,
      oldValue,
      newValue
    }) => {
      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      }

      const newSubscribePropertyName = getSubscribePropertyName();

      if (name === subscribePropertyName) {
        if (subscribePropertyName === newSubscribePropertyName && subscribePropertyName != null && unsubscribe != null && typeof oldValue !== 'undefined' && typeof newValue !== 'undefined') {
          changeItem(subscribePropertyName, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.ValueProperty);
          return;
        }

        if (typeof oldValue !== 'undefined') {
          changeItem(subscribePropertyName, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty);
        }
      } else if (subscribePropertyName !== newSubscribePropertyName) {
        unsubscribeProperty(false);
      } else {
        return;
      }

      if (unsubscribe != null) {
        subscribeProperty(newSubscribePropertyName, false);
      }
    }, {
      propertiesPath,
      rule
    }));
  }

  if (immediateSubscribe) {
    subscribeProperty(getSubscribePropertyName(), true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return () => {
    let _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    unsubscribeProperty(true);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion

function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!(object instanceof Object)) {
    return null;
  }

  const {
    propertyChanged
  } = object;
  let unsubscribe;
  let subscribed;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(({
      name,
      oldValue,
      newValue
    }) => {
      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      } // PROF: 623 - 1.3%


      if (!propertyPredicate || propertyPredicate(name, object)) {
        if (unsubscribe && typeof oldValue !== 'undefined' && typeof newValue !== 'undefined') {
          changeItem(name, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.Property);
        } else {
          if (typeof oldValue !== 'undefined') {
            changeItem(name, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
          }

          if (unsubscribe && typeof newValue !== 'undefined') {
            changeItem(name, void 0, newValue, ValueChangeType.Subscribe, ValueKeyType.Property);
          }
        }
      }
    }, {
      propertiesPath,
      rule
    }));
  }

  const forEach = isSubscribe => {
    if (propertyNames == null) {
      for (const propertyName in object) {
        if ( (!propertyPredicate || propertyPredicate(propertyName, object))) {
          if (isSubscribe) {
            changeItem(propertyName, void 0, object[propertyName], ValueChangeType.Subscribe, ValueKeyType.Property);
          } else {
            changeItem(propertyName, object[propertyName], void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
          }
        }
      }
    } else {
      if (Array.isArray(propertyNames)) {
        for (let i = 0, len = propertyNames.length; i < len; i++) {
          const propertyName = propertyNames[i];

          if (!isSubscribe) {
            changeItem(propertyName, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
          }

          if ( propertyName in object ) {
            const value = object[propertyName];

            if (typeof value !== 'undefined') {
              if (isSubscribe) {
                changeItem(propertyName, void 0, value, ValueChangeType.Subscribe, ValueKeyType.Property);
              } else {
                changeItem(propertyName, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
              }
            }
          }

          if (isSubscribe) {
            changeItem(propertyName, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.Property);
          }
        }
      } else {
        if (!isSubscribe) {
          changeItem(propertyNames, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
        }

        if ( propertyNames in object ) {
          const value = object[propertyNames];

          if (typeof value !== 'undefined') {
            if (isSubscribe) {
              changeItem(propertyNames, void 0, value, ValueChangeType.Subscribe, ValueKeyType.Property);
            } else {
              changeItem(propertyNames, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
            }
          }
        }

        if (isSubscribe) {
          changeItem(propertyNames, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.Property);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return () => {
    let _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEach(false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeMap


function subscribeMap(keys, keyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[Symbol.toStringTag] !== 'Map' && !(object instanceof Map)) {
    return null;
  }

  const {
    mapChanged
  } = object;
  let unsubscribe;
  let subscribed;

  if (mapChanged) {
    unsubscribe = checkIsFuncOrNull(mapChanged.subscribe(({
      type,
      key,
      oldValue,
      newValue
    }) => {
      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      }

      if (!keyPredicate || keyPredicate(key, object)) {
        switch (type) {
          case MapChangedType.Added:
            if (unsubscribe) {
              changeItem(key, void 0, newValue, ValueChangeType.Subscribe, ValueKeyType.MapKey);
            }

            break;

          case MapChangedType.Removed:
            changeItem(key, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
            break;

          case MapChangedType.Set:
            if (unsubscribe) {
              changeItem(key, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.MapKey);
            } else {
              changeItem(key, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
            }

            break;
        }
      }
    }, {
      propertiesPath,
      rule
    }));
  }

  const forEach = isSubscribe => {
    if (keys) {
      for (let i = 0, len = keys.length; i < len; i++) {
        const key = keys[i];

        if (!isSubscribe) {
          changeItem(key, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
        }

        if (object.has(key)) {
          if (isSubscribe) {
            changeItem(key, void 0, object.get(key), ValueChangeType.Subscribe, ValueKeyType.MapKey);
          } else {
            changeItem(key, object.get(key), void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
          }
        }

        if (isSubscribe) {
          changeItem(key, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.MapKey);
        }
      }
    } else {
      for (const entry of object) {
        if (!keyPredicate || keyPredicate(entry[0], object)) {
          if (isSubscribe) {
            changeItem(entry[0], void 0, entry[1], ValueChangeType.Subscribe, ValueKeyType.MapKey);
          } else {
            changeItem(entry[0], entry[1], void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
          }
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return () => {
    let _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEach(false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// endregion
// region RuleSubscribeObject


function createPropertyPredicate(propertyNames) {
  if (!propertyNames || !propertyNames.length) {
    return null;
  }

  if (propertyNames.length === 1) {
    const propertyName = propertyNames[0] + '';

    if (propertyName === ANY) {
      return null;
    }

    return propName => {
      // PROF: 226 - 0.5%
      return propName === propertyName;
    };
  } else {
    const propertyNamesMap = {};

    for (let i = 0, len = propertyNames.length; i < len; i++) {
      const propertyName = propertyNames[i] + '';

      if (propertyName === ANY) {
        return null;
      }

      propertyNamesMap[propertyName] = true;
    }

    return propName => {
      return !!propertyNamesMap[propName];
    };
  }
}

let SubscribeObjectType;

(function (SubscribeObjectType) {
  SubscribeObjectType[SubscribeObjectType["Property"] = 0] = "Property";
  SubscribeObjectType[SubscribeObjectType["ValueProperty"] = 1] = "ValueProperty";
})(SubscribeObjectType || (SubscribeObjectType = {}));

class RuleSubscribe extends Rule {
  constructor(description) {
    super(RuleType.Action, description);
  }

  clone() {
    const clone = super.clone();
    const {
      subscribe
    } = this;

    if (subscribe != null) {
      clone.subscribe = subscribe;
    }

    if (this.unsubscribers) {
      clone.unsubscribers = [];
    }

    if (this.unsubscribersCount) {
      clone.unsubscribersCount = [];
    }

    return clone;
  }

}
class RuleSubscribeObject extends RuleSubscribe {
  constructor(type, propertyPredicate, description, ...propertyNames) {
    super(description);

    if (propertyNames && !propertyNames.length) {
      propertyNames = null;
    }

    if (propertyPredicate) {
      if (typeof propertyPredicate !== 'function') {
        throw new Error(`propertyPredicate (${propertyPredicate}) is not a function`);
      }
    } else if (type === SubscribeObjectType.Property) {
      propertyPredicate = createPropertyPredicate(propertyNames);

      if (!propertyPredicate) {
        propertyNames = null;
      }
    }

    switch (type) {
      case SubscribeObjectType.Property:
        // @ts-ignore
        this.subscribe = subscribeObject.bind(null, propertyNames, propertyPredicate);
        break;

      case SubscribeObjectType.ValueProperty:
        this.subType = type; // @ts-ignore

        this.subscribe = subscribeObjectValue.bind(null, propertyNames);
        break;

      default:
        throw new Error(`Unknown SubscribeObjectType: ${type}`);
    }
  }

} // endregion
// region RuleSubscribeMap

function createKeyPredicate(keys) {
  if (!keys || !keys.length) {
    return null;
  }

  if (keys.length === 1) {
    const key = keys[0]; // @ts-ignore

    if (key === ANY) {
      return null;
    }

    return k => {
      return k === key;
    };
  } else {
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i]; // @ts-ignore

      if (key === ANY) {
        return null;
      }
    }

    return k => {
      return keys.indexOf(k) >= 0;
    };
  }
}

class RuleSubscribeMap extends RuleSubscribe {
  constructor(keyPredicate, description, ...keys) {
    super(description);

    if (keys && !keys.length) {
      keys = null;
    }

    if (keyPredicate) {
      if (typeof keyPredicate !== 'function') {
        throw new Error(`keyPredicate (${keyPredicate}) is not a function`);
      }
    } else {
      keyPredicate = createKeyPredicate(keys);

      if (!keyPredicate) {
        keys = null;
      }
    } // @ts-ignore


    this.subscribe = subscribeMap.bind(null, keys, keyPredicate);
  }

} // endregion
 // endregion

const RuleSubscribeObjectPropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.Property, null);
const RuleSubscribeObjectValuePropertyNames = RuleSubscribeObject.bind(null, SubscribeObjectType.ValueProperty, null);
const RuleSubscribeMapKeys = RuleSubscribeMap.bind(null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// interface ITestInterface1 {
// 	y: number
// }
//
// interface ITestInterface2 {
// 	x: ITestInterface1
// }
//
// export const test = new RuleBuilder<ITestInterface2>()
// 	.path(o => o.x)

class ConnectorState extends ObservableClass {}
new ObservableObjectBuilder(ConnectorState.prototype).writable('source');
class Connector extends ObservableClass {
  constructor(source, name) {
    super();
    this.connectorState.name = name;
    this.connectorState.source = source;
  }

}
new ObservableObjectBuilder(Connector.prototype).readable('connectorState', {
  hidden: true,

  factory() {
    return new ConnectorState();
  }

});

let _Symbol$toStringTag;
_Symbol$toStringTag = Symbol.toStringTag;
class Property extends ObservableClass {
  constructor(options, initValue) {
    super();
    this[_Symbol$toStringTag] = 'Property';
    const {
      merger,
      mergeOptions
    } = options || {};

    if (merger != null) {
      this.merger = merger;
    }

    if (mergeOptions != null) {
      this.mergeOptions = mergeOptions;
    }

    if (typeof initValue !== 'undefined') {
      this.value = initValue;
    }
  } // region set / fill / merge


  set(value, clone, options) {
    const result = this.mergeValue(void 0, value, value, clone, clone, options);

    if (!result) {
      this.value = void 0;
    }

    return result;
  }

  fill(value, preferClone, options) {
    return this.mergeValue(this.value, value, value, preferClone, preferClone, options);
  }

  merge(older, newer, preferCloneOlder, preferCloneNewer, options) {
    return this.mergeValue(this.value, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region merge helpers


  mergeValue(base, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return this._mergeValue((this.merger || ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
  }

  _mergeValue(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
    if (older instanceof Property) {
      older = older.value;
    } else {
      options = { ...options,
        selfAsValueOlder: true
      };
    }

    if (newer instanceof Property) {
      newer = newer.value;
    } else {
      if (!options) {
        options = {};
      }

      options.selfAsValueNewer = true;
    }

    return merge(base, older, newer, o => {
      this.value = o;
    }, preferCloneOlder, preferCloneNewer, { ...this.mergeOptions,
      ...options,
      selfAsValueOlder: !(older instanceof Property),
      selfAsValueNewer: !(newer instanceof Property)
    });
  } // endregion
  // region IMergeable


  _canMerge(source) {
    if (webrainOptions.equalsFunc ? source.constructor === Property && webrainOptions.equalsFunc.call(this, this.value, source.value) || webrainOptions.equalsFunc.call(this, this.value, source) : source.constructor === Property && this.value === source.value || this.value === source) {
      return null;
    }

    return true;
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer) {
    return this._mergeValue(merge, this.value, older, newer, preferCloneOlder, preferCloneNewer);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      value: serialize(this.value)
    };
  }

  deSerialize(deSerialize, serializedValue) {
    deSerialize(serializedValue.value, o => this.value = o);
  } // endregion


}
Property.uuid = '6f2c51ccd8654baa9a93226e3374ccaf';
new ObservableObjectBuilder(Property.prototype).writable('value');
registerMergeable(Property);
registerSerializable(Property);

let _Symbol$toStringTag$1, _Symbol$iterator;
_Symbol$toStringTag$1 = Symbol.toStringTag;
_Symbol$iterator = Symbol.iterator;
class ArraySet {
  constructor(array, size) {
    this[_Symbol$toStringTag$1] = 'Set';
    this._array = array || [];
    this._size = size || Object.keys(this._array).length;
  }

  add(value) {
    const {
      _array
    } = this;
    const id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

    if (typeof _array[id] !== 'undefined') {
      return this;
    }

    this._array[id] = value;
    this._size++;
    return this;
  }

  delete(value) {
    const {
      _array
    } = this;
    const id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

    if (typeof _array[id] === 'undefined') {
      return false;
    } // tslint:disable-next-line:no-array-delete


    delete _array[id];
    this._size--;
    return true;
  }

  clear() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        // tslint:disable-next-line:no-array-delete
        delete _array[id];
      }
    }

    this._size = 0;
    return this;
  }

  get size() {
    return this._size;
  }

  *[_Symbol$iterator]() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        yield _array[id];
      }
    }
  }

  *entries() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const value = _array[id];
        yield [value, value];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const value = _array[id];
        callbackfn.call(thisArg, value, value, this);
      }
    }
  }

  has(value) {
    return Object.prototype.hasOwnProperty.call(this._array, getObjectUniqueId(value));
  }

  keys() {
    return this[Symbol.iterator]();
  }

  values() {
    return this[Symbol.iterator]();
  }

  static from(arrayOrIterable) {
    return fillSet(new ArraySet(), arrayOrIterable);
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ArraySet && this._array === source._array) {
      return null;
    }

    return source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => ArraySet.from(arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      array: serialize(this._array, {
        arrayAsObject: true,
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}
ArraySet.uuid = '0e8c7f09ea9e46318af8a635c214a01c';
registerMergeable(ArraySet);
registerSerializable(ArraySet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.array, null, {
        arrayAsObject: true
      });
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});

let _Symbol$toStringTag$2, _Symbol$iterator$1;
_Symbol$toStringTag$2 = Symbol.toStringTag;
_Symbol$iterator$1 = Symbol.iterator;
class ArrayMap {
  constructor(array) {
    this[_Symbol$toStringTag$2] = 'Map';
    this._array = array || [];
  }

  set(key, value) {
    const id = getObjectUniqueId(key);
    this._array[id] = [key, value];
    return this;
  }

  clear() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        // tslint:disable-next-line:no-array-delete
        delete _array[id];
      }
    }

    return this;
  }

  delete(key) {
    const {
      _array
    } = this;
    const id = getObjectUniqueId(key);

    if (!Object.prototype.hasOwnProperty.call(_array, id)) {
      return false;
    } // tslint:disable-next-line:no-array-delete


    delete _array[id];
    return true;
  }

  get size() {
    return Object.keys(this._array).length;
  }

  [_Symbol$iterator$1]() {
    return this.entries();
  }

  *entries() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        yield _array[id];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const entry = _array[id];
        callbackfn.call(thisArg, entry[1], entry[0], this);
      }
    }
  }

  get(key) {
    const id = getObjectUniqueId(key);

    if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
      return void 0;
    }

    return this._array[id][1];
  }

  has(key) {
    const id = getObjectUniqueId(key);
    return Object.prototype.hasOwnProperty.call(this._array, id);
  }

  *keys() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const entry = _array[id];
        yield entry[0];
      }
    }
  } // tslint:disable-next-line:no-identical-functions


  *values() {
    const {
      _array
    } = this;

    for (const id in _array) {
      if (Object.prototype.hasOwnProperty.call(_array, id)) {
        const entry = _array[id];
        yield entry[1];
      }
    }
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ArrayMap && this._array === source._array) {
      return null;
    }

    return source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new ArrayMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      array: serialize(this._array, {
        arrayAsObject: true,
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}
ArrayMap.uuid = 'ef0ced8a58f74381b8503b09c0a42eed';
registerMergeable(ArrayMap);
registerSerializable(ArrayMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      // @ts-ignore
      const innerMap = yield deSerialize(serializedValue.array, null, {
        arrayAsObject: true
      });
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});

class SetChangedObject extends PropertyChangedObject {
  get setChanged() {
    let {
      _setChanged
    } = this;

    if (!_setChanged) {
      this._setChanged = _setChanged = new HasSubscribersSubject();
    }

    return _setChanged;
  }

  onSetChanged(event) {
    const {
      propertyChangedDisabled
    } = this.__meta;
    const {
      _setChanged
    } = this;

    if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
      return this;
    }

    _setChanged.emit(event);

    return this;
  }

  get _setChangedIfCanEmit() {
    const {
      propertyChangedDisabled
    } = this.__meta;
    const {
      _setChanged
    } = this;
    return !propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers ? _setChanged : null;
  }

}

let _Symbol$toStringTag$3, _Symbol$iterator$2;
_Symbol$toStringTag$3 = Symbol.toStringTag;
_Symbol$iterator$2 = Symbol.iterator;
class ObservableSet extends SetChangedObject {
  constructor(set) {
    super();
    this[_Symbol$toStringTag$3] = 'Set';
    this._set = set || new Set();
  }

  add(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.add(value);

    const size = _set.size;

    if (size > oldSize) {
      const {
        _setChangedIfCanEmit
      } = this;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: SetChangedType.Added,
          newItems: [value]
        });
      }

      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }
    }

    return this;
  }

  delete(value) {
    const {
      _set
    } = this;
    const oldSize = _set.size;

    this._set.delete(value);

    const size = _set.size;

    if (size < oldSize) {
      const {
        _setChangedIfCanEmit
      } = this;

      if (_setChangedIfCanEmit) {
        _setChangedIfCanEmit.emit({
          type: SetChangedType.Removed,
          oldItems: [value]
        });
      }

      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }

      return true;
    }

    return false;
  }

  clear() {
    const {
      size
    } = this;

    if (size === 0) {
      return;
    }

    const {
      _setChangedIfCanEmit
    } = this;

    if (_setChangedIfCanEmit) {
      const oldItems = Array.from(this);

      this._set.clear();

      _setChangedIfCanEmit.emit({
        type: SetChangedType.Removed,
        oldItems
      });
    } else {
      this._set.clear();
    }

    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    }
  } // region Unchanged Set methods


  get size() {
    return this._set.size;
  }

  [_Symbol$iterator$2]() {
    return this._set[Symbol.iterator]();
  }

  entries() {
    return this._set.entries();
  }

  forEach(callbackfn, thisArg) {
    this._set.forEach((k, v) => callbackfn.call(thisArg, k, v, this));
  }

  has(value) {
    return this._set.has(value);
  }

  keys() {
    return this._set.keys();
  }

  values() {
    return this._set.values();
  } // endregion
  // region IMergeable


  _canMerge(source) {
    const {
      _set
    } = this;

    if (_set.canMerge) {
      return _set.canMerge(source);
    }

    if (source.constructor === ObservableSet && this._set === source._set) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => fillSet(new this._set.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      set: serialize(this._set)
    };
  }

  deSerialize() {} // endregion


}
ObservableSet.uuid = '91539dfb55f44bfb9dbfbff7f6ab800d';
registerMergeable(ObservableSet);
registerSerializable(ObservableSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.set);
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});

class MapChangedObject extends PropertyChangedObject {
  get mapChanged() {
    let {
      _mapChanged
    } = this;

    if (!_mapChanged) {
      this._mapChanged = _mapChanged = new HasSubscribersSubject();
    }

    return _mapChanged;
  }

  onMapChanged(event) {
    const {
      _mapChanged
    } = this;

    if (!_mapChanged || !_mapChanged.hasSubscribers) {
      return this;
    }

    _mapChanged.emit(event);

    return this;
  }

  get _mapChangedIfCanEmit() {
    const {
      __meta
    } = this;
    const propertyChangedDisabled = __meta ? __meta.propertyChangedDisabled : null;
    const {
      _mapChanged
    } = this;
    return !propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers ? _mapChanged : null;
  }

}

let _Symbol$toStringTag$4, _Symbol$iterator$3;
_Symbol$toStringTag$4 = Symbol.toStringTag;
_Symbol$iterator$3 = Symbol.iterator;
class ObservableMap extends MapChangedObject {
  constructor(map) {
    super();
    this[_Symbol$toStringTag$4] = 'Map';
    this._map = map || new Map();
  }

  set(key, value) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    _map.set(key, value);

    const size = _map.size;

    if (size > oldSize) {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Added,
          key,
          newValue: value
        });
      }

      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }
    } else {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Set,
          key,
          oldValue,
          newValue: value
        });
      }
    }

    return this;
  }

  delete(key) {
    const {
      _map
    } = this;
    const oldSize = _map.size;

    const oldValue = _map.get(key);

    this._map.delete(key);

    const size = _map.size;

    if (size < oldSize) {
      const {
        _mapChangedIfCanEmit
      } = this;

      if (_mapChangedIfCanEmit) {
        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Removed,
          key,
          oldValue
        });
      }

      const {
        propertyChangedIfCanEmit
      } = this;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: oldSize,
          newValue: size
        });
      }

      return true;
    }

    return false;
  }

  clear() {
    const {
      size
    } = this;

    if (size === 0) {
      return;
    }

    const {
      _mapChangedIfCanEmit
    } = this;

    if (_mapChangedIfCanEmit) {
      const oldItems = Array.from(this.entries());

      this._map.clear();

      for (let i = 0, len = oldItems.length; i < len; i++) {
        const oldItem = oldItems[i];

        _mapChangedIfCanEmit.emit({
          type: MapChangedType.Removed,
          key: oldItem[0],
          oldValue: oldItem[1]
        });
      }
    } else {
      this._map.clear();
    }

    const {
      propertyChangedIfCanEmit
    } = this;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: 'size',
        oldValue: size,
        newValue: 0
      });
    }
  } // region Unchanged Map methods


  get size() {
    return this._map.size;
  }

  [_Symbol$iterator$3]() {
    return this._map[Symbol.iterator]();
  }

  get(key) {
    return this._map.get(key);
  }

  entries() {
    return this._map.entries();
  }

  forEach(callbackfn, thisArg) {
    this._map.forEach((k, v) => callbackfn.call(thisArg, k, v, this));
  }

  has(key) {
    return this._map.has(key);
  }

  keys() {
    return this._map.keys();
  }

  values() {
    return this._map.values();
  } // endregion
  // region IMergeable


  _canMerge(source) {
    const {
      _map
    } = this;

    if (_map.canMerge) {
      return _map.canMerge(source);
    }

    if (source.constructor === ObservableMap && this._map === source._map) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new this._map.constructor(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      map: serialize(this._map)
    };
  }

  deSerialize() {} // endregion


}
ObservableMap.uuid = 'e162178d51234beaab6eb96d5b8f130b';
registerMergeable(ObservableMap);
registerSerializable(ObservableMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.map);
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});

let _Symbol$toStringTag$5, _Symbol$iterator$4;
_Symbol$toStringTag$5 = Symbol.toStringTag;
_Symbol$iterator$4 = Symbol.iterator;
class ObjectMap {
  constructor(object) {
    this[_Symbol$toStringTag$5] = 'Map';
    this._object = object || {};
  }

  set(key, value) {
    this._object[key] = value;
    return this;
  }

  clear() {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        delete _object[key];
      }
    }

    return this;
  }

  delete(key) {
    const {
      _object
    } = this;

    if (!Object.prototype.hasOwnProperty.call(_object, key)) {
      return false;
    }

    delete _object[key];
    return true;
  }

  get size() {
    return Object.keys(this._object).length;
  }

  [_Symbol$iterator$4]() {
    return this.entries();
  }

  *entries() {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        yield [key, _object[key]];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _object
    } = this;

    for (const key in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, key)) {
        callbackfn.call(thisArg, _object[key], key, this);
      }
    }
  }

  get(key) {
    return this._object[key];
  }

  has(key) {
    return Object.prototype.hasOwnProperty.call(this._object, key);
  }

  keys() {
    return Object.keys(this._object)[Symbol.iterator]();
  }

  values() {
    return Object.values(this._object)[Symbol.iterator]();
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ObjectMap && this._object === source._object) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Map' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeMapWrapper(target, source, arrayOrIterable => fillMap(new ObjectMap(), arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable
  // noinspection SpellCheckingInspection


  serialize(serialize) {
    return {
      object: serialize(this._object, {
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}
ObjectMap.uuid = '62388f07b21a47788b3858f225cdbd42';
registerMergeable(ObjectMap);
registerSerializable(ObjectMap, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerMap = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});

let _Symbol$toStringTag$6, _Symbol$iterator$5;
_Symbol$toStringTag$6 = Symbol.toStringTag;
_Symbol$iterator$5 = Symbol.iterator;
class ObjectSet {
  constructor(object) {
    this[_Symbol$toStringTag$6] = 'Set';
    this._object = object || {};
  }

  add(value) {
    this._object[value] = true;
    return this;
  }

  delete(value) {
    const {
      _object
    } = this;

    if (!Object.prototype.hasOwnProperty.call(_object, value)) {
      return false;
    }

    delete _object[value];
    return true;
  }

  clear() {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        delete _object[value];
      }
    }

    return this;
  }

  get size() {
    return Object.keys(this._object).length;
  }

  [_Symbol$iterator$5]() {
    return Object.keys(this._object)[Symbol.iterator]();
  }

  *entries() {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        yield [value, value];
      }
    }
  }

  forEach(callbackfn, thisArg) {
    const {
      _object
    } = this;

    for (const value in _object) {
      if (Object.prototype.hasOwnProperty.call(_object, value)) {
        callbackfn.call(thisArg, value, value, this);
      }
    }
  }

  has(value) {
    return Object.prototype.hasOwnProperty.call(this._object, value);
  }

  keys() {
    return this[Symbol.iterator]();
  }

  values() {
    return this[Symbol.iterator]();
  }

  static from(arrayOrIterable) {
    return new ObjectSet(fillObjectKeys({}, arrayOrIterable));
  } // region IMergeable


  _canMerge(source) {
    if (source.constructor === ObjectSet && this._object === source._object) {
      return null;
    }

    return source.constructor === Object || source[Symbol.toStringTag] === 'Set' || Array.isArray(source) || isIterable(source);
  }

  _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
    return mergeMaps((target, source) => createMergeSetWrapper(target, source, arrayOrIterable => ObjectSet.from(arrayOrIterable)), merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
  } // endregion
  // region ISerializable


  serialize(serialize) {
    return {
      object: serialize(this._object, {
        objectKeepUndefined: true
      })
    };
  }

  deSerialize() {} // endregion


}
ObjectSet.uuid = '6988ebc9cd064a9b97a98415b8cf1dc4';
registerMergeable(ObjectSet);
registerSerializable(ObjectSet, {
  serializer: {
    *deSerialize(deSerialize, serializedValue, valueFactory) {
      const innerSet = yield deSerialize(serializedValue.object);
      const value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

      return value;
    }

  }
});

const lut = [];

for (let i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

// from here: https://stackoverflow.com/a/47593316/5221762
const randomWithoutSeed = Math.random.bind(Math);

function filter(obj) {
  if (typeof EventTarget !== 'undefined' && obj instanceof EventTarget) {
    return false;
  }

  return true;
}

function objectToString(object) {
  if (object == null) {
    return object + '';
  }

  const buffer = [];

  const append = (obj, tabs, parents) => {
    if (typeof obj === 'undefined') {
      buffer.push('undefined');
      return;
    }

    if (obj === null) {
      buffer.push('null');
      return;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      buffer.push(obj.toString());
      return;
    }

    if (typeof obj === 'string') {
      buffer.push('"');
      buffer.push(obj);
      buffer.push('"');
      return;
    }

    if (obj instanceof Date) {
      buffer.push('<Date> ');
      buffer.push(Number.isNaN(obj.getTime()) ? 'NaN' : obj.toISOString());
      return;
    }

    if (obj instanceof Error) {
      obj._stack = obj.stack || obj.toString();
    }

    if (obj.valueOf) {
      const value = obj.valueOf();

      if (value !== obj) {
        if (obj.constructor) {
          buffer.push('<');
          buffer.push(obj.constructor.name);
          const id = getObjectUniqueId(obj);

          if (id) {
            buffer.push('-');
            buffer.push(id.toString());
          }

          buffer.push('> ');
        }

        append(value, tabs, parents);
        return;
      }
    }

    if (typeof obj === 'object') {
      if (parents && parents.indexOf(obj) >= 0) {
        buffer.push('...');
        return;
      }

      parents = parents ? [obj, ...parents] : [obj];

      if (!filter(obj)) {
        buffer.push('<');
        buffer.push(obj.constructor.name);
        buffer.push('> {...}');
        return;
      }

      if (Array.isArray(obj)) {
        buffer.push('[');
      } else if (obj.constructor) {
        buffer.push('<');
        buffer.push(obj.constructor.name);
        const id = getObjectUniqueId(obj);

        if (id) {
          buffer.push('-');
          buffer.push(id.toString());
        }

        buffer.push('> {');
      } else {
        buffer.push('{');
      }

      const newTabs = tabs + '\t';
      let first = true; // tslint:disable-next-line:forin

      for (const key in obj) {
        if (!first) {
          buffer.push(',\r\n');
        } else {
          buffer.push('\r\n');
          first = false;
        }

        buffer.push(newTabs);
        buffer.push(key);
        buffer.push(': ');
        append(obj[key], newTabs, parents);
      }

      if (!first) {
        buffer.push(',\r\n');
        buffer.push(tabs);
      }

      if (Array.isArray(obj)) {
        buffer.push(']');
      } else {
        buffer.push('}');
      }

      if (!Array.isArray(obj) && Symbol.iterator in obj) {
        buffer.push('[');
        const index = 0;

        for (const item of obj) {
          {
            buffer.push('\r\n');
            first = false;
          }

          buffer.push(tabs);
          buffer.push(index.toString());
          buffer.push(': ');
          append(item, newTabs, parents);
        }

        buffer.push(']');
      }

      return;
    }

    buffer.push(obj.toString());
  };

  append(object, '', null);
  return buffer.join('');
}

// tslint:disable-next-line:no-var-requires

function getStackTraceCountFrames(level) {
  switch (level) {
    case LogLevel.Error:
      return 50;

    case LogLevel.Fatal:
      return 100;

    case LogLevel.UserError:
      return 10;

    case LogLevel.UserWarning:
      return 10;

    case LogLevel.Warning:
      return 5;
  }

  return 0;
}

class LogEvent {
  // region constructor
  constructor({
    level,
    messagesOrErrors,
    handlersModes,
    time,
    stack,
    additionalHashString,
    appState
  }) {
    this.level = level || LogLevel.Error;
    this.messagesOrErrors = messagesOrErrors;
    this.handlersModes = handlersModes;
    this.time = time || new Date(); // TODO - need UTC

    this.stack = stack;
    this.additionalHashString = additionalHashString;
    this.appState = appState;

    if (!this.stack) {
      const stackTraceCountFrames = getStackTraceCountFrames(this.level);

      if (stackTraceCountFrames > 0) {
        this.stack = new Error('StackTrace').stack;
      }
    }
  } // endregion
  // region calculable
  // region messages


  get messages() {
    if (this._messages == null) {
      this._messages = this.messagesOrErrors ? (Array.isArray(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).filter(o => !(o instanceof Error)).map(o => o ? typeof o === 'object' ? objectToString(o) : o.toString() : o + '') : [];
    }

    return this._messages;
  }

  get messagesString() {
    if (this._messagesString == null) {
      this._messagesString = this.messages.join('\r\n\r\n');
    }

    return this._messagesString;
  } // endregion
  // region errors


  get errors() {
    if (this._errors == null) {
      this._errors = this.messagesOrErrors ? (Array.isArray(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).filter(o => o instanceof Error) : [];
    }

    return this._errors;
  }

  get errorsString() {
    if (this._errorsString == null) {
      this._errorsString = this.errors.map(objectToString).join('\r\n\r\n');
    }

    return this._errorsString;
  } // endregion
  // region console


  get consoleLevel() {
    switch (this.level) {
      case LogLevel.None:
      case LogLevel.Trace:
      case LogLevel.Debug:
        return 'debug';

      case LogLevel.Info:
        return 'info';

      case LogLevel.UserAction:
      case LogLevel.Action:
        return 'log';

      case LogLevel.UserWarning:
      case LogLevel.UserError:
      case LogLevel.Warning:
        return 'warn';

      case LogLevel.Error:
      case LogLevel.Fatal:
      default:
        return 'error';
    }
  }

  get consoleString() {
    if (this._consoleString == null) {
      this._consoleString = `\r\n[${this.dateString}][${LogLevel[this.level]}]: ${this.bodyString}`;
    }

    return this._consoleString;
  } // endregion
  // region time


  get dateString() {
    if (this._timeString == null) {
      this._timeString = this.time.toISOString().replace('T', ' ').replace('Z', '');
    }

    return this._timeString;
  } // endregion
  // region stack


  get stackString() {
    if (this._stackString == null) {
      this._stackString = this.stack || '';
    }

    return this._stackString;
  } // endregion
  // region appInfo


  get appInfo() {
    if (this._appInfo == null) {
      const {
        appState
      } = this;
      this._appInfo = appState ? JSON.stringify(appState, null, 4) : '';
    }

    return this._appInfo;
  } // endregion
  // region md5Hash


  get md5Hash() {
    if (!this._md5Hash) {
      const buffer = [];

      if (this.additionalHashString) {
        buffer.push(this.additionalHashString);
      }

      if (this.errorsString) {
        buffer.push(this.errorsString.toString());
      }

      if (this.stack) {
        buffer.push(this.stack);
      }

      if (this.appInfo) {
        buffer.push(this.appInfo);
      } // if (!buffer.length && this.messagesString) {
      // 	buffer.push(this.messagesString)
      // }


      const hashString = buffer.join('\r\n');
      this._md5Hash = md5(hashString);
    }

    return this._md5Hash;
  } // endregion
  // region bodyString


  get bodyString() {
    if (!this._bodyString) {
      const buffer = [];

      if (this.messagesString) {
        buffer.push(this.messagesString);
      }

      if (this.errorsString) {
        buffer.push(this.errorsString);
      }

      if (this.stackString) {
        buffer.push(this.stackString);
      }

      this._bodyString = buffer.join('\r\n\r\n');
    }

    return this._bodyString;
  } // endregion
  // endregion


}

/* tslint:disable:no-var-requires */

class Logger {
  constructor() {
    this.minTimeBetweenEqualEvents = 120000;
    this._logEventsTime = {};
    this._subscribers = [];
  }

  _init({
    appName,
    appVersion,
    handlers,
    filter,
    appState
  }) {
    if (this._initialized) {
      this.error('Logger already initialized');
      return;
    }

    this._initialized = true;
    this.appName = appName;
    this.appVersion = appVersion;
    this.handlers = handlers;
    this.filter = filter;
    this.appState = appState;
    this.interceptEval();
    const logEvent = {
      level: LogLevel.Info,
      messagesOrErrors: `Start App: ${appName} v${appVersion}`,
      handlersModes: {}
    };

    if (this.handlers) {
      for (let i = 0; i < this.handlers.length; i++) {
        const handler = handlers[i];

        if (handler) {
          logEvent.handlersModes[handler.name] = ActionMode.Always;
          handler.init();
        }
      }
    }

    this.log(logEvent);
  }

  interceptEval() {
    const oldEval = globalScope.eval;
    delete globalScope.eval;

    globalScope.eval = str => {
      if (str.indexOf('async function') >= 0) {
        return oldEval.call(globalScope, str);
      }

      try {
        return oldEval.call(globalScope, str);
      } catch (ex) {
        this.error('eval error', ex, str);
        throw ex;
      }
    };
  } // endregion
  // region log interface


  debug(...messagesOrErrors) {
    this.log({
      level: LogLevel.Debug,
      messagesOrErrors
    });
  }

  info(...messagesOrErrors) {
    this.log({
      level: LogLevel.Info,
      messagesOrErrors
    });
  }

  action(...messagesOrErrors) {
    this.log({
      level: LogLevel.Action,
      messagesOrErrors
    });
  }

  warn(...messagesOrErrors) {
    this.log({
      level: LogLevel.Warning,
      messagesOrErrors
    });
  }

  error(...messagesOrErrors) {
    this.log({
      level: LogLevel.Error,
      messagesOrErrors
    });
  }

  log(logEventOrLevel, ...messagesOrErrors) {
    if (logEventOrLevel != null && typeof logEventOrLevel === 'object') {
      this._log(logEventOrLevel instanceof LogEvent ? logEventOrLevel : this.createLogEvent(logEventOrLevel));
    } else {
      this._log(this.createLogEvent({
        level: logEventOrLevel,
        messagesOrErrors
      }));
    }
  } // endregion
  // region log handlers


  createLogEvent(params) {
    params.appState = {
      appName: this.appName,
      appVersion: this.appVersion,
      ...this.appState
    };
    return new LogEvent(params);
  }

  _log(logEvent) {
    const {
      filter
    } = this;

    if (filter && !filter(logEvent)) {
      return;
    }

    const {
      _logEventsTime
    } = this;
    const time = _logEventsTime[logEvent.bodyString];

    if (time != null && time + this.minTimeBetweenEqualEvents > logEvent.time.getTime()) {
      return;
    }

    _logEventsTime[logEvent.bodyString] = logEvent.time.getTime();
    const {
      handlers
    } = this;

    for (let i = 0; i < handlers.length; i++) {
      const handler = handlers[i];

      if (handler) {
        handler.enqueueLog(logEvent);
      }
    }
  } // endregion
  // region log event


  subscribe(subscriber) {
    this._subscribers.push(subscriber);

    return () => {
      const index = this._subscribers.indexOf(subscriber);

      if (index >= 0) {
        this._subscribers.splice(index, 1);
      }
    };
  }

  async onLog(logEvent) {
    if (this._subscribers.length) {
      for (let i = 0; i < this._subscribers.length; i++) {
        await this._subscribers[i](logEvent);
      }
    }
  } // endregion


} // endregion

const consoleOrig = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
};
class WriteToConsoleHandler extends LogHandler {
  constructor(logger, allowLogLevels) {
    super({
      name: 'writeToConsole',
      logger,
      allowLogLevels
    });
  }

  init() {
    this.interceptConsole();
  }

  interceptConsole() {
    const self = this;

    const createInterceptFunc = (level, consoleFunc) => {
      return function (...args) {
        self._logger.log({
          level,
          messagesOrErrors: args,
          handlersModes: {
            writeToConsole: consoleFunc ? ActionMode.Never : ActionMode.Default
          }
        });

        if (consoleFunc) {
          consoleFunc(...args);
        }
      };
    };

    console.debug = createInterceptFunc(LogLevel.Debug, consoleOrig.debug);
    console.info = createInterceptFunc(LogLevel.Info, consoleOrig.info);
    console.log = createInterceptFunc(LogLevel.Info, consoleOrig.log);
    console.warn = createInterceptFunc(LogLevel.Warning, null);
    console.error = createInterceptFunc(LogLevel.Error, null);
  }

  handleLog(logEvents) {
    for (let i = 0, len = logEvents.length; i < len; i++) {
      const logEvent = logEvents[i]; // let messagesOrErrors = logEvent.messagesOrErrors
      // if (!Array.isArray(messagesOrErrors)) {
      // 	messagesOrErrors = [messagesOrErrors]
      // }

      switch (logEvent.level) {
        case LogLevel.None:
        case LogLevel.Trace:
        case LogLevel.Debug:
          consoleOrig.debug(logEvent.consoleString);
          break;

        case LogLevel.Info:
          consoleOrig.info(logEvent.consoleString);
          break;

        case LogLevel.UserAction:
        case LogLevel.Action:
          consoleOrig.log(logEvent.consoleString);
          break;

        case LogLevel.UserWarning:
        case LogLevel.UserError:
        case LogLevel.Warning:
          consoleOrig.warn(logEvent.consoleString);
          break;

        case LogLevel.Error:
        case LogLevel.Fatal:
        default:
          consoleOrig.error(logEvent.consoleString);
          break;
      }
    }
  }

}

class SendLogHandler extends LogHandler {
  constructor(logger, allowLogLevels, logUrl) {
    super({
      name: 'sendLog',
      logger,
      allowLogLevels,
      throttleTime: 1000
    });
    this.logUrl = logUrl;
  }

  async handleLog(logEvents) {
    const {
      logUrl
    } = this;

    if (!logUrl) {
      return;
    }

    const lastLogEvent = logEvents[logEvents.length - 1];

    const selfError = (...messagesOrErrors) => {
      this._logger.log({
        level: LogLevel.Error,
        messagesOrErrors,
        handlersModes: { ...lastLogEvent.handlersModes,
          [this.name]: ActionMode.Never
        }
      });
    };

    let errorWasWrite = false;
    let body = logEvents.reverse().map((logEvent, index) => escapeHtml(`[${logEvent.dateString}][${this._logger.appName}][${logEvent.level}][${index}]: ${logEvent.bodyString}\r\n\r\nAppInfo: ${logEvent.appInfo}`)).join('\r\n<hr>\r\n');
    body = lastLogEvent.md5Hash + '\r\n' + '\r\n' + body;
    const token = md5(lastLogEvent.md5Hash + '607bf405-a5a8-4b8c-aa61-41e8c1208dba');
    const message = {
      Token: token,
      Hash: lastLogEvent.md5Hash,
      AppName: this._logger.appName,
      AppVersion: this._logger.appVersion,
      Type: LogLevel[lastLogEvent.level],
      Time: lastLogEvent.time.toISOString(),
      MessageFull: body,
      MessageShort: removeExcessSpaces(lastLogEvent.messagesString.substring(0, 200))
    };
    let delayTime = 10000;
    const maxDelayTime = 300000;

    while (true) {
      try {
        const {
          statusCode
        } = await this.sendLog(logUrl, message, selfError);

        if (statusCode === 200) {
          return;
        }

        selfError('Send log status code == ' + statusCode);
      } catch (error) {
        if (!errorWasWrite) {
          errorWasWrite = true;
          selfError('Send log error', error);
        }
      }

      await delay(delayTime);
      delayTime = delayTime * 2;

      if (delayTime > maxDelayTime) {
        delayTime = maxDelayTime;
      }
    }
  }

}

/* tslint:disable:no-var-requires */

const needle = require('needle');

class SendLogHandlerNode extends SendLogHandler {
  sendLog(logUrl, message) {
    return new Promise((resolve, reject) => needle.post(logUrl, message, {
      json: true,
      compressed: true,
      timeout: 20000,
      headers: {
        'X-HASH': message.Hash,
        'X-TOKEN': message.Token
      }
    }, (err, response) => {
      if (err) {
        reject(err);
        return;
      }

      resolve({
        statusCode: response.statusCode
      });
    }));
  }

}

/* tslint:disable:no-var-requires */

const fs = require('fs');

const path = require('path');

function asPromise(func) {
  return new Promise((resolve, reject) => func((err, result) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(result);
  }));
}

async function autoCutLogFile(filePath, maxSize, cutToSize) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const stat = await asPromise(callback => fs.stat(filePath, callback));

  if (!stat.isFile() || stat.size < maxSize) {
    return;
  }

  const content = await asPromise(callback => fs.readFile(filePath, {
    encoding: 'utf8'
  }, callback));

  if (content.length < cutToSize) {
    return;
  }

  await asPromise(callback => fs.writeFile(filePath, content.substring(content.length - cutToSize), {
    encoding: 'utf8'
  }, callback));
}

class WriteToFileHandler extends LogHandler {
  constructor(logger, allowLogLevels, logFilePath) {
    super({
      name: 'writeToFile',
      logger,
      allowLogLevels
    });
    this.logFilePath = logFilePath;
  }

  async handleLog(logEvents) {
    const logText = logEvents.map(logEvent => `\r\n\r\n[${this._logger.appVersion}][${logEvent.dateString}][${this._logger.appName}][${LogLevel[logEvent.level]}]: ${logEvent.bodyString}`).join('');
    const {
      logFilePath
    } = this;
    const dirOutput = path.dirname(logFilePath);
    await asPromise(callback => fs.mkdir(dirOutput, {
      recursive: true
    }, callback));
    await asPromise(callback => fs.appendFile(logFilePath, logText, callback));
    await autoCutLogFile(logFilePath, 1000000, 500000);
  }

}

class LoggerNode extends Logger {
  init({
    appName,
    appVersion,
    logFilePath,
    logUrl,
    writeToConsoleLevels = LogLevel.Any,
    writeToFileLevels = LogLevel.Fatal | LogLevel.Error | LogLevel.Warning | LogLevel.UserError | LogLevel.UserWarning,
    sendLogLevels = LogLevel.Fatal | LogLevel.Error | LogLevel.Warning | LogLevel.UserError | LogLevel.UserWarning,
    emitEventLevels = LogLevel.Any,
    filter,
    appState
  }) {
    this.logUnhandledErrors();

    super._init({
      appName,
      appVersion,
      handlers: [new WriteToConsoleHandler(this, writeToConsoleLevels), new WriteToFileHandler(this, writeToFileLevels, path.resolve(logFilePath)), new SendLogHandlerNode(this, sendLogLevels, logUrl), new EmitEventHandler(this, emitEventLevels)],
      filter,
      appState
    });
  }

  logUnhandledErrors() {
    process.on('unhandledRejection', (...args) => {
      this.error('process.unhandledRejection', ...args);
    }).on('uncaughtException', (...args) => {
      this.error('process.uncaughtException', ...args);
    });
  }

}
const logger = new LoggerNode();

/* tslint:disable:no-var-requires no-duplicate-string */

const {
  protocol,
  BrowserWindow,
  remote
} = require('electron');

const path$1 = require('path');

const mime = require('mime');

const fs$1 = require('fs');

function getResourcesPath(app) {
  const resPath = app.getAppPath();

  if (resPath.endsWith('.asar')) {
    return resPath;
  }

  return path$1.resolve('.');
}
function getRootPath(app) {
  const resPath = getResourcesPath(app);
  return resPath.endsWith('.asar') ? path$1.resolve(resPath, '../../') : resPath;
}

const errorHandler = error => {
  if (error) {
    logger.error(error);
  }
};

class ServeStatic {
  constructor({
    protocol: protocolName,
    host,
    relativeRootDir
  }) {
    this.protocol = protocolName;
    this.host = host;
    this.relativeRootDir = relativeRootDir;
  }

  start(app) {
    this.rootDirs = [path$1.normalize(path$1.join(getResourcesPath(app), this.relativeRootDir)), path$1.normalize(path$1.join(process.cwd(), this.relativeRootDir))];
    protocol.registerSchemesAsPrivileged([{
      scheme: this.protocol,
      privileges: {
        standard: true,
        secure: true,
        allowServiceWorkers: true,
        // is not worked: https://github.com/electron/electron/issues/9663
        supportFetchAPI: true,
        // bypassCSP: true,
        corsEnabled: true
      }
    }]);
    app.on('ready', () => {
      this.registerAppProtocol();
    });
  }

  getFilePath(urlInfo) {
    const relativePath = urlInfo.pathname.substr(1);

    for (let i = 0, len = this.rootDirs.length; i < len; i++) {
      const dir = this.rootDirs[i];
      let filePath = path$1.join(dir, relativePath);
      filePath = path$1.normalize(filePath);

      if (!filePath.startsWith(dir)) {
        continue;
      }

      if (!fs$1.existsSync(filePath)) {
        continue;
      }

      if (fs$1.lstatSync(filePath).isFile()) {
        return filePath;
      }

      let indexFilePath = path$1.join(filePath, 'index.htm');

      if (fs$1.existsSync(indexFilePath) && fs$1.lstatSync(indexFilePath).isFile()) {
        return indexFilePath;
      }

      indexFilePath = path$1.join(filePath, 'index.html');

      if (fs$1.existsSync(indexFilePath) && fs$1.lstatSync(indexFilePath).isFile()) {
        return indexFilePath;
      }
    }

    return null;
  }

  toAppUrl(url) {
    if (!url) {
      return null;
    }

    const urlInfo = new URL(url);

    if (urlInfo.protocol !== 'https:' || urlInfo.hostname !== this.host) {
      return null;
    }

    const filePath = this.getFilePath(urlInfo);

    if (!filePath) {
      return null;
    }

    return this.protocol + '://' + urlInfo.host + urlInfo.pathname + urlInfo.search + urlInfo.hash;
  }

  tryConvertToFileUrl(url) {
    if (url) {
      const filePath = this.getFilePath(new URL(url));

      if (filePath) {
        const fileUrlInfo = new URL('file://');
        fileUrlInfo.pathname = filePath;
        return fileUrlInfo.href;
      }
    }

    return url;
  }

  registerAppProtocol() {
    // const doIntercept = () => {
    // 	const interceptHttpProtocolHandler = (request, callback) => {
    // 		try {
    // 			const appUrl = this.toAppUrl(request.url)
    // 			const appReferrer = this.toAppUrl(request.referrer)
    // 			if (appUrl || appReferrer) {
    // 				// request.url = appUrl || request.url
    // 				// request.referrer = appReferrer || request.referrer
    // 				request = {
    // 					...request,
    // 					url: appUrl || request.url,
    // 					referrer: appReferrer || request.referrer,
    // 				}
    // 				logger.debug(request)
    // 				callback(request)
    // 				return
    // 			}
    // 		} catch (error) {
    // 			logger.error('interceptHttpProtocol', error)
    // 		}
    //
    // 		protocol.uninterceptProtocol('https', err => {
    // 			if (err) {
    // 				errorHandler(err)
    // 			}
    //
    // 			doIntercept()
    // 		})
    // 	}
    //
    // 	protocol.interceptHttpProtocol('https', interceptHttpProtocolHandler, errorHandler)
    // }
    protocol.registerFileProtocol(this.protocol, (request, callback) => {
      const urlInfo = new URL(request.url);
      const filePath = this.getFilePath(urlInfo);

      if (!filePath) {
        logger.error(`File not found by URL: ${request.url}\r\nRootDirs: ${this.rootDirs.join('\r\n')}`);
        callback(null);
        return;
      }

      callback({
        path: filePath,
        headers: {
          'Content-Type': mime.getType(path$1.extname(filePath)) + '; charset=utf-8',
          'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' blob: data:" // 'unsafe-eval' - for webrain optimizations (createFunction(...))

        }
      });
    }, errorHandler);
  }

}

function serveStatic(app, protocolName, host, relativeRootDir) {
  new ServeStatic({
    protocol: protocolName,
    host,
    relativeRootDir
  }).start(app);
}

// @ts-ignore
const appState = {};

let WindowPosition;

(function (WindowPosition) {
  WindowPosition["TrayLeft"] = "trayLeft";
  WindowPosition["TrayBottomLeft"] = "trayBottomLeft";
  WindowPosition["TrayRight"] = "trayRight";
  WindowPosition["TrayBottomRight"] = "trayBottomRight";
  WindowPosition["TrayCenter"] = "trayCenter";
  WindowPosition["TrayBottomCenter"] = "trayBottomCenter";
  WindowPosition["TopLeft"] = "topLeft";
  WindowPosition["TopRight"] = "topRight";
  WindowPosition["BottomLeft"] = "bottomLeft";
  WindowPosition["BottomRight"] = "bottomRight";
  WindowPosition["TopCenter"] = "topCenter";
  WindowPosition["BottomCenter"] = "bottomCenter";
  WindowPosition["LeftCenter"] = "leftCenter";
  WindowPosition["RightCenter"] = "rightCenter";
  WindowPosition["Center"] = "center";
})(WindowPosition || (WindowPosition = {}));

const trayPositions = [WindowPosition.TrayLeft, WindowPosition.TrayBottomLeft, WindowPosition.TrayRight, WindowPosition.TrayBottomRight, WindowPosition.TrayCenter, WindowPosition.TrayBottomCenter]; // from here: https://raw.githubusercontent.com/jenslind/electron-positioner/master/index.js

class WindowPositioner {
  constructor(browserWindow) {
    this.browserWindow = browserWindow;
    this.electronScreen = electron.screen || window.screen;
  }

  _getCoords(position, trayPosition, margin) {
    const screenSize = this._getScreenSize(trayPosition);

    const windowSize = this._getWindowSize();

    if (!trayPosition) {
      trayPosition = {};
    }

    if (!margin) {
      margin = 0;
    } // Positions


    const positions = {
      [WindowPosition.TrayLeft]: {
        x: Math.floor(trayPosition.x + margin),
        y: screenSize.y + margin
      },
      [WindowPosition.TrayBottomLeft]: {
        x: Math.floor(trayPosition.x + margin),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TrayRight]: {
        x: Math.floor(trayPosition.x - (windowSize[0] + margin) + trayPosition.width),
        y: screenSize.y + margin
      },
      [WindowPosition.TrayBottomRight]: {
        x: Math.floor(trayPosition.x - (windowSize[0] + margin) + trayPosition.width),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TrayCenter]: {
        x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
        y: screenSize.y + margin
      },
      [WindowPosition.TrayBottomCenter]: {
        x: Math.floor(trayPosition.x - windowSize[0] / 2 + trayPosition.width / 2),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TopLeft]: {
        x: screenSize.x + margin,
        y: screenSize.y + margin
      },
      [WindowPosition.TopRight]: {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: screenSize.y + margin
      },
      [WindowPosition.BottomLeft]: {
        x: screenSize.x + margin,
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.BottomRight]: {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.TopCenter]: {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: screenSize.y + margin
      },
      [WindowPosition.BottomCenter]: {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: Math.floor(screenSize.height - (windowSize[1] + margin - screenSize.y))
      },
      [WindowPosition.LeftCenter]: {
        x: screenSize.x + margin,
        y: screenSize.y + Math.floor(screenSize.height / 2) - Math.floor(windowSize[1] / 2)
      },
      [WindowPosition.RightCenter]: {
        x: Math.floor(screenSize.x + (screenSize.width - (windowSize[0] + margin))),
        y: screenSize.y + Math.floor(screenSize.height / 2) - Math.floor(windowSize[1] / 2)
      },
      [WindowPosition.Center]: {
        x: Math.floor(screenSize.x + (screenSize.width / 2 - windowSize[0] / 2)),
        y: Math.floor((screenSize.height + screenSize.y) / 2 - windowSize[1] / 2)
      }
    }; // Default to right if the window is bigger than the space left.
    // Because on Windows the window might get out of bounds and dissappear.

    if (trayPositions.indexOf(position) >= 0 && positions[position].x + windowSize[0] + margin > screenSize.width + screenSize.x) {
      return {
        x: positions[WindowPosition.TopRight].x,
        y: positions[position].y
      };
    }

    return positions[position];
  }

  _getWindowSize() {
    return this.browserWindow.getSize();
  }

  _getScreenSize(trayPosition) {
    if (trayPosition) {
      return this.electronScreen.getDisplayMatching(trayPosition).workArea;
    } else {
      return this.electronScreen.getDisplayNearestPoint(this.electronScreen.getCursorScreenPoint()).workArea;
    }
  }

  move(position, trayPos, margin) {
    // Get positions coords
    const coords = this._getCoords(position, trayPos, margin); // Set the windows position


    this.browserWindow.setPosition(coords.x, coords.y);
  }

  calculate(position, trayPos, margin) {
    // Get positions coords
    const coords = this._getCoords(position, trayPos, margin);

    return {
      x: coords.x,
      y: coords.y
    };
  }

}

/* tslint:disable:no-var-requires */

const {
  Menu,
  Tray,
  nativeImage
} = require('electron');

const path$2 = require('path');

const {
  ipcMain
} = require('electron');

function showTray() {
  const iconPath = path$2.resolve(getRootPath(appState.app), process.platform === 'darwin' ? 'static/favicon-mac-white.png' : 'static/favicon.png');
  appState.tray = new Tray(iconPath);
  const menu = Menu.buildFromTemplate([{
    id: 'about',
    label: 'About',

    click(item, window, event) {
      appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }

  }, {
    id: 'signin',
    label: 'Sign In',

    click(item, window, event) {
      appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }

  }, {
    id: 'signout',
    label: 'Sign Out',

    click(item, window, event) {
      appState.win.webContents.send('tray_onclick', {
        id: item.id
      });
    }

  }, {
    type: 'separator'
  }, {
    id: 'exit',
    label: 'Exit',

    async click(item, window, event) {
      await appState.win.webContents.executeJavaScript('window.onbeforeunload = null');
      appState.app.quit();
    }

  }]);
  appState.tray.setToolTip(`${appState.appConfig.appName} v${appState.appConfig.appVersion}`);
  appState.tray.setContextMenu(menu);
  appState.tray.on('click', () => {
    appState.win.webContents.send('tray_onclick', {
      id: 'icon'
    });
  });
  ipcMain.addListener('tray_state', (event, state) => {
    if ('isLoggedIn' in state) {
      menu.getMenuItemById('signin').visible = !state.isLoggedIn;
      menu.getMenuItemById('signout').visible = !!state.isLoggedIn;
    }
  });
}

/* tslint:disable:no-var-requires */

const {
  BrowserWindow: BrowserWindow$1
} = require('electron');

async function createWindow(url) {
  // Create the browser window.
  appState.win = new BrowserWindow$1({
    width: 1200,
    height: 700,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: false,
      sandbox: true,
      preload: require.resolve('./preload')
    },
    frame: false,
    skipTaskbar: true,
    // see: https://ourcodeworld.com/articles/read/315/how-to-create-a-transparent-window-with-electron-framework
    transparent: true // backgroundColor: '#00FFFFFF',

  });
  appState.win.setSkipTaskbar(false);

  if (appState.appConfig.dev && appState.appConfig.dev.devTools && appState.appConfig.dev.devTools.openAtStart) {
    appState.win.webContents.openDevTools({
      mode: 'undocked',
      activate: true
    });
    await delay(2000);
  } // and load the index.html of the app.


  appState.win.loadURL(url);
  new WindowPositioner(appState.win).move(WindowPosition.Center);
  appState.win.webContents.on('did-finish-load', function () {
    appState.win.webContents.executeJavaScript(`console.log('Log path:\\n${escapeJs(logger.handlers.filter(o => o.logFilePath)[0].logFilePath)}\\n')`);
  });
  logger.subscribe(logEvent => {
    appState.win.webContents.executeJavaScript(`console.${logEvent.consoleLevel}('${escapeJs(logEvent.consoleString)}')`);
  });
  appState.app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (appState.win === null) {
      createWindow(url);
    } else {
      appState.win.show();
    }
  }); // region closing
  // Emitted when the window is closed.

  appState.win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    appState.win = null;
  });
  appState.app.on('before-quit', () => {
    appState.app.quitting = true;
  }); // Not worked:
  // appState.win.on('close', event => {
  // 	if (appState.app.quitting) {
  // 		appState.win = null
  // 	} else {
  // 		event.preventDefault()
  // 		appState.win.hide()
  // 	}
  // })
  // endregion

  showTray();
}

/* tslint:disable:no-var-requires */

const path$3 = require('path');

const {
  ipcMain: ipcMain$1
} = require('electron');

function init(app, appConfig, prepareStartUrl) {
  appState.app = app;
  appState.appConfig = appConfig;
  ipcMain$1.on('app-config', event => {
    event.returnValue = appState.appConfig;
  }); // app.setPath('userData', path.resolve(process.cwd(), 'tmp/electron/userData'))

  logger.init({
    appName: appState.appConfig.appName,
    appVersion: appState.appConfig.appVersion,
    logUrl: appState.appConfig.logUrl,
    appState: { ...appState.appConfig
    },
    logFilePath: path$3.resolve(appState.app.getPath('userData'), 'logs/log.txt'),
    writeToFileLevels: LogLevel.Any
  });
  logger.debug('resourcesPath = ' + getResourcesPath(appState.app));
  logger.debug('rootPath = ' + getRootPath(appState.app));
  process.chdir(getRootPath(appState.app));
  appState.app.enableSandbox();
  const url = prepareStartUrl(); // const protocolName = 'app'
  // appState.app.setAsDefaultProtocolClient(protocolName)
  // serveStatic(appState.app, protocolName, 'localhost', `dist/${appState.appConfig.type}/sapper/export`)
  // const url = protocolName + '://localhost/app/dev/gmap'

  const createWindow$1 = () => createWindow(url); // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.


  appState.app.on('ready', () => {
    createWindow$1();
  });
  appState.app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      appState.app.quit();
    }
  });
}

/* eslint-disable no-process-env */
var base = {
  appId: 'com.app-template',
  packageName: 'app-template',
  appName: 'App Template',
  appVersion: '0.0.1',
  description: 'App Template',
  // logUrl     : 'http://app-template.logger.com/log.php', // TODO
  installer: {
    electronVersion: '6.0.11',
    nodeVersion: '12.4.0'
  },
  sapper: {
    devServer: ( '').trim() === 'development'
  },
  tests: {
    intern: {}
  }
};

/* tslint:disable:no-var-requires */

var dev = {
  // base
  appId: `${base.appId}.dev`,
  packageName: `${base.packageName}-dev`,
  appName: `${base.appName} Dev`,
  appVersion: `${base.appVersion}`,
  logUrl: base.logUrl,
  installer: base.installer,
  type: 'dev',
  dev: {
    devTools: {
      openAtStart: false
    }
  },
  tests: {
    intern: {
      staticPort: 3012,
      serverPort: 3022,
      socketPort: 3032
    }
  },
  sapper: {
    buildMode: 'development',
    port: base.sapper.devServer ? 3000 : 3002,
    devServer: base.sapper.devServer
  }
};

/* tslint:disable:no-var-requires */

const {
  app
} = require('electron'); // @ts-ignore
init(app, dev, () => {
  const protocolName = 'app';
  app.setAsDefaultProtocolClient(protocolName);
  serveStatic(app, protocolName, 'localhost', `dist/${dev.type}/sapper/export`);
  return protocolName + '://localhost/app';
});
