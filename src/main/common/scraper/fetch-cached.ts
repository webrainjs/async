/*
* Returns a fetch function wrapped with cache to be used as normal fetch
*/

// https://github.com/janneh/fetch-cached
export function fetchCached({
	fetch: _fetch,
	cache,
}: {
	fetch: typeof fetch,
	cache,
}) {
	if (!_fetch) {
		throw Error('fetch is a required option')
	}
	if (!cache) {
		throw Error('cache is a required option')
	}

	function cachedResponse(url, body) {
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
			textConverted: () => Promise.resolve(body),
		})
	}

	function cachingFetch(key, url, options) {
		return _fetch(url, options)
			.then(response => {
				response.clone().text().then(value => {
					cache.set(key, value)
				})

				return Promise.resolve(response)
			})
	}

	return function cachedFetch(url, options = {}) {
		// return plain fetch for non-GET requests
		// if (options.method && options.method !== 'GET') {
		// 	return _fetch(url, options)
		// }

		const key = url + '\n' + JSON.stringify(options)

		return cache.get(key)
			.then(data => cachedResponse(url, data))
			.then(cached => {
				// return the cached result if it exist
				if (cached) {
					return cached
				}

				// return fetch request after setting cache
				return cachingFetch(key, url, options)
			})
	}
}
