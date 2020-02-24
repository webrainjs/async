export let NetworkEventType;

(function (NetworkEventType) {
  NetworkEventType["Error"] = "Error";
  NetworkEventType["Success"] = "Success";
})(NetworkEventType || (NetworkEventType = {}));