/* tslint:disable:no-var-requires */
import { LogLevel } from '../../common/log/contracts';
import { LogHandler } from '../../common/log/LogHandler';

const fs = require('fs');

export const path = require('path');

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

export class WriteToFileHandler extends LogHandler {
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