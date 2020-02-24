"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.getAudio = getAudio;
exports.audioQueue = exports.AudioQueue = exports.AudioPlayer = void 0;

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _set = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set"));

var _url = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/url"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _forEach = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/for-each"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

var _webrain = require("webrain");

function waitProperty(object, propertyName, predicate) {
  if (predicate(object[propertyName])) {
    return;
  }

  return new _promise.default(function (resolve, reject) {
    var unsubscribe;

    var onResolve = function onResolve() {
      unsubscribe();
      resolve();
    };

    unsubscribe = object.propertyChanged.subscribe(function (_ref) {
      var name = _ref.name,
          oldValue = _ref.oldValue,
          newValue = _ref.newValue;

      if (name === propertyName && predicate(newValue)) {
        onResolve();
      }
    });

    if (predicate(object[propertyName])) {
      onResolve();
    }
  });
}

var AudioPlayer =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(AudioPlayer, _ObservableClass);

  function AudioPlayer() {
    var _context, _context2;

    var _this;

    (0, _classCallCheck2.default)(this, AudioPlayer);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(AudioPlayer).call(this));
    _this.stopped = true;

    if (typeof window === 'undefined') {
      return (0, _possibleConstructorReturn2.default)(_this);
    }

    _this._audio = new Audio();
    _this._audio.preload = 'none';
    var unsubscribers = [];

    var bind = function bind(event, handler) {
      _this._audio.addEventListener(event, handler, false);

      unsubscribers.push(function () {
        _this._audio.removeEventListener(event, handler, false);
      });
    };

    var unbind = function unbind() {
      if (unsubscribers) {
        (0, _forEach.default)(unsubscribers).call(unsubscribers, function (o) {
          return o();
        });
        unsubscribers = null;
      }
    };

    var onStop = function onStop() {
      _this.stopped = true;
    };

    var onError = function onError(err) {
      _this.error = err;
      _this.stopped = true;
    };

    bind('canplay', function (o) {
      console.log('AudioPlayer: canplay');
      _this.canPlay = true;
    });
    bind('abort', function (o) {
      console.log('AudioPlayer: abort');
      onStop();
    });
    bind('emptied', function (o) {
      console.log('AudioPlayer: emptied'); // onStop()
    });
    bind('error', function (o) {
      console.log('AudioPlayer: error');
      onError(new Error('Audio load error: ' + _this._audio.src));
    });
    bind('stalled', function (o) {
      console.log('AudioPlayer: stalled'); // onStop()
    });
    bind('waiting', function (o) {
      console.log('AudioPlayer: waiting'); // onStop()
    });
    bind('suspend', function (o) {
      console.log('AudioPlayer: suspend'); // onStop()
    });
    bind('ended', function (o) {
      console.log('AudioPlayer: ended');
      onStop();
    });
    bind('pause', function (o) {
      console.log('AudioPlayer: pause');
      onStop();
    });

    for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
      sources[_key] = arguments[_key];
    }

    _this._sources = (0, _map.default)(_context = (0, _map.default)(_context2 = (0, _flatMap.default)(sources).call(sources, function (source) {
      return (0, _isArray.default)(source) ? source : [source];
    })).call(_context2, function (source) {
      if (typeof source === 'string') {
        var ext = source.match(/\.(\w+)$/)[1];

        if (!ext) {
          throw new Error("Unknown file format: " + source);
        }

        source = {
          src: source,
          format: "audio/" + ext
        };
      }

      return source;
    })).call(_context, function (source) {
      var sourceElement = document.createElement('source');
      (0, _assign.default)(sourceElement, source);
      return sourceElement;
    });
    return _this;
  }

  (0, _createClass2.default)(AudioPlayer, [{
    key: "init",
    value: function init() {
      if (this._initialized) {
        return;
      }

      this._initialized = true;

      for (var i = 0; i < this._sources.length; i++) {
        this._audio.appendChild(this._sources[i]);
      }
    }
  }, {
    key: "preload",
    value: function preload() {
      if (!this._audio) {
        return;
      }

      this._audio.preload = 'auto';
      this.init();
    }
  }, {
    key: "waitCanPlay",
    value: function () {
      var _waitCanPlay = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee() {
        return _regenerator.default.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (this._audio) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.next = 4;
                return waitProperty(this, 'canPlay', function (o) {
                  return o;
                });

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this);
      }));

      function waitCanPlay() {
        return _waitCanPlay.apply(this, arguments);
      }

      return waitCanPlay;
    }()
  }, {
    key: "waitEnd",
    value: function () {
      var _waitEnd = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee2() {
        return _regenerator.default.wrap(function _callee2$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (this._audio) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return");

              case 2:
                _context4.next = 4;
                return waitProperty(this, 'stopped', function (o) {
                  return o;
                });

              case 4:
                if (!this.error) {
                  _context4.next = 6;
                  break;
                }

                throw this.error;

              case 6:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee2, this);
      }));

      function waitEnd() {
        return _waitEnd.apply(this, arguments);
      }

      return waitEnd;
    }()
  }, {
    key: "_play",
    value: function () {
      var _play2 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee3(waitEnd) {
        var wait;
        return _regenerator.default.wrap(function _callee3$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                this.stopped = false;
                wait = waitEnd ? this.waitEnd() : null;
                _context5.prev = 2;
                console.log('AudioPlayer: play()');
                _context5.next = 6;
                return this._audio.play();

              case 6:
                _context5.next = 12;
                break;

              case 8:
                _context5.prev = 8;
                _context5.t0 = _context5["catch"](2);
                this.error = _context5.t0;
                throw _context5.t0;

              case 12:
                return _context5.abrupt("return", wait);

              case 13:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee3, this, [[2, 8]]);
      }));

      function _play(_x) {
        return _play2.apply(this, arguments);
      }

      return _play;
    }()
  }, {
    key: "play",
    value: function play(waitEnd) {
      if (waitEnd === void 0) {
        waitEnd = true;
      }

      if (!this._audio) {
        return;
      }

      this.init();

      if (this.error) {
        this.error = null;
        this.stop();
        console.log('AudioPlayer: load()');

        this._audio.load();
      } else if (this.stopped && this._audio.duration) {
        this._audio.currentTime = 0;

        if (this._audio.currentTime) {
          console.log('AudioPlayer: load()');

          this._audio.load();
        }
      }

      return this._play(waitEnd);
    }
  }, {
    key: "pause",
    value: function pause() {
      if (!this._audio) {
        return;
      }

      console.log('AudioPlayer: pause()');

      this._audio.pause();
    }
  }, {
    key: "resume",
    value: function resume(waitEnd) {
      if (waitEnd === void 0) {
        waitEnd = true;
      }

      if (!this._audio) {
        return;
      }

      return this._play(waitEnd);
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this._audio) {
        return;
      }

      console.log('AudioPlayer: pause()');

      this._audio.pause();

      if (this._audio.duration) {
        this._audio.currentTime = 0;
        this.stopped = true;
      }
    }
  }]);
  return AudioPlayer;
}(_webrain.ObservableClass);

exports.AudioPlayer = AudioPlayer;
new _webrain.CalcObjectBuilder(AudioPlayer.prototype).writable('canPlay').writable('stopped', {
  setOptions: {
    afterChange: function afterChange(oldValue, newValue) {
      if (!newValue) {
        this.error = null;
      }

      console.log(newValue ? 'AudioPlayer stopped' : 'AudioPlayer played');
    }
  }
}).writable('error', {
  setOptions: {
    afterChange: function afterChange(oldValue, newValue) {
      if (newValue) {
        this.stopped = true;
      }
    }
  }
});
var _cache = {};

function getAudio(source) {
  source = new _url.default(source, document.baseURI).href;
  var item = _cache[source];

  if (!item) {
    _cache[source] = item = new AudioPlayer(source);
    item.preload();
  }

  return item;
}

var AudioQueue =
/*#__PURE__*/
function () {
  function AudioQueue() {
    (0, _classCallCheck2.default)(this, AudioQueue);
    this._queue = new _set.default();
  }

  (0, _createClass2.default)(AudioQueue, [{
    key: "play",
    value: function () {
      var _play3 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee4(source) {
        return _regenerator.default.wrap(function _callee4$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (source) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return");

              case 2:
                if (!(source instanceof AudioPlayer)) {
                  source = getAudio(source);
                }

                _context6.next = 5;
                return source.waitCanPlay();

              case 5:
                // add to queue or move to end
                this._queue.delete(source);

                this._queue.add(source);

                _context6.next = 9;
                return this._play();

              case 9:
                return _context6.abrupt("return", _context6.sent);

              case 10:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee4, this);
      }));

      function play(_x2) {
        return _play3.apply(this, arguments);
      }

      return play;
    }()
  }, {
    key: "_play",
    value: function _play() {
      if (!this._playThenable) {
        this._playThenable = this.__play();
      }

      return this._playThenable;
    }
  }, {
    key: "__play",
    value: function () {
      var _play4 = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee5() {
        var iterator, iteration, audio;
        return _regenerator.default.wrap(function _callee5$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                console.log('AudioQueue play');
                _context7.prev = 1;

              case 2:
                if (!true) {
                  _context7.next = 24;
                  break;
                }

                // get AudioPlayer from queue
                iterator = (0, _getIterator2.default)(this._queue);
                iteration = iterator.next();

                if (!iteration.done) {
                  _context7.next = 7;
                  break;
                }

                return _context7.abrupt("return");

              case 7:
                audio = iteration.value;
                _context7.prev = 8;
                // play and wait
                audio.stop();
                _context7.next = 12;
                return _promise.default.race([(0, _webrain.delay)(60000), audio.play()]);

              case 12:
                _context7.next = 17;
                break;

              case 14:
                _context7.prev = 14;
                _context7.t0 = _context7["catch"](8);
                console.error(_context7.t0);

              case 17:
                _context7.prev = 17;

                // delete AudioPlayer from queue
                this._queue.delete(audio);

                return _context7.finish(17);

              case 20:
                _context7.next = 22;
                return (0, _webrain.delay)(1000);

              case 22:
                _context7.next = 2;
                break;

              case 24:
                _context7.prev = 24;
                this._playThenable = null;
                console.log('AudioQueue stopped');
                return _context7.finish(24);

              case 28:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee5, this, [[1,, 24, 28], [8, 14, 17, 20]]);
      }));

      function __play() {
        return _play4.apply(this, arguments);
      }

      return __play;
    }()
  }]);
  return AudioQueue;
}();

exports.AudioQueue = AudioQueue;
var audioQueue = new AudioQueue();
exports.audioQueue = audioQueue;