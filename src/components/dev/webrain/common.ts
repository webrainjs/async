// /* tslint:disable:no-construct use-primitive-type */
// // @ts-ignore
// import Color from 'color'
// import {
// 	CalcProperty,
// 	CalcStat,
// 	Connector,
// 	getObjectUniqueId,
// 	isIterable,
// } from 'webrain/src/main/common/index.ts'
//
// export const WebrainGraphObjectsId = '-4ff4f3a6-b8a8-4085-bd85-bb255c9f24a7'
//
// export type TObjectId = string|number
// // noinspection JSPrimitiveTypeWrapperUsage
// export const NoValue = new String('NoValue')
// export const VALUE_HISTORY_MAX_SIZE = 10
//
// export function getDisplayName(value) {
// 	if (typeof value === 'undefined') {
// 		return 'undefined'
// 	}
// 	if (value === null) {
// 		return 'null'
// 	}
// 	if (typeof value === 'string') {
// 		return `"${value}"`
// 	}
//
// 	if (value instanceof Date) {
// 		return Number.isNaN(value.getTime()) ? 'NaN' : value.toISOString().replace('T', ' ')
// 	}
//
// 	if (value instanceof CalcStat) {
// 		return value.toString()
// 	}
//
// 	if (isIterable(value)) {
// 		const iterator = value[Symbol.iterator]()
// 		const iteration = iterator.next()
//
// 		let size = value.length
// 		if (size == null) {
// 			size = value.size
// 		}
//
// 		let item
// 		if (!iteration.done) {
// 			item = iteration.value
// 			if (value[Symbol.toStringTag] === 'Map') {
// 				item = item[1]
// 			}
// 		}
//
// 		return iteration.done
// 			? `${value.constructor.name}-${getObjectUniqueId(value)}[${size || 0}]`
// 			: `${value.constructor.name}-${getObjectUniqueId(value)}<${getDisplayName(item)}>[${size}]`
// 	}
//
// 	if (typeof value === 'object') {
// 		const name = value instanceof CalcProperty && value.state.name
// 			|| value instanceof Connector && value.connectorState.name
//
// 		if (value instanceof Connector) {
// 			return 'Connector.' + (name || '')
// 		}
//
// 		return `${name || value.constructor.name}-${getObjectUniqueId(value)}`
// 	}
//
// 	if (typeof value === 'function') {
// 		return value.name
// 			? `${value.name}()-${getObjectUniqueId(value)}`
// 			: `() => {...} - ${getObjectUniqueId(value)}`
// 	}
//
// 	return value.toString()
// }
//
// const emptyObject = {}
//
// interface IDeepMergeOptions {
// 	fill: boolean,
// }
//
// export function deepMerge<TBase, TObject>(
// 	options: IDeepMergeOptions,
// 	base: TBase,
// 	...others: TObject[]
// ): TBase & TObject {
// 	for (let i = 0, len = others.length; i < len; i++) {
// 		base = _deepMerge(options, base, others[i])
// 	}
//
// 	return base as any
// }
//
// function _deepMerge(options: IDeepMergeOptions, base: any, other: any): any {
// 	if (!(other instanceof Object)) {
// 		if (options.fill && typeof other === 'undefined') {
// 			return base
// 		} else {
// 			return other
// 		}
// 	}
//
// 	if (!(base instanceof Object)) {
// 		base = {}
// 	}
//
// 	for (const key in base) {
// 		if (Object.prototype.hasOwnProperty.call(base, key)) {
// 			const v1 = base[key]
// 			const v2 = Object.prototype.hasOwnProperty.call(other, key)
// 				? other[key]
// 				: void 0
// 			base[key] = _deepMerge(options, v1, v2)
// 		}
// 	}
//
// 	for (const key in other) {
// 		if (Object.prototype.hasOwnProperty.call(other, key)) {
// 			const v1 = Object.prototype.hasOwnProperty.call(base, key)
// 				? base[key]
// 				: void 0
// 			const v2 = other[key]
// 			base[key] = _deepMerge(options, v1, v2)
// 		}
// 	}
//
// 	return base
// }
//
// export function colorOpacity(color: string, opacity: number): string {
// 	return Color(color).mix(Color('white'), 1.0 - opacity).string()
// }
//
// export const updateId = [0]
//
// export class WebrainMap<K, V> extends Map<K, V> {
//
// }
//
// export class WebrainObject {
// 	[key: number]: any
// 	[key: string]: any
// }
