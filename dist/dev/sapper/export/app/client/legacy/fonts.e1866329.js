import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, a2 as _sortInstanceProperty, N as onMount, l as _sliceInstanceProperty, p as element, D as text, E as space, r as claim_element, t as children, F as claim_text, h as _forEachInstanceProperty, v as detach_dev, G as claim_space, w as attr_dev, x as add_location, y as insert_dev, H as append_dev, n as noop, a3 as listen_dev, $ as destroy_each, a4 as _JSON$stringify, a5 as _filterInstanceProperty, a6 as _mapInstanceProperty, a7 as _Array$from, a8 as _trimInstanceProperty, P as binding_callbacks } from './client.1f341216.js';

var file = "src\\routes\\dev\\components\\small\\fonts.svelte";

function get_each_context(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[5] = list[i];
  return child_ctx;
} // (41:2) {#each fonts as font}


function create_each_block(ctx) {
  var tr;
  var td0;
  var span0;
  var t0;
  var t1_value =
  /*font*/
  ctx[5] + "";
  var t1;
  var t2;
  var td1;
  var span1;
  var t3;
  var span1_class_value;
  var t4;
  var block = {
    c: function create() {
      tr = element("tr");
      td0 = element("td");
      span0 = element("span");
      t0 = text("font-");
      t1 = text(t1_value);
      t2 = space();
      td1 = element("td");
      span1 = element("span");
      t3 = text(
      /*exampleText*/
      ctx[1]);
      t4 = space();
      this.h();
    },
    l: function claim(nodes) {
      tr = claim_element(nodes, "TR", {
        class: true
      });
      var tr_nodes = children(tr);
      td0 = claim_element(tr_nodes, "TD", {
        class: true
      });
      var td0_nodes = children(td0);
      span0 = claim_element(td0_nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      t0 = claim_text(span0_nodes, "font-");

      _forEachInstanceProperty(span0_nodes).call(span0_nodes, detach_dev);

      t1 = claim_text(td0_nodes, t1_value);

      _forEachInstanceProperty(td0_nodes).call(td0_nodes, detach_dev);

      t2 = claim_space(tr_nodes);
      td1 = claim_element(tr_nodes, "TD", {
        class: true
      });
      var td1_nodes = children(td1);
      span1 = claim_element(td1_nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t3 = claim_text(span1_nodes,
      /*exampleText*/
      ctx[1]);

      _forEachInstanceProperty(span1_nodes).call(span1_nodes, detach_dev);

      _forEachInstanceProperty(td1_nodes).call(td1_nodes, detach_dev);

      t4 = claim_space(tr_nodes);

      _forEachInstanceProperty(tr_nodes).call(tr_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(span0, "class", "fonts__prefix svelte-g9cgun");
      add_location(span0, file, 43, 5, 1143);
      attr_dev(td0, "class", "fonts__cell fonts__name table-layout__cell svelte-g9cgun");
      add_location(td0, file, 42, 4, 1082);
      attr_dev(span1, "class", span1_class_value = "font-" +
      /*font*/
      ctx[5] + " svelte-g9cgun");
      add_location(span1, file, 46, 5, 1253);
      attr_dev(td1, "class", "fonts__cell table-layout__cell svelte-g9cgun");
      add_location(td1, file, 45, 4, 1204);
      attr_dev(tr, "class", "table-layout__row svelte-g9cgun");
      add_location(tr, file, 41, 3, 1047);
    },
    m: function mount(target, anchor) {
      insert_dev(target, tr, anchor);
      append_dev(tr, td0);
      append_dev(td0, span0);
      append_dev(span0, t0);
      append_dev(td0, t1);
      append_dev(tr, t2);
      append_dev(tr, td1);
      append_dev(td1, span1);
      append_dev(span1, t3);
      append_dev(tr, t4);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(tr);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block.name,
    type: "each",
    source: "(41:2) {#each fonts as font}",
    ctx: ctx
  });
  return block;
}

function create_fragment(ctx) {
  var div;
  var table;
  var dispose;
  var each_value =
  /*fonts*/
  ctx[2];
  var each_blocks = [];

  for (var i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  var block = {
    c: function create() {
      div = element("div");
      table = element("table");

      for (var _i = 0; _i < each_blocks.length; _i += 1) {
        each_blocks[_i].c();
      }

      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      table = claim_element(div_nodes, "TABLE", {
        class: true
      });
      var table_nodes = children(table);

      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
        each_blocks[_i2].l(table_nodes);
      }

      _forEachInstanceProperty(table_nodes).call(table_nodes, detach_dev);

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(table, "class", "fonts table-layout svelte-g9cgun");
      add_location(table, file, 39, 1, 985);
      attr_dev(div, "class", "container flex flex--vertical svelte-g9cgun");
      add_location(div, file, 38, 0, 890);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, table);

      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].m(table, null);
      }
      /*div_binding*/


      ctx[4](div);
      dispose = listen_dev(div, "mouseover",
      /*setTitle*/
      ctx[3], false, false, false);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (dirty &
      /*fonts, exampleText*/
      6) {
        each_value =
        /*fonts*/
        ctx[2];

        var _i4;

        for (_i4 = 0; _i4 < each_value.length; _i4 += 1) {
          var child_ctx = get_each_context(ctx, each_value, _i4);

          if (each_blocks[_i4]) {
            each_blocks[_i4].p(child_ctx, dirty);
          } else {
            each_blocks[_i4] = create_each_block(child_ctx);

            each_blocks[_i4].c();

            each_blocks[_i4].m(table, null);
          }
        }

        for (; _i4 < each_blocks.length; _i4 += 1) {
          each_blocks[_i4].d(1);
        }

        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      destroy_each(each_blocks, detaching);
      /*div_binding*/

      ctx[4](null);
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

function instance($$self, $$props, $$invalidate) {
  var _context;

  var container;
  var exampleText = "example Text 137";

  var fonts = _sortInstanceProperty(_context = ["default"]).call(_context);

  var setTitle = function setTitle(e) {
    var _context2, _context3;

    var target = e.target || e.srcElement;
    var style = getComputedStyle(target);
    target.title = _JSON$stringify({
      text: target.childNodes.length && _filterInstanceProperty(_context2 = _mapInstanceProperty(_context3 = _Array$from(target.childNodes)).call(_context3, function (o) {
        var _context4;

        return o.nodeName === "#text" ? _trimInstanceProperty(_context4 = o.nodeValue).call(_context4) : "";
      })).call(_context2, function (o) {
        return o;
      }).join(" ").substring(0, 20),
      fontFamily: style.fontFamily,
      fontSize: style.fontSize,
      color: style.color,
      letterSpacing: style.letterSpacing,
      fontWeight: style.fontWeight,
      textDecoration: style.textDecoration
    }, null, 4);
  }; // helper:


  onMount(function () {}); // window.addEventListener('mouseover', listener, false)
  // onDestroy(() => {
  // 	window.removeEventListener('mouseover', listener, false)
  // })

  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(0, container = $$value);
    });
  }

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("container" in $$props) $$invalidate(0, container = $$props.container);
    if ("exampleText" in $$props) $$invalidate(1, exampleText = $$props.exampleText);
  };

  return [container, exampleText, fonts, setTitle, div_binding];
}

var Fonts =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Fonts, _SvelteComponentDev);

  function Fonts(options) {
    var _this;

    _classCallCheck(this, Fonts);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Fonts).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Fonts",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Fonts;
}(SvelteComponentDev);

export default Fonts;
