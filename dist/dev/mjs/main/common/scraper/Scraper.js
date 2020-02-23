import { Subject } from 'webrain';
import { prepareHttpRequest } from '../api/helpers';
import { NetworkError } from '../api/NetworkError';
export class Scraper {
  constructor({
    urlBase,
    httpClient
  }) {
    this._networkErrorSubject = new Subject();
    this.urlBase = urlBase;
    this.httpClient = httpClient;
  } // region networkErrorObservable


  get networkErrorObservable() {
    return this._networkErrorSubject;
  } // endregion


  prepareRequest(request) {
    return prepareHttpRequest(request);
  }

  async sendRequest({
    request,
    checkStatusCode
  }) {
    let response;

    try {
      request = { ...request,
        headers: {}
      };
      this.prepareRequest(request);
      response = await this.httpClient.sendRequest(request);

      if (checkStatusCode ? !checkStatusCode(response.statusCode) : response.statusCode !== 200) {
        throw new NetworkError({
          message: `statusCode(${response.statusCode}) !== 200`,
          request,
          response
        });
      }

      return {
        response
      };
    } catch (err) {
      if (!(err instanceof NetworkError)) {
        console.error('Scraper unknown error', err, request, response);
        throw err;
      }

      console.error('Scraper error', err, request);

      this._networkErrorSubject.emit(err);

      return {
        error: err
      };
    }
  }

}