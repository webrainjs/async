import {IObservable} from 'webrain'
import {
	IHttpRequest,
	INetworkError,
} from './http'

export interface IApiError<TApiError> {
	apiError?: TApiError
	networkError: INetworkError
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

export interface IApi<TError> {
	urlBase: string
	sendRequest<TResult>(args: IApiRequestArgs<TResult, TError>): Promise<IApiResponse<TResult, TError>>
	networkErrorObservable: IObservable<INetworkError>
}
