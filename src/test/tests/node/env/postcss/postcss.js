/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import fs from 'fs'
const postcss = require(path.resolve('env/rollup/postcss'))
const {requireFromString} = require('require-from-memory')
const postcssJsSyntax = require('postcss-js-syntax').default

describe('node > styles > postcss', function () {
	this.timeout(120000)

	function removeSpaces(str) {
		return str.replace(/[\s;]+/gs, '')
	}

	function assertCss(actual, excepted) {
		assert.strictEqual(removeSpaces(actual), removeSpaces(excepted))
	}

	function jsToCss(content, filename) {
		return postcss.convert.jsToCss(content, filename)
	}

	function cssToJs(content, filename) {
		return postcss.convert.cssToJs(content, filename)
	}

	it('cssToJs', function () {
		const js = cssToJs('.x { color: #00f; }', 'file.css')
		assert.deepStrictEqual(js, { '.x': { color: '#00f' } })
		// console.log(js)
	})

	it('jsToCss', async function () {
		const css = await jsToCss('module.exports = { ".x": { "color": "#00f" } }', 'file.js')
		assertCss(css, '\n.x {\n\tcolor: #00f;\n}\n')
	})

	it('jsToCss es6', async function () {
		const css = await jsToCss('export default { ".x": { "color": "#00f" } }', 'file.js')
		assertCss(css, '\n.x {\n\tcolor: #00f;\n}\n')
	})

	it('jsToCss import + babel', async function () {
		const css = await jsToCss(`
			import style from '../../../style.js'
			export default { 
				'.x': { 
					content: JSON.stringify(style) 
				}
			 }
		`, path.resolve(__dirname, 'assets/x/y/z/file.js'))
		// console.log(css)
		assertCss(css, '.x{content:{"css":{"@font-face":{"color":"#f0f"}},"test1":"test1","test2":"test2"}}')
	})

	xit('calc', async function () {
		const css = await jsToCss('module.exports = { ".x": { "width": "calc(5pt / 2)" } }', 'file.js')
		assertCss(css, '\n.x {\n\twidth: 2.5pt;\n}\n')
	})
})
