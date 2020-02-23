import { LogLevel } from '../../common/log/contracts';
import { EmitEventHandler } from '../../common/log/EmitEventHandler';
import { Logger } from '../../common/log/Logger';
import { WriteToConsoleHandler } from '../../common/log/WriteToConsoleHandler';
import { SendLogHandlerNode } from './SendLogHandlerNode';
import { path, WriteToFileHandler } from './WriteToFileHandler';
export class LoggerNode extends Logger {
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
export const logger = new LoggerNode();