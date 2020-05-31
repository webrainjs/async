import {logger} from '@flemist/web-logger'
// noinspection NpmUsedModulesInstalled
import appConfig from 'APP_CONFIG_PATH'

try {
	logger.init({
		appName    : appConfig.appName,
		appVersion : appConfig.appVersion,
		logUrls    : appConfig.logUrls,
		logFileName: 'client.log',
		appState   : {...appConfig},
		filter(logEvent) {
			if (logEvent.messagesOrErrors && logEvent.messagesOrErrors.length) {
				const first = logEvent.messagesOrErrors[0]
				if (first) {
					if (first.target
						&& typeof first.target.url === 'string'
						&& first.target.url.indexOf('__sapper__') >= 0
					) {
						return false
					}
				}
				if (typeof first === 'string') {
					if (/<\w+> received an unexpected slot ['"]?default['"]?/.test(first)) {
						return false
					}
					if (/<\w+> was created with unknown prop ['"]?segment['"]?/.test(first)) {
						return false
					}
				}
			}

			return true
		},
	})
} catch (ex) {
	console.error(ex)
	throw ex
}
