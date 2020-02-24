import {HttpDataType, IHttpClient, IHttpRequest, IHttpResponse} from '../../common/api/contracts/http'
import {NetworkError} from '../../common/api/NetworkError'

async function fetchExt(url: string, options): Promise<any> {
	// Abort by timeout
	const controller = new AbortController()
	const signal = controller.signal
	const timeout = options.timeout || 60000
	const timeoutId = setTimeout(() => {
		console.debug('Fetch aborted by timeout: ' + timeout)
		controller.abort()
	}, timeout)

	try {
		return await fetch(url, {
			...options,
			signal,
		})
	} finally {
		clearTimeout(timeoutId)
	}
}

export class FetchHttpClient implements IHttpClient {
	public async sendRequest(request: IHttpRequest): Promise<IHttpResponse> {
		try {
			// const headers = new Headers(request.headers)

			const response = await fetchExt(request.url, {
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
