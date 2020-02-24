import { logger } from './main/browser/log/LoggerBrowser'; // noinspection NpmUsedModulesInstalled

import appConfig from 'APP_CONFIG_PATH';

try {
  logger.init({
    appName: appConfig.appName,
    appVersion: appConfig.appVersion,
    logUrls: appConfig.logUrls,
    logFileName: 'client.log',
    appState: { ...appConfig
    },

    filter(logEvent) {
      if (logEvent.messagesOrErrors && logEvent.messagesOrErrors.length) {
        const first = logEvent.messagesOrErrors[0];

        if (first) {
          if (first.target && typeof first.target.url === 'string' && first.target.url.indexOf('__sapper__') >= 0) {
            return false;
          }
        }
      }

      return true;
    }

  });
} catch (ex) {
  console.log(ex);
  throw ex;
}