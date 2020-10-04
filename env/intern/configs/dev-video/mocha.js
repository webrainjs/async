import config from './intern'
import {configure, runTests} from '../../mocha-helpers'

config.environments = config.environments.map(o => ({
	...o,
	enableVNC       : true,
	enableVideo     : true,
	videoFrameRate  : 60,
	screenResolution: '500x1000x24',
}))

configure({
	...config,
	functionalSuites: [
		'src/test/*/webdriver/**/*.{js,ts}',
		'!*/**/{src,assets}/**',
	],
})
runTests()
