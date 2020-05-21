import {
	webrainOptions,
} from 'webrain/src/main/common/index.ts'
// noinspection NpmUsedModulesInstalled
import appConfig from 'APP_CONFIG_PATH'

webrainOptions.callState.logCaughtErrors = !!appConfig.dev
