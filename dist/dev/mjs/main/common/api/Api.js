import { Subject } from 'webrain';
import { NetworkEventType } from './contracts/api';
import { HttpDataType, NetworkErrorType } from './contracts/http';
import { toFormData, toFormUrlEncoded } from './helpers';
import { NetworkError } from './NetworkError';
export class Api {
  constructor({
    urlBase,
    httpClient
  }) {
    this._isBadConnection = false;
    this._networkEventSubject = new Subject();
    this.urlBase = urlBase;
    this.httpClient = httpClient;
  }

  get isBadConnection() {
    return this._isBadConnection;
  }

  set isBadConnection(value) {
    if (this._isBadConnection === value) {
      return;
    }

    this._isBadConnection = value;
    console.log(value ? 'Bad Connection' : 'Connection Restored');
  } // region networkEventObservable


  get networkEventObservable() {
    return this._networkEventSubject;
  } // endregion


  prepareRequest(request) {
    if (request.method !== 'GET' && (request.data || request.dataType)) {
      switch (request.dataType) {
        case HttpDataType.FormUrlEncoded:
          request.data = toFormUrlEncoded(request.data);
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
          break;

        case HttpDataType.MultipartFormData:
          request.data = toFormData(request.data); // request.headers['Content-Type'] = 'multipart/form-data; boundary="d0987012-5c8b-471d-b79b-81fabac23628"'

          break;

        case HttpDataType.Json:
          request.data = JSON.stringify(request.data);
          request.headers['Content-Type'] = 'application/json; charset=UTF-8';
          break;

        default:
          throw new Error('Unknown dataType: ' + request.dataType);
      }
    }

    switch (request.responseDataType) {
      case HttpDataType.String:
        request.headers.Accept = 'text/plain';
        break;

      case HttpDataType.Json:
        request.headers.Accept = 'application/json';
        break;

      default:
        throw new Error('Unknown dataType: ' + request.responseDataType);
    }

    if (this.urlBase) {
      request.url = new URL(request.url, this.urlBase).href;
    }
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
      this.isBadConnection = false;

      if (response.statusCode !== 200) {
        throw new NetworkError({
          message: `statusCode(${response.statusCode}) !== 200`,
          request,
          response
        });
      }

      this._networkEventSubject.emit({
        type: NetworkEventType.Success,
        data: {
          fromBaseUrl: request.url.toLowerCase().startsWith((this.urlBase || '').toLowerCase()),
          request,
          response
        }
      });

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

      if (err.errorType === NetworkErrorType.BadConnection) {
        this.isBadConnection = true;

        this._networkEventSubject.emit({
          type: NetworkEventType.Error,
          data: err
        });

        return {
          error: {
            networkError: err
          }
        };
      }

      this.isBadConnection = false;
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
      const errorHandled = errorHandler && errorHandler(apiError);

      if (errorHandled !== true) {
        console.error('Api error', err, request);

        if (errorHandled == null) {
          this._networkEventSubject.emit({
            type: NetworkEventType.Error,
            data: err
          });
        }
      }

      return {
        error: apiError
      };
    }
  }

}