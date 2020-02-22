import config from './intern'
import {configure, runTests} from '../../mocha-helpers'

configure({
	...config,
	functionalSuites: [
		'src/test/*/webdriver/**/sapper/**/*.js',
		'!*/**/{src,assets}/**'
	],
})
runTests()
