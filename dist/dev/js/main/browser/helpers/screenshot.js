"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.takeScreenshotCanvas = takeScreenshotCanvas;
exports.getJpegBlob = getJpegBlob;
exports.getJpegBytes = getJpegBytes;
exports.takeScreenshotJpegBlob = takeScreenshotJpegBlob;
exports.takeScreenshotJpegBytes = takeScreenshotJpegBytes;
exports.blobToCanvas = blobToCanvas;

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

// docs: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
// see: https://www.webrtc-experiment.com/Pluginfree-Screen-Sharing/#20893521368186473
// see: https://github.com/muaz-khan/WebRTC-Experiment/blob/master/Pluginfree-Screen-Sharing/conference.js
function getDisplayMedia(options) {
  if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
    return navigator.mediaDevices.getDisplayMedia(options);
  }

  if (navigator.getDisplayMedia) {
    return navigator.getDisplayMedia(options);
  }

  if (navigator.webkitGetDisplayMedia) {
    return navigator.webkitGetDisplayMedia(options);
  }

  if (navigator.mozGetDisplayMedia) {
    return navigator.mozGetDisplayMedia(options);
  }

  throw new Error('getDisplayMedia is not defined');
}

function getUserMedia(options) {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(options);
  }

  if (navigator.getUserMedia) {
    return navigator.getUserMedia(options);
  }

  if (navigator.webkitGetUserMedia) {
    return navigator.webkitGetUserMedia(options);
  }

  if (navigator.mozGetUserMedia) {
    return navigator.mozGetUserMedia(options);
  }

  throw new Error('getUserMedia is not defined');
}

function takeScreenshotStream() {
  return _takeScreenshotStream.apply(this, arguments);
}

function _takeScreenshotStream() {
  _takeScreenshotStream = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var width, height, errors, stream, _console;

    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // see: https://developer.mozilla.org/en-US/docs/Web/API/Window/screen
            width = screen.width * (window.devicePixelRatio || 1);
            height = screen.height * (window.devicePixelRatio || 1);
            errors = [];
            _context.prev = 3;
            _context.next = 6;
            return getDisplayMedia({
              audio: false,
              // see: https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints/video
              video: {
                width: width,
                height: height,
                frameRate: 1
              }
            });

          case 6:
            stream = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](3);
            errors.push(_context.t0);

          case 12:
            _context.prev = 12;
            _context.next = 15;
            return getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  // chromeMediaSourceId: source.id,
                  minWidth: width,
                  maxWidth: width,
                  minHeight: height,
                  maxHeight: height
                }
              }
            });

          case 15:
            stream = _context.sent;
            _context.next = 21;
            break;

          case 18:
            _context.prev = 18;
            _context.t1 = _context["catch"](12);
            errors.push(_context.t1);

          case 21:
            if (errors.length) {
              (_console = console).debug.apply(_console, errors);
            }

            return _context.abrupt("return", stream);

          case 23:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[3, 9], [12, 18]]);
  }));
  return _takeScreenshotStream.apply(this, arguments);
}

function takeScreenshotCanvas() {
  return _takeScreenshotCanvas.apply(this, arguments);
} // from: https://stackoverflow.com/a/46182044/5221762


function _takeScreenshotCanvas() {
  _takeScreenshotCanvas = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var _context2;

    var stream, video, result;
    return _regenerator.default.wrap(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return takeScreenshotStream();

          case 2:
            stream = _context3.sent;

            if (stream) {
              _context3.next = 5;
              break;
            }

            return _context3.abrupt("return", null);

          case 5:
            // from: https://stackoverflow.com/a/57665309/5221762
            video = document.createElement('video');
            _context3.next = 8;
            return new _promise.default(function (resolve, reject) {
              video.onloadedmetadata = function () {
                video.play();
                video.pause(); // from: https://github.com/kasprownik/electron-screencapture/blob/master/index.js

                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                var context = canvas.getContext('2d'); // see: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement

                context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                resolve(canvas);
              };

              video.srcObject = stream;
            });

          case 8:
            result = _context3.sent;
            (0, _forEach.default)(_context2 = stream.getTracks()).call(_context2, function (track) {
              track.stop();
            });
            return _context3.abrupt("return", result);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee2);
  }));
  return _takeScreenshotCanvas.apply(this, arguments);
}

function getJpegBlob(canvas) {
  return new _promise.default(function (resolve, reject) {
    // docs: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    canvas.toBlob(function (blob) {
      return resolve(blob);
    }, 'image/jpeg', 0.95);
  });
}

function getJpegBytes(_x) {
  return _getJpegBytes.apply(this, arguments);
}

function _getJpegBytes() {
  _getJpegBytes = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3(canvas) {
    var blob;
    return _regenerator.default.wrap(function _callee3$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return getJpegBlob(canvas);

          case 2:
            blob = _context4.sent;
            return _context4.abrupt("return", new _promise.default(function (resolve, reject) {
              var fileReader = new FileReader();
              fileReader.addEventListener('loadend', function () {
                if (this.error) {
                  reject(this.error);
                  return;
                }

                resolve(this.result);
              });
              fileReader.readAsArrayBuffer(blob);
            }));

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee3);
  }));
  return _getJpegBytes.apply(this, arguments);
}

function takeScreenshotJpegBlob() {
  return _takeScreenshotJpegBlob.apply(this, arguments);
}

function _takeScreenshotJpegBlob() {
  _takeScreenshotJpegBlob = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee4() {
    var canvas;
    return _regenerator.default.wrap(function _callee4$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return takeScreenshotCanvas();

          case 2:
            canvas = _context5.sent;

            if (canvas) {
              _context5.next = 5;
              break;
            }

            return _context5.abrupt("return", null);

          case 5:
            return _context5.abrupt("return", getJpegBlob(canvas));

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee4);
  }));
  return _takeScreenshotJpegBlob.apply(this, arguments);
}

function takeScreenshotJpegBytes() {
  return _takeScreenshotJpegBytes.apply(this, arguments);
}

function _takeScreenshotJpegBytes() {
  _takeScreenshotJpegBytes = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee5() {
    var canvas;
    return _regenerator.default.wrap(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return takeScreenshotCanvas();

          case 2:
            canvas = _context6.sent;

            if (canvas) {
              _context6.next = 5;
              break;
            }

            return _context6.abrupt("return", null);

          case 5:
            return _context6.abrupt("return", getJpegBytes(canvas));

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee5);
  }));
  return _takeScreenshotJpegBytes.apply(this, arguments);
}

function blobToCanvas(blob, maxWidth, maxHeight) {
  return new _promise.default(function (resolve, reject) {
    var img = new Image();

    img.onload = function () {
      var canvas = document.createElement('canvas');
      var scale = Math.min(1, maxWidth ? maxWidth / img.width : 1, maxHeight ? maxHeight / img.height : 1);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
      resolve(canvas);
    };

    img.onerror = function () {
      reject(new Error('Error load blob to Image'));
    };

    img.src = _url.default.createObjectURL(blob);
  });
}