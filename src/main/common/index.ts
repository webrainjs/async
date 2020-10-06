export {ThenableSync, resolveAsync, resolveAsyncFunc, resolveAsyncAll, resolveAsyncAny} from './ThenableSync'
export {isAsync, isThenable} from './async'
export {equals, isIterator, isIterable} from './helpers'

// region Interfaces

import {
	ThenableOrIteratorOrValue as _ThenableOrIteratorOrValue,
	ThenableOrValue as _ThenableOrValue,
	ThenableIterator as _ThenableIterator,
} from './async'

export type ThenableOrIteratorOrValue<T> = _ThenableOrIteratorOrValue<T>
export type ThenableIterator<T> = _ThenableIterator<T>
export type ThenableOrValue<T> = _ThenableOrValue<T>

// endregion
