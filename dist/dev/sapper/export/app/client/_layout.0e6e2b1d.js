import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, f as _createClass, S as SvelteComponentDev, h as _forEachInstanceProperty, j as _Object$keys, k as _indexOfInstanceProperty, l as _sliceInstanceProperty, p as element, D as text, E as space, r as claim_element, t as children, F as claim_text, v as detach_dev, G as claim_space, w as attr_dev, K as null_to_empty, x as add_location, y as insert_dev, H as append_dev, n as noop, L as _someInstanceProperty, M as _bindInstanceProperty, W as Window, N as onMount, O as onDestroy, m as create_slot, q as create_component, u as claim_component, z as mount_component, A as transition_in, B as transition_out, C as destroy_component, P as binding_callbacks, Q as set_style, I as get_slot_context, J as get_slot_changes } from './client.6a27e0ac.js';

var file = "src\\components\\dev\\Nav.svelte";

function create_fragment(ctx) {
  var nav;
  var ul;
  var li0;
  var a0;
  var t0;
  var a0_class_value;
  var t1;
  var li1;
  var a1;
  var t2;
  var a1_class_value;
  var t3;
  var li2;
  var a2;
  var t4;
  var a2_class_value;
  var t5;
  var li3;
  var a3;
  var t6;
  var a3_class_value;
  var t7;
  var li4;
  var a4;
  var t8;
  var a4_class_value;
  var t9;
  var li5;
  var a5;
  var t10;
  var a5_class_value;
  var block = {
    c: function create() {
      nav = element("nav");
      ul = element("ul");
      li0 = element("li");
      a0 = element("a");
      t0 = text("Components");
      t1 = space();
      li1 = element("li");
      a1 = element("a");
      t2 = text("Tests");
      t3 = space();
      li2 = element("li");
      a2 = element("a");
      t4 = text("Status");
      t5 = space();
      li3 = element("li");
      a3 = element("a");
      t6 = text("Validate");
      t7 = space();
      li4 = element("li");
      a4 = element("a");
      t8 = text("Webrain");
      t9 = space();
      li5 = element("li");
      a5 = element("a");
      t10 = text("App Info");
      this.h();
    },
    l: function claim(nodes) {
      nav = claim_element(nodes, "NAV", {
        class: true
      });
      var nav_nodes = children(nav);
      ul = claim_element(nav_nodes, "UL", {
        class: true
      });
      var ul_nodes = children(ul);
      li0 = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li0_nodes = children(li0);
      a0 = claim_element(li0_nodes, "A", {
        class: true,
        href: true
      });
      var a0_nodes = children(a0);
      t0 = claim_text(a0_nodes, "Components");

      _forEachInstanceProperty(a0_nodes).call(a0_nodes, detach_dev);

      _forEachInstanceProperty(li0_nodes).call(li0_nodes, detach_dev);

      t1 = claim_space(ul_nodes);
      li1 = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li1_nodes = children(li1);
      a1 = claim_element(li1_nodes, "A", {
        class: true,
        href: true
      });
      var a1_nodes = children(a1);
      t2 = claim_text(a1_nodes, "Tests");

      _forEachInstanceProperty(a1_nodes).call(a1_nodes, detach_dev);

      _forEachInstanceProperty(li1_nodes).call(li1_nodes, detach_dev);

      t3 = claim_space(ul_nodes);
      li2 = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li2_nodes = children(li2);
      a2 = claim_element(li2_nodes, "A", {
        class: true,
        href: true,
        rel: true
      });
      var a2_nodes = children(a2);
      t4 = claim_text(a2_nodes, "Status");

      _forEachInstanceProperty(a2_nodes).call(a2_nodes, detach_dev);

      _forEachInstanceProperty(li2_nodes).call(li2_nodes, detach_dev);

      t5 = claim_space(ul_nodes);
      li3 = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li3_nodes = children(li3);
      a3 = claim_element(li3_nodes, "A", {
        class: true,
        href: true,
        rel: true
      });
      var a3_nodes = children(a3);
      t6 = claim_text(a3_nodes, "Validate");

      _forEachInstanceProperty(a3_nodes).call(a3_nodes, detach_dev);

      _forEachInstanceProperty(li3_nodes).call(li3_nodes, detach_dev);

      t7 = claim_space(ul_nodes);
      li4 = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li4_nodes = children(li4);
      a4 = claim_element(li4_nodes, "A", {
        class: true,
        href: true,
        rel: true
      });
      var a4_nodes = children(a4);
      t8 = claim_text(a4_nodes, "Webrain");

      _forEachInstanceProperty(a4_nodes).call(a4_nodes, detach_dev);

      _forEachInstanceProperty(li4_nodes).call(li4_nodes, detach_dev);

      t9 = claim_space(ul_nodes);
      li5 = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li5_nodes = children(li5);
      a5 = claim_element(li5_nodes, "A", {
        class: true,
        href: true,
        rel: true
      });
      var a5_nodes = children(a5);
      t10 = claim_text(a5_nodes, "App Info");

      _forEachInstanceProperty(a5_nodes).call(a5_nodes, detach_dev);

      _forEachInstanceProperty(li5_nodes).call(li5_nodes, detach_dev);

      _forEachInstanceProperty(ul_nodes).call(ul_nodes, detach_dev);

      _forEachInstanceProperty(nav_nodes).call(nav_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(a0, "class", a0_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "components" ? "selected" : "") + " svelte-bu277n"));
      attr_dev(a0, "href", "dev/components");
      add_location(a0, file, 6, 6, 58);
      attr_dev(li0, "class", "svelte-bu277n");
      add_location(li0, file, 6, 2, 54);
      attr_dev(a1, "class", a1_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "tests" ? "selected" : "") + " svelte-bu277n"));
      attr_dev(a1, "href", "dev/tests");
      add_location(a1, file, 7, 6, 162);
      attr_dev(li1, "class", "svelte-bu277n");
      add_location(li1, file, 7, 2, 158);
      attr_dev(a2, "class", a2_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "status" ? "selected" : "") + " svelte-bu277n"));
      attr_dev(a2, "href", "dev/status");
      attr_dev(a2, "rel", "prefetch");
      add_location(a2, file, 8, 6, 251);
      attr_dev(li2, "class", "svelte-bu277n");
      add_location(li2, file, 8, 2, 247);
      attr_dev(a3, "class", a3_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "validate" ? "selected" : "") + " svelte-bu277n"));
      attr_dev(a3, "href", "dev/validate");
      attr_dev(a3, "rel", "prefetch");
      add_location(a3, file, 9, 6, 358);
      attr_dev(li3, "class", "svelte-bu277n");
      add_location(li3, file, 9, 2, 354);
      attr_dev(a4, "class", a4_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "webrain" ? "selected" : "") + " svelte-bu277n"));
      attr_dev(a4, "href", "dev/webrain");
      attr_dev(a4, "rel", "prefetch");
      add_location(a4, file, 10, 6, 471);
      attr_dev(li4, "class", "svelte-bu277n");
      add_location(li4, file, 10, 2, 467);
      attr_dev(a5, "class", a5_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "app-info" ? "selected" : "") + " svelte-bu277n"));
      attr_dev(a5, "href", "dev/app-info");
      attr_dev(a5, "rel", "prefetch");
      add_location(a5, file, 11, 6, 581);
      attr_dev(li5, "class", "svelte-bu277n");
      add_location(li5, file, 11, 2, 577);
      attr_dev(ul, "class", "svelte-bu277n");
      add_location(ul, file, 5, 1, 47);
      attr_dev(nav, "class", "svelte-bu277n");
      add_location(nav, file, 4, 0, 40);
    },
    m: function mount(target, anchor) {
      insert_dev(target, nav, anchor);
      append_dev(nav, ul);
      append_dev(ul, li0);
      append_dev(li0, a0);
      append_dev(a0, t0);
      append_dev(ul, t1);
      append_dev(ul, li1);
      append_dev(li1, a1);
      append_dev(a1, t2);
      append_dev(ul, t3);
      append_dev(ul, li2);
      append_dev(li2, a2);
      append_dev(a2, t4);
      append_dev(ul, t5);
      append_dev(ul, li3);
      append_dev(li3, a3);
      append_dev(a3, t6);
      append_dev(ul, t7);
      append_dev(ul, li4);
      append_dev(li4, a4);
      append_dev(a4, t8);
      append_dev(ul, t9);
      append_dev(ul, li5);
      append_dev(li5, a5);
      append_dev(a5, t10);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (dirty &
      /*segment*/
      1 && a0_class_value !== (a0_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "components" ? "selected" : "") + " svelte-bu277n"))) {
        attr_dev(a0, "class", a0_class_value);
      }

      if (dirty &
      /*segment*/
      1 && a1_class_value !== (a1_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "tests" ? "selected" : "") + " svelte-bu277n"))) {
        attr_dev(a1, "class", a1_class_value);
      }

      if (dirty &
      /*segment*/
      1 && a2_class_value !== (a2_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "status" ? "selected" : "") + " svelte-bu277n"))) {
        attr_dev(a2, "class", a2_class_value);
      }

      if (dirty &
      /*segment*/
      1 && a3_class_value !== (a3_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "validate" ? "selected" : "") + " svelte-bu277n"))) {
        attr_dev(a3, "class", a3_class_value);
      }

      if (dirty &
      /*segment*/
      1 && a4_class_value !== (a4_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "webrain" ? "selected" : "") + " svelte-bu277n"))) {
        attr_dev(a4, "class", a4_class_value);
      }

      if (dirty &
      /*segment*/
      1 && a5_class_value !== (a5_class_value = "" + (null_to_empty(
      /*segment*/
      ctx[0] === "app-info" ? "selected" : "") + " svelte-bu277n"))) {
        attr_dev(a5, "class", a5_class_value);
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(nav);
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

function instance($$self, $$props, $$invalidate) {
  var _context;

  var segment = $$props.segment;
  var writable_props = ["segment"];

  _forEachInstanceProperty(_context = _Object$keys($$props)).call(_context, function (key) {
    if (!~_indexOfInstanceProperty(writable_props).call(writable_props, key) && _sliceInstanceProperty(key).call(key, 0, 2) !== "$$") console.warn("<Nav> was created with unknown prop '" + key + "'");
  });

  $$self.$set = function ($$props) {
    if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
  };

  $$self.$capture_state = function () {
    return {
      segment: segment
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
  };

  return [segment];
}

var Nav =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Nav, _SvelteComponentDev);

  function Nav(options) {
    var _this;

    _classCallCheck(this, Nav);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Nav).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
      segment: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Nav",
      options: options,
      id: create_fragment.name
    });
    var ctx = _this.$$.ctx;
    var props = options.props || {};

    if (
    /*segment*/
    ctx[0] === undefined && !("segment" in props)) {
      console.warn("<Nav> was created without expected prop 'segment'");
    }

    return _this;
  }

  _createClass(Nav, [{
    key: "segment",
    get: function get() {
      throw new Error("<Nav>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Nav>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return Nav;
}(SvelteComponentDev);

function createHtmlElementMatches(_ref) {
  var tagNames = _ref.tagNames,
      classNames = _ref.classNames,
      selector = _ref.selector;
  return function (element) {
    if (tagNames) {
      if (typeof tagNames === 'string') {
        if (element.nodeName === tagNames) {
          return true;
        }
      } else if (_indexOfInstanceProperty(tagNames).call(tagNames, element.nodeName) >= 0) {
        return true;
      }
    }

    if (classNames) {
      if (typeof classNames === 'string') {
        if (element.classList.contains(classNames)) {
          return true;
        }
      } else if (_someInstanceProperty(classNames).call(classNames, function (className) {
        return element.classList.contains(className);
      })) {
        return true;
      }
    }

    if (selector && element.matches(selector)) {
      return true;
    }

    return false;
  };
}
function getPatentElement(element, matchesFunc) {
  while (element && !matchesFunc(element)) {
    element = element.parentElement;
  }

  return element;
}

var HtmlController =
/*#__PURE__*/
function () {
  function HtmlController(container) {
    _classCallCheck(this, HtmlController);

    this._unsubscribers = [];
    this._container = container;
  }

  _createClass(HtmlController, [{
    key: "addEventListener",
    value: function addEventListener(containerMatches, eventName, handler) {
      var _this = this;

      for (var _len = arguments.length, options = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
        options[_key - 3] = arguments[_key];
      }

      var self = this;

      var _handler = function _handler() {
        var container;

        if (containerMatches) {
          container = getPatentElement(arguments[0].target, containerMatches);

          if (!container) {
            return;
          }

          arguments[0].container = container;
        } else {
          arguments[0].container = container = self._container;
        }

        return handler.apply(container, arguments);
      };

      this._container.addEventListener(eventName, _handler, options);

      this._unsubscribers.push(function () {
        _this._container.removeEventListener(eventName, _handler, options);
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      var _unsubscribers = this._unsubscribers;

      for (var i = 0, len = _unsubscribers.length; i < len; i++) {
        _unsubscribers[i]();
      }

      this._unsubscribers.length = 0;
    }
  }]);

  return HtmlController;
}(); // this._container.addEventListener('click', function (event) {
// 	if (event.target.nodeName === 'BUTTON'
// 		|| event.target.nodeName === 'A'
// 		|| event.target.classList.contains('js-sound-click')
// 	) {
// 		sounds.click.play()
// 	}
// })

var ScrollDragController =
/*#__PURE__*/
function (_HtmlController) {
  _inherits(ScrollDragController, _HtmlController);

  function ScrollDragController(_ref) {
    var _context, _context2, _context3, _context4;

    var _this;

    var container = _ref.container,
        scrollMatches = _ref.scrollMatches,
        noDragMatches = _ref.noDragMatches,
        _ref$throttlePixels = _ref.throttlePixels,
        throttlePixels = _ref$throttlePixels === void 0 ? 5 : _ref$throttlePixels;

    _classCallCheck(this, ScrollDragController);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ScrollDragController).call(this, container));
    _this._throttlePixels = throttlePixels;
    _this._scrollMatches = scrollMatches;
    _this._noDragMatches = noDragMatches;

    _this.addEventListener(scrollMatches, 'mousedown', _bindInstanceProperty(_context = _this.mousedown).call(_context, _assertThisInitialized(_this)));

    _this.addEventListener(scrollMatches, 'mousemove', _bindInstanceProperty(_context2 = _this.mousemove).call(_context2, _assertThisInitialized(_this)));

    _this.addEventListener(null, 'mouseup', _bindInstanceProperty(_context3 = _this.mouseup).call(_context3, _assertThisInitialized(_this)));

    _this.addEventListener(null, 'click', _bindInstanceProperty(_context4 = _this.click).call(_context4, _assertThisInitialized(_this)));

    return _this;
  }

  _createClass(ScrollDragController, [{
    key: "mousedown",
    value: function mousedown(event) {
      var scroll = event.container;

      if (scroll && (!this._noDragMatches || !this._noDragMatches(event.target) || document.elementFromPoint(event.pageX, event.pageY) === scroll)) {
        this._pushed = 1;
        this._moved = false;
        this._lastClientX = event.clientX;
        this._lastClientY = event.clientY; // event.preventDefault()
      }
    }
  }, {
    key: "mouseup",
    value: function mouseup(event) {
      this._pushed = 0;

      if (this._moved) {
        event.preventDefault();
      }
    }
  }, {
    key: "click",
    value: function click(event) {
      if (this._moved) {
        event.preventDefault();
        this._moved = false;
      }
    }
  }, {
    key: "mousemove",
    value: function mousemove(event) {
      var scroll = event.container;

      if (scroll && this._pushed && (Math.abs(this._lastClientX - event.clientX) > this._throttlePixels || Math.abs(this._lastClientY - event.clientY) > this._throttlePixels)) {
        this._moved = true;
        (this._scroller = scroll._scroller || scroll).scrollLeft -= this._newScrollX = -this._lastClientX + (this._lastClientX = event.clientX);
        this._scroller.scrollTop -= this._newScrollY = -this._lastClientY + (this._lastClientY = event.clientY);

        if (scroll === document.body) {
          (this._scroller = document.documentElement).scrollLeft -= this._newScrollX;
          this._scroller.scrollTop -= this._newScrollY;
        }
      }
    }
  }]);

  return ScrollDragController;
}(HtmlController);

var file$1 = "src\\routes\\dev\\_layout.svelte"; // (31:1) <Window   title="Dev"   minimizeInsteadClose={true}   >

function create_default_slot(ctx) {
  var div3;
  var div1;
  var div0;
  var t;
  var div2;
  var current;
  var nav = new Nav({
    props: {
      segment:
      /*segment*/
      ctx[0]
    },
    $$inline: true
  });
  var default_slot_template =
  /*$$slots*/
  ctx[3].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[5], null);
  var block = {
    c: function create() {
      div3 = element("div");
      div1 = element("div");
      div0 = element("div");
      create_component(nav.$$.fragment);
      t = space();
      div2 = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div3 = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      var div3_nodes = children(div3);
      div1 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      claim_component(nav.$$.fragment, div0_nodes);

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      t = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      if (default_slot) default_slot.l(div2_nodes);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      _forEachInstanceProperty(div3_nodes).call(div3_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "scroll__content");
      add_location(div0, file$1, 36, 4, 1079);
      attr_dev(div1, "class", "nav flex__item--fit scroll-horizontal scrollbar--collapsed svelte-1tcadv2");
      add_location(div1, file$1, 35, 9, 1002);
      attr_dev(div2, "class", "flex__item--fill scroll-vertical");
      add_location(div2, file$1, 40, 9, 1162);
      attr_dev(div3, "class", "fill flex flex--vertical");
      set_style(div3, "background", "white");
      add_location(div3, file$1, 34, 8, 927);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div3, anchor);
      append_dev(div3, div1);
      append_dev(div1, div0);
      mount_component(nav, div0, null);
      append_dev(div3, t);
      append_dev(div3, div2);

      if (default_slot) {
        default_slot.m(div2, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      var nav_changes = {};
      if (dirty &
      /*segment*/
      1) nav_changes.segment =
      /*segment*/
      ctx[0];
      nav.$set(nav_changes);

      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      32) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[5], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[5], dirty, null));
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(nav.$$.fragment, local);
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(nav.$$.fragment, local);
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div3);
      destroy_component(nav);
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot.name,
    type: "slot",
    source: "(31:1) <Window   title=\\\"Dev\\\"   minimizeInsteadClose={true}   >",
    ctx: ctx
  });
  return block;
}

function create_fragment$1(ctx) {
  var main;
  var current;
  var window = new Window({
    props: {
      title: "Dev",
      minimizeInsteadClose: true,
      $$slots: {
        default: [create_default_slot]
      },
      $$scope: {
        ctx: ctx
      }
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      main = element("main");
      create_component(window.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      main = claim_element(nodes, "MAIN", {
        class: true
      });
      var main_nodes = children(main);
      claim_component(window.$$.fragment, main_nodes);

      _forEachInstanceProperty(main_nodes).call(main_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(main, "class", "fill svelte-1tcadv2");
      add_location(main, file$1, 29, 0, 818);
    },
    m: function mount(target, anchor) {
      insert_dev(target, main, anchor);
      mount_component(window, main, null);
      /*main_binding*/

      ctx[4](main);
      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];
      var window_changes = {};

      if (dirty &
      /*$$scope, segment*/
      33) {
        window_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      window.$set(window_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(window.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(window.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(main);
      destroy_component(window);
      /*main_binding*/

      ctx[4](null);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$1($$self, $$props, $$invalidate) {
  var _context;

  var segment = $$props.segment;
  var container;
  var scrollDragController;
  onMount(function () {
    scrollDragController = new ScrollDragController({
      container: container,
      scrollMatches: createHtmlElementMatches({
        classNames: "js-scroll-drag"
      }),
      noDragMatches: createHtmlElementMatches({
        tagNames: "SELECT",
        classNames: "js-scroll-nodrag"
      }),
      throttlePixels: 5
    });
  });
  onDestroy(function () {
    return scrollDragController && scrollDragController.destroy();
  });
  var writable_props = ["segment"];

  _forEachInstanceProperty(_context = _Object$keys($$props)).call(_context, function (key) {
    if (!~_indexOfInstanceProperty(writable_props).call(writable_props, key) && _sliceInstanceProperty(key).call(key, 0, 2) !== "$$") console.warn("<Layout> was created with unknown prop '" + key + "'");
  });

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function main_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(1, container = $$value);
    });
  }

  $$self.$set = function ($$props) {
    if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
    if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {
      segment: segment,
      container: container,
      scrollDragController: scrollDragController
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
    if ("container" in $$props) $$invalidate(1, container = $$props.container);
    if ("scrollDragController" in $$props) scrollDragController = $$props.scrollDragController;
  };

  return [segment, container, scrollDragController, $$slots, main_binding, $$scope];
}

var Layout =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Layout, _SvelteComponentDev);

  function Layout(options) {
    var _this;

    _classCallCheck(this, Layout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layout).call(this, options));
    init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, {
      segment: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Layout",
      options: options,
      id: create_fragment$1.name
    });
    var ctx = _this.$$.ctx;
    var props = options.props || {};

    if (
    /*segment*/
    ctx[0] === undefined && !("segment" in props)) {
      console.warn("<Layout> was created without expected prop 'segment'");
    }

    return _this;
  }

  _createClass(Layout, [{
    key: "segment",
    get: function get() {
      throw new Error("<Layout>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Layout>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return Layout;
}(SvelteComponentDev);

export default Layout;
