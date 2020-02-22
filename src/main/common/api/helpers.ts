import {HttpDataType, IHttpRequest} from './contracts/http'

// from: https://stackoverflow.com/a/37562814/5221762
export function toFormUrlEncoded(args: object) {
	const formBody = []
	for (const key in args) {
		if (Object.prototype.hasOwnProperty.call(args, key) && args[key] != null) {
			const encodedKey = encodeURIComponent(key)
			const encodedValue = encodeURIComponent(args[key])
			formBody.push(encodedKey + '=' + encodedValue)
		}
	}
	return formBody.join('&')
}

export function toFormData(args: object) {
	const formData = new FormData()

	for (const key in args) {
		if (Object.prototype.hasOwnProperty.call(args, key) && args[key] != null) {
			formData.append(key, args[key])
		}
	}

	return formData
}

export function prepareHttpRequest(request: IHttpRequest): void {
	if (request.method !== 'GET') {
		switch (request.dataType) {
			case HttpDataType.FormUrlEncoded:
				request.data = toFormUrlEncoded(request.data)
				request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
				break
			case HttpDataType.MultipartFormData:
				request.data = toFormData(request.data)
				// request.headers['Content-Type'] = 'multipart/form-data; boundary="d0987012-5c8b-471d-b79b-81fabac23628"'
				break
			case HttpDataType.Json:
				request.data = JSON.stringify(request.data)
				request.headers['Content-Type'] = 'application/json; charset=UTF-8'
				break
			default:
				throw new Error('Unknown dataType: ' + request.dataType)
		}
	}

	switch (request.responseDataType) {
		case HttpDataType.String:
			request.headers.Accept = 'text/plain'
			break
		case HttpDataType.Json:
			request.headers.Accept = 'application/json'
			break
		default:
			throw new Error('Unknown dataType: ' + request.responseDataType)
	}

	request.url = new URL(request.url, this.urlBase).href
}
