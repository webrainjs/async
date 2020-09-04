import {IObservable} from 'webrain'
import {
	IHttpRequest, IHttpResponse,
	INetworkError,
} from './http'

export interface IApiError<TApiError> {
	apiError?: TApiError
	networkError?: INetworkError
}

export interface IApiRequest extends IHttpRequest {
}

export interface IApiResponse<TResult, TApiError> {
	result?: TResult
	error?: IApiError<TApiError>
}

export interface IApiRequestArgs<TResult, TError> {
	request: IApiRequest,
	resultHandler?: (result: IApiResponse<TResult, TError>) => void,
	/** @return true - don't throw and log, error is handled */
	errorHandler?: (error: IApiError<TError>) => boolean|null,
}

export enum NetworkEventType {
	Error = 'Error',
	Success = 'Success',
}

export interface INetworkEvent {
	type: NetworkEventType
	data: any
}

export interface ISuccessResponse {
	fromBaseUrl: boolean,
	request: IHttpRequest,
	response: IHttpResponse,
}

export interface IApi<TError> {
	urlBase: string
	timeout: number
	isBadConnection: boolean
	sendRequest<TResult>(args: IApiRequestArgs<TResult, TError>): Promise<IApiResponse<TResult, TError>>
	networkEventObservable: IObservable<INetworkEvent>
}
