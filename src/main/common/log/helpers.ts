// @ts-ignore
import {html, SparkMD5} from './helpers-cjs'

export function md5(str: string): string {
	const spark = new SparkMD5()
	spark.append(str)
	return spark.end()
}

export function escapeJs(str: string): string {
	return str && str
		.replace(/[\\"']/g, '\\$&')
		.replace(/\u0000/g, '\\0')
		.replace(/\n/g, '\\n')
		.replace(/\r/g, '\\r')
}

export function escapeHtml(str: string): string {
	return html.escape(str)
}

export function delay(timeMilliseconds) {
	return new Promise(resolve => setTimeout(resolve, timeMilliseconds))
}

const _spacesRegex: RegExp = new RegExp('\\s+')
const _spacesWithoutNewLinesRegex: RegExp = new RegExp('[^\\S\\n]+')
const _fixNewLines: RegExp = new RegExp('([^\\S\\n]*\\n[^\\S\\n]*)')

export function removeExcessSpaces(text: string, keepLines?: number) {
	if (!text) {
		return text
	}

	if (keepLines) {
		text = text.replace(_spacesWithoutNewLinesRegex, ' ').trim()
		text = text.replace(_fixNewLines, '\\r\\n')
		text = text.replace(new RegExp('((\\r\\n){' + keepLines + '})[\\r\\n]*'), '$1')
	} else {
		text = text.replace(_spacesRegex, ' ').trim()
	}

	return text
}

export function getGlobalScope() {
	if (typeof window !== 'undefined') {
		return window
	}
	if (typeof self !== 'undefined') {
		return self
	}
	if (typeof global !== 'undefined') {
		return global
	}
	return null
}

export const globalScope: any = getGlobalScope()
