import { a9 as _filterInstanceProperty, a6 as _sortInstanceProperty, aa as _mapInstanceProperty, ad as _Promise, ae as _asyncToGenerator, af as _regeneratorRuntime, a4 as _Array$isArray, a5 as _getIterator, ag as _concatInstanceProperty, ah as _URL } from './client.d5c92d1b.js';

/* eslint-disable no-extra-parens,prefer-destructuring */
function getDebugInfo() {
  var _context;

  if (typeof window === 'undefined') {
    return null;
  }

  var result = {
    userAgent: navigator.userAgent
  }; // performance.timing (deprecated)
  // https://www.w3.org/TR/navigation-timing/
  // Performance.timeOrigin (new)
  // https://w3c.github.io/navigation-timing/

  var timing = performance.getEntriesByType && performance.getEntriesByType('navigation')[0] || performance.getEntries && _filterInstanceProperty(_context = performance.getEntries()).call(_context, function (o) {
    return o.entryType === 'navigation';
  })[0];

  if (timing) {
    result.timing = {
      loadHtml: timing.domInteractive,
      loadDom: timing.loadEventEnd - timing.domInteractive,
      loadTotal: timing.loadEventEnd
    };
  } else if (timing = performance.timing) {
    result.timing = {
      loadHtml: timing.domInteractive - timing.navigationStart,
      loadDom: timing.loadEventEnd - timing.domInteractive,
      loadTotal: timing.loadEventEnd - timing.navigationStart
    };
  } // Only for Chrome
  // https://webplatform.github.io/docs/apis/timing/properties/memory/


  if (performance.memory && performance.memory.usedJSHeapSize) {
    result.memory = {
      used: performance.memory.usedJSHeapSize
    };
  } // var resources = performance.getEntriesByType && performance.getEntriesByType('resource') ||
  // 	performance.getEntries && performance.getEntries().filter(o => o.entryType === 'resource')


  var resources = performance.getEntries && performance.getEntries();

  if (resources) {
    var _context2;

    result.resources = _sortInstanceProperty(_context2 = _mapInstanceProperty(resources).call(resources, function (o) {
      var resource = {
        url: o.name
      };
      var time = o.responseEnd && (o.domainLookupStart || o.startTime || o.fetchStart) ? o.responseEnd - (o.domainLookupStart || o.startTime || o.fetchStart) : o.duration;

      if (time != null) {
        resource.time = time;
      }

      if (o.initiatorType) {
        resource.initiator = o.initiatorType;
      }

      var size = o.transferSize || o.encodedBodySize;

      if (size) {
        resource.size = size;
      }

      return resource;
    })).call(_context2, function (o1, o2) {
      var i;

      if ((i = (o2.size || 0) - (o1.size || 0)) !== 0) {
        return i;
      }

      return (o2.time || 0) - (o1.time || 0);
    });
  }

  return result;
}

function load(method, url, data) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open(method, url, true);
  return new _Promise(function (resolve, reject) {
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4) {
        if (xmlhttp.status < 400) {
          resolve(xmlhttp);
          return;
        }

        reject(xmlhttp);
        return;
      }
    };

    xmlhttp.send(data);
  });
}
function getHtml(win) {
  return new XMLSerializer().serializeToString((win || window).document);
}

var w3cValidateHtmlUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=html';
var w3cValidateCssUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=css';
var w3cValidateSvgUrl = 'https://validator.w3.org/nu/?out=json&group=1&parser=svg';
function validateW3C(_x) {
  return _validateW3C.apply(this, arguments);
}

function _validateW3C() {
  _validateW3C = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(options) {
    var w3cValidatorUrl, contentType, xhr, responseJson, response, result, _iterator, _isArray, _i, _ref, message, type, messages;

    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.t0 = options.type || 'html';
            _context.next = _context.t0 === 'css' ? 3 : _context.t0 === 'html' ? 6 : _context.t0 === 'svg' ? 9 : 12;
            break;

          case 3:
            w3cValidatorUrl = w3cValidateCssUrl;
            contentType = 'text/css; charset=utf-8';
            return _context.abrupt("break", 13);

          case 6:
            w3cValidatorUrl = w3cValidateHtmlUrl;
            contentType = 'text/html; charset=utf-8';
            return _context.abrupt("break", 13);

          case 9:
            w3cValidatorUrl = w3cValidateSvgUrl;
            contentType = 'image/svg+xml; charset=utf-8';
            return _context.abrupt("break", 13);

          case 12:
            throw new Error("Unknown source type: " + options.type);

          case 13:
            xhr = new XMLHttpRequest();
            xhr.timeout = options.timeout || 7000;
            xhr.open('POST', w3cValidatorUrl);
            xhr.setRequestHeader('Content-Type', contentType); // xhr.setRequestHeader('User-Agent', 'Validator.nu/LV http://validator.w3.org/services')

            _context.next = 19;
            return new _Promise(function (resolve, reject) {
              xhr.ontimeout = function () {
                reject("validateW3C: The request for " + w3cValidatorUrl + " timed out.");
              };

              xhr.onerror = function () {
                reject('validateW3C: Error during the request');
              };

              xhr.onreadystatechange = function () {
                if (this.readyState !== 4) {
                  return;
                }

                if (this.status !== 200) {
                  reject("validateW3C: An error occurred during your request: " + this.status + ":" + this.statusText);
                  return;
                }

                resolve(this.responseText);
              };

              xhr.send(options.content);
            });

          case 19:
            responseJson = _context.sent;
            response = JSON.parse(responseJson);
            result = {};
            _iterator = response.messages, _isArray = _Array$isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);

          case 23:
            if (!_isArray) {
              _context.next = 29;
              break;
            }

            if (!(_i >= _iterator.length)) {
              _context.next = 26;
              break;
            }

            return _context.abrupt("break", 40);

          case 26:
            _ref = _iterator[_i++];
            _context.next = 33;
            break;

          case 29:
            _i = _iterator.next();

            if (!_i.done) {
              _context.next = 32;
              break;
            }

            return _context.abrupt("break", 40);

          case 32:
            _ref = _i.value;

          case 33:
            message = _ref;
            type = message.subType || message.type;
            messages = result[type];

            if (!messages) {
              result[type] = messages = [];
            }

            messages.push(message);

          case 38:
            _context.next = 23;
            break;

          case 40:
            return _context.abrupt("return", result);

          case 41:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _validateW3C.apply(this, arguments);
}

var w3c = {
  validateW3C: validateW3C
};

function validateSingle(_x) {
  return _validateSingle.apply(this, arguments);
}

function _validateSingle() {
  _validateSingle = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(resource) {
    var response, urlInfo, matchExt, ext;
    return _regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!(!resource || !resource.url)) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", null);

          case 2:
            if (resource.content) {
              _context.next = 13;
              break;
            }

            _context.prev = 3;
            _context.next = 6;
            return load('GET', resource.url, null);

          case 6:
            response = _context.sent;
            resource.content = response.responseText;
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](3);
            resource.error = "Error load " + resource.url + ":\r\n" + _context.t0 + "\r\n" + _context.t0.stack || _context.t0.toString();

          case 13:
            if (resource.type) {
              _context.next = 26;
              break;
            }

            urlInfo = new _URL(resource.url);
            matchExt = urlInfo.pathname.match(/\.(?:\w+)$/);
            ext = matchExt ? matchExt[0] : '';
            _context.t1 = ext;
            _context.next = _context.t1 === '.css' ? 20 : _context.t1 === '.svg' ? 22 : _context.t1 === '.htm' ? 24 : _context.t1 === '.html' ? 24 : 24;
            break;

          case 20:
            resource.type = 'css';
            return _context.abrupt("break", 26);

          case 22:
            resource.type = 'svg';
            return _context.abrupt("break", 26);

          case 24:
            resource.type = 'html';
            return _context.abrupt("break", 26);

          case 26:
            _context.prev = 26;
            _context.next = 29;
            return w3c.validateW3C({
              content: resource.content,
              type: resource.type
            });

          case 29:
            resource.w3c = _context.sent;
            _context.next = 35;
            break;

          case 32:
            _context.prev = 32;
            _context.t2 = _context["catch"](26);
            resource.error = "Error get w3c validate report for content of " + resource.url + ":\r\n" + _context.t2 + "\r\n" + _context.t2.stack || _context.t2.toString();

          case 35:
            return _context.abrupt("return", resource);

          case 36:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 10], [26, 32]]);
  }));
  return _validateSingle.apply(this, arguments);
}

function validateAll(_x2) {
  return _validateAll.apply(this, arguments);
}

function _validateAll() {
  _validateAll = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(urlRegex) {
    var _context2, _context3, _context4, _context5;

    var resources, results, total, withErrors;
    return _regeneratorRuntime.wrap(function _callee2$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (urlRegex) {
              urlRegex = urlRegex instanceof RegExp ? urlRegex : new RegExp(urlRegex, 'i');
            }

            resources = getDebugInfo().resources || []; // console.log(`validate resources[${resources.length}]`)

            _context6.t0 = _filterInstanceProperty;
            _context6.next = 5;
            return _Promise.all(_mapInstanceProperty(_context3 = _filterInstanceProperty(_context4 = _concatInstanceProperty(_context5 = [{
              type: 'html',
              url: document.location.href + '.html',
              content: getHtml()
            }]).call(_context5, resources)).call(_context4, function (o) {
              return o && o.url && (!urlRegex || o.url.match(urlRegex));
            })).call(_context3, function (res) {
              return validateSingle(res);
            }));

          case 5:
            _context6.t1 = _context2 = _context6.sent;
            _context6.t2 = _context2;

            _context6.t3 = function (o) {
              return o;
            };

            results = (0, _context6.t0)(_context6.t1).call(_context6.t2, _context6.t3);
            total = results.length;
            withErrors = _filterInstanceProperty(results).call(results, function (o) {
              return o.error || !o.w3c || o.w3c.error || o.w3c.warning;
            });
            return _context6.abrupt("return", {
              total: total,
              withErrors: withErrors
            });

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee2);
  }));
  return _validateAll.apply(this, arguments);
}

var browserDebug = {
  getDebugInfo: getDebugInfo,
  load: load,
  getHtml: getHtml,
  validateAll: validateAll
};

export { browserDebug as b };
