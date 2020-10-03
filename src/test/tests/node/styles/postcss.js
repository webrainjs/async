/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs'
const postcss = require(path.resolve('env/rollup/postcss'))
require('../../../../styles/index.js')
require('../../../../styles/themes.js')

describe('node > styles > postcss', function () {
	this.timeout(120000)

	const stylesDir = './src/styles/'

	function jsToCss(content, filename) {
		return postcss.convert.jsToCss(content, filename)
	}

	function cssToJs(content, filename) {
		return postcss.convert.cssToJs(content, filename)
	}

	function jsStyleToCss(filename) {
		filename = path.resolve(stylesDir, filename)
		const content = fs.readFileSync(filename, 'utf-8')
		return jsToCss(content, filename)
	}

	function styleToCss(filename) {
		return jsToCss(`
			import style from '${filename}'
			export default style
		`, path.resolve(stylesDir, '__fake__.js'))
	}

	function themeToCss(filename, componentId) {
		return jsToCss(`
			import style from '${filename}'
			export default style('${componentId}')
		`, path.resolve(stylesDir, '__fake__.js'))
	}

	xit('themes', async function () {
		const css = await themeToCss('./themes.js', '')
		assert.ok(css)
		assert.strictEqual(typeof css, 'string', css)
		// console.log(css)
	})

	it('global', async function () {
		const css = await styleToCss('./index.js')
		assert.ok(css)
		assert.strictEqual(typeof css, 'string')
		// console.log(css)
	})
})
