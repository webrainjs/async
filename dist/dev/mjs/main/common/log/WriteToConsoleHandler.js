import { ActionMode, LogLevel } from './contracts';
import { LogHandler } from './LogHandler';
const consoleOrig = {
  debug: console.debug.bind(console),
  info: console.info.bind(console),
  log: console.log.bind(console),
  warn: console.warn.bind(console),
  error: console.error.bind(console)
};
export class WriteToConsoleHandler extends LogHandler {
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