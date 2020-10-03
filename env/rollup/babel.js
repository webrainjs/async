const {babel} = require('@rollup/plugin-babel')
const babelConfigMinimal = require('../babel/configs/minimal')
const babelConfigWebApp = require('../babel/configs/webapp')
const babelConfigBrowserModule = require('../babel/configs/browser-module')
const babelConfigNode = require('../babel/configs/node')
const babelConfigElectron = require('../babel/configs/electron')
const babelConfigV8Trace = require('../babel/configs/v8-trace')
const {fileExtensions} = require('../common/constants')

const babelCommon = {
	babelrc     : false,
	exclude     : ['node_modules/@babel/**', 'node_modules/core-js*/**'],
	babelHelpers: 'bundled',
}

const babelRollup = {
	rollup: {
		minimal: (options = {}) => babel({
			...babelCommon,
			extensions: [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigMinimal,
			...options,
		}),
		node: (options = {}) => babel({
			...babelCommon,
			extensions: [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigNode,
			...options,
		}),
		electron: (options = {}) => babel({
			...babelCommon,
			babelHelpers: 'runtime',
			extensions  : [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigElectron,
			...options,
		}),
		webapp: (options = {}) => babel({
			...babelCommon,
			babelHelpers: 'runtime',
			extensions  : [...fileExtensions.js, ...fileExtensions.ts, ...fileExtensions.svelte],
			...babelConfigWebApp,
			...options,
		}),
		browserModule: (options = {}) => babel({
			...babelCommon,
			babelHelpers: 'runtime',
			extensions  : [...fileExtensions.js, ...fileExtensions.ts, ...fileExtensions.svelte],
			...babelConfigBrowserModule,
			...options,
		}),
		v8Trace: (options = {}) => babel({
			...babelCommon,
			babelHelpers: 'runtime',
			extensions  : [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigV8Trace,
			...options,
		}),
	},
}

module.exports = babelRollup
