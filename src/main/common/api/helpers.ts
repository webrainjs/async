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
