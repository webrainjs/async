import { am as path, _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, Q as onMount, R as onDestroy, H as space, t as element, G as text, X as query_selector_all, k as _forEachInstanceProperty, y as detach_dev, J as claim_space, v as claim_element, w as children, I as claim_text, z as attr_dev, A as add_location, B as insert_dev, K as append_dev, a0 as set_data_dev, n as noop, q as _sliceInstanceProperty, aj as empty, a3 as destroy_each } from './client.d5c92d1b.js';
import { b as browserDebug } from './index.122070be.js';

var setInterval = path.setInterval;

var setInterval$1 = setInterval;

var file = "src\\routes\\dev\\status.svelte";

function get_each_context(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[2] = list[i];
  return child_ctx;
} // (34:1) {:else}


function create_else_block(ctx) {
  var t;
  var block = {
    c: function create() {
      t = text("-");
    },
    l: function claim(nodes) {
      t = claim_text(nodes, "-");
    },
    m: function mount(target, anchor) {
      insert_dev(target, t, anchor);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_else_block.name,
    type: "else",
    source: "(34:1) {:else}",
    ctx: ctx
  });
  return block;
} // (21:1) {#if status && status.resources}


function create_if_block(ctx) {
  var each_1_anchor;
  var each_value =
  /*status*/
  ctx[0].resources;
  var each_blocks = [];

  for (var i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  var block = {
    c: function create() {
      for (var _i = 0; _i < each_blocks.length; _i += 1) {
        each_blocks[_i].c();
      }

      each_1_anchor = empty();
    },
    l: function claim(nodes) {
      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
        each_blocks[_i2].l(nodes);
      }

      each_1_anchor = empty();
    },
    m: function mount(target, anchor) {
      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*status, Math*/
      1) {
        each_value =
        /*status*/
        ctx[0].resources;

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
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block.name,
    type: "if",
    source: "(21:1) {#if status && status.resources}",
    ctx: ctx
  });
  return block;
} // (22:2) {#each status.resources as resource}


function create_each_block(ctx) {
  var tr;
  var td0;
  var t0_value = (
  /*resource*/
  ctx[2].time ? Math.round(
  /*resource*/
  ctx[2].time) : "-") + "";
  var t0;
  var t1;
  var td1;
  var t2_value = (
  /*resource*/
  ctx[2].size || "-") + "";
  var t2;
  var t3;
  var td2;
  var t4_value = (
  /*resource*/
  ctx[2].initiator || "-") + "";
  var t4;
  var t5;
  var td3;
  var a;
  var t6_value = (
  /*resource*/
  ctx[2].url || "-") + "";
  var t6;
  var a_href_value;
  var t7;
  var block = {
    c: function create() {
      tr = element("tr");
      td0 = element("td");
      t0 = text(t0_value);
      t1 = space();
      td1 = element("td");
      t2 = text(t2_value);
      t3 = space();
      td2 = element("td");
      t4 = text(t4_value);
      t5 = space();
      td3 = element("td");
      a = element("a");
      t6 = text(t6_value);
      t7 = space();
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
      t0 = claim_text(td0_nodes, t0_value);

      _forEachInstanceProperty(td0_nodes).call(td0_nodes, detach_dev);

      t1 = claim_space(tr_nodes);
      td1 = claim_element(tr_nodes, "TD", {
        class: true
      });
      var td1_nodes = children(td1);
      t2 = claim_text(td1_nodes, t2_value);

      _forEachInstanceProperty(td1_nodes).call(td1_nodes, detach_dev);

      t3 = claim_space(tr_nodes);
      td2 = claim_element(tr_nodes, "TD", {
        class: true
      });
      var td2_nodes = children(td2);
      t4 = claim_text(td2_nodes, t4_value);

      _forEachInstanceProperty(td2_nodes).call(td2_nodes, detach_dev);

      t5 = claim_space(tr_nodes);
      td3 = claim_element(tr_nodes, "TD", {
        class: true
      });
      var td3_nodes = children(td3);
      a = claim_element(td3_nodes, "A", {
        href: true,
        target: true
      });
      var a_nodes = children(a);
      t6 = claim_text(a_nodes, t6_value);

      _forEachInstanceProperty(a_nodes).call(a_nodes, detach_dev);

      _forEachInstanceProperty(td3_nodes).call(td3_nodes, detach_dev);

      t7 = claim_space(tr_nodes);

      _forEachInstanceProperty(tr_nodes).call(tr_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(td0, "class", "svelte-1dix2a2");
      add_location(td0, file, 23, 4, 898);
      attr_dev(td1, "class", "svelte-1dix2a2");
      add_location(td1, file, 24, 4, 961);
      attr_dev(td2, "class", "svelte-1dix2a2");
      add_location(td2, file, 25, 4, 997);
      attr_dev(a, "href", a_href_value =
      /*resource*/
      ctx[2].url || "-");
      attr_dev(a, "target", "_blank");
      add_location(a, file, 27, 5, 1048);
      attr_dev(td3, "class", "svelte-1dix2a2");
      add_location(td3, file, 26, 4, 1038);
      attr_dev(tr, "class", "svelte-1dix2a2");
      add_location(tr, file, 22, 3, 889);
    },
    m: function mount(target, anchor) {
      insert_dev(target, tr, anchor);
      append_dev(tr, td0);
      append_dev(td0, t0);
      append_dev(tr, t1);
      append_dev(tr, td1);
      append_dev(td1, t2);
      append_dev(tr, t3);
      append_dev(tr, td2);
      append_dev(td2, t4);
      append_dev(tr, t5);
      append_dev(tr, td3);
      append_dev(td3, a);
      append_dev(a, t6);
      append_dev(tr, t7);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*status*/
      1 && t0_value !== (t0_value = (
      /*resource*/
      ctx[2].time ? Math.round(
      /*resource*/
      ctx[2].time) : "-") + "")) set_data_dev(t0, t0_value);
      if (dirty &
      /*status*/
      1 && t2_value !== (t2_value = (
      /*resource*/
      ctx[2].size || "-") + "")) set_data_dev(t2, t2_value);
      if (dirty &
      /*status*/
      1 && t4_value !== (t4_value = (
      /*resource*/
      ctx[2].initiator || "-") + "")) set_data_dev(t4, t4_value);
      if (dirty &
      /*status*/
      1 && t6_value !== (t6_value = (
      /*resource*/
      ctx[2].url || "-") + "")) set_data_dev(t6, t6_value);

      if (dirty &
      /*status*/
      1 && a_href_value !== (a_href_value =
      /*resource*/
      ctx[2].url || "-")) {
        attr_dev(a, "href", a_href_value);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(tr);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block.name,
    type: "each",
    source: "(22:2) {#each status.resources as resource}",
    ctx: ctx
  });
  return block;
}

function create_fragment(ctx) {
  var t0;
  var table0;
  var tbody0;
  var tr0;
  var td0;
  var t1;
  var td1;
  var t2_value = (
  /*status*/
  ctx[0] ?
  /*status*/
  ctx[0].userAgent : "-") + "";
  var t2;
  var t3;
  var tr1;
  var td2;
  var t4;
  var td3;
  var t5_value = (
  /*status*/
  ctx[0] &&
  /*status*/
  ctx[0].timing &&
  /*status*/
  ctx[0].timing.loadHtml ? Math.round(
  /*status*/
  ctx[0].timing.loadHtml) : "-") + "";
  var t5;
  var t6;
  var tr2;
  var td4;
  var t7;
  var td5;
  var t8_value = (
  /*status*/
  ctx[0] &&
  /*status*/
  ctx[0].timing &&
  /*status*/
  ctx[0].timing.loadDom ? Math.round(
  /*status*/
  ctx[0].timing.loadDom) : "-") + "";
  var t8;
  var t9;
  var tr3;
  var td6;
  var t10;
  var td7;
  var t11_value = (
  /*status*/
  ctx[0] &&
  /*status*/
  ctx[0].timing &&
  /*status*/
  ctx[0].timing.loadTotal ? Math.round(
  /*status*/
  ctx[0].timing.loadTotal) : "-") + "";
  var t11;
  var t12;
  var tr4;
  var td8;
  var t13;
  var td9;
  var t14_value = (
  /*status*/
  ctx[0] &&
  /*status*/
  ctx[0].memory ?
  /*status*/
  ctx[0].memory.used : "-") + "";
  var t14;
  var t15;
  var h3;
  var t16;
  var t17;
  var table1;
  var thead;
  var tr5;
  var th0;
  var t18;
  var th1;
  var t19;
  var th2;
  var t20;
  var th3;
  var t21;
  var t22;
  var tbody1;

  function select_block_type(ctx, dirty) {
    if (
    /*status*/
    ctx[0] &&
    /*status*/
    ctx[0].resources) return create_if_block;
    return create_else_block;
  }

  var current_block_type = select_block_type(ctx);
  var if_block = current_block_type(ctx);
  var block = {
    c: function create() {
      t0 = space();
      table0 = element("table");
      tbody0 = element("tbody");
      tr0 = element("tr");
      td0 = element("td");
      t1 = text("UserAgent");
      td1 = element("td");
      t2 = text(t2_value);
      t3 = space();
      tr1 = element("tr");
      td2 = element("td");
      t4 = text("Time load HTML (ms)");
      td3 = element("td");
      t5 = text(t5_value);
      t6 = space();
      tr2 = element("tr");
      td4 = element("td");
      t7 = text("Time load DOM (ms)");
      td5 = element("td");
      t8 = text(t8_value);
      t9 = space();
      tr3 = element("tr");
      td6 = element("td");
      t10 = text("Time load Total (ms)");
      td7 = element("td");
      t11 = text(t11_value);
      t12 = space();
      tr4 = element("tr");
      td8 = element("td");
      t13 = text("Memory used");
      td9 = element("td");
      t14 = text(t14_value);
      t15 = space();
      h3 = element("h3");
      t16 = text("Resources:");
      t17 = space();
      table1 = element("table");
      thead = element("thead");
      tr5 = element("tr");
      th0 = element("th");
      t18 = text("Time (ms)");
      th1 = element("th");
      t19 = text("Size");
      th2 = element("th");
      t20 = text("Initiator");
      th3 = element("th");
      t21 = text("Url");
      t22 = space();
      tbody1 = element("tbody");
      if_block.c();
      this.h();
    },
    l: function claim(nodes) {
      var head_nodes = query_selector_all("[data-svelte=\"svelte-te9bo3\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      table0 = claim_element(nodes, "TABLE", {
        class: true
      });
      var table0_nodes = children(table0);
      tbody0 = claim_element(table0_nodes, "TBODY", {});
      var tbody0_nodes = children(tbody0);
      tr0 = claim_element(tbody0_nodes, "TR", {
        class: true
      });
      var tr0_nodes = children(tr0);
      td0 = claim_element(tr0_nodes, "TD", {
        class: true
      });
      var td0_nodes = children(td0);
      t1 = claim_text(td0_nodes, "UserAgent");

      _forEachInstanceProperty(td0_nodes).call(td0_nodes, detach_dev);

      td1 = claim_element(tr0_nodes, "TD", {
        class: true
      });
      var td1_nodes = children(td1);
      t2 = claim_text(td1_nodes, t2_value);

      _forEachInstanceProperty(td1_nodes).call(td1_nodes, detach_dev);

      _forEachInstanceProperty(tr0_nodes).call(tr0_nodes, detach_dev);

      t3 = claim_space(tbody0_nodes);
      tr1 = claim_element(tbody0_nodes, "TR", {
        class: true
      });
      var tr1_nodes = children(tr1);
      td2 = claim_element(tr1_nodes, "TD", {
        class: true
      });
      var td2_nodes = children(td2);
      t4 = claim_text(td2_nodes, "Time load HTML (ms)");

      _forEachInstanceProperty(td2_nodes).call(td2_nodes, detach_dev);

      td3 = claim_element(tr1_nodes, "TD", {
        class: true
      });
      var td3_nodes = children(td3);
      t5 = claim_text(td3_nodes, t5_value);

      _forEachInstanceProperty(td3_nodes).call(td3_nodes, detach_dev);

      _forEachInstanceProperty(tr1_nodes).call(tr1_nodes, detach_dev);

      t6 = claim_space(tbody0_nodes);
      tr2 = claim_element(tbody0_nodes, "TR", {
        class: true
      });
      var tr2_nodes = children(tr2);
      td4 = claim_element(tr2_nodes, "TD", {
        class: true
      });
      var td4_nodes = children(td4);
      t7 = claim_text(td4_nodes, "Time load DOM (ms)");

      _forEachInstanceProperty(td4_nodes).call(td4_nodes, detach_dev);

      td5 = claim_element(tr2_nodes, "TD", {
        class: true
      });
      var td5_nodes = children(td5);
      t8 = claim_text(td5_nodes, t8_value);

      _forEachInstanceProperty(td5_nodes).call(td5_nodes, detach_dev);

      _forEachInstanceProperty(tr2_nodes).call(tr2_nodes, detach_dev);

      t9 = claim_space(tbody0_nodes);
      tr3 = claim_element(tbody0_nodes, "TR", {
        class: true
      });
      var tr3_nodes = children(tr3);
      td6 = claim_element(tr3_nodes, "TD", {
        class: true
      });
      var td6_nodes = children(td6);
      t10 = claim_text(td6_nodes, "Time load Total (ms)");

      _forEachInstanceProperty(td6_nodes).call(td6_nodes, detach_dev);

      td7 = claim_element(tr3_nodes, "TD", {
        class: true
      });
      var td7_nodes = children(td7);
      t11 = claim_text(td7_nodes, t11_value);

      _forEachInstanceProperty(td7_nodes).call(td7_nodes, detach_dev);

      _forEachInstanceProperty(tr3_nodes).call(tr3_nodes, detach_dev);

      t12 = claim_space(tbody0_nodes);
      tr4 = claim_element(tbody0_nodes, "TR", {
        class: true
      });
      var tr4_nodes = children(tr4);
      td8 = claim_element(tr4_nodes, "TD", {
        class: true
      });
      var td8_nodes = children(td8);
      t13 = claim_text(td8_nodes, "Memory used");

      _forEachInstanceProperty(td8_nodes).call(td8_nodes, detach_dev);

      td9 = claim_element(tr4_nodes, "TD", {
        class: true
      });
      var td9_nodes = children(td9);
      t14 = claim_text(td9_nodes, t14_value);

      _forEachInstanceProperty(td9_nodes).call(td9_nodes, detach_dev);

      _forEachInstanceProperty(tr4_nodes).call(tr4_nodes, detach_dev);

      _forEachInstanceProperty(tbody0_nodes).call(tbody0_nodes, detach_dev);

      _forEachInstanceProperty(table0_nodes).call(table0_nodes, detach_dev);

      t15 = claim_space(nodes);
      h3 = claim_element(nodes, "H3", {});
      var h3_nodes = children(h3);
      t16 = claim_text(h3_nodes, "Resources:");

      _forEachInstanceProperty(h3_nodes).call(h3_nodes, detach_dev);

      t17 = claim_space(nodes);
      table1 = claim_element(nodes, "TABLE", {
        class: true
      });
      var table1_nodes = children(table1);
      thead = claim_element(table1_nodes, "THEAD", {});
      var thead_nodes = children(thead);
      tr5 = claim_element(thead_nodes, "TR", {});
      var tr5_nodes = children(tr5);
      th0 = claim_element(tr5_nodes, "TH", {
        class: true
      });
      var th0_nodes = children(th0);
      t18 = claim_text(th0_nodes, "Time (ms)");

      _forEachInstanceProperty(th0_nodes).call(th0_nodes, detach_dev);

      th1 = claim_element(tr5_nodes, "TH", {
        class: true
      });
      var th1_nodes = children(th1);
      t19 = claim_text(th1_nodes, "Size");

      _forEachInstanceProperty(th1_nodes).call(th1_nodes, detach_dev);

      th2 = claim_element(tr5_nodes, "TH", {
        class: true
      });
      var th2_nodes = children(th2);
      t20 = claim_text(th2_nodes, "Initiator");

      _forEachInstanceProperty(th2_nodes).call(th2_nodes, detach_dev);

      th3 = claim_element(tr5_nodes, "TH", {
        class: true
      });
      var th3_nodes = children(th3);
      t21 = claim_text(th3_nodes, "Url");

      _forEachInstanceProperty(th3_nodes).call(th3_nodes, detach_dev);

      _forEachInstanceProperty(tr5_nodes).call(tr5_nodes, detach_dev);

      _forEachInstanceProperty(thead_nodes).call(thead_nodes, detach_dev);

      t22 = claim_space(table1_nodes);
      tbody1 = claim_element(table1_nodes, "TBODY", {});
      var tbody1_nodes = children(tbody1);
      if_block.l(tbody1_nodes);

      _forEachInstanceProperty(tbody1_nodes).call(tbody1_nodes, detach_dev);

      _forEachInstanceProperty(table1_nodes).call(table1_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      document.title = "Status page";
      attr_dev(td0, "class", "svelte-1dix2a2");
      add_location(td0, file, 6, 5, 80);
      attr_dev(td1, "class", "svelte-1dix2a2");
      add_location(td1, file, 6, 23, 98);
      attr_dev(tr0, "class", "svelte-1dix2a2");
      add_location(tr0, file, 6, 1, 76);
      attr_dev(td2, "class", "svelte-1dix2a2");
      add_location(td2, file, 7, 5, 151);
      attr_dev(td3, "class", "svelte-1dix2a2");
      add_location(td3, file, 7, 33, 179);
      attr_dev(tr1, "class", "svelte-1dix2a2");
      add_location(tr1, file, 7, 1, 147);
      attr_dev(td4, "class", "svelte-1dix2a2");
      add_location(td4, file, 8, 5, 293);
      attr_dev(td5, "class", "svelte-1dix2a2");
      add_location(td5, file, 8, 32, 320);
      attr_dev(tr2, "class", "svelte-1dix2a2");
      add_location(tr2, file, 8, 1, 289);
      attr_dev(td6, "class", "svelte-1dix2a2");
      add_location(td6, file, 9, 5, 432);
      attr_dev(td7, "class", "svelte-1dix2a2");
      add_location(td7, file, 9, 34, 461);
      attr_dev(tr3, "class", "svelte-1dix2a2");
      add_location(tr3, file, 9, 1, 428);
      attr_dev(td8, "class", "svelte-1dix2a2");
      add_location(td8, file, 10, 5, 577);
      attr_dev(td9, "class", "svelte-1dix2a2");
      add_location(td9, file, 10, 25, 597);
      attr_dev(tr4, "class", "svelte-1dix2a2");
      add_location(tr4, file, 10, 1, 573);
      add_location(tbody0, file, 5, 1, 67);
      attr_dev(table0, "class", "svelte-1dix2a2");
      add_location(table0, file, 4, 0, 58);
      add_location(h3, file, 14, 0, 684);
      attr_dev(th0, "class", "svelte-1dix2a2");
      add_location(th0, file, 17, 6, 727);
      attr_dev(th1, "class", "svelte-1dix2a2");
      add_location(th1, file, 17, 24, 745);
      attr_dev(th2, "class", "svelte-1dix2a2");
      add_location(th2, file, 17, 37, 758);
      attr_dev(th3, "class", "svelte-1dix2a2");
      add_location(th3, file, 17, 55, 776);
      add_location(tr5, file, 17, 2, 723);
      add_location(thead, file, 16, 1, 713);
      add_location(tbody1, file, 19, 1, 805);
      attr_dev(table1, "class", "svelte-1dix2a2");
      add_location(table1, file, 15, 0, 704);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, table0, anchor);
      append_dev(table0, tbody0);
      append_dev(tbody0, tr0);
      append_dev(tr0, td0);
      append_dev(td0, t1);
      append_dev(tr0, td1);
      append_dev(td1, t2);
      append_dev(tbody0, t3);
      append_dev(tbody0, tr1);
      append_dev(tr1, td2);
      append_dev(td2, t4);
      append_dev(tr1, td3);
      append_dev(td3, t5);
      append_dev(tbody0, t6);
      append_dev(tbody0, tr2);
      append_dev(tr2, td4);
      append_dev(td4, t7);
      append_dev(tr2, td5);
      append_dev(td5, t8);
      append_dev(tbody0, t9);
      append_dev(tbody0, tr3);
      append_dev(tr3, td6);
      append_dev(td6, t10);
      append_dev(tr3, td7);
      append_dev(td7, t11);
      append_dev(tbody0, t12);
      append_dev(tbody0, tr4);
      append_dev(tr4, td8);
      append_dev(td8, t13);
      append_dev(tr4, td9);
      append_dev(td9, t14);
      insert_dev(target, t15, anchor);
      insert_dev(target, h3, anchor);
      append_dev(h3, t16);
      insert_dev(target, t17, anchor);
      insert_dev(target, table1, anchor);
      append_dev(table1, thead);
      append_dev(thead, tr5);
      append_dev(tr5, th0);
      append_dev(th0, t18);
      append_dev(tr5, th1);
      append_dev(th1, t19);
      append_dev(tr5, th2);
      append_dev(th2, t20);
      append_dev(tr5, th3);
      append_dev(th3, t21);
      append_dev(table1, t22);
      append_dev(table1, tbody1);
      if_block.m(tbody1, null);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];
      if (dirty &
      /*status*/
      1 && t2_value !== (t2_value = (
      /*status*/
      ctx[0] ?
      /*status*/
      ctx[0].userAgent : "-") + "")) set_data_dev(t2, t2_value);
      if (dirty &
      /*status*/
      1 && t5_value !== (t5_value = (
      /*status*/
      ctx[0] &&
      /*status*/
      ctx[0].timing &&
      /*status*/
      ctx[0].timing.loadHtml ? Math.round(
      /*status*/
      ctx[0].timing.loadHtml) : "-") + "")) set_data_dev(t5, t5_value);
      if (dirty &
      /*status*/
      1 && t8_value !== (t8_value = (
      /*status*/
      ctx[0] &&
      /*status*/
      ctx[0].timing &&
      /*status*/
      ctx[0].timing.loadDom ? Math.round(
      /*status*/
      ctx[0].timing.loadDom) : "-") + "")) set_data_dev(t8, t8_value);
      if (dirty &
      /*status*/
      1 && t11_value !== (t11_value = (
      /*status*/
      ctx[0] &&
      /*status*/
      ctx[0].timing &&
      /*status*/
      ctx[0].timing.loadTotal ? Math.round(
      /*status*/
      ctx[0].timing.loadTotal) : "-") + "")) set_data_dev(t11, t11_value);
      if (dirty &
      /*status*/
      1 && t14_value !== (t14_value = (
      /*status*/
      ctx[0] &&
      /*status*/
      ctx[0].memory ?
      /*status*/
      ctx[0].memory.used : "-") + "")) set_data_dev(t14, t14_value);

      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);

        if (if_block) {
          if_block.c();
          if_block.m(tbody1, null);
        }
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(table0);
      if (detaching) detach_dev(t15);
      if (detaching) detach_dev(h3);
      if (detaching) detach_dev(t17);
      if (detaching) detach_dev(table1);
      if_block.d();
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
  var status = null;
  var interval;
  onMount(function () {
    $$invalidate(0, status = browserDebug.getDebugInfo());
    interval = setInterval$1(function () {
      $$invalidate(0, status = browserDebug.getDebugInfo());
    }, 1000);
  });
  onDestroy(function () {
    clearInterval(interval);
  });

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("status" in $$props) $$invalidate(0, status = $$props.status);
    if ("interval" in $$props) interval = $$props.interval;
  };

  return [status];
}

var Status =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Status, _SvelteComponentDev);

  function Status(options) {
    var _this;

    _classCallCheck(this, Status);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Status).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Status",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Status;
}(SvelteComponentDev);

export default Status;
