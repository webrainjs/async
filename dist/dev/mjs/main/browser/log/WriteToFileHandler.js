/* tslint:disable:no-var-requires */
import { ActionMode } from '../../common/log/contracts';
import { LogHandler } from '../../common/log/LogHandler';
export class WriteToFileHandler extends LogHandler {
  constructor(logger, allowLogLevels, logFileName) {
    super({
      name: 'writeToFile',
      logger,
      allowLogLevels
    });
    this._logFileName = logFileName;
  }

  get logFileName() {
    return this._logFileName;
  }

  set logFileName(value) {
    this._logFileName = value;
    console.log(`logFileName = ${this._logFileName}`);

    if (typeof window !== 'undefined' && window.remoteLogger) {
      window.remoteLogger.setFileName(value);
    }
  }

  async handleLog(logEvents) {
    const remoteLogger = typeof window !== 'undefined' ? window.remoteLogger : null;

    if (!remoteLogger) {
      return;
    }

    const sendLogEvents = logEvents.map(o => {
      return {
        level: o.level,
        dateString: o.dateString,
        appInfo: o.appInfo,
        handlersModes: {
          _all: ActionMode.Never,
          writeToFile: ActionMode.Always
        },
        bodyString: o.bodyString
      };
    });
    await remoteLogger.writeToFile(...sendLogEvents);
  }

}