import { ActionMode, LogLevel } from './contracts';
import { delay } from './helpers';
export function canDoAction(actionMode, allowedLevels, level) {
  return actionMode === ActionMode.Always || actionMode !== ActionMode.Never && (allowedLevels & level) !== 0;
}
export class LogHandler {
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
export function handleLogErrorHandler(logEvents, error, logger, changeNewLogEvent) {
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