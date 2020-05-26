/* tslint:disable:no-construct use-primitive-type */
export function filterDefault(obj) {
	if (typeof EventTarget !== 'undefined' && obj instanceof EventTarget) {
		return false
	}

	return true
}

let nextId = 1
const objectsMap = new WeakMap()
function getObjectUniqueId(obj) {
	let id = objectsMap.get(obj)
	if (id == null) {
		id = nextId++
		objectsMap.set(obj, id)
	}
	return id
}

export function objectToString(object: any, {
	maxLevel = 15,
	maxValueSize = 5000,
	maxFuncSize = 100,
	maxProperties = 30,
	maxListSize = 10,
	maxResultSize = 50000,
	filter = filterDefault,
}: {
	maxLevel: number,
	maxValueSize: number,
	maxFuncSize: number,
	maxProperties: number,
	maxListSize: number,
	maxResultSize: number,
	filter: (object: any) => boolean,
} = {} as any): string {
	if (object == null) {
		return object + ''
	}

	const buffer: string[] = []

	let resultSize = 0
	const OVERFLOW = new String('Overflow')

	function appendBuffer(value: string, maxSize?: number) {
		let _maxSize = Math.min(value.length, maxValueSize, maxResultSize - resultSize)
		if (maxSize != null && _maxSize > maxSize) {
			_maxSize = maxSize
		}

		if (value.length > _maxSize) {
			value = value.substring(0, _maxSize) + '...'
		}
		buffer.push(value)
		resultSize += value.length

		if (resultSize >= maxResultSize) {
			buffer.push('...')
			resultSize += 3
			throw OVERFLOW
		}
	}

	const objectsSet = new Set()

	const append = (obj, tabs, level = 0) => {
		if (typeof obj === 'undefined') {
			appendBuffer('undefined')
			return
		}

		if (obj === null) {
			appendBuffer('null')
			return
		}

		if (typeof obj === 'number' || typeof obj === 'boolean') {
			appendBuffer(obj.toString())
			return
		}

		if (typeof obj === 'string') {
			appendBuffer('"')
			appendBuffer(obj)
			appendBuffer('"')
			return
		}

		if (obj instanceof Date) {
			appendBuffer('<Date> ')
			appendBuffer(Number.isNaN(obj.getTime()) ? 'NaN' : obj.toISOString())
			return
		}

		if (obj instanceof Error) {
			(obj as any)._stack = obj.stack || obj.toString()
		}

		if (typeof obj === 'object') {
			if (obj.valueOf) {
				const value = obj.valueOf()
				if (value !== obj) {
					if (obj.constructor) {
						appendBuffer('<')
						appendBuffer(obj.constructor.name)
						const id = getObjectUniqueId(obj)
						if (id) {
							appendBuffer('-')
							appendBuffer(id.toString())
						}
						appendBuffer('> ')
					}
					append(value, tabs, level)
					return
				}
			}

			if (level >= maxLevel) {
				appendBuffer('...')
				return
			}

			level++

			if (!filter(obj)) {
				appendBuffer('<')
				appendBuffer(obj.constructor.name)
				appendBuffer('> {...}')
				return
			}

			let maxCount = maxProperties
			let _maxListSize = maxListSize
			if (objectsSet.has(obj)) {
				maxCount = 0
				_maxListSize = 0
			} else {
				objectsSet.add(obj)
			}

			if (Array.isArray(obj)) {
				appendBuffer('[')
				maxCount = _maxListSize
			} else if (obj.constructor) {
				appendBuffer('<')
				appendBuffer(obj.constructor.name)
				const id = getObjectUniqueId(obj)
				if (id) {
					appendBuffer('-')
					appendBuffer(id.toString())
				}
				appendBuffer('> {')
			} else {
				appendBuffer('{')
			}

			const newTabs = tabs + '\t'

			let index = 0
			if (index >= maxCount) {
				appendBuffer('...')
			} else {
				// tslint:disable-next-line:forin
				for (const key in obj) {
					if (index === 0) {
						appendBuffer('\r\n')
					} else {
						appendBuffer(',\r\n')
					}

					appendBuffer(newTabs)
					appendBuffer(key === '' ? '""' : key)
					appendBuffer(': ')
					append(obj[key], newTabs, level)

					index++
					if (index >= maxCount) {
						appendBuffer(newTabs)
						appendBuffer('...')
						break
					}
				}
			}

			if (index > 0) {
				appendBuffer(',\r\n')
				appendBuffer(tabs)
			}
			if (Array.isArray(obj)) {
				appendBuffer(']')
			} else {
				appendBuffer('}')
			}

			if (!Array.isArray(obj) && Symbol.iterator in obj) {
				appendBuffer('[')
				index = 0
				if (index >= _maxListSize) {
					appendBuffer('...')
				} else {
					for (const item of obj) {
						if (index > 0) {
							appendBuffer(',\r\n')
						} else {
							appendBuffer('\r\n')
						}

						appendBuffer(tabs)
						appendBuffer(index.toString())
						appendBuffer(': ')
						append(item, newTabs, level)

						index++
						if (index >= _maxListSize) {
							appendBuffer(newTabs)
							appendBuffer('...')
							break
						}
					}
				}
				if (index > 0) {
					appendBuffer(',\r\n')
					appendBuffer(tabs)
				}
				appendBuffer(']')
			}

			return
		}

		if (typeof obj === 'function') {
			appendBuffer(obj.toString(), maxFuncSize)
		} else {
			appendBuffer(obj.toString())
		}
	}

	try {
		append(object, '', null)
	} catch (error) {
		if (error !== OVERFLOW) {
			throw error
		}
	}

	return buffer.join('')
}
