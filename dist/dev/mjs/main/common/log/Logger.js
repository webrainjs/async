/* tslint:disable:no-var-requires */
import { ActionMode, LogLevel } from './contracts';
import { globalScope } from './helpers';
import { LogEvent } from './LogEvent'; // region Logger

export class Logger {
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
    const handlersObject = {};

    for (let i = 0, len = handlers.length; i < len; i++) {
      const handler = handlers[i];

      if (handler) {
        handlersObject[handler.name] = handler;
        handler.init();
      }
    }

    this.handlers = handlersObject;
    this.filter = filter;
    this.appState = appState;
    this.interceptEval();
    const logEvent = {
      level: LogLevel.Info,
      messagesOrErrors: `Start App: ${appName} v${appVersion}`,
      handlersModes: {
        _all: ActionMode.Always
      }
    };
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

    for (const key in handlers) {
      if (Object.prototype.hasOwnProperty.call(handlers, key)) {
        const handler = handlers[key];

        if (handler) {
          handler.enqueueLog(logEvent);
        }
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