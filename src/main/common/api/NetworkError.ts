import {IHttpRequest, IHttpResponse, INetworkError, NetworkErrorType} from './contracts/http'

export class NetworkError extends Error implements INetworkError {
	public message: string
	public request: IHttpRequest
	public response: IHttpResponse
	public error: Error

	constructor(args: INetworkError) {
		super()
		Object.assign(this, args)
	}

	public get statusCode(): number {
		return this.response && this.response.statusCode
	}

	private _errorType: NetworkErrorType
	public get errorType(): NetworkErrorType {
		let {_errorType} = this
		if (typeof _errorType === 'undefined') {
			const {statusCode} = this
			if (!statusCode || statusCode === 429 || statusCode === 502 || statusCode === 504) {
				_errorType = NetworkErrorType.BadConnection
			} else if (statusCode === 307 || statusCode === 451 || statusCode === 403) {
				_errorType = NetworkErrorType.UnauthorizedOrLoggedOff
			} else if (statusCode && 500 <= statusCode && statusCode < 600) {
				_errorType = NetworkErrorType.TemporaryUnavailable
			} else {
				_errorType = null
			}
			this._errorType = _errorType
		}

		return _errorType
	}

	public toString() {
		const buffer = []
		if (this.statusCode) {
			buffer.push('StatusCode: ')
			buffer.push(this.statusCode)
		}
		if (this.message) {
			buffer.push(this.message)
		}
		if (this.error) {
			buffer.push(this.error.toString())
		}

		if (!buffer.length) {
			buffer.push('Unknown error')
		}

		return buffer.join('\r\n')
	}
}
