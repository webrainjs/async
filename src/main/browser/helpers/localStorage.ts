/* tslint:disable:no-empty */
import {
	DeferredCalc,
	IUnsubscribeOrVoid,
	ObjectSerializer,
	RuleBuilder,
	dependDeepSubscriber,
} from 'webrain'

declare const chrome: any

export const localStorageWrapper = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local &&
	{
		getItem: (key: string) => new Promise<string>(resolve => {
			chrome.storage.local.get([key], result => resolve(result[key]))
		}),
		setItem: (key: string, value: string) => new Promise(resolve => {
			chrome.storage.local.set({[key]: value}, resolve)
		}),
	}
	|| typeof localStorage !== 'undefined' && localStorage
	|| null

export async function storeWindowState(name: string, win: typeof window) {
	const storageKey = `window-state-${name}`
	const stateStr: string = await localStorageWrapper.getItem(storageKey)
	const state: any = stateStr && JSON.parse(stateStr)
	if (state) {
		win.resizeTo(state.width, state.height)
		win.moveTo(state.x, state.y)
	}
	const saveState = async () => {
		await localStorageWrapper.setItem(storageKey, JSON.stringify({
			x     : win.screenLeft,
			y     : win.screenTop,
			width : win.outerWidth,
			height: win.outerHeight,
		}))
	}
	win.addEventListener('resize', saveState, false)
}

export async function storeObject<TObject>(
	storageKey: string,
	object: TObject,
	ruleBuilder: (ruleBuilder: RuleBuilder<TObject>) => RuleBuilder<any>,
): Promise<IUnsubscribeOrVoid> {
	if (typeof window === 'undefined') {
		return null
	}

	const serializedStr = await localStorageWrapper.getItem(storageKey)
	if (serializedStr) {
		const serialized = JSON.parse(serializedStr)
		ObjectSerializer.default.deSerialize(serialized, {
			valueFactory: () => object,
		})
	}

	const deferredSave = new DeferredCalc({
		async calcFunc() {
			// tslint:disable-next-line:no-shadowed-variable
			const serialized = ObjectSerializer.default.serialize(object)
			await localStorageWrapper.setItem(storageKey, JSON.stringify(serialized))
			this.done()
		},
		options: {
			throttleTime: 1000,
			maxThrottleTime: 10000,
			minTimeBetweenCalc: 5000,
		},
	})

	return dependDeepSubscriber({
		build: ruleBuilder,
	})(object, () => {
		deferredSave.invalidate()
	})
}
