/* tslint:disable:no-var-requires */
// @ts-ignore
import { logger } from '../../log/LoggerNode';

const {
  ipcMain
} = require('electron');

export function bindRemoteLogger(logFileNameDefault) {
  ipcMain.addListener('logger_setFileName', (event, value) => {
    const handler = logger.handlers.writeToFile;
    handler.logFileName = value ? value.replace(/[^\w.\-]+/, '_') : logFileNameDefault;
  });
  ipcMain.addListener('logger_writeToFile', (event, logEvents) => {
    const handler = logger.handlers.writeToFile;

    for (let i = 0, len = logEvents.length; i < len; i++) {
      handler.enqueueLog(logEvents[i]);
    }
  });
}