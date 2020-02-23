// tslint:disable-next-line:no-var-requires
import { LogLevel } from './contracts';
import { md5 } from './helpers';
import { objectToString } from './objectToString';

function getStackTraceCountFrames(level) {
  switch (level) {
    case LogLevel.Error:
      return 50;

    case LogLevel.Fatal:
      return 100;

    case LogLevel.UserError:
      return 10;

    case LogLevel.UserWarning:
      return 10;

    case LogLevel.Warning:
      return 5;
  }

  return 0;
}

export class LogEvent {
  // region constructor
  constructor({
    level,
    messagesOrErrors,
    handlersModes,
    time,
    stack,
    additionalHashString,
    appState
  }) {
    this.level = level || LogLevel.Error;
    this.messagesOrErrors = messagesOrErrors;
    this.handlersModes = handlersModes;
    this.time = time || new Date(); // TODO - need UTC

    this.stack = stack;
    this.additionalHashString = additionalHashString;
    this.appState = appState;

    if (!this.stack) {
      const stackTraceCountFrames = getStackTraceCountFrames(this.level);

      if (stackTraceCountFrames > 0) {
        this.stack = new Error('StackTrace').stack;
      }
    }
  } // endregion
  // region calculable
  // region messages


  get messages() {
    if (this._messages == null) {
      this._messages = this.messagesOrErrors ? (Array.isArray(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).filter(o => !(o instanceof Error)).map(o => o ? typeof o === 'object' ? objectToString(o) : o.toString() : o + '') : [];
    }

    return this._messages;
  }

  get messagesString() {
    if (this._messagesString == null) {
      this._messagesString = this.messages.join('\r\n\r\n');
    }

    return this._messagesString;
  } // endregion
  // region errors


  get errors() {
    if (this._errors == null) {
      this._errors = this.messagesOrErrors ? (Array.isArray(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).filter(o => o instanceof Error) : [];
    }

    return this._errors;
  }

  get errorsString() {
    if (this._errorsString == null) {
      this._errorsString = this.errors.map(objectToString).join('\r\n\r\n');
    }

    return this._errorsString;
  } // endregion
  // region console


  get consoleLevel() {
    switch (this.level) {
      case LogLevel.None:
      case LogLevel.Trace:
      case LogLevel.Debug:
        return 'debug';

      case LogLevel.Info:
        return 'info';

      case LogLevel.UserAction:
      case LogLevel.Action:
        return 'log';

      case LogLevel.UserWarning:
      case LogLevel.UserError:
      case LogLevel.Warning:
        return 'warn';

      case LogLevel.Error:
      case LogLevel.Fatal:
      default:
        return 'error';
    }
  }

  get consoleString() {
    if (this._consoleString == null) {
      this._consoleString = `\r\n[${this.dateString}][${LogLevel[this.level]}]: ${this.bodyString}`;
    }

    return this._consoleString;
  } // endregion
  // region time


  get dateString() {
    if (this._timeString == null) {
      this._timeString = this.time.toISOString().replace('T', ' ').replace('Z', '');
    }

    return this._timeString;
  } // endregion
  // region stack


  get stackString() {
    if (this._stackString == null) {
      this._stackString = this.stack || '';
    }

    return this._stackString;
  } // endregion
  // region appInfo


  get appInfo() {
    if (this._appInfo == null) {
      const {
        appState
      } = this;
      this._appInfo = appState ? JSON.stringify(appState, null, 4) : '';
    }

    return this._appInfo;
  } // endregion
  // region md5Hash


  get md5Hash() {
    if (!this._md5Hash) {
      const buffer = [];

      if (this.additionalHashString) {
        buffer.push(this.additionalHashString);
      }

      if (this.errorsString) {
        buffer.push(this.errorsString.toString());
      }

      if (this.stack) {
        buffer.push(this.stack);
      }

      if (this.appInfo) {
        buffer.push(this.appInfo);
      } // if (!buffer.length && this.messagesString) {
      // 	buffer.push(this.messagesString)
      // }


      const hashString = buffer.join('\r\n');
      this._md5Hash = md5(hashString);
    }

    return this._md5Hash;
  } // endregion
  // region bodyString


  get bodyString() {
    if (!this._bodyString) {
      const buffer = [];

      if (this.messagesString) {
        buffer.push(this.messagesString);
      }

      if (this.errorsString) {
        buffer.push(this.errorsString);
      }

      if (this.stackString) {
        buffer.push(this.stackString);
      }

      this._bodyString = buffer.join('\r\n\r\n');
    }

    return this._bodyString;
  } // endregion
  // endregion


}