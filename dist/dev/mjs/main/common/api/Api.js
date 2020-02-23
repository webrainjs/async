import { Subject } from 'webrain/src/main/common/index.ts';
import { HttpDataType, NetworkErrorType } from './contracts/http';
import { prepareHttpRequest } from './helpers';
import { NetworkError } from './NetworkError';
export class Api {
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
    errorHandler,
    resultHandler
  }) {
    let response;

    try {
      request = { ...request,
        headers: {}
      };
      this.prepareRequest(request);
      response = await this.httpClient.sendRequest(request);

      if (response.statusCode !== 200) {
        throw new NetworkError({
          message: `statusCode(${response.statusCode}) !== 200`,
          request,
          response
        });
      }

      let result; // tslint:disable-next-line:no-small-switch

      switch (request.responseDataType) {
        case HttpDataType.Json:
          result = JSON.parse(response.data);
          break;
      }

      const apiResult = {
        result
      };

      if (resultHandler) {
        resultHandler(apiResult);
      }

      return apiResult;
    } catch (err) {
      if (!(err instanceof NetworkError)) {
        console.error('Api unknown error', err, request, response);
        throw err;
      }

      let data = err.response && err.response.data;

      if (typeof data === 'string') {
        try {
          data = JSON.parse(data); // tslint:disable-next-line:no-empty
        } catch {}
      }

      const apiError = {
        apiError: data,
        networkError: err
      };

      if (err.errorType === NetworkErrorType.BadConnection) {
        console.log('Api bad connection', err, request);
        return {
          error: apiError
        };
      }

      const errorHandled = errorHandler && errorHandler(apiError);

      if (errorHandled !== true) {
        console.error('Api error', err, request);

        if (errorHandled == null) {
          this._networkErrorSubject.emit(err);
        }
      }

      return {
        error: apiError
      };
    }
  }

}