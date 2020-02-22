export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export enum HttpDataType {
	String = 'String',
	Json = 'Json',
	FormUrlEncoded = 'FormUrlEncoded',
	MultipartFormData = 'MultipartFormData',
}

export interface IHttpRequest {
	method: HttpMethod,
	url: string
	headers?: { [key: string]: string }
	data?: any
	dataType?: HttpDataType
	responseDataType?: HttpDataType
	timeout?: number
	cache?: boolean
}

export interface IHttpResponse {
	statusCode: number
	data: any
	originalResponse: any
}

export enum NetworkErrorType {
	UnauthorizedOrLoggedOff = 'UnauthorizedOrLoggedOff',
	TemporaryUnavailable = 'TemporaryUnavailable',
	BadConnection = 'BadConnection',
}

export interface INetworkError {
	message?: string
	request: IHttpRequest
	response?: IHttpResponse
	error?: Error
	errorType?: NetworkErrorType
	statusCode?: number
}

export interface IHttpClient {
	sendRequest(request: IHttpRequest): Promise<IHttpResponse>
}
