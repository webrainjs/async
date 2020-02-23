import {getObjectUniqueId} from 'webrain'

function filter(obj) {
	if (typeof EventTarget !== 'undefined' && obj instanceof EventTarget) {
		return false
	}

	return true
}

export function objectToString(object: any): string {
	if (object == null) {
		return object + ''
	}

	const buffer: string[] = []
	const append = (obj, tabs, parents) => {
		if (typeof obj === 'undefined') {
			buffer.push('undefined')
			return
		}

		if (obj === null) {
			buffer.push('null')
			return
		}

		if (typeof obj === 'number' || typeof obj === 'boolean') {
			buffer.push(obj.toString())
			return
		}

		if (typeof obj === 'string') {
			buffer.push('"')
			buffer.push(obj)
			buffer.push('"')
			return
		}

		if (obj instanceof Date) {
			buffer.push('<Date> ')
			buffer.push(Number.isNaN(obj.getTime()) ? 'NaN' : obj.toISOString())
			return
		}

		if (obj instanceof Error) {
			(obj as any)._stack = obj.stack || obj.toString()
		}

		if (obj.valueOf) {
			const value = obj.valueOf()
			if (value !== obj) {
				if (obj.constructor) {
					buffer.push('<')
					buffer.push(obj.constructor.name)
					const id = getObjectUniqueId(obj)
					if (id) {
						buffer.push('-')
						buffer.push(id.toString())
					}
					buffer.push('> ')
				}
				append(value, tabs, parents)
				return
			}
		}

		if (typeof obj === 'object') {
			if (parents && parents.indexOf(obj) >= 0) {
				buffer.push('...')
				return
			}

			parents = parents
				? [obj, ...parents]
				: [obj]

			if (!filter(obj)) {
				buffer.push('<')
				buffer.push(obj.constructor.name)
				buffer.push('> {...}')
				return
			}

			if (Array.isArray(obj)) {
				buffer.push('[')
			} else if (obj.constructor) {
				buffer.push('<')
				buffer.push(obj.constructor.name)
				const id = getObjectUniqueId(obj)
				if (id) {
					buffer.push('-')
					buffer.push(id.toString())
				}
				buffer.push('> {')
			} else {
				buffer.push('{')
			}

			const newTabs = tabs + '\t'

			let first = true
			// tslint:disable-next-line:forin
			for (const key in obj) {
				if (!first) {
					buffer.push(',\r\n')
				} else {
					buffer.push('\r\n')
					first = false
				}
				buffer.push(newTabs)
				buffer.push(key)
				buffer.push(': ')
				append(obj[key], newTabs, parents)
			}

			if (!first) {
				buffer.push(',\r\n')
				buffer.push(tabs)
			}
			if (Array.isArray(obj)) {
				buffer.push(']')
			} else {
				buffer.push('}')
			}

			if (!Array.isArray(obj) && Symbol.iterator in obj) {
				buffer.push('[')
				const index = 0
				for (const item of obj) {
					if (index > 0) {
						buffer.push(',\r\n')
					} else {
						buffer.push('\r\n')
						first = false
					}
					buffer.push(tabs)
					buffer.push(index.toString())
					buffer.push(': ')
					append(item, newTabs, parents)
				}
				if (index > 0) {
					buffer.push(',\r\n')
					buffer.push(tabs)
				}
				buffer.push(']')
			}

			return
		}

		buffer.push(obj.toString())
	}

	append(object, '', null)
	return buffer.join('')
}
