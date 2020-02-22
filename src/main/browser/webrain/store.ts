// @ts-ignore
import {Readable, Writable} from 'svelte/store'
import {createFunction, IPropertyChangedObject} from 'webrain/src/main/common/index.ts'

class ReadableStore<TValue>
	implements Readable<TValue>
{
	private readonly _object: IPropertyChangedObject
	private readonly _propertyName: string | number

	constructor(object: IPropertyChangedObject, propertyName: string | number) {
		this._object = object
		this._propertyName = propertyName
	}

	public subscribe(run: <T>(value: T) => void, invalidate?: <T>(value?: T) => void): () => void {
		return this._object.propertyChanged.subscribe(event => {
			if (event.name === this._propertyName) {
				run(event.newValue)
			}
		})
	}
}

class WritableStore<TValue>
	extends ReadableStore<TValue>
	implements Writable<TValue>
{
	constructor(object: IPropertyChangedObject, propertyName: string | number) {
		super(object, propertyName)
		this.set = createFunction('o', 'v', `o["${propertyName}"] = v`) as any
	}

	public set: (value: TValue) => void
}

const STORES_PROPERTY_NAME = '192e3271-3e9a-47a7-be1b-b2aaeade9304'

function getStore<
	TObject extends object,
	Name extends string | number,
	TStore
>(
	object: IPropertyChangedObject,
	propertyName: Name,
	storeFactory: (object: TObject, propertyName: Name) => TStore,
): TStore {
	let stores = object[STORES_PROPERTY_NAME]

	if (stores == null) {
		Object.defineProperty(object, STORES_PROPERTY_NAME, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: stores = {},
		})
	}

	let store = stores[propertyName]
	if (store == null) {
		stores[propertyName] = store = storeFactory(object, propertyName)
	}

	return store
}

export function asReadable<
	TObject extends IPropertyChangedObject & { readonly [prop in Name]: TValue },
	TValue,
	Name extends string | number
>(
	object: IPropertyChangedObject,
	propertyName: Name,
): Readable<TObject[Name]> {
	if (object == null) {
		return object
	}
	if (typeof object !== 'object' || !('propertyChanged' in object)) {
		return object[propertyName]
	}
	return getStore(object, propertyName, (o, p) => new ReadableStore(o, p))
}

export function asWriteable<
	TObject extends IPropertyChangedObject & { [prop in Name]: TValue },
	TValue,
	Name extends string | number
>(
	object: IPropertyChangedObject,
	propertyName: Name,
): Writable<TObject[Name]> {
	if (object == null) {
		return object
	}
	if (typeof object !== 'object' || !('propertyChanged' in object)) {
		return object[propertyName]
	}
	return getStore(object, propertyName, (o, p) => new WritableStore(o, p))
}
