const babel = require('rollup-plugin-babel')
const babelConfigMinimal = require('../babel/configs/minimal')
const babelConfigBrowser = require('../babel/configs/browser')
const babelConfigComponents = require('../babel/configs/components')
const babelConfigNode = require('../babel/configs/node')
const babelConfigV8Trace = require('../babel/configs/v8-trace')
const {fileExtensions} = require('../common/constants')

const babelCommon = {
	babelrc: false,
	exclude: ['node_modules/@babel/**', 'node_modules/core-js*/**'],
}

const babelRollup = {
	rollup: {
		minimal: (options = {}) => babel({
			...babelCommon,
			extensions: [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigMinimal,
			...options
		}),
		node: (options = {}) => babel({
			...babelCommon,
			extensions: [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigNode,
			...options,
		}),
		browser: (options = {}) => babel({
			...babelCommon,
			runtimeHelpers: true,
			extensions    : [...fileExtensions.js, ...fileExtensions.ts, ...fileExtensions.svelte],
			...babelConfigBrowser,
			...options
		}),
		components: (options = {}) => babel({
			...babelCommon,
			runtimeHelpers: true,
			extensions    : [...fileExtensions.js, ...fileExtensions.ts, ...fileExtensions.svelte],
			...babelConfigComponents,
			...options
		}),
		v8Trace: (options = {}) => babel({
			...babelCommon,
			runtimeHelpers: true,
			extensions    : [...fileExtensions.js, ...fileExtensions.ts],
			...babelConfigV8Trace,
			...options
		}),
	}
}

module.exports = babelRollup
