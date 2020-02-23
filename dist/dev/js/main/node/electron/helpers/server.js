"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getResourcesPath = getResourcesPath;
exports.getRootPath = getRootPath;
exports.serveStatic = serveStatic;

var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));

var _startsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/starts-with"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _endsWith = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/ends-with"));

var _LoggerNode = require("../../log/LoggerNode");

/* tslint:disable:no-var-requires no-duplicate-string */
// @ts-ignore
var _require = require('electron'),
    protocol = _require.protocol,
    BrowserWindow = _require.BrowserWindow,
    remote = _require.remote;

var path = require('path');

var mime = require('mime');

var fs = require('fs');

function getResourcesPath(app) {
  var resPath = app.getAppPath();

  if ((0, _endsWith.default)(resPath).call(resPath, '.asar')) {
    return resPath;
  }

  return path.resolve('.');
}

function getRootPath(app) {
  var resPath = getResourcesPath(app);
  return (0, _endsWith.default)(resPath).call(resPath, '.asar') ? path.resolve(resPath, '../../') : resPath;
}

var errorHandler = function errorHandler(error) {
  if (error) {
    _LoggerNode.logger.error(error);
  }
};

var ServeStatic =
/*#__PURE__*/
function () {
  function ServeStatic(_ref) {
    var protocolName = _ref.protocol,
        host = _ref.host,
        relativeRootDir = _ref.relativeRootDir;
    (0, _classCallCheck2.default)(this, ServeStatic);
    this.protocol = protocolName;
    this.host = host;
    this.relativeRootDir = relativeRootDir;
  }

  (0, _createClass2.default)(ServeStatic, [{
    key: "start",
    value: function start(app) {
      var _this = this;

      this.rootDirs = [path.normalize(path.join(getResourcesPath(app), this.relativeRootDir)), path.normalize(path.join(process.cwd(), this.relativeRootDir))];
      protocol.registerSchemesAsPrivileged([{
        scheme: this.protocol,
        privileges: {
          standard: true,
          secure: true,
          allowServiceWorkers: true,
          // is not worked: https://github.com/electron/electron/issues/9663
          supportFetchAPI: true,
          // bypassCSP: true,
          corsEnabled: true
        }
      }]);
      app.on('ready', function () {
        _this.registerAppProtocol();
      });
    }
  }, {
    key: "getFilePath",
    value: function getFilePath(urlInfo) {
      var relativePath = urlInfo.pathname.substr(1);

      for (var i = 0, len = this.rootDirs.length; i < len; i++) {
        var dir = this.rootDirs[i];
        var filePath = path.join(dir, relativePath);
        filePath = path.normalize(filePath);

        if (!(0, _startsWith.default)(filePath).call(filePath, dir)) {
          continue;
        }

        if (!fs.existsSync(filePath)) {
          continue;
        }

        if (fs.lstatSync(filePath).isFile()) {
          return filePath;
        }

        var indexFilePath = path.join(filePath, 'index.htm');

        if (fs.existsSync(indexFilePath) && fs.lstatSync(indexFilePath).isFile()) {
          return indexFilePath;
        }

        indexFilePath = path.join(filePath, 'index.html');

        if (fs.existsSync(indexFilePath) && fs.lstatSync(indexFilePath).isFile()) {
          return indexFilePath;
        }
      }

      return null;
    }
  }, {
    key: "toAppUrl",
    value: function toAppUrl(url) {
      if (!url) {
        return null;
      }

      var urlInfo = new _url.default(url);

      if (urlInfo.protocol !== 'https:' || urlInfo.hostname !== this.host) {
        return null;
      }

      var filePath = this.getFilePath(urlInfo);

      if (!filePath) {
        return null;
      }

      return this.protocol + '://' + urlInfo.host + urlInfo.pathname + urlInfo.search + urlInfo.hash;
    }
  }, {
    key: "tryConvertToFileUrl",
    value: function tryConvertToFileUrl(url) {
      if (url) {
        var filePath = this.getFilePath(new _url.default(url));

        if (filePath) {
          var fileUrlInfo = new _url.default('file://');
          fileUrlInfo.pathname = filePath;
          return fileUrlInfo.href;
        }
      }

      return url;
    }
  }, {
    key: "registerAppProtocol",
    value: function registerAppProtocol() {
      var _this2 = this;

      // const doIntercept = () => {
      // 	const interceptHttpProtocolHandler = (request, callback) => {
      // 		try {
      // 			const appUrl = this.toAppUrl(request.url)
      // 			const appReferrer = this.toAppUrl(request.referrer)
      // 			if (appUrl || appReferrer) {
      // 				// request.url = appUrl || request.url
      // 				// request.referrer = appReferrer || request.referrer
      // 				request = {
      // 					...request,
      // 					url: appUrl || request.url,
      // 					referrer: appReferrer || request.referrer,
      // 				}
      // 				logger.debug(request)
      // 				callback(request)
      // 				return
      // 			}
      // 		} catch (error) {
      // 			logger.error('interceptHttpProtocol', error)
      // 		}
      //
      // 		protocol.uninterceptProtocol('https', err => {
      // 			if (err) {
      // 				errorHandler(err)
      // 			}
      //
      // 			doIntercept()
      // 		})
      // 	}
      //
      // 	protocol.interceptHttpProtocol('https', interceptHttpProtocolHandler, errorHandler)
      // }
      protocol.registerFileProtocol(this.protocol, function (request, callback) {
        var urlInfo = new _url.default(request.url);

        var filePath = _this2.getFilePath(urlInfo);

        if (!filePath) {
          _LoggerNode.logger.error("File not found by URL: " + request.url + "\r\nRootDirs: " + _this2.rootDirs.join('\r\n'));

          callback(null);
          return;
        }

        callback({
          path: filePath,
          headers: {
            'Content-Type': mime.getType(path.extname(filePath)) + '; charset=utf-8',
            'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' blob: data:" // 'unsafe-eval' - for webrain optimizations (createFunction(...))

          }
        });
      }, errorHandler);
    }
  }]);
  return ServeStatic;
}();

function serveStatic(app, protocolName, host, relativeRootDir) {
  new ServeStatic({
    protocol: protocolName,
    host: host,
    relativeRootDir: relativeRootDir
  }).start(app);
}