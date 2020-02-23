"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.AudioPlayer = void 0;

var _assign = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/object/assign"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _flatMap = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/flat-map"));

var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/map"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var AudioPlayer = function AudioPlayer() {
  var _context, _context2;

  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }

  (0, _classCallCheck2.default)(this, AudioPlayer);

  if (typeof window === 'undefined') {
    this.preload = function () {};

    this.play = function () {};

    this.pause = function () {};

    this.resume = function () {};

    return;
  }

  var audio = new Audio();
  audio.preload = 'none';
  sources = (0, _map.default)(_context = (0, _map.default)(_context2 = (0, _flatMap.default)(sources).call(sources, function (source) {
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
  var initialized;

  function init() {
    if (initialized) {
      return;
    }

    initialized = true;

    for (var i = 0; i < sources.length; i++) {
      audio.appendChild(sources[i]);
    }
  }

  this.preload = function () {
    audio.preload = 'auto';
    init();
  };

  var stopped = true;

  this.play = function () {
    if (stopped && audio.duration) {
      audio.currentTime = 0;

      if (audio.currentTime) {
        init();
        audio.load();
      }
    }

    audio.play();
  };

  this.pause = function () {
    audio.pause();
  };

  this.resume = function () {
    audio.play();
  };

  this.stop = function () {
    audio.pause();

    if (audio.duration) {
      audio.currentTime = 0;
      stopped = true;
    }
  };
};

exports.AudioPlayer = AudioPlayer;