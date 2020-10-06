import {
	isAsync,
	isThenable, IThenable,
	ResolveResult,
	resolveValue,
	resolveValueFunc, stateProviderDefault,
	ThenableOrIteratorOrValue,
	ThenableOrValue,
	TOnFulfilled,
	TOnRejected,
	TReject,
	TResolve, TResolveAsyncValue,
} from './async'

export type TExecutor<TValue = any> = (
	resolve: TResolve<TValue>,
	reject: TReject,
) => void

export enum ThenableSyncStatus {
	Resolving = 'Resolving',
	Resolved = 'Resolved',
	Rejected = 'Rejected',
}

export function createResolved<TValue = any>(
	value: ThenableOrIteratorOrValue<TValue>,
	customResolveValue?: TResolveAsyncValue,
): ThenableSync<TValue> {
	const thenable = new ThenableSync<TValue>(null, customResolveValue)
	thenable.resolve(value)
	return thenable
}

export function createRejected<TValue = any>(
	error: ThenableOrIteratorOrValue<any>,
	customResolveValue?: TResolveAsyncValue,
): ThenableSync<TValue> {
	const thenable = new ThenableSync<TValue>(null, customResolveValue)
	thenable.reject(error)
	return thenable
}

export class ThenableSync<TValue = any> implements IThenable<TValue> {
	private _onfulfilled: Array<TOnFulfilled<TValue>> = null
	private _onrejected: Array<TOnRejected<TValue>> = null
	private _value: TValue = void 0
	private _error: any = null
	private _status: ThenableSyncStatus = null
	private readonly _customResolveValue: TResolveAsyncValue

	constructor(
		executor?: TExecutor<TValue>,
		customResolveValue?: TResolveAsyncValue,
	) {
		this._customResolveValue = customResolveValue

		if (executor) {
			try {
				executor(this.resolve.bind(this), this.reject.bind(this))
			} catch (err) {
				this.reject(err)
			}
		}
	}

	// region resolve

	public resolve(value?: ThenableOrIteratorOrValue<TValue>): void {
		if (this._status != null) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`)
		}

		this._resolve(value)
	}

	private _resolve(value?: ThenableOrIteratorOrValue<TValue>): void {
		const {_status} = this
		if (_status != null && _status !== ThenableSyncStatus.Resolving) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`)
		}

		const result = resolveValue(
			value,
			(o, e) => {
				if (e) {
					this._reject(o)
				} else {
					this.__resolve(o)
				}
			},
			(o, e) => {
				if (e) {
					this._reject(o)
				} else {
					this._resolve(o)
				}
			},
			this._customResolveValue,
		)

		if ((result & ResolveResult.Deferred) !== 0) {
			this._status = ThenableSyncStatus.Resolving
			return
		}

		if ((result & ResolveResult.Error) !== 0) {
			return
		}
	}

	private __resolve(value?: ThenableOrIteratorOrValue<TValue>): void {
		this._status = ThenableSyncStatus.Resolved

		this._value = value as TValue

		const {_onfulfilled} = this
		if (_onfulfilled) {
			this._onfulfilled = void 0
			this._onrejected = void 0
			for (let i = 0, len = _onfulfilled.length; i < len; i++) {
				_onfulfilled[i](value as TValue)
			}
		}
	}

	// endregion

	// region reject

	public reject(error?: ThenableOrIteratorOrValue<any>): void {
		if (this._status != null) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${this._status}`)
		}

		this._reject(error)
	}

	private _reject(error?: ThenableOrIteratorOrValue<any>): void {
		const {_status} = this
		if (_status != null && _status !== ThenableSyncStatus.Resolving) {
			throw new Error(`Multiple call resolve/reject() is forbidden; status = ${_status}`)
		}

		const result = resolveValue(
			error,
			o => {
				this.__reject(o)
			},
			o => {
				this._reject(o)
			},
			this._customResolveValue,
		)

		if ((result & ResolveResult.Deferred) !== 0) {
			this._status = ThenableSyncStatus.Resolving
			return
		}
	}

	private __reject(error?: ThenableOrIteratorOrValue<any>): void {
		this._status = ThenableSyncStatus.Rejected

		this._error = error

		const {_onrejected} = this
		if (_onrejected) {
			this._onfulfilled = void 0
			this._onrejected = void 0
			for (let i = 0, len = _onrejected.length; i < len; i++) {
				_onrejected[i](error)
			}
		}
	}

	// endregion

	// region then

	private _then<TResult1 = TValue, TResult2 = never>(
		onfulfilled: TOnFulfilled<TValue, TResult1>,
		onrejected: TOnRejected<TResult2>,
		lastExpression: boolean,
		customResolveValue: TResolveAsyncValue,
	): ThenableOrValue<TResult1> {
		const reject = error => {
			if (!onrejected) {
				if (lastExpression) {
					throw error
				}
				return createRejected(error, customResolveValue)
			}

			let isError
			try {
				error = onrejected(error)
			} catch (err) {
				isError = true
				error = err
			}

			const result = resolveAsync(error, null, null, !lastExpression, customResolveValue, isError)

			return result
		}

		switch (this._status) {
			case ThenableSyncStatus.Resolved: {
				let {_value} = this
				if (!onfulfilled) {
					return lastExpression
						? _value as any
						: this
				}

				let isError
				try {
					_value = onfulfilled(_value) as any
				} catch (err) {
					isError = true
					_value = err
				}

				if (isError) {
					const result = resolveAsync(_value as any, null, null, !lastExpression,
						customResolveValue)
					if (isThenable(result)) {
						return result.then(reject, onrejected)
					}
					return reject(result)
				}

				const result = resolveAsync(_value as any, null, onrejected, !lastExpression,
					customResolveValue)
				return lastExpression || isThenable(result)
					? result
					: createResolved(result as TResult1, customResolveValue)
			}
			case ThenableSyncStatus.Rejected:
				if (!onrejected && !lastExpression && (
					!customResolveValue || customResolveValue === this._customResolveValue
				)) {
					return this as any
				}
				return reject(this._error)
			default: {
				if (!onfulfilled && !onrejected && (
					!customResolveValue || customResolveValue === this._customResolveValue
				)) {
					return this as any
				}

				const result = new ThenableSync<TResult1>(null, customResolveValue)

				let {_onrejected} = this
				if (!_onrejected) {
					this._onrejected = _onrejected = []
				}

				const callState = stateProviderDefault.getState()

				const rejected = onrejected
					? (value): any => {
						let isError

						const prevState = stateProviderDefault.getState()
						try {
							stateProviderDefault.setState(callState)
							value = onrejected(value)
						} catch (err) {
							isError = true
							value = err
						} finally {
							stateProviderDefault.setState(prevState)
						}

						if (isError) {
							result.reject(value)
						} else {
							result.resolve(value)
						}
					}
					: (value): any => { result.reject(value) }

				_onrejected.push(rejected)

				let {_onfulfilled} = this
				if (!_onfulfilled) {
					this._onfulfilled = _onfulfilled = []
				}

				_onfulfilled.push(onfulfilled
					? (value: any): any => {
						let isError

						const prevState = stateProviderDefault.getState()
						try {
							stateProviderDefault.setState(callState)
							value = onfulfilled(value) as any
						} catch (err) {
							isError = true
							value = err
						} finally {
							stateProviderDefault.setState(prevState)
						}

						if (isError) {
							resolveValue(value, rejected, rejected, customResolveValue)
						} else {
							result.resolve(value)
						}
					}
					: (value): any => { result.resolve(value as any) })

				return result
			}
		}
	}

	public then<TResult1 = TValue, TResult2 = never>(
		onfulfilled?: TOnFulfilled<TValue, TResult1>,
		onrejected?: TOnRejected<TResult2>,
		customResolveValue?: TResolveAsyncValue | false,
	): ThenableSync<TResult1> {
		return this._then(
			onfulfilled,
			onrejected,
			false,
			customResolveValue === false ? null : (customResolveValue || this._customResolveValue),
		) as ThenableSync<TResult1>
	}

	public thenLast<TResult1 = TValue, TResult2 = never>(
		onfulfilled?: TOnFulfilled<TValue, TResult1>,
		onrejected?: TOnRejected<TResult2>,
		customResolveValue?: TResolveAsyncValue | false,
	): ThenableOrValue<TResult1> {
		return this._then(
			onfulfilled,
			onrejected,
			true,
			customResolveValue === false ? null : (customResolveValue || this._customResolveValue),
		)
	}

	// endregion

	// region static helpers

	public static createResolved = createResolved

	public static createRejected = createRejected

	public static isThenable = isThenable

	public static resolve = resolveAsync

	// endregion
}

export function resolveAsync<TValue = any, TResult1 = TValue, TResult2 = never>(
	input: ThenableOrIteratorOrValue<TValue>,
	onfulfilled?: TOnFulfilled<TValue, TResult1>,
	onrejected?: TOnRejected<TResult2>,
	dontThrowOnImmediateError?: boolean,
	customResolveValue?: TResolveAsyncValue,
	isError?: boolean,
): ThenableOrValue<TResult1> {
	// Optimization
	if (!isError && !onfulfilled && !isAsync(input)) {
		if (input != null && customResolveValue) {
			const newInput = customResolveValue(input)
			if (input === newInput) {
				return input as any
			}
			input = newInput
		} else {
			return input as any
		}
	}

	return _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue, isError)
}

function _resolveAsync<TValue = any, TResult1 = TValue, TResult2 = never>(
	input: ThenableOrIteratorOrValue<TValue>,
	onfulfilled?: TOnFulfilled<TValue, TResult1>,
	onrejected?: TOnRejected<TResult2>,
	dontThrowOnImmediateError?: boolean,
	customResolveValue?: TResolveAsyncValue,
	isError?: boolean,
): ThenableOrValue<TResult1> {
	let result: ThenableOrValue<TResult1>
	let onResult = (o: ThenableOrValue<TValue|TResult1>, e) => {
		result = o as TResult1
		isError = isError || e
	}

	let thenable
	const createThenable = () => {
		if (!thenable) {
			thenable = new ThenableSync((resolve, reject) => {
				onResult = (o, e) => {
					if (isError || e) {
						reject(o)
						return
					}

					resolve(o as TResult1)
				}
			}, customResolveValue)
		}
		return thenable
	}

	const resolveOnResult = (o, e) => {
		const handler: any = e ? onrejected : onfulfilled

		if (handler) {
			if ((resolveValueFunc<TResult1|TResult2>(
				() => handler(o),
				(o2, e2) => { onResult(o2 as TResult1, e2) },
				(o2, e2) => { onResult(o2 as TResult1, e2) },
				customResolveValue,
			) & ResolveResult.Deferred) !== 0) {
				result = createThenable()
			}
		} else {
			onResult(o, e)
		}
	}

	const res = resolveValue(
		input,
		resolveOnResult,
		resolveOnResult,
		customResolveValue,
	)

	if ((res & ResolveResult.Deferred) !== 0) {
		return createThenable()
	}

	if (isError) {
		if (dontThrowOnImmediateError) {
			return createRejected(result, customResolveValue)
		}
		throw result
	}

	return result
}

export function resolveAsyncFunc<TValue = any, TResult1 = TValue, TResult2 = never>(
	func: () => ThenableOrIteratorOrValue<TValue>,
	onfulfilled?: TOnFulfilled<TValue, TResult1>,
	onrejected?: TOnRejected<TResult2>,
	dontThrowOnImmediateReject?: boolean,
	customResolveValue?: TResolveAsyncValue,
): ThenableOrValue<TResult1> {
	try {
		return resolveAsync(func(), onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue)
	} catch (err) {
		return resolveAsync(err, onrejected as any, onrejected, dontThrowOnImmediateReject, customResolveValue, true)
	}
}

function *_resolveAsyncAll<TValue>(
	inputPrepared: Array<ThenableOrIteratorOrValue<TValue>>,
): Iterable<TValue[]> {
	const len = inputPrepared.length
	for (let i = 0; i < len; i++) {
		inputPrepared[i] = yield inputPrepared[i] as any
	}
	return inputPrepared
}

export function resolveAsyncAll<TValue = any, TResult1 = TValue, TResult2 = never>(
	input: Array<ThenableOrIteratorOrValue<TValue>>,
	onfulfilled?: TOnFulfilled<TValue[], TResult1>,
	onrejected?: TOnRejected<TResult2>,
	dontThrowOnImmediateError?: boolean,
	customResolveValue?: TResolveAsyncValue,
): ThenableOrValue<TResult1> {
	let resolved = true
	const inputPrepared = input.map(o => {
		const item = resolveAsync(o, null, null, true, customResolveValue)
		if (resolved && isThenable(item)) {
			resolved = false
		}
		return item
	})

	return resolveAsync<TValue[], TResult1, TResult2>(
		resolved
			? inputPrepared as any
			: _resolveAsyncAll(inputPrepared)[Symbol.iterator](),
		onfulfilled,
		onrejected,
		dontThrowOnImmediateError,
		customResolveValue,
	)
}

export function resolveAsyncAny<TValue = any, TResult1 = TValue, TResult2 = never>(
	input: Array<ThenableOrIteratorOrValue<TValue>>,
	onfulfilled?: TOnFulfilled<TValue, TResult1>,
	onrejected?: TOnRejected<TResult2>,
	dontThrowOnImmediateError?: boolean,
	customResolveValue?: TResolveAsyncValue,
): ThenableOrValue<TResult1> {
	const len = input.length
	const inputPrepared = new Array(len)
	for (let i = 0; i < len; i++) {
		const item = resolveAsync(input[i], null, null, true, customResolveValue)
		if (!isThenable(item)) {
			return resolveAsync<TValue, TResult1, TResult2>(
				item,
				onfulfilled,
				onrejected,
				dontThrowOnImmediateError,
				customResolveValue,
			)
		}
		inputPrepared[i] = item
	}

	return resolveAsync<TValue, TResult1, TResult2>(
		new ThenableSync((resolve, reject) => {
			inputPrepared.forEach(o => o.then(resolve, reject))
		}),
		onfulfilled,
		onrejected,
		dontThrowOnImmediateError,
		customResolveValue,
	)
}
