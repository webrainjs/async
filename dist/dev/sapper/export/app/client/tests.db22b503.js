import { an as global, ao as $, am as path, ap as bind, aq as isArray, ar as toLength, as as toObject, at as aFunction, au as arraySpeciesCreate, av as entryVirtual, aw as CalcObjectBuilder, _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, aa as _mapInstanceProperty, a4 as _Array$isArray, ax as _Object$assign, h as _createClass, ay as ObservableClass, az as _Set, ae as _asyncToGenerator, af as _regeneratorRuntime, aA as delay, ad as _Promise, a5 as _getIterator, ah as _URL, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, Q as onMount, H as space, t as element, G as text, aB as svg_element, X as query_selector_all, k as _forEachInstanceProperty, y as detach_dev, J as claim_space, v as claim_element, w as children, I as claim_text, z as attr_dev, A as add_location, V as set_style, B as insert_dev, K as append_dev, a7 as listen_dev, n as noop, U as binding_callbacks } from './client.f26f53d6.js';

var globalIsFinite = global.isFinite;

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
var numberIsFinite = Number.isFinite || function isFinite(it) {
  return typeof it == 'number' && globalIsFinite(it);
};

// `Number.isFinite` method
// https://tc39.github.io/ecma262/#sec-number.isfinite
$({ target: 'Number', stat: true }, { isFinite: numberIsFinite });

var _isFinite = path.Number.isFinite;

// `FlattenIntoArray` abstract operation
// https://tc39.github.io/proposal-flatMap/#sec-FlattenIntoArray
var flattenIntoArray = function (target, original, source, sourceLen, start, depth, mapper, thisArg) {
  var targetIndex = start;
  var sourceIndex = 0;
  var mapFn = mapper ? bind(mapper, thisArg, 3) : false;
  var element;

  while (sourceIndex < sourceLen) {
    if (sourceIndex in source) {
      element = mapFn ? mapFn(source[sourceIndex], sourceIndex, original) : source[sourceIndex];

      if (depth > 0 && isArray(element)) {
        targetIndex = flattenIntoArray(target, original, element, toLength(element.length), targetIndex, depth - 1) - 1;
      } else {
        if (targetIndex >= 0x1FFFFFFFFFFFFF) throw TypeError('Exceed the acceptable array length');
        target[targetIndex] = element;
      }

      targetIndex++;
    }
    sourceIndex++;
  }
  return targetIndex;
};

var flattenIntoArray_1 = flattenIntoArray;

// `Array.prototype.flatMap` method
// https://github.com/tc39/proposal-flatMap
$({ target: 'Array', proto: true }, {
  flatMap: function flatMap(callbackfn /* , thisArg */) {
    var O = toObject(this);
    var sourceLen = toLength(O.length);
    var A;
    aFunction(callbackfn);
    A = arraySpeciesCreate(O, 0);
    A.length = flattenIntoArray_1(A, O, O, sourceLen, 0, 1, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    return A;
  }
});

var flatMap = entryVirtual('Array').flatMap;

var ArrayPrototype = Array.prototype;

var flatMap_1 = function (it) {
  var own = it.flatMap;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.flatMap) ? flatMap : own;
};

var flatMap$1 = flatMap_1;

var flatMap$2 = flatMap$1;

function waitProperty(object, propertyName, predicate) {
  if (predicate(object[propertyName])) {
    return;
  }

  return new _Promise(function (resolve, reject) {
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
  _inherits(AudioPlayer, _ObservableClass);

  function AudioPlayer() {
    var _context, _context2;

    var _this;

    _classCallCheck(this, AudioPlayer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(AudioPlayer).call(this));
    _this.stopped = true;

    if (typeof window === 'undefined') {
      return _possibleConstructorReturn(_this);
    }

    _this._audio = new Audio();
    _this._audio.preload = 'none';

    var bind = function bind(event, handler) {
      _this._audio.addEventListener(event, handler, false);
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

    _this._sources = _mapInstanceProperty(_context = _mapInstanceProperty(_context2 = flatMap$2(sources).call(sources, function (source) {
      return _Array$isArray(source) ? source : [source];
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

      _Object$assign(sourceElement, source);

      return sourceElement;
    });
    return _this;
  }

  _createClass(AudioPlayer, [{
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
      var _waitCanPlay = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        return _regeneratorRuntime.wrap(function _callee$(_context3) {
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
      var _waitEnd = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2() {
        return _regeneratorRuntime.wrap(function _callee2$(_context4) {
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
      var _play2 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee3(waitEnd) {
        var wait;
        return _regeneratorRuntime.wrap(function _callee3$(_context5) {
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
}(ObservableClass);
new CalcObjectBuilder(AudioPlayer.prototype).writable('canPlay').writable('stopped', {
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
  source = new _URL(source, document.baseURI).href;
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
    _classCallCheck(this, AudioQueue);

    this._queue = new _Set();
  }

  _createClass(AudioQueue, [{
    key: "play",
    value: function () {
      var _play3 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee4(source) {
        return _regeneratorRuntime.wrap(function _callee4$(_context6) {
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
      var _play4 = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee5() {
        var iterator, iteration, audio;
        return _regeneratorRuntime.wrap(function _callee5$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                console.log('AudioQueue play');
                _context7.prev = 1;

              case 2:

                // get AudioPlayer from queue
                iterator = _getIterator(this._queue);
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
                return _Promise.race([delay(60000), audio.play()]);

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
                return delay(1000);

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
var audioQueue = new AudioQueue();

var file = "src\\routes\\dev\\tests.svelte";

function create_fragment(ctx) {
  var t0;
  var button;
  var t1;
  var t2;
  var h20;
  var t3;
  var t4;
  var div1;
  var t5;
  var div0;
  var t6;
  var div2;
  var t7;
  var img;
  var img_src_value;
  var t8;
  var div3;
  var t9;
  var svg;
  var linearGradient0;
  var stop0;
  var stop1;
  var linearGradient1;
  var stop2;
  var stop3;
  var stop4;
  var radialGradient0;
  var stop5;
  var stop6;
  var radialGradient1;
  var stop7;
  var stop8;
  var stop9;
  var rect0;
  var rect1;
  var rect2;
  var rect3;
  var t10;
  var h21;
  var t11;
  var t12;
  var div4;
  var canvas_1;
  var t13;
  var h22;
  var t14;
  var t15;
  var div5;
  var audio;
  var source;
  var source_src_value;
  var p;
  var t16;
  var a;
  var t17;
  var t18;
  var dispose;
  var block = {
    c: function create() {
      t0 = space();
      button = element("button");
      t1 = text("Play sound");
      t2 = space();
      h20 = element("h2");
      t3 = text("SVG Gradient");
      t4 = space();
      div1 = element("div");
      t5 = text("CSS:\n\t");
      div0 = element("div");
      t6 = space();
      div2 = element("div");
      t7 = text("<img />:\n\t");
      img = element("img");
      t8 = space();
      div3 = element("div");
      t9 = text("<svg />:\n\t");
      svg = svg_element("svg");
      linearGradient0 = svg_element("linearGradient");
      stop0 = svg_element("stop");
      stop1 = svg_element("stop");
      linearGradient1 = svg_element("linearGradient");
      stop2 = svg_element("stop");
      stop3 = svg_element("stop");
      stop4 = svg_element("stop");
      radialGradient0 = svg_element("radialGradient");
      stop5 = svg_element("stop");
      stop6 = svg_element("stop");
      radialGradient1 = svg_element("radialGradient");
      stop7 = svg_element("stop");
      stop8 = svg_element("stop");
      stop9 = svg_element("stop");
      rect0 = svg_element("rect");
      rect1 = svg_element("rect");
      rect2 = svg_element("rect");
      rect3 = svg_element("rect");
      t10 = space();
      h21 = element("h2");
      t11 = text("Canvas");
      t12 = space();
      div4 = element("div");
      canvas_1 = element("canvas");
      t13 = space();
      h22 = element("h2");
      t14 = text("Sounds");
      t15 = space();
      div5 = element("div");
      audio = element("audio");
      source = element("source");
      p = element("p");
      t16 = text("Your browser does not support HTML5 audio, but you can still\n\t\t\t");
      a = element("a");
      t17 = text("download the music");
      t18 = text(".");
      this.h();
    },
    l: function claim(nodes) {
      var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13, _context14, _context15, _context16;

      var head_nodes = query_selector_all("[data-svelte=\"svelte-34ep71\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      button = claim_element(nodes, "BUTTON", {
        class: true
      });
      var button_nodes = children(button);
      t1 = claim_text(button_nodes, "Play sound");

      _forEachInstanceProperty(button_nodes).call(button_nodes, detach_dev);

      t2 = claim_space(nodes);
      h20 = claim_element(nodes, "H2", {
        class: true
      });
      var h20_nodes = children(h20);
      t3 = claim_text(h20_nodes, "SVG Gradient");

      _forEachInstanceProperty(h20_nodes).call(h20_nodes, detach_dev);

      t4 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t5 = claim_text(div1_nodes, "CSS:\n\t");
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });

      _forEachInstanceProperty(_context = children(div0)).call(_context, detach_dev);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      t6 = claim_space(nodes);
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      t7 = claim_text(div2_nodes, "<img />:\n\t");
      img = claim_element(div2_nodes, "IMG", {
        src: true,
        alt: true,
        class: true
      });

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      t8 = claim_space(nodes);
      div3 = claim_element(nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      t9 = claim_text(div3_nodes, "<svg />:\n\t");
      svg = claim_element(div3_nodes, "svg", {
        version: true,
        id: true,
        xmlns: true,
        "xmlns:xlink": true,
        viewBox: true,
        class: true
      }, 1);
      var svg_nodes = children(svg);
      linearGradient0 = claim_element(svg_nodes, "linearGradient", {
        id: true,
        x1: true,
        y1: true,
        x2: true,
        y2: true
      }, 1);
      var linearGradient0_nodes = children(linearGradient0);
      stop0 = claim_element(linearGradient0_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context2 = children(stop0)).call(_context2, detach_dev);

      stop1 = claim_element(linearGradient0_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context3 = children(stop1)).call(_context3, detach_dev);

      _forEachInstanceProperty(linearGradient0_nodes).call(linearGradient0_nodes, detach_dev);

      linearGradient1 = claim_element(svg_nodes, "linearGradient", {
        id: true,
        x1: true,
        y1: true,
        x2: true,
        y2: true,
        spreadMethod: true
      }, 1);
      var linearGradient1_nodes = children(linearGradient1);
      stop2 = claim_element(linearGradient1_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context4 = children(stop2)).call(_context4, detach_dev);

      stop3 = claim_element(linearGradient1_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context5 = children(stop3)).call(_context5, detach_dev);

      stop4 = claim_element(linearGradient1_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context6 = children(stop4)).call(_context6, detach_dev);

      _forEachInstanceProperty(linearGradient1_nodes).call(linearGradient1_nodes, detach_dev);

      radialGradient0 = claim_element(svg_nodes, "radialGradient", {
        id: true,
        fx: true,
        fy: true,
        cx: true,
        cy: true,
        r: true
      }, 1);
      var radialGradient0_nodes = children(radialGradient0);
      stop5 = claim_element(radialGradient0_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context7 = children(stop5)).call(_context7, detach_dev);

      stop6 = claim_element(radialGradient0_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context8 = children(stop6)).call(_context8, detach_dev);

      _forEachInstanceProperty(radialGradient0_nodes).call(radialGradient0_nodes, detach_dev);

      radialGradient1 = claim_element(svg_nodes, "radialGradient", {
        id: true,
        fx: true,
        fy: true,
        cx: true,
        cy: true,
        r: true,
        spreadMethod: true
      }, 1);
      var radialGradient1_nodes = children(radialGradient1);
      stop7 = claim_element(radialGradient1_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context9 = children(stop7)).call(_context9, detach_dev);

      stop8 = claim_element(radialGradient1_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context10 = children(stop8)).call(_context10, detach_dev);

      stop9 = claim_element(radialGradient1_nodes, "stop", {
        offset: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context11 = children(stop9)).call(_context11, detach_dev);

      _forEachInstanceProperty(radialGradient1_nodes).call(radialGradient1_nodes, detach_dev);

      rect0 = claim_element(svg_nodes, "rect", {
        x: true,
        y: true,
        width: true,
        height: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context12 = children(rect0)).call(_context12, detach_dev);

      rect1 = claim_element(svg_nodes, "rect", {
        x: true,
        y: true,
        width: true,
        height: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context13 = children(rect1)).call(_context13, detach_dev);

      rect2 = claim_element(svg_nodes, "rect", {
        x: true,
        y: true,
        width: true,
        height: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context14 = children(rect2)).call(_context14, detach_dev);

      rect3 = claim_element(svg_nodes, "rect", {
        x: true,
        y: true,
        width: true,
        height: true,
        style: true
      }, 1);

      _forEachInstanceProperty(_context15 = children(rect3)).call(_context15, detach_dev);

      _forEachInstanceProperty(svg_nodes).call(svg_nodes, detach_dev);

      _forEachInstanceProperty(div3_nodes).call(div3_nodes, detach_dev);

      t10 = claim_space(nodes);
      h21 = claim_element(nodes, "H2", {
        class: true
      });
      var h21_nodes = children(h21);
      t11 = claim_text(h21_nodes, "Canvas");

      _forEachInstanceProperty(h21_nodes).call(h21_nodes, detach_dev);

      t12 = claim_space(nodes);
      div4 = claim_element(nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      canvas_1 = claim_element(div4_nodes, "CANVAS", {
        class: true
      });

      _forEachInstanceProperty(_context16 = children(canvas_1)).call(_context16, detach_dev);

      _forEachInstanceProperty(div4_nodes).call(div4_nodes, detach_dev);

      t13 = claim_space(nodes);
      h22 = claim_element(nodes, "H2", {
        class: true
      });
      var h22_nodes = children(h22);
      t14 = claim_text(h22_nodes, "Sounds");

      _forEachInstanceProperty(h22_nodes).call(h22_nodes, detach_dev);

      t15 = claim_space(nodes);
      div5 = claim_element(nodes, "DIV", {
        class: true
      });
      var div5_nodes = children(div5);
      audio = claim_element(div5_nodes, "AUDIO", {
        class: true
      });
      var audio_nodes = children(audio);
      source = claim_element(audio_nodes, "SOURCE", {
        src: true,
        type: true
      });
      p = claim_element(audio_nodes, "P", {});
      var p_nodes = children(p);
      t16 = claim_text(p_nodes, "Your browser does not support HTML5 audio, but you can still\n\t\t\t");
      a = claim_element(p_nodes, "A", {
        href: true
      });
      var a_nodes = children(a);
      t17 = claim_text(a_nodes, "download the music");

      _forEachInstanceProperty(a_nodes).call(a_nodes, detach_dev);

      t18 = claim_text(p_nodes, ".");

      _forEachInstanceProperty(p_nodes).call(p_nodes, detach_dev);

      _forEachInstanceProperty(audio_nodes).call(audio_nodes, detach_dev);

      _forEachInstanceProperty(div5_nodes).call(div5_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      document.title = "Page for tests";
      attr_dev(button, "class", "svelte-ufi6lg");
      add_location(button, file, 4, 0, 61);
      attr_dev(h20, "class", "svelte-ufi6lg");
      add_location(h20, file, 5, 0, 110);
      attr_dev(div0, "class", "ref-gradient svelte-ufi6lg");
      add_location(div0, file, 8, 1, 157);
      attr_dev(div1, "class", "box svelte-ufi6lg");
      add_location(div1, file, 6, 0, 132);
      if (img.src !== (img_src_value = "client/images/tests/gradient.svg")) attr_dev(img, "src", img_src_value);
      attr_dev(img, "alt", "gradient");
      attr_dev(img, "class", "svelte-ufi6lg");
      add_location(img, file, 12, 1, 251);
      attr_dev(div2, "class", "box svelte-ufi6lg");
      add_location(div2, file, 10, 0, 216);
      attr_dev(stop0, "offset", "0%");
      set_style(stop0, "stop-color", "yellow");
      add_location(stop0, file, 24, 3, 569);
      attr_dev(stop1, "offset", "100%");
      set_style(stop1, "stop-color", "blue");
      add_location(stop1, file, 25, 3, 622);
      attr_dev(linearGradient0, "id", "gradient1");
      attr_dev(linearGradient0, "x1", "0");
      attr_dev(linearGradient0, "y1", "0");
      attr_dev(linearGradient0, "x2", "0.8");
      attr_dev(linearGradient0, "y2", "0.8");
      add_location(linearGradient0, file, 23, 2, 502);
      attr_dev(stop2, "offset", "0%");
      set_style(stop2, "stop-color", "yellow");
      add_location(stop2, file, 29, 3, 786);
      attr_dev(stop3, "offset", "50%");
      set_style(stop3, "stop-color", "blue");
      add_location(stop3, file, 30, 3, 839);
      attr_dev(stop4, "offset", "100%");
      set_style(stop4, "stop-color", "yellow");
      add_location(stop4, file, 31, 3, 890);
      attr_dev(linearGradient1, "id", "gradient2");
      attr_dev(linearGradient1, "x1", "0.4");
      attr_dev(linearGradient1, "y1", "0.4");
      attr_dev(linearGradient1, "x2", "0.5");
      attr_dev(linearGradient1, "y2", "0.5");
      attr_dev(linearGradient1, "spreadMethod", "repeat");
      add_location(linearGradient1, file, 28, 2, 693);
      attr_dev(stop5, "offset", "0%");
      set_style(stop5, "stop-color", "yellow");
      add_location(stop5, file, 35, 3, 1042);
      attr_dev(stop6, "offset", "100%");
      set_style(stop6, "stop-color", "blue");
      add_location(stop6, file, 36, 3, 1095);
      attr_dev(radialGradient0, "id", "gradient3");
      attr_dev(radialGradient0, "fx", "0.7");
      attr_dev(radialGradient0, "fy", "0.7");
      attr_dev(radialGradient0, "cx", "0.5");
      attr_dev(radialGradient0, "cy", "0.5");
      attr_dev(radialGradient0, "r", "0.4");
      add_location(radialGradient0, file, 34, 2, 963);
      attr_dev(stop7, "offset", "0%");
      set_style(stop7, "stop-color", "yellow");
      add_location(stop7, file, 40, 3, 1267);
      attr_dev(stop8, "offset", "50%");
      set_style(stop8, "stop-color", "blue");
      add_location(stop8, file, 41, 3, 1320);
      attr_dev(stop9, "offset", "100%");
      set_style(stop9, "stop-color", "yellow");
      add_location(stop9, file, 42, 3, 1371);
      attr_dev(radialGradient1, "id", "gradient4");
      attr_dev(radialGradient1, "fx", "0.5");
      attr_dev(radialGradient1, "fy", "0.5");
      attr_dev(radialGradient1, "cx", "0.6");
      attr_dev(radialGradient1, "cy", "0.6");
      attr_dev(radialGradient1, "r", "0.2");
      attr_dev(radialGradient1, "spreadMethod", "repeat");
      add_location(radialGradient1, file, 39, 2, 1166);
      attr_dev(rect0, "x", "10");
      attr_dev(rect0, "y", "10");
      attr_dev(rect0, "width", "180");
      attr_dev(rect0, "height", "120");
      set_style(rect0, "fill", "url(#gradient1)");
      add_location(rect0, file, 45, 2, 1444);
      attr_dev(rect1, "x", "210");
      attr_dev(rect1, "y", "10");
      attr_dev(rect1, "width", "180");
      attr_dev(rect1, "height", "120");
      set_style(rect1, "fill", "url(#gradient2)");
      add_location(rect1, file, 47, 2, 1524);
      attr_dev(rect2, "x", "10");
      attr_dev(rect2, "y", "150");
      attr_dev(rect2, "width", "180");
      attr_dev(rect2, "height", "120");
      set_style(rect2, "fill", "url(#gradient3)");
      add_location(rect2, file, 49, 2, 1605);
      attr_dev(rect3, "x", "210");
      attr_dev(rect3, "y", "150");
      attr_dev(rect3, "width", "180");
      attr_dev(rect3, "height", "120");
      set_style(rect3, "fill", "url(#gradient4)");
      add_location(rect3, file, 51, 2, 1686);
      attr_dev(svg, "version", "1.1");
      attr_dev(svg, "id", "Layer_1");
      attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      attr_dev(svg, "viewBox", "0 0 390 270");
      attr_dev(svg, "class", "svelte-ufi6lg");
      add_location(svg, file, 16, 1, 355);
      attr_dev(div3, "class", "box svelte-ufi6lg");
      add_location(div3, file, 14, 0, 320);
      attr_dev(h21, "class", "svelte-ufi6lg");
      add_location(h21, file, 55, 0, 1781);
      attr_dev(canvas_1, "class", "fill svelte-ufi6lg");
      add_location(canvas_1, file, 57, 1, 1816);
      attr_dev(div4, "class", "box svelte-ufi6lg");
      add_location(div4, file, 56, 0, 1797);
      attr_dev(h22, "class", "svelte-ufi6lg");
      add_location(h22, file, 60, 0, 1868);
      if (source.src !== (source_src_value = "client/sounds/click.ogg")) attr_dev(source, "src", source_src_value);
      attr_dev(source, "type", "audio/ogg");
      add_location(source, file, 64, 2, 1978);
      attr_dev(a, "href", "client/sounds/click.mp3");
      add_location(a, file, 67, 3, 2161);
      add_location(p, file, 66, 2, 2094);
      attr_dev(audio, "class", "svelte-ufi6lg");
      add_location(audio, file, 62, 1, 1903);
      attr_dev(div5, "class", "box svelte-ufi6lg");
      add_location(div5, file, 61, 0, 1884);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, button, anchor);
      append_dev(button, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, h20, anchor);
      append_dev(h20, t3);
      insert_dev(target, t4, anchor);
      insert_dev(target, div1, anchor);
      append_dev(div1, t5);
      append_dev(div1, div0);
      /*div0_binding*/

      ctx[2](div0);
      insert_dev(target, t6, anchor);
      insert_dev(target, div2, anchor);
      append_dev(div2, t7);
      append_dev(div2, img);
      insert_dev(target, t8, anchor);
      insert_dev(target, div3, anchor);
      append_dev(div3, t9);
      append_dev(div3, svg);
      append_dev(svg, linearGradient0);
      append_dev(linearGradient0, stop0);
      append_dev(linearGradient0, stop1);
      append_dev(svg, linearGradient1);
      append_dev(linearGradient1, stop2);
      append_dev(linearGradient1, stop3);
      append_dev(linearGradient1, stop4);
      append_dev(svg, radialGradient0);
      append_dev(radialGradient0, stop5);
      append_dev(radialGradient0, stop6);
      append_dev(svg, radialGradient1);
      append_dev(radialGradient1, stop7);
      append_dev(radialGradient1, stop8);
      append_dev(radialGradient1, stop9);
      append_dev(svg, rect0);
      append_dev(svg, rect1);
      append_dev(svg, rect2);
      append_dev(svg, rect3);
      insert_dev(target, t10, anchor);
      insert_dev(target, h21, anchor);
      append_dev(h21, t11);
      insert_dev(target, t12, anchor);
      insert_dev(target, div4, anchor);
      append_dev(div4, canvas_1);
      /*canvas_1_binding*/

      ctx[3](canvas_1);
      insert_dev(target, t13, anchor);
      insert_dev(target, h22, anchor);
      append_dev(h22, t14);
      insert_dev(target, t15, anchor);
      insert_dev(target, div5, anchor);
      append_dev(div5, audio);
      append_dev(audio, source);
      append_dev(audio, p);
      append_dev(p, t16);
      append_dev(p, a);
      append_dev(a, t17);
      append_dev(p, t18);
      dispose = listen_dev(button, "click", playSound, false, false, false);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(button);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(h20);
      if (detaching) detach_dev(t4);
      if (detaching) detach_dev(div1);
      /*div0_binding*/

      ctx[2](null);
      if (detaching) detach_dev(t6);
      if (detaching) detach_dev(div2);
      if (detaching) detach_dev(t8);
      if (detaching) detach_dev(div3);
      if (detaching) detach_dev(t10);
      if (detaching) detach_dev(h21);
      if (detaching) detach_dev(t12);
      if (detaching) detach_dev(div4);
      /*canvas_1_binding*/

      ctx[3](null);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(h22);
      if (detaching) detach_dev(t15);
      if (detaching) detach_dev(div5);
      dispose();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function playSound() {
  audioQueue.play("client/sounds/code-red-twice.mp3");
}

function instance($$self, $$props, $$invalidate) {
  var canvas;
  var gradient;
  onMount(function () {
    var context = canvas.getContext("2d");
    context.fillStyle = "#ffff00";
    context.strokeStyle = "#00ffff";
    $$invalidate(0, canvas.onmousedown = function () {
      context.font = "30px Arial";
      context.fillText("Hello World", 10, 50);
    }, canvas);
    $$invalidate(0, canvas.onmouseup = function () {
      context.moveTo(0, 0);
      context.lineTo(200, 100);
      context.stroke();
    }, canvas);
  });

  function div0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(1, gradient = $$value);
    });
  }

  function canvas_1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(0, canvas = $$value);
    });
  }

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("canvas" in $$props) $$invalidate(0, canvas = $$props.canvas);
    if ("gradient" in $$props) $$invalidate(1, gradient = $$props.gradient);
  };

  return [canvas, gradient, div0_binding, canvas_1_binding];
}

var Tests =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Tests, _SvelteComponentDev);

  function Tests(options) {
    var _this;

    _classCallCheck(this, Tests);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Tests).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Tests",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Tests;
}(SvelteComponentDev);

export default Tests;
