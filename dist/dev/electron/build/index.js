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

let nextObjectId = 1;
function getNextObjectId() {
  return nextObjectId++;
}
const UNIQUE_ID_PROPERTY_NAME = '458d576952bc489ab45e98ac7f296fd9';
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
    intern: {
      serverIp: '192.168.0.102'
    }
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
      serverIp: base.tests.intern.serverIp,
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
