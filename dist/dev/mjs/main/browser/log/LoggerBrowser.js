import { LogLevel } from '../../common/log/contracts';
import { EmitEventHandler } from '../../common/log/EmitEventHandler';
import { globalScope } from '../../common/log/helpers';
import { Logger } from '../../common/log/Logger';
import { WriteToConsoleHandler } from '../../common/log/WriteToConsoleHandler';
import { SendLogHandlerBrowser } from './SendLogHandlerBrowser';
export class LoggerBrowser extends Logger {
  init({
    appName,
    appVersion,
    logUrl,
    writeToConsoleLevels = LogLevel.Any,
    sendLogLevels = LogLevel.Fatal | LogLevel.Error | LogLevel.Warning | LogLevel.UserError | LogLevel.UserWarning,
    emitEventLevels = LogLevel.Any,
    filter,
    appState
  }) {
    if (typeof window !== 'undefined') {
      // @ts-ignore
      const {
        unsubscribeUnhandledErrors
      } = window;

      if (unsubscribeUnhandledErrors) {
        // @ts-ignore
        window.unsubscribeUnhandledErrors = null;
        unsubscribeUnhandledErrors();
      }
    }

    this.logUnhandledErrors();

    super._init({
      appName,
      appVersion,
      handlers: [new WriteToConsoleHandler(this, writeToConsoleLevels), new SendLogHandlerBrowser(this, sendLogLevels, logUrl), new EmitEventHandler(this, emitEventLevels)],
      filter,
      appState
    });
  }

  logUnhandledErrors() {
    const errorHandler = (...args) => {
      this.error('unhandledrejection', ...args.map(arg => (typeof PromiseRejectionEvent !== 'undefined' ? arg instanceof PromiseRejectionEvent && arg.reason : arg.reason) || arg));
    };

    if (typeof globalScope !== 'undefined') {
      globalScope.addEventListener('unhandledrejection', errorHandler);
      globalScope.onunhandledrejection = errorHandler;

      globalScope.onerror = (...args) => {
        this.error('unhandled error', ...args);
      };
    }
  }

}
export const logger = new LoggerBrowser();