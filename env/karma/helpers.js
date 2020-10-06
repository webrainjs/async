/* eslint-disable prefer-template,no-sync,no-process-env,global-require */
// Karma configuration

const globby = require('globby')
const path = require('path')
const thisPackage = require('../../package')
const rollupPlugins  = require('../rollup/plugins.js')
const {writeTextFile, writeTextFileSync} = require('../common/helpers')

if (!process.env.APP_CONFIG) {
	console.error('Environment variable APP_CONFIG is not defined', __filename)
	throw new Error('Environment variable APP_CONFIG is not defined')
}

const paths = {
	tmp: `tmp/${process.env.APP_CONFIG}`,
}
module.exports.paths = paths

module.exports.rollup = {
	plugins: rollupPlugins,
}

module.exports.concatArrays = concatArrays
function concatArrays(...arrays) {
	const items = []
	const arraysLength = arrays.length
	for (let i = 0; i < arraysLength; i++) {
		const array = arrays[i]
		const len = array ? array.length : 0
		for (let j = 0; j < len; j++) {
			const item = array[j]
			if (items.indexOf(item) < 0) {
				items.push(item)
			}
		}
	}
	return items
}

module.exports.concatJsFiles = function concatJsFiles(outFilePath, ...globbyPatterns) {
	const dir = path.dirname(outFilePath)

	const code = globby
		.sync(globbyPatterns)
		.map(file => "import {} from '"
			+ path
				.relative(dir, file)
				.replace(/\\/g, '/')
				.replace(/'/g, "\\'")
			+ "'")
		.join('\n') + '\n'

	return writeTextFileSync(outFilePath, code)
}

module.exports.servedPattern = servedPattern
function servedPattern(file) {
	return {
		pattern : file,
		included: true,
		served  : true,
		watched : false,
	}
}

module.exports.watchPatterns = function (...globbyPatterns) {
	return globby
		.sync(globbyPatterns)
		.map(file => ({
			pattern : file,
			included: false,
			served  : false,
			watched : true,
		}))
}

module.exports.configCommon = function (config) {
	config.set({
		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: process.cwd(),

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['mocha', 'unshiftFiles'],

		unshiftFiles: [
			...[
				// Check if polyfill load first and fix Uint8Array bug
				servedPattern(writeTextFileSync(
					`${paths.tmp}/karma/polyfill-before.js`,
					"'use strict'; \n"
					+ '(function () {\n'
					// + "\tif (typeof _babelPolyfill !== 'undefined') return;\n"
					+ '\tvar log = [];\n'
					+ "\tif (typeof describe !== 'undefined') {\n"
					+ "\t\tlog.push('describe: ' + describe);\n"
					+ '\t}\n'
					+ "\tif (typeof it !== 'undefined') {\n"
					+ "\t\tlog.push('it: ' + it);\n"
					+ '\t}\n'
					+ "\tif (typeof test !== 'undefined') {\n"
					+ "\t\tlog.push('test: ' + test);\n"
					+ '\t}\n'
					+ '\tif (log.length) {\n'
					+ "\t\tthrow new Error('polyfill was not run first:\\n' + log.join('\\n'));\n"
					+ '\t}\n'
					+ "\tconsole.log('karma polyfill activating...');\n"
					+ '})();\n',
				)),
				// Load polyfill
				// servedPattern(require.resolve('../../static/libs/polyfill')),
				// servedPattern(require.resolve('@babel/polyfill/dist/polyfill')), // For IE / PhantomJS
				servedPattern(writeTextFileSync(
					`${paths.tmp}/karma/polyfill-after.js`,
					"console.log('karma polyfill activated!');",
				)),
			],
		],

		client: {
			mocha: {
				opts: path.resolve(__dirname, '../mocha.opts'),
			},
		},

		logReporter: {
			outputPath: 'reports/', // default name is current directory
			outputName: 'performance.log', // default name is logFile_month_day_year_hr:min:sec.log
		},

		plugins: [
			'karma-chrome-launcher',
			'karma-firefox-launcher',
			'karma-safari-launcher',
			'karma-safaritechpreview-launcher',
			'karma-opera-launcher',
			'karma-edge-launcher',
			// 'karma-ie-launcher',

			'karma-mocha',
			'karma-rollup-preprocessor',
			'karma-coverage',
			require('./modules/karma-express'),
			require('./modules/karma-custom-launcher'),
			require('./modules/karma-unshift-files'),

			{
				'preprocessor:writeToFile': [
					'factory',
					(factory => {
						factory.$inject = ['args', 'config', 'emitter', 'logger']
						return factory
					})((preconfig, _config, emitter, logger) => {
						const log = logger.create('preprocessor.rollup')

						return async (original, file, done) => {
							const {originalPath} = file
							const location = path.relative(_config.basePath, originalPath)

							try {
								const parsed = path.parse(originalPath)
								const fileOutput = path.join(parsed.dir, parsed.name + '.build' + parsed.ext)
								await writeTextFile(fileOutput, original)
								return done(null, original)
							} catch (error) {
								log.error('Failed to process ./%s\n\n%s\n', location, error.stack)
								return done(error, null)
							}
						}
					}),
				],
			},
		],

		// optionally, configure the reporter
		coverageReporter: {
			// Prevent to disable coverage by IntelliJ
			// see: https://github.com/karma-runner/karma-coverage/issues/183#issuecomment-167880660
			instrumenter: null,

			type: 'json',
			dir : `${paths.tmp}/coverage/karma/json`,
			// subDir: () => 'browser'
		},

		// web server port
		port: 9876,

		// enable / disable colors in the output (reporters and logs)
		colors: true,

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_DEBUG,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [
			'E2E_Chromium33',
			'E2E_Chromium39',
			'E2E_Chromium44',
			'E2E_ChromeLatest',
			'ChromeDev',
		],

		// Firefox:
		// privacy.reduceTimerPrecision

		customLaunchers: {
			E2E_Chromium33: {
				base       : 'Custom',
				parent     : 'ChromiumHeadless',
				displayName: 'Chromium 33.0.1750.170',
				flags      : [
					'--incognito',
					'--no-sandbox',
					'--disable-web-security',
					'--allow-cross-origin-auth-prompt',
					'--disable-site-isolation-trials',
				],
				DEFAULT_CMD: {
					win32: 'l:/Program Files (x86)/Chromium/33.0.1750.170/chrome.exe',
				},
				ENV_CMD: null,
			},
			E2E_Chromium39: {
				base       : 'Custom',
				parent     : 'ChromiumHeadless',
				displayName: 'Chromium 39.0.2171.99',
				flags      : [
					'--incognito',
					'--no-sandbox',
					'--disable-web-security',
					'--allow-cross-origin-auth-prompt',
					'--disable-site-isolation-trials',
				],
				DEFAULT_CMD: {
					win32: 'l:/Program Files (x86)/Chromium/39.0.2171.99/chrome.exe',
				},
				ENV_CMD: null,
			},
			E2E_Chromium44: {
				base       : 'Custom',
				parent     : 'ChromiumHeadless',
				displayName: 'Chromium 44.0.2403.119',
				flags      : [
					'--incognito',
					'--no-sandbox',
					'--disable-web-security',
					'--allow-cross-origin-auth-prompt',
					'--disable-site-isolation-trials',
				],
				DEFAULT_CMD: {
					win32: 'l:/Program Files (x86)/Chromium/44.0.2403.119/chrome.exe',
				},
				ENV_CMD: null,
			},
			E2E_ChromiumLatest: {
				base  : 'Custom',
				parent: 'ChromiumHeadless',
				flags : [
					'--incognito',
					'--no-sandbox',
					'--disable-web-security',
					'--allow-cross-origin-auth-prompt',
					'--disable-site-isolation-trials',
				],
				DEFAULT_CMD: {
					win32: 'l:/Program Files (x86)/Chromium/44.0.2403.119/chrome.exe',
				},
				ENV_CMD: null,
			},
			E2E_ChromeLatest: {
				base  : 'Custom',
				parent: 'ChromeHeadless',
				flags : [
					'--incognito',
					'--no-sandbox',
					'--disable-web-security',
					'--allow-cross-origin-auth-prompt',
					'--disable-site-isolation-trials',
				],
				DEFAULT_CMD: {
					win32: 'E:/Program Files (x86)/Google/Chrome Dev/Application/chrome.exe',
				},
				ENV_CMD: null,
			},
			ChromeDev: {
				base  : 'Custom',
				parent: 'Chrome',
				flags : [
					'--incognito',
					'--no-sandbox',
					'--disable-web-security',
					'--allow-cross-origin-auth-prompt',
					'--disable-site-isolation-trials',
				],
				DEFAULT_CMD: {
					win32: 'E:/Program Files (x86)/Google/Chrome Dev/Application/chrome.exe',
				},
				ENV_CMD: null,
			},
		},
	})
}

module.exports.configDetectBrowsers = configDetectBrowsers
function configDetectBrowsers(config) {
	config.set({
		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: concatArrays(config.frameworks, ['detectBrowsers']),

		// configuration
		detectBrowsers: {
			// use headless mode, for browsers that support it, default is false
			preferHeadless: true,

			usePhantomJS: false,

			postDetection(availableBrowsers) {
				const useBrowsers = {
					E2E_ChromeLatest  : /Chrome/,
					E2E_ChromiumLatest: /Chromium/,
				}

				return availableBrowsers
					.filter(o => !o.startsWith('IE') && !o.startsWith('PhantomJS'))
					.map(availableBrowser => {
						for (const key in useBrowsers) {
							if (availableBrowser.match(useBrowsers[key])) {
								delete useBrowsers[key]
								return key
							}
						}

						return availableBrowser
					})
			},
		},

		plugins: concatArrays(config.plugins, ['karma-detect-browsers']),
	})
}

module.exports.configBrowserStack = function (config, desktop = true, mobile = false) {
	// config: https://www.browserstack.com/list-of-browsers-and-platforms?product=automate
	// browser statistics: http://gs.statcounter.com/browser-version-market-share

	const mobileLaunchers = {
		Android4_4: {
			base      : 'BrowserStack',
			browser   : 'android',
			os        : 'android',
			device    : 'Samsung Galaxy Tab 4',
			os_version: '4.4',
			realMobile: true,
		},
		Android6: {
			base      : 'BrowserStack',
			browser   : 'android',
			os        : 'android',
			device    : 'Samsung Galaxy S7',
			os_version: '6.0',
			realMobile: true,
		},
		Android7: {
			base      : 'BrowserStack',
			browser   : 'android',
			os        : 'android',
			device    : 'Samsung Galaxy S8',
			os_version: '7.0',
			realMobile: true,
		},
		Android8: {
			base      : 'BrowserStack',
			browser   : 'android',
			os        : 'android',
			device    : 'Samsung Galaxy S9',
			os_version: '8.0',
			realMobile: true,
		},
		iOS10_3: {
			base      : 'BrowserStack',
			browser   : 'iOS',
			os        : 'iOS',
			device    : 'iPhone 7',
			os_version: '10.3',
			realMobile: true,
		},
		iOS11: {
			base      : 'BrowserStack',
			browser   : 'iOS',
			os        : 'iOS',
			device    : 'iPhone 8',
			os_version: '11.0',
			realMobile: true,
		},
		iOS12: {
			base      : 'BrowserStack',
			browser   : 'iOS',
			os        : 'iOS',
			device    : 'iPhone XS',
			os_version: '12.1',
			realMobile: true,
		},
	}

	const desktopLaunchers = {
		Chrome48: {
			base           : 'BrowserStack',
			browser        : 'Chrome',
			browser_version: '48',
			os             : 'Windows',
			os_version     : '10',
		},
		Firefox47: {
			base           : 'BrowserStack',
			browser        : 'Firefox',
			browser_version: '47',
			os             : 'Windows',
			os_version     : '10',
		},
		Safari10_1: {
			base           : 'BrowserStack',
			browser        : 'Safari',
			browser_version: '10.1',
			os             : 'OS X',
			os_version     : 'Sierra',
		},
		Opera12_15: {
			base           : 'BrowserStack',
			browser        : 'Opera',
			browser_version: '12.15',
			os             : 'OS X',
			os_version     : 'Sierra',
		},
		// IE11: {
		// 	base           : 'BrowserStack',
		// 	browser        : 'IE',
		// 	browser_version: '11',
		// 	os             : 'Windows',
		// 	os_version     : '10',
		// },
		// IE10: {
		// 	base           : 'BrowserStack',
		// 	browser        : 'IE',
		// 	browser_version: '10',
		// 	os             : 'Windows',
		// 	os_version     : '8',
		// },
		// IE9: {
		// 	base           : 'BrowserStack',
		// 	browser        : 'IE',
		// 	browser_version: '9',
		// 	os             : 'Windows',
		// 	os_version     : '7',
		// },
		Edge: {
			base           : 'BrowserStack',
			browser        : 'Edge',
			browser_version: '15',
			os             : 'Windows',
			os_version     : '10',
		},
		Yandex: {
			base           : 'BrowserStack',
			browser        : 'Yandex',
			browser_version: '14.12',
			os             : 'Windows',
			os_version     : '10',
		},
	}

	const launchers = [{}]
	if (desktop) {
		launchers.push(desktopLaunchers)
	}
	if (mobile) {
		launchers.push(mobileLaunchers)
	}

	const customLaunchers = Object.assign(...launchers)

	const id = new Date().getTime().toString(36)
	// see: https://github.com/karma-runner/karma-browserstack-launcher#global-options
	const browserStack = {
		build  	 : 'Local - ' + id,
		name   	 : 'Local',
		// localIdentifier: id,
		// tunnelIdentifier: id,
		project  : thisPackage.name,
		username : process.env.BROWSERSTACK_USERNAME.replace(/-travis$/, ''),
		accessKey: process.env.BROWSERSTACK_ACCESS_KEY,
		video    : false,
	}

	if (process.env.TRAVIS) {
		delete browserStack.build
		delete browserStack.name
	}

	config.set({
		captureTimeout: 600000,

		browserNoActivityTimeout: 600000,

		browserStack,

		customLaunchers,

		browsers: concatArrays(
			config.browsers,
			process.env.TRAVIS
				? Object.keys(customLaunchers)
				: Object.keys(customLaunchers).slice(0, 1),
		),

		plugins: concatArrays(config.plugins, ['karma-browserstack-launcher']),

		browserConsoleLogOptions: {
			level   : 'debug',
			terminal: true,
		},
	})

	// disable singleRun

	delete config.singleRun
	Object.defineProperty(config, 'singleRun', {
		value   : true,
		writable: false,
	})
}
