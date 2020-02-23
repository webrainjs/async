import { LogHandler } from './LogHandler';
export class EmitEventHandler extends LogHandler {
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