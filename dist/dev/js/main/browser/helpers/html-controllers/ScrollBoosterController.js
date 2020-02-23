"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.ScrollBoosterController = void 0;

var _bind = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/bind"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _HtmlController2 = require("./HtmlController");

// source: https://ilyashubin.github.io/scrollbooster/
// source: https://github.com/ilyashubin/scrollbooster

/* tslint:disable:no-empty */
var ScrollBoosterController =
/*#__PURE__*/
function (_HtmlController) {
  (0, _inherits2.default)(ScrollBoosterController, _HtmlController);

  function ScrollBoosterController(props) {
    var _this;

    (0, _classCallCheck2.default)(this, ScrollBoosterController);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(ScrollBoosterController).call(this, props.container));
    var defaults = {
      handleMatches: props.viewportMatches,
      bounce: true,
      friction: 0.05,
      bounceForce: 0.1,
      textSelection: false,
      emulateScroll: false,
      onUpdate: function onUpdate(data) {
        data.viewportElement.scrollLeft = data.position.x;
        data.viewportElement.scrollTop = data.position.y; // data.contentElement.style.transform = `translate(
        // 	${-data.position.x}px,
        // 	${-data.position.y}px
        // )`
        // and also metrics: data.viewport['width'|'height'] and data.cotent['width'|'height']
      },
      shouldScroll: function shouldScroll(data, event) {
        if (props.noDragMatches && props.noDragMatches(event.target)) {
          return false;
        } else {
          return true;
        }
      },
      onClick: function onClick(data, event) {
        if (props.noDragMatches && props.noDragMatches(event.target)) {
          event.preventDefault();
        }
      }
    };
    _this.props = (0, _extends2.default)({}, defaults, {}, props);
    _this.position = {
      x: 0,
      y: 0
    };
    _this.velocity = {
      x: 0,
      y: 0
    };
    _this.friction = 1 - _this.props.friction;
    _this.bounceForce = _this.props.bounceForce;
    _this.isDragging = false;
    _this.dragStartPosition = {
      x: 0,
      y: 0
    };
    _this.dragOffsetPosition = (0, _extends2.default)({}, _this.dragStartPosition);
    _this.dragPosition = (0, _extends2.default)({}, _this.position);
    _this.isScrollEnabled = !!_this.props.emulateScroll;
    _this.isScrolling = false;
    _this.scrollOffset = {
      x: 0,
      y: 0
    };
    _this.bounce = _this.props.bounce;
    _this.textSelection = _this.props.textSelection;
    _this.viewport = {
      width: 0,
      height: 0
    };
    _this.content = {
      width: 0,
      height: 0
    };
    _this.boundX = {
      from: 0,
      to: 0
    };
    _this.boundY = {
      from: 0,
      to: 0
    };
    _this.mode = {
      x: _this.props.mode == 'x',
      y: _this.props.mode == 'y',
      xy: _this.props.mode !== 'x' && _this.props.mode !== 'y'
    };
    _this.isRunning = false;
    _this.rafID = null;
    _this.events = {};

    _this.animate();

    _this.handleEvents();

    return _this;
  }

  (0, _createClass2.default)(ScrollBoosterController, [{
    key: "updateViewport",
    value: function updateViewport(viewport) {
      if (!viewport || !(viewport instanceof Element)) {
        console.error('"viewport" config property must be present and must be Element');
        return;
      }

      if (this.props.viewport === viewport) {
        return;
      }

      this.props.viewport = viewport;
      this.props.handle = viewport;
      this.props.content = viewport.children[0];

      if (!this.props.content) {
        console.error('Viewport does not have any content');
        return;
      }

      this.updateMetrics();
    }
    /**
     * Run update loop
     */

  }, {
    key: "run",
    value: function run() {
      var _this2 = this;

      this.isRunning = true;
      cancelAnimationFrame(this.rafID);
      this.rafID = requestAnimationFrame(function () {
        return _this2.animate();
      });
    }
  }, {
    key: "animate",
    value: function animate() {
      var _this3 = this;

      if (!this.isRunning) {
        return;
      }

      this.update();
      this.notify();
      this.rafID = requestAnimationFrame(function () {
        return _this3.animate();
      });
    }
  }, {
    key: "update",
    value: function update() {
      this.applyBoundForce();
      this.applyDragForce();
      this.applyScrollForce();
      this.velocity.x *= this.friction;
      this.velocity.y *= this.friction;

      if (!this.mode.y) {
        this.position.x += this.velocity.x;
      }

      if (!this.mode.x) {
        this.position.y += this.velocity.y;
      } // if bounce effect is disabled


      if (!this.bounce || this.isScrolling) {
        this.position.x = Math.max(Math.min(this.position.x, this.boundX.to), this.boundX.from);
        this.position.y = Math.max(Math.min(this.position.y, this.boundY.to), this.boundY.from);
      } // stop update loop if nothing moves


      if (!this.isDragging && !this.isScrolling && Math.abs(this.velocity.x) < 0.1 && Math.abs(this.velocity.y) < 0.1) {
        this.isRunning = false;
      }
    }
  }, {
    key: "applyForce",
    value: function applyForce(force) {
      this.velocity.x += force.x;
      this.velocity.y += force.y;
    }
    /**
     * Apply force for bounce effect
     */

  }, {
    key: "applyBoundForce",
    value: function applyBoundForce() {
      if (!this.bounce) {
        return;
      }

      if (this.isDragging) {
        return;
      }

      var pastLeft = this.position.x < this.boundX.from;
      var pastRight = this.position.x > this.boundX.to;
      var pastTop = this.position.y < this.boundY.from;
      var pastBottom = this.position.y > this.boundY.to;
      var resultForce = {
        x: 0,
        y: 0
      }; // scrolled past left of right viewport boundaries

      if (pastLeft || pastRight) {
        var bound = pastLeft ? this.boundX.from : this.boundX.to;
        var distance = bound - this.position.x;
        var force = distance * this.bounceForce;
        var restX = this.position.x + (this.velocity.x + force) / (1 - this.friction);

        if (!(pastLeft && restX < this.boundX.from || pastRight && restX > this.boundX.to)) {
          force = distance * this.bounceForce - this.velocity.x;
        }

        resultForce.x = force;
      } // scrolled past top of bottom viewport boundaries


      if (pastTop || pastBottom) {
        var _bound = pastTop ? this.boundY.from : this.boundY.to;

        var _distance = _bound - this.position.y;

        var _force = _distance * this.bounceForce;

        var restY = this.position.y + (this.velocity.y + _force) / (1 - this.friction);

        if (!(pastTop && restY < this.boundY.from || pastBottom && restY > this.boundY.to)) {
          _force = _distance * this.bounceForce - this.velocity.y;
        }

        resultForce.y = _force;
      }

      this.applyForce(resultForce);
    }
    /**
     * Apply force to move content while dragging with mouse/touch
     */

  }, {
    key: "applyDragForce",
    value: function applyDragForce() {
      if (!this.isDragging) {
        return;
      }

      var dragVelocity = {
        x: this.dragPosition.x - this.position.x,
        y: this.dragPosition.y - this.position.y
      };
      var dragForce = {
        x: dragVelocity.x - this.velocity.x,
        y: dragVelocity.y - this.velocity.y
      };
      this.applyForce(dragForce);
    }
    /**
     * Apply force to emulate mouse wheel
     */

  }, {
    key: "applyScrollForce",
    value: function applyScrollForce() {
      if (!this.isScrolling) {
        return;
      }

      var scrollForce = {
        x: this.scrollOffset.x - this.velocity.x,
        y: this.scrollOffset.y - this.velocity.y
      };
      this.scrollOffset.x = 0;
      this.scrollOffset.y = 0;
      this.applyForce(scrollForce);
    }
    /**
     * Manual position setting
     */

  }, {
    key: "setPosition",
    value: function setPosition(newPosition) {
      if (newPosition === void 0) {
        newPosition = {};
      }

      this.velocity.x = 0;
      this.velocity.y = 0;
      this.position.x = -newPosition.x || 0;
      this.position.y = -newPosition.y || 0;
      this.run();
    }
    /**
     * Get latest metrics and coordinates
     */

  }, {
    key: "getUpdate",
    value: function getUpdate() {
      return {
        isRunning: this.isRunning,
        isDragging: this.isDragging,
        isScrolling: this.isScrolling,
        position: {
          x: -this.position.x,
          y: -this.position.y
        },
        dragOffsetPosition: this.dragOffsetPosition,
        viewport: (0, _extends2.default)({}, this.viewport),
        content: (0, _extends2.default)({}, this.content),
        viewportElement: this.props.viewport,
        contentElement: this.props.content
      };
    }
  }, {
    key: "notify",
    value: function notify() {
      this.props.onUpdate(this.getUpdate());
    }
  }, {
    key: "updateMetrics",
    value: function updateMetrics() {
      if (!this.props.viewport) {
        return;
      }

      this.viewport.width = this.props.viewport.clientWidth;
      this.viewport.height = this.props.viewport.clientHeight;
      this.content.width = getFullWidth(this.props.content);
      this.content.height = getFullHeight(this.props.content);
      this.boundX.from = Math.min(-this.content.width + this.viewport.width, 0);
      this.boundY.from = Math.min(-this.content.height + this.viewport.height, 0);
      this.run();
    }
  }, {
    key: "handleEvents",
    value: function handleEvents() {
      var _this4 = this,
          _context;

      var scroll = {
        x: 0,
        y: 0
      };
      var mousedown = {
        x: 0,
        y: 0
      };
      var isTouch = false;

      var setDragPosition = function setDragPosition(event) {
        var pageX, pageY;

        if (isTouch) {
          pageX = event.touches[0].pageX;
          pageY = event.touches[0].pageY;
        } else {
          pageX = event.pageX;
          pageY = event.pageY;
        }

        _this4.dragOffsetPosition.x = pageX - mousedown.x;
        _this4.dragOffsetPosition.y = pageY - mousedown.y;
        _this4.dragPosition.x = _this4.dragStartPosition.x + _this4.dragOffsetPosition.x;
        _this4.dragPosition.y = _this4.dragStartPosition.y + _this4.dragOffsetPosition.y;

        if (!isTouch) {
          event.preventDefault();
        }
      };

      this.events.pointerdown = function (event) {
        _this4.updateViewport(event.container);

        var pageX, pageY, clientX, clientY;
        isTouch = !!(event.touches && event.touches[0]);

        if (isTouch) {
          pageX = event.touches[0].pageX;
          pageY = event.touches[0].pageY;
          clientX = event.touches[0].clientX;
          clientY = event.touches[0].clientY;
        } else {
          pageX = event.pageX;
          pageY = event.pageY;
          clientX = event.clientX;
          clientY = event.clientY;
        }

        var vp = _this4.props.viewport;
        var rect = vp.getBoundingClientRect(); // click on vertical scrollbar

        if (clientX - rect.left >= vp.clientLeft + vp.clientWidth) {
          return;
        } // click on horizontal scrollbar


        if (clientY - rect.top >= vp.clientTop + vp.clientHeight) {
          return;
        }

        if (!_this4.props.shouldScroll(_this4.getUpdate(), event)) {
          return;
        } // text selection enabled


        if (_this4.textSelection) {
          var clickedNode = textNodeFromPoint(event.target, clientX, clientY);

          if (clickedNode) {
            return;
          } else {
            clearTextSelection();
          }
        }

        _this4.isDragging = true;

        if (scroll.x || scroll.y) {
          _this4.position.x = scroll.x;
          _this4.position.y = scroll.y;
          scroll.x = 0;
          scroll.y = 0;
        }

        mousedown.x = pageX;
        mousedown.y = pageY;
        _this4.dragStartPosition.x = _this4.position.x;
        _this4.dragStartPosition.y = _this4.position.y;
        setDragPosition(event);

        _this4.run();

        var pointerUp, removeEvents;

        removeEvents = function removeEvents(event) {
          _this4.isDragging = false;

          if (isTouch) {
            window.removeEventListener('touchmove', setDragPosition);
            window.removeEventListener('touchend', pointerUp);
          } else {
            window.removeEventListener('mousemove', setDragPosition);
            window.removeEventListener('mouseup', pointerUp);
          }
        };

        if (isTouch) {
          pointerUp = window.addEventListener('touchend', removeEvents);
          window.addEventListener('touchmove', setDragPosition);
        } else {
          pointerUp = window.addEventListener('mouseup', removeEvents);
          window.addEventListener('mousemove', setDragPosition);
        }
      };

      var scrollTimer = null;

      this.events.wheel = function (event) {
        _this4.updateViewport(event.container);

        _this4.velocity.x = 0;

        if (!_this4.isScrollEnabled) {
          return;
        }

        _this4.isScrolling = true;
        _this4.scrollOffset.x = -event.deltaX;
        _this4.scrollOffset.y = -event.deltaY;

        _this4.run();

        clearTimeout(scrollTimer);
        scrollTimer = (0, _setTimeout2.default)(function () {
          return _this4.isScrolling = false;
        }, 80);
        event.preventDefault();
      };

      this.events.scroll = function (event) {
        _this4.updateViewport(event.container);

        var sl = _this4.props.viewport.scrollLeft;
        var st = _this4.props.viewport.scrollTop;

        if (Math.abs(_this4.position.x + sl) > 3) {
          _this4.position.x = -sl;
          _this4.velocity.x = 0;
        }

        if (Math.abs(_this4.position.y + st) > 3) {
          _this4.position.y = -st;
          _this4.velocity.y = 0;
        }

        scroll.x = -_this4.props.viewport.scrollLeft;
        scroll.y = -_this4.props.viewport.scrollTop;
      };

      this.events.click = function (event) {
        _this4.updateViewport(event.container);

        _this4.props.onClick(_this4.getUpdate(), event);
      };

      this.events.resize = (0, _bind.default)(_context = this.updateMetrics).call(_context, this);
      this.addEventListener(this.props.handleMatches, 'mousedown', this.events.pointerdown);
      this.addEventListener(this.props.handleMatches, 'touchstart', this.events.pointerdown);
      this.addEventListener(this.props.handleMatches, 'click', this.events.click);
      this.addEventListener(this.props.viewportMatches, 'wheel', this.events.wheel);
      this.addEventListener(this.props.viewportMatches, 'scroll', this.events.scroll);
      window.addEventListener('resize', this.events.resize);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      (0, _get2.default)((0, _getPrototypeOf2.default)(ScrollBoosterController.prototype), "destroy", this).call(this); // this.props.handle.removeEventListener('mousedown', this.events.pointerdown)
      // this.props.handle.removeEventListener('touchstart', this.events.pointerdown)
      // this.props.handle.removeEventListener('click', this.events.click)
      // this.props.viewport.removeEventListener('wheel', this.events.wheel)
      // this.props.viewport.removeEventListener('scroll', this.events.scroll)

      window.removeEventListener('resize', this.events.resize);
    }
  }]);
  return ScrollBoosterController;
}(_HtmlController2.HtmlController);

exports.ScrollBoosterController = ScrollBoosterController;

function getFullWidth(elem) {
  return Math.max(elem.offsetWidth, elem.scrollWidth);
}

function getFullHeight(elem) {
  return Math.max(elem.offsetHeight, elem.scrollHeight);
}

function textNodeFromPoint(element, x, y) {
  var node;
  var nodes = element.childNodes;
  var range = document.createRange();

  for (var i = 0; node = nodes[i], i < nodes.length; i++) {
    if (node.nodeType !== 3) {
      continue;
    }

    range.selectNodeContents(node);
    var rect = range.getBoundingClientRect();

    if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
      return node;
    }
  }

  return false;
}

function clearTextSelection() {
  var sel = window.getSelection ? window.getSelection() : document.selection;

  if (sel) {
    if (sel.removeAllRanges) {
      sel.removeAllRanges();
    } else if (sel.empty) {
      sel.empty();
    }
  }
}