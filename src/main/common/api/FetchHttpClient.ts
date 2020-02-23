import {IObservable, ISubject, Subject} from 'webrain'
import {HttpDataType, IHttpClient, IHttpRequest, IHttpResponse} from './contracts/http'
import {NetworkError} from './NetworkError'

function getCachedResponse(url, body) {
	if (!body) {
		return null
	}

	return Promise.resolve({
		ok: true,
		url,
		status: 200,
		statusText: 'OK',
		json: () => Promise.resolve(JSON.parse(body)),
		text: () => Promise.resolve(body),
		// textConverted: () => Promise.resolve(body),
	})
}

export class FetchHttpClient implements IHttpClient {
	private readonly _fetch: typeof fetch
	constructor({
		fetch: _fetch = fetch,
	}: {
		fetch?: typeof fetch,
	}) {
		this._fetch = _fetch
	}

	// region events

	// region loading

	private _loadingSubject: ISubject<{ url, options }> = new Subject()

	public get loadingObservable(): IObservable<{ url, options }> {
		return this._loadingSubject
	}

	// endregion

	// region loaded

	private _loadedSubject: ISubject<{ url, options, response }> = new Subject()

	public get loadedObservable(): IObservable<{ url, options, response }> {
		return this._loadedSubject
	}

	// endregion

	// region error

	private _errorSubject: ISubject<{ url, options, error: NetworkError }> = new Subject()

	public get errorObservable(): IObservable<{ url, options, error: NetworkError }> {
		return this._errorSubject
	}

	// endregion

	// endregion

	private async fetchExt(url: string, options): Promise<any> {
		try {
			let key
			if (options.cache) {
				key = url + '\n' + JSON.stringify(options)
				const data = await options.cache.get(key, options.cache && options.cache.expiry)
				if (data) {
					return await getCachedResponse(url, data)
				}
			}

			const fetchFunc = async () => {
				this._loadingSubject.emit({url, options})

				// Abort by timeout
				const controller = new AbortController()
				const signal = controller.signal
				const timeout = options.timeout || 60000
				const timeoutId = setTimeout(() => {
					console.debug('Fetch aborted by timeout: ' + timeout)
					controller.abort()
				}, timeout)

				let res
				try {
					res = await this._fetch(url, options.fetch)
				} finally {
					clearTimeout(timeoutId)
				}

				this._loadedSubject.emit({url, options, response: res})

				return res
			}

			const response = await (options.timeLimit
				? options.timeLimit.run(fetchFunc)
				: fetchFunc())

			if (options.cache) {
				const data = await response
				// .clone()
					.text()
				options.cache.set(key, data)
				return await getCachedResponse(url, data)
			}

			return response
		} catch (error) {
			this._errorSubject.emit({ url, options, error })
			throw error
		}
	}

	public async sendRequest(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			// const headers = new Headers(request.headers)

			const response = await this.fetchExt(request.url, {
				timeout: request.timeout,
				method: request.method,
				headers: request.headers,
				cache: request.cache ? 'default' : 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				body: request.data, // body data type must match "Content-Type" header

				mode: 'cors', // no-cors, cors, *same-origin
				// credentials: 'same-origin', // include, *same-origin, omit
				redirect: 'error', // manual, *follow, error
				referrer: '', // no-referrer, *client
			})

			let data
			switch (request.responseDataType) {
				case HttpDataType.String:
				case HttpDataType.Json:
					data = await response.text()
					break
				default:
					throw new Error('Unknown dataType: ' + request.responseDataType)
			}

			return {
				statusCode: response.status,
				data,
				originalResponse: response,
			}
		} catch (err) {
			throw new NetworkError({
				message: 'Init fetch error',
				request,
				error: err,
			})
		}
	}
}
