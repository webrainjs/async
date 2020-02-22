import {IObservable, ISubject, Subject} from 'webrain/src/main/common/index.ts'
import {IHttpResponse} from '../api/contracts/http'
import {IHttpClient, IHttpRequest, INetworkError} from '../api/contracts/http'
import {prepareHttpRequest} from '../api/helpers'
import {NetworkError} from '../api/NetworkError'

export interface IScraperConstructorArgs {
	urlBase?: string,
	httpClient: IHttpClient,
}

export class Scraper {
	public readonly urlBase: string
	public readonly httpClient: IHttpClient

	constructor({
		urlBase,
		httpClient,
	}: IScraperConstructorArgs) {
		this.urlBase = urlBase
		this.httpClient = httpClient
	}

	// region networkErrorObservable

	private _networkErrorSubject: ISubject<INetworkError> = new Subject()

	public get networkErrorObservable(): IObservable<INetworkError> {
		return this._networkErrorSubject
	}

	// endregion

	protected prepareRequest(request: IHttpRequest): void {
		return prepareHttpRequest(request)
	}

	public async sendRequest<TResult>({
		request,
		checkStatusCode,
	}: {
		request: IHttpRequest,
		/** @return false - return error */
		checkStatusCode?: (statusCode: number) => boolean|null,
	}): Promise<{
		response?: IHttpResponse,
		error?: NetworkError,
	}> {
		let response
		try {
			request = {
				...request,
				headers: {},
			}
			this.prepareRequest(request)

			response = await this.httpClient.sendRequest(request)

			if (checkStatusCode ? !checkStatusCode(response.statusCode) : response.statusCode !== 200) {
				throw new NetworkError({
					message: `statusCode(${response.statusCode}) !== 200`,
					request,
					response,
				})
			}

			return {
				response,
			}
		} catch (err) {
			if (!(err instanceof NetworkError)) {
				console.error('Scraper unknown error', err, request, response)
				throw err
			}

			console.error('Scraper error', err, request)
			this._networkErrorSubject.emit(err)

			return {
				error: err,
			}
		}
	}
}
