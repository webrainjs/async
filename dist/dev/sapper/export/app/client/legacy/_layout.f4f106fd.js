import { f as brain, l as logger, g as deepSubscribe, _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, h as _createClass, S as SvelteComponentDev, W as Window, j as appConfig, o as openWebrainWindow, k as _forEachInstanceProperty, m as _Object$keys, p as _indexOfInstanceProperty, q as _sliceInstanceProperty, r as create_slot, t as element, u as create_component, v as claim_element, w as children, x as claim_component, y as detach_dev, z as attr_dev, A as add_location, B as insert_dev, C as mount_component, D as transition_in, E as transition_out, F as destroy_component, G as text, H as space, I as claim_text, J as claim_space, K as append_dev, L as get_slot_context, M as get_slot_changes } from './client.d5c92d1b.js';

var file = "src\\routes\\main\\_layout.svelte"; // (75:1) <Window   title="{appConfig.type === 'prod' ? '' : `${appConfig.appName} v${appConfig.appVersion}`}"   {openWebrainWindow}   minimizeInsteadClose={true}   >

function create_default_slot(ctx) {
  var div2;
  var div0;
  var nav;
  var ul;
  var li;
  var a;
  var span;
  var t0;
  var a_class_value;
  var t1;
  var div1;
  var current;
  var default_slot_template =
  /*$$slots*/
  ctx[1].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[2], null);
  var block = {
    c: function create() {
      div2 = element("div");
      div0 = element("div");
      nav = element("nav");
      ul = element("ul");
      li = element("li");
      a = element("a");
      span = element("span");
      t0 = text("Parser");
      t1 = space();
      div1 = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      nav = claim_element(div0_nodes, "NAV", {
        class: true
      });
      var nav_nodes = children(nav);
      ul = claim_element(nav_nodes, "UL", {
        class: true
      });
      var ul_nodes = children(ul);
      li = claim_element(ul_nodes, "LI", {
        class: true
      });
      var li_nodes = children(li);
      a = claim_element(li_nodes, "A", {
        class: true,
        href: true
      });
      var a_nodes = children(a);
      span = claim_element(a_nodes, "SPAN", {
        class: true
      });
      var span_nodes = children(span);
      t0 = claim_text(span_nodes, "Parser");

      _forEachInstanceProperty(span_nodes).call(span_nodes, detach_dev);

      _forEachInstanceProperty(a_nodes).call(a_nodes, detach_dev);

      _forEachInstanceProperty(li_nodes).call(li_nodes, detach_dev);

      _forEachInstanceProperty(ul_nodes).call(ul_nodes, detach_dev);

      _forEachInstanceProperty(nav_nodes).call(nav_nodes, detach_dev);

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      if (default_slot) default_slot.l(div1_nodes);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(span, "class", "text svelte-17eb6nv");
      add_location(span, file, 85, 8, 2357);
      attr_dev(a, "class", a_class_value = "nav__item " + (
      /*segment*/
      ctx[0] === "parser" ? "nav__item--selected" : "") + " svelte-17eb6nv");
      attr_dev(a, "href", "main/parser");
      add_location(a, file, 84, 7, 2256);
      attr_dev(li, "class", "svelte-17eb6nv");
      add_location(li, file, 83, 6, 2244);
      attr_dev(ul, "class", "nav__list svelte-17eb6nv");
      add_location(ul, file, 82, 5, 2215);
      attr_dev(nav, "class", "nav__content scroll__content svelte-17eb6nv");
      add_location(nav, file, 81, 4, 2167);
      attr_dev(div0, "class", "nav flex__item--fit scroll-horizontal scrollbar--collapsed svelte-17eb6nv");
      add_location(div0, file, 80, 9, 2090);
      attr_dev(div1, "class", "flex__item--fill scroll-vertical svelte-17eb6nv");
      add_location(div1, file, 91, 9, 2455);
      attr_dev(div2, "class", "fill flex flex--vertical svelte-17eb6nv");
      add_location(div2, file, 79, 8, 2042);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div0);
      append_dev(div0, nav);
      append_dev(nav, ul);
      append_dev(ul, li);
      append_dev(li, a);
      append_dev(a, span);
      append_dev(span, t0);
      append_dev(div2, t1);
      append_dev(div2, div1);

      if (default_slot) {
        default_slot.m(div1, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (!current || dirty &
      /*segment*/
      1 && a_class_value !== (a_class_value = "nav__item " + (
      /*segment*/
      ctx[0] === "parser" ? "nav__item--selected" : "") + " svelte-17eb6nv")) {
        attr_dev(a, "class", a_class_value);
      }

      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      4) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[2], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[2], dirty, null));
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div2);
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot.name,
    type: "slot",
    source: "(75:1) <Window   title=\\\"{appConfig.type === 'prod' ? '' : `${appConfig.appName} v${appConfig.appVersion}`}\\\"   {openWebrainWindow}   minimizeInsteadClose={true}   >",
    ctx: ctx
  });
  return block;
}

function create_fragment(ctx) {
  var main;
  var current;
  var window_1 = new Window({
    props: {
      title: appConfig.type === "prod" ? "" : appConfig.appName + " v" + appConfig.appVersion,
      openWebrainWindow: openWebrainWindow,
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
      create_component(window_1.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      main = claim_element(nodes, "MAIN", {
        class: true
      });
      var main_nodes = children(main);
      claim_component(window_1.$$.fragment, main_nodes);

      _forEachInstanceProperty(main_nodes).call(main_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(main, "class", "fill font-base svelte-17eb6nv");
      add_location(main, file, 73, 0, 1846);
    },
    m: function mount(target, anchor) {
      insert_dev(target, main, anchor);
      mount_component(window_1, main, null);
      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];
      var window_1_changes = {};

      if (dirty &
      /*$$scope, segment*/
      5) {
        window_1_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      window_1.$set(window_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(window_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(window_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(main);
      destroy_component(window_1);
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

if (typeof window !== "undefined") {
  // region Tray
  if (window.tray) {
    window.tray.subscribe("click", function (e) {
      if (e.id === "icon") {
        brain.mainWindow.show();
        window.widget.updateState({
          isVisible: true
        });
      }
    });
  } // endregion
  // region logFileName


  logger.handlers.writeToFile.logFileName = "unknown.log";
  deepSubscribe({
    object: brain,
    ruleBuilder: function ruleBuilder(b) {
      return b.p("auth").p("user").p("accountId");
    },
    lastValue: function lastValue(accountId) {
      logger.handlers.writeToFile.logFileName = accountId == null ? "unknown.log" : accountId + ".log";
    }
  });
} // endregion


function instance($$self, $$props, $$invalidate) {
  var _context;

  var segment = $$props.segment;
  var writable_props = ["segment"];

  _forEachInstanceProperty(_context = _Object$keys($$props)).call(_context, function (key) {
    if (!~_indexOfInstanceProperty(writable_props).call(writable_props, key) && _sliceInstanceProperty(key).call(key, 0, 2) !== "$$") console.warn("<Layout> was created with unknown prop '" + key + "'");
  });

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
    if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {
      segment: segment
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("segment" in $$props) $$invalidate(0, segment = $$props.segment);
  };

  return [segment, $$slots, $$scope];
}

var Layout =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Layout, _SvelteComponentDev);

  function Layout(options) {
    var _this;

    _classCallCheck(this, Layout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layout).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {
      segment: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Layout",
      options: options,
      id: create_fragment.name
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
