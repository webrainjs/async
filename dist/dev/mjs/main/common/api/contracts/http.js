export let HttpDataType;

(function (HttpDataType) {
  HttpDataType["String"] = "String";
  HttpDataType["Json"] = "Json";
  HttpDataType["FormUrlEncoded"] = "FormUrlEncoded";
  HttpDataType["MultipartFormData"] = "MultipartFormData";
})(HttpDataType || (HttpDataType = {}));

export let NetworkErrorType;

(function (NetworkErrorType) {
  NetworkErrorType["UnauthorizedOrLoggedOff"] = "UnauthorizedOrLoggedOff";
  NetworkErrorType["TemporaryUnavailable"] = "TemporaryUnavailable";
  NetworkErrorType["BadConnection"] = "BadConnection";
})(NetworkErrorType || (NetworkErrorType = {}));