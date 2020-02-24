import { LogLevel } from './contracts';
export class CombineLogHandlers {
  constructor(logger, ...logHandlers) {
    this.name = logHandlers[0].name;
    this.logHandlers = logHandlers;
    this.allowLogLevels = LogLevel.Any;
  }

  init() {
    for (let i = 0, len = this.logHandlers.length; i < len; i++) {
      this.logHandlers[i].init();
    }
  }

  enqueueLog(logEvent) {
    for (let i = 0, len = this.logHandlers.length; i < len; i++) {
      this.logHandlers[i].enqueueLog(logEvent);
    }
  }

}