import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, H as space, t as element, G as text, X as query_selector_all, k as _forEachInstanceProperty, y as detach_dev, J as claim_space, v as claim_element, w as children, I as claim_text, A as add_location, z as attr_dev, B as insert_dev, K as append_dev, a7 as listen_dev, n as noop, ae as _asyncToGenerator, af as _regeneratorRuntime, a9 as _filterInstanceProperty, aa as _mapInstanceProperty, ai as _someInstanceProperty, a0 as set_data_dev, a8 as _JSON$stringify, a3 as destroy_each, q as _sliceInstanceProperty, aj as empty } from './client.d5c92d1b.js';
import { b as browserDebug } from './index.122070be.js';

var file = "src\\routes\\dev\\validate.svelte";

function get_each_context_1(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[8] = list[i];
  return child_ctx;
}

function get_each_context(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[5] = list[i];
  return child_ctx;
} // (13:0) {:else}


function create_else_block(ctx) {
  var div;
  var t0;
  var t1;
  var t2;
  var t3;
  var each_1_anchor;
  var if_block =
  /*withErrors*/
  ctx[1].length && create_if_block_2(ctx);
  var each_value =
  /*withErrors*/
  ctx[1];
  var each_blocks = [];

  for (var i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  var block = {
    c: function create() {
      div = element("div");
      t0 = text(
      /*total*/
      ctx[0]);
      t1 = text(" resources is OK.");
      t2 = space();
      if (if_block) if_block.c();
      t3 = space();

      for (var _i = 0; _i < each_blocks.length; _i += 1) {
        each_blocks[_i].c();
      }

      each_1_anchor = empty();
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      t0 = claim_text(div_nodes,
      /*total*/
      ctx[0]);
      t1 = claim_text(div_nodes, " resources is OK.");

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      t2 = claim_space(nodes);
      if (if_block) if_block.l(nodes);
      t3 = claim_space(nodes);

      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
        each_blocks[_i2].l(nodes);
      }

      each_1_anchor = empty();
      this.h();
    },
    h: function hydrate() {
      add_location(div, file, 13, 4, 266);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, t0);
      append_dev(div, t1);
      insert_dev(target, t2, anchor);
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, t3, anchor);

      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*total*/
      1) set_data_dev(t0,
      /*total*/
      ctx[0]);

      if (
      /*withErrors*/
      ctx[1].length) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block_2(ctx);
          if_block.c();
          if_block.m(t3.parentNode, t3);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }

      if (dirty &
      /*withErrors, JSON*/
      2) {
        each_value =
        /*withErrors*/
        ctx[1];

        var _i4;

        for (_i4 = 0; _i4 < each_value.length; _i4 += 1) {
          var child_ctx = get_each_context(ctx, each_value, _i4);

          if (each_blocks[_i4]) {
            each_blocks[_i4].p(child_ctx, dirty);
          } else {
            each_blocks[_i4] = create_each_block(child_ctx);

            each_blocks[_i4].c();

            each_blocks[_i4].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        for (; _i4 < each_blocks.length; _i4 += 1) {
          each_blocks[_i4].d(1);
        }

        each_blocks.length = each_value.length;
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      if (detaching) detach_dev(t2);
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(t3);
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_else_block.name,
    type: "else",
    source: "(13:0) {:else}",
    ctx: ctx
  });
  return block;
} // (11:20) 


function create_if_block_1(ctx) {
  var div;
  var t;
  var block = {
    c: function create() {
      div = element("div");
      t = text(
      /*loadError*/
      ctx[3]);
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      t = claim_text(div_nodes,
      /*loadError*/
      ctx[3]);

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      add_location(div, file, 11, 4, 231);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, t);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*loadError*/
      8) set_data_dev(t,
      /*loadError*/
      ctx[3]);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_1.name,
    type: "if",
    source: "(11:20) ",
    ctx: ctx
  });
  return block;
} // (9:0) {#if loading}


function create_if_block(ctx) {
  var div;
  var t;
  var block = {
    c: function create() {
      div = element("div");
      t = text("...loading");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      t = claim_text(div_nodes, "...loading");

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      add_location(div, file, 9, 4, 184);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, t);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block.name,
    type: "if",
    source: "(9:0) {#if loading}",
    ctx: ctx
  });
  return block;
} // (15:4) {#if withErrors.length}


function create_if_block_2(ctx) {
  var div;
  var t0_value =
  /*withErrors*/
  ctx[1].length + "";
  var t0;
  var t1;
  var block = {
    c: function create() {
      div = element("div");
      t0 = text(t0_value);
      t1 = text(" resources with errors.");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {});
      var div_nodes = children(div);
      t0 = claim_text(div_nodes, t0_value);
      t1 = claim_text(div_nodes, " resources with errors.");

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      add_location(div, file, 15, 8, 338);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, t0);
      append_dev(div, t1);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*withErrors*/
      2 && t0_value !== (t0_value =
      /*withErrors*/
      ctx[1].length + "")) set_data_dev(t0, t0_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_2.name,
    type: "if",
    source: "(15:4) {#if withErrors.length}",
    ctx: ctx
  });
  return block;
} // (27:16) {#each resource.content.split('\n') as line}


function create_each_block_1(ctx) {
  var code;
  var t_value =
  /*line*/
  ctx[8] + "";
  var t;
  var br;
  var block = {
    c: function create() {
      code = element("code");
      t = text(t_value);
      br = element("br");
      this.h();
    },
    l: function claim(nodes) {
      code = claim_element(nodes, "CODE", {
        class: true
      });
      var code_nodes = children(code);
      t = claim_text(code_nodes, t_value);

      _forEachInstanceProperty(code_nodes).call(code_nodes, detach_dev);

      br = claim_element(nodes, "BR", {});
      this.h();
    },
    h: function hydrate() {
      attr_dev(code, "class", "svelte-ake4fw");
      add_location(code, file, 27, 20, 862);
      add_location(br, file, 27, 39, 881);
    },
    m: function mount(target, anchor) {
      insert_dev(target, code, anchor);
      append_dev(code, t);
      insert_dev(target, br, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*withErrors*/
      2 && t_value !== (t_value =
      /*line*/
      ctx[8] + "")) set_data_dev(t, t_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(code);
      if (detaching) detach_dev(br);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_1.name,
    type: "each",
    source: "(27:16) {#each resource.content.split('\\n') as line}",
    ctx: ctx
  });
  return block;
} // (18:4) {#each withErrors as resource}


function create_each_block(ctx) {
  var div2;
  var div0;
  var t0;
  var t1_value =
  /*resource*/
  ctx[5].initiator + "";
  var t1;
  var t2;
  var a;
  var t3_value =
  /*resource*/
  ctx[5].url + "";
  var t3;
  var a_href_value;
  var t4;
  var div1;
  var t5_value = (
  /*resource*/
  ctx[5].error || _JSON$stringify(
  /*resource*/
  ctx[5].w3c, null, 4)) + "";
  var t5;
  var t6;
  var pre;
  var t7;
  var each_value_1 =
  /*resource*/
  ctx[5].content.split("\n");
  var each_blocks = [];

  for (var i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }

  var block = {
    c: function create() {
      div2 = element("div");
      div0 = element("div");
      t0 = text("From ");
      t1 = text(t1_value);
      t2 = text(": ");
      a = element("a");
      t3 = text(t3_value);
      t4 = space();
      div1 = element("div");
      t5 = text(t5_value);
      t6 = space();
      pre = element("pre");

      for (var _i5 = 0; _i5 < each_blocks.length; _i5 += 1) {
        each_blocks[_i5].c();
      }

      t7 = space();
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
      t0 = claim_text(div0_nodes, "From ");
      t1 = claim_text(div0_nodes, t1_value);
      t2 = claim_text(div0_nodes, ": ");
      a = claim_element(div0_nodes, "A", {
        href: true,
        target: true
      });
      var a_nodes = children(a);
      t3 = claim_text(a_nodes, t3_value);

      _forEachInstanceProperty(a_nodes).call(a_nodes, detach_dev);

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      t4 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t5 = claim_text(div1_nodes, t5_value);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      t6 = claim_space(div2_nodes);
      pre = claim_element(div2_nodes, "PRE", {
        class: true
      });
      var pre_nodes = children(pre);

      for (var _i6 = 0; _i6 < each_blocks.length; _i6 += 1) {
        each_blocks[_i6].l(pre_nodes);
      }

      _forEachInstanceProperty(pre_nodes).call(pre_nodes, detach_dev);

      t7 = claim_space(div2_nodes);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(a, "href", a_href_value =
      /*resource*/
      ctx[5].url);
      attr_dev(a, "target", "_blank");
      add_location(a, file, 20, 43, 544);
      attr_dev(div0, "class", "header svelte-ake4fw");
      add_location(div0, file, 19, 12, 480);
      attr_dev(div1, "class", "errors svelte-ake4fw");
      add_location(div1, file, 22, 12, 633);
      attr_dev(pre, "class", "content svelte-ake4fw");
      add_location(pre, file, 25, 12, 759);
      attr_dev(div2, "class", "resource");
      add_location(div2, file, 18, 8, 445);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div0);
      append_dev(div0, t0);
      append_dev(div0, t1);
      append_dev(div0, t2);
      append_dev(div0, a);
      append_dev(a, t3);
      append_dev(div2, t4);
      append_dev(div2, div1);
      append_dev(div1, t5);
      append_dev(div2, t6);
      append_dev(div2, pre);

      for (var _i7 = 0; _i7 < each_blocks.length; _i7 += 1) {
        each_blocks[_i7].m(pre, null);
      }

      append_dev(div2, t7);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*withErrors*/
      2 && t1_value !== (t1_value =
      /*resource*/
      ctx[5].initiator + "")) set_data_dev(t1, t1_value);
      if (dirty &
      /*withErrors*/
      2 && t3_value !== (t3_value =
      /*resource*/
      ctx[5].url + "")) set_data_dev(t3, t3_value);

      if (dirty &
      /*withErrors*/
      2 && a_href_value !== (a_href_value =
      /*resource*/
      ctx[5].url)) {
        attr_dev(a, "href", a_href_value);
      }

      if (dirty &
      /*withErrors*/
      2 && t5_value !== (t5_value = (
      /*resource*/
      ctx[5].error || _JSON$stringify(
      /*resource*/
      ctx[5].w3c, null, 4)) + "")) set_data_dev(t5, t5_value);

      if (dirty &
      /*withErrors*/
      2) {
        each_value_1 =
        /*resource*/
        ctx[5].content.split("\n");

        var _i8;

        for (_i8 = 0; _i8 < each_value_1.length; _i8 += 1) {
          var child_ctx = get_each_context_1(ctx, each_value_1, _i8);

          if (each_blocks[_i8]) {
            each_blocks[_i8].p(child_ctx, dirty);
          } else {
            each_blocks[_i8] = create_each_block_1(child_ctx);

            each_blocks[_i8].c();

            each_blocks[_i8].m(pre, null);
          }
        }

        for (; _i8 < each_blocks.length; _i8 += 1) {
          each_blocks[_i8].d(1);
        }

        each_blocks.length = each_value_1.length;
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div2);
      destroy_each(each_blocks, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block.name,
    type: "each",
    source: "(18:4) {#each withErrors as resource}",
    ctx: ctx
  });
  return block;
}

function create_fragment(ctx) {
  var t0;
  var button;
  var t1;
  var t2;
  var h3;
  var t3;
  var t4;
  var div;
  var dispose;

  function select_block_type(ctx, dirty) {
    if (
    /*loading*/
    ctx[2]) return create_if_block;
    if (
    /*loadError*/
    ctx[3]) return create_if_block_1;
    return create_else_block;
  }

  var current_block_type = select_block_type(ctx);
  var if_block = current_block_type(ctx);
  var block = {
    c: function create() {
      t0 = space();
      button = element("button");
      t1 = text("Validate all site resources");
      t2 = space();
      h3 = element("h3");
      t3 = text("Report:");
      t4 = space();
      div = element("div");
      if_block.c();
      this.h();
    },
    l: function claim(nodes) {
      var head_nodes = query_selector_all("[data-svelte=\"svelte-1u93dev\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      button = claim_element(nodes, "BUTTON", {});
      var button_nodes = children(button);
      t1 = claim_text(button_nodes, "Validate all site resources");

      _forEachInstanceProperty(button_nodes).call(button_nodes, detach_dev);

      t2 = claim_space(nodes);
      h3 = claim_element(nodes, "H3", {});
      var h3_nodes = children(h3);
      t3 = claim_text(h3_nodes, "Report:");

      _forEachInstanceProperty(h3_nodes).call(h3_nodes, detach_dev);

      t4 = claim_space(nodes);
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);
      if_block.l(div_nodes);

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      document.title = "Validate page";
      add_location(button, file, 4, 0, 60);
      add_location(h3, file, 6, 0, 128);
      attr_dev(div, "class", "report");
      add_location(div, file, 7, 0, 145);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, button, anchor);
      append_dev(button, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, h3, anchor);
      append_dev(h3, t3);
      insert_dev(target, t4, anchor);
      insert_dev(target, div, anchor);
      if_block.m(div, null);
      dispose = listen_dev(button, "click",
      /*validate*/
      ctx[4], false, false, false);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);

        if (if_block) {
          if_block.c();
          if_block.m(div, null);
        }
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(button);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(h3);
      if (detaching) detach_dev(t4);
      if (detaching) detach_dev(div);
      if_block.d();
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
  var total = 0;
  var withErrors = "";
  var loading = false;
  var loadError = "";

  function validate() {
    return _validate.apply(this, arguments);
  }

  function _validate() {
    _validate = _asyncToGenerator(
    /*#__PURE__*/
    _regeneratorRuntime.mark(function _callee() {
      var _context, _context2, filters, report;

      return _regeneratorRuntime.wrap(function _callee$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!loading) {
                _context5.next = 2;
                break;
              }

              return _context5.abrupt("return");

            case 2:
              _context5.prev = 2;
              $$invalidate(2, loading = true);
              $$invalidate(3, loadError = null);
              filters = [/Bad value “prefetch” for attribute “rel”/, /Consider adding a “lang” attribute/, /overflow-clip-box|padding-block-end|padding-block-start|padding-inline-end|padding-inline-start/];
              _context5.next = 8;
              return browserDebug.validateAll("\\.(css|html?|svg)([?#]|$)");

            case 8:
              report = _context5.sent;
              $$invalidate(1, withErrors = _filterInstanceProperty(_context = _mapInstanceProperty(_context2 = report.withErrors).call(_context2, function (resource) {
                var _context3, _context4;

                if (resource.error) {
                  return resource;
                }

                if (!resource.w3c) {
                  resource.error = "report resource w3c field is empty null";
                  return resource;
                }

                resource.w3c.error = _filterInstanceProperty(_context3 = resource.w3c.error || []).call(_context3, function (o) {
                  if (o.message && _someInstanceProperty(filters).call(filters, function (filter) {
                    return o.message.match(filter);
                  })) {
                    return false;
                  }

                  return true;
                });
                resource.w3c.warning = _filterInstanceProperty(_context4 = resource.w3c.error || []).call(_context4, function (o) {
                  if (o.message && _someInstanceProperty(filters).call(filters, function (filter) {
                    return o.message.match(filter);
                  })) {
                    return false;
                  }

                  return true;
                });
                return resource;
              })).call(_context, function (o) {
                return o.error || !o.w3c || o.w3c.error && o.w3c.error.length || o.w3c.warning && o.w3c.warning.length;
              }));
              $$invalidate(0, total = report.total);
              _context5.next = 16;
              break;

            case 13:
              _context5.prev = 13;
              _context5.t0 = _context5["catch"](2);
              $$invalidate(3, loadError = _context5.t0.stack || _context5.t0.toString());

            case 16:
              _context5.prev = 16;
              $$invalidate(2, loading = false);
              return _context5.finish(16);

            case 19:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee, null, [[2, 13, 16, 19]]);
    }));
    return _validate.apply(this, arguments);
  }

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("total" in $$props) $$invalidate(0, total = $$props.total);
    if ("withErrors" in $$props) $$invalidate(1, withErrors = $$props.withErrors);
    if ("loading" in $$props) $$invalidate(2, loading = $$props.loading);
    if ("loadError" in $$props) $$invalidate(3, loadError = $$props.loadError);
  };

  return [total, withErrors, loading, loadError, validate];
}

var Validate =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Validate, _SvelteComponentDev);

  function Validate(options) {
    var _this;

    _classCallCheck(this, Validate);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Validate).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Validate",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Validate;
}(SvelteComponentDev);

export default Validate;
