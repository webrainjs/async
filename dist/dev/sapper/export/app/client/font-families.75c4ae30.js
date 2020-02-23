import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, l as _sliceInstanceProperty, p as element, D as text, E as space, r as claim_element, t as children, F as claim_text, h as _forEachInstanceProperty, v as detach_dev, G as claim_space, w as attr_dev, x as add_location, y as insert_dev, H as append_dev, n as noop, $ as destroy_each, P as binding_callbacks } from './client.6a27e0ac.js';

var file = "src\\routes\\dev\\components\\small\\font-families.svelte";

function get_each_context(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[3] = list[i];
  return child_ctx;
}

function get_each_context_1(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[3] = list[i];
  return child_ctx;
} // (19:2) {#each fontFamilies as fontFamily}


function create_each_block_1(ctx) {
  var span0;
  var t0;
  var t1;
  var span3;
  var span1;
  var t2;
  var t3_value =
  /*fontFamily*/
  ctx[3] + "";
  var t3;
  var t4;
  var t5_value =
  /*fontFamily*/
  ctx[3] + "";
  var t5;
  var t6;
  var t7_value =
  /*fontFamily*/
  ctx[3] + "";
  var t7;
  var t8;
  var t9_value =
  /*fontFamily*/
  ctx[3] + "";
  var t9;
  var t10;
  var t11_value =
  /*fontFamily*/
  ctx[3] + "";
  var t11;
  var span1_title_value;
  var span2;
  var t12;
  var span3_class_value;
  var t13;
  var span5;
  var div;
  var t14;
  var t15_value =
  /*fontFamily*/
  ctx[3] + "";
  var t15;
  var t16;
  var t17_value =
  /*fontFamily*/
  ctx[3] + "";
  var t17;
  var t18;
  var t19_value =
  /*fontFamily*/
  ctx[3] + "";
  var t19;
  var t20;
  var t21_value =
  /*fontFamily*/
  ctx[3] + "";
  var t21;
  var t22;
  var t23_value =
  /*fontFamily*/
  ctx[3] + "";
  var t23;
  var div_title_value;
  var span4;
  var t24;
  var span5_class_value;
  var block = {
    c: function create() {
      span0 = element("span");
      t0 = text(" ");
      t1 = space();
      span3 = element("span");
      span1 = element("span");
      t2 = text("Wgj ");
      t3 = text(t3_value);
      t4 = text(" Wgj ");
      t5 = text(t5_value);
      t6 = text(" Wgj ");
      t7 = text(t7_value);
      t8 = text(" Wgj ");
      t9 = text(t9_value);
      t10 = text(" Wgj ");
      t11 = text(t11_value);
      span2 = element("span");
      t12 = text(" ");
      t13 = space();
      span5 = element("span");
      div = element("div");
      t14 = text("Wgj-");
      t15 = text(t15_value);
      t16 = text(" Wgj-");
      t17 = text(t17_value);
      t18 = text(" Wgj-");
      t19 = text(t19_value);
      t20 = text(" Wgj-");
      t21 = text(t21_value);
      t22 = text(" Wgj-");
      t23 = text(t23_value);
      span4 = element("span");
      t24 = text(" ");
      this.h();
    },
    l: function claim(nodes) {
      span0 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      t0 = claim_text(span0_nodes, " ");

      _forEachInstanceProperty(span0_nodes).call(span0_nodes, detach_dev);

      t1 = claim_space(nodes);
      span3 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span3_nodes = children(span3);
      span1 = claim_element(span3_nodes, "SPAN", {
        class: true,
        title: true
      });
      var span1_nodes = children(span1);
      t2 = claim_text(span1_nodes, "Wgj ");
      t3 = claim_text(span1_nodes, t3_value);
      t4 = claim_text(span1_nodes, " Wgj ");
      t5 = claim_text(span1_nodes, t5_value);
      t6 = claim_text(span1_nodes, " Wgj ");
      t7 = claim_text(span1_nodes, t7_value);
      t8 = claim_text(span1_nodes, " Wgj ");
      t9 = claim_text(span1_nodes, t9_value);
      t10 = claim_text(span1_nodes, " Wgj ");
      t11 = claim_text(span1_nodes, t11_value);

      _forEachInstanceProperty(span1_nodes).call(span1_nodes, detach_dev);

      span2 = claim_element(span3_nodes, "SPAN", {
        class: true
      });
      var span2_nodes = children(span2);
      t12 = claim_text(span2_nodes, " ");

      _forEachInstanceProperty(span2_nodes).call(span2_nodes, detach_dev);

      _forEachInstanceProperty(span3_nodes).call(span3_nodes, detach_dev);

      t13 = claim_space(nodes);
      span5 = claim_element(nodes, "SPAN", {
        class: true
      });
      var span5_nodes = children(span5);
      div = claim_element(span5_nodes, "DIV", {
        class: true,
        title: true
      });
      var div_nodes = children(div);
      t14 = claim_text(div_nodes, "Wgj-");
      t15 = claim_text(div_nodes, t15_value);
      t16 = claim_text(div_nodes, " Wgj-");
      t17 = claim_text(div_nodes, t17_value);
      t18 = claim_text(div_nodes, " Wgj-");
      t19 = claim_text(div_nodes, t19_value);
      t20 = claim_text(div_nodes, " Wgj-");
      t21 = claim_text(div_nodes, t21_value);
      t22 = claim_text(div_nodes, " Wgj-");
      t23 = claim_text(div_nodes, t23_value);

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      span4 = claim_element(span5_nodes, "SPAN", {
        class: true
      });
      var span4_nodes = children(span4);
      t24 = claim_text(span4_nodes, " ");

      _forEachInstanceProperty(span4_nodes).call(span4_nodes, detach_dev);

      _forEachInstanceProperty(span5_nodes).call(span5_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(span0, "class", "font-family__icon-inline icon-inline svelte-1d5p5pw");
      add_location(span0, file, 19, 3, 529);
      attr_dev(span1, "class", "text svelte-1d5p5pw");
      attr_dev(span1, "title", span1_title_value =
      /*fontFamily*/
      ctx[3]);
      add_location(span1, file, 20, 61, 655);
      attr_dev(span2, "class", "font-family__icon-inline icon-inline svelte-1d5p5pw");
      add_location(span2, file, 20, 192, 786);
      attr_dev(span3, "class", span3_class_value = "font-family__other font-family-" +
      /*fontFamily*/
      ctx[3] + " svelte-1d5p5pw");
      add_location(span3, file, 20, 3, 597);
      attr_dev(div, "class", "text svelte-1d5p5pw");
      attr_dev(div, "title", div_title_value =
      /*fontFamily*/
      ctx[3]);
      add_location(div, file, 21, 61, 919);
      attr_dev(span4, "class", "font-family__icon-inline icon-inline svelte-1d5p5pw");
      add_location(span4, file, 21, 190, 1048);
      attr_dev(span5, "class", span5_class_value = "font-family__other font-family-" +
      /*fontFamily*/
      ctx[3] + " svelte-1d5p5pw");
      add_location(span5, file, 21, 3, 861);
    },
    m: function mount(target, anchor) {
      insert_dev(target, span0, anchor);
      append_dev(span0, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, span3, anchor);
      append_dev(span3, span1);
      append_dev(span1, t2);
      append_dev(span1, t3);
      append_dev(span1, t4);
      append_dev(span1, t5);
      append_dev(span1, t6);
      append_dev(span1, t7);
      append_dev(span1, t8);
      append_dev(span1, t9);
      append_dev(span1, t10);
      append_dev(span1, t11);
      append_dev(span3, span2);
      append_dev(span2, t12);
      insert_dev(target, t13, anchor);
      insert_dev(target, span5, anchor);
      append_dev(span5, div);
      append_dev(div, t14);
      append_dev(div, t15);
      append_dev(div, t16);
      append_dev(div, t17);
      append_dev(div, t18);
      append_dev(div, t19);
      append_dev(div, t20);
      append_dev(div, t21);
      append_dev(div, t22);
      append_dev(div, t23);
      append_dev(span5, span4);
      append_dev(span4, t24);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(span0);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(span3);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(span5);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_1.name,
    type: "each",
    source: "(19:2) {#each fontFamilies as fontFamily}",
    ctx: ctx
  });
  return block;
} // (25:1) {#each fontFamilies as fontFamily}


function create_each_block(ctx) {
  var div6;
  var div2;
  var div0;
  var t0;
  var div1;
  var t1;
  var div5;
  var span0;
  var div3;
  var t2;
  var t3;
  var span3;
  var div4;
  var t4;
  var div4_title_value;
  var span1;
  var t5;
  var span2;
  var t6;
  var span2_title_value;
  var span3_class_value;
  var t7;
  var div13;
  var div9;
  var div7;
  var t8;
  var div8;
  var t9;
  var div12;
  var span4;
  var div10;
  var t10;
  var t11;
  var span7;
  var div11;
  var t12;
  var div11_title_value;
  var span5;
  var t13;
  var span6;
  var t14;
  var span6_title_value;
  var span7_class_value;
  var t15;
  var block = {
    c: function create() {
      div6 = element("div");
      div2 = element("div");
      div0 = element("div");
      t0 = space();
      div1 = element("div");
      t1 = space();
      div5 = element("div");
      span0 = element("span");
      div3 = element("div");
      t2 = text("Wgj");
      t3 = space();
      span3 = element("span");
      div4 = element("div");
      t4 = text("Wgj");
      span1 = element("span");
      t5 = text(" ");
      span2 = element("span");
      t6 = text("Wgj");
      t7 = space();
      div13 = element("div");
      div9 = element("div");
      div7 = element("div");
      t8 = space();
      div8 = element("div");
      t9 = space();
      div12 = element("div");
      span4 = element("span");
      div10 = element("div");
      t10 = text("Wgj");
      t11 = space();
      span7 = element("span");
      div11 = element("div");
      t12 = text("Wgj");
      span5 = element("span");
      t13 = text(" ");
      span6 = element("span");
      t14 = text("Wgj");
      t15 = space();
      this.h();
    },
    l: function claim(nodes) {
      var _context, _context2, _context3, _context4;

      div6 = claim_element(nodes, "DIV", {
        class: true
      });
      var div6_nodes = children(div6);
      div2 = claim_element(div6_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true
      });

      _forEachInstanceProperty(_context = children(div0)).call(_context, detach_dev);

      t0 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });

      _forEachInstanceProperty(_context2 = children(div1)).call(_context2, detach_dev);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      t1 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", {
        class: true
      });
      var div5_nodes = children(div5);
      span0 = claim_element(div5_nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      div3 = claim_element(span0_nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      t2 = claim_text(div3_nodes, "Wgj");

      _forEachInstanceProperty(div3_nodes).call(div3_nodes, detach_dev);

      _forEachInstanceProperty(span0_nodes).call(span0_nodes, detach_dev);

      t3 = claim_space(div5_nodes);
      span3 = claim_element(div5_nodes, "SPAN", {
        class: true
      });
      var span3_nodes = children(span3);
      div4 = claim_element(span3_nodes, "DIV", {
        class: true,
        title: true
      });
      var div4_nodes = children(div4);
      t4 = claim_text(div4_nodes, "Wgj");

      _forEachInstanceProperty(div4_nodes).call(div4_nodes, detach_dev);

      span1 = claim_element(span3_nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t5 = claim_text(span1_nodes, " ");

      _forEachInstanceProperty(span1_nodes).call(span1_nodes, detach_dev);

      span2 = claim_element(span3_nodes, "SPAN", {
        class: true,
        title: true
      });
      var span2_nodes = children(span2);
      t6 = claim_text(span2_nodes, "Wgj");

      _forEachInstanceProperty(span2_nodes).call(span2_nodes, detach_dev);

      _forEachInstanceProperty(span3_nodes).call(span3_nodes, detach_dev);

      _forEachInstanceProperty(div5_nodes).call(div5_nodes, detach_dev);

      _forEachInstanceProperty(div6_nodes).call(div6_nodes, detach_dev);

      t7 = claim_space(nodes);
      div13 = claim_element(nodes, "DIV", {
        class: true
      });
      var div13_nodes = children(div13);
      div9 = claim_element(div13_nodes, "DIV", {
        class: true
      });
      var div9_nodes = children(div9);
      div7 = claim_element(div9_nodes, "DIV", {
        class: true
      });

      _forEachInstanceProperty(_context3 = children(div7)).call(_context3, detach_dev);

      t8 = claim_space(div9_nodes);
      div8 = claim_element(div9_nodes, "DIV", {
        class: true
      });

      _forEachInstanceProperty(_context4 = children(div8)).call(_context4, detach_dev);

      _forEachInstanceProperty(div9_nodes).call(div9_nodes, detach_dev);

      t9 = claim_space(div13_nodes);
      div12 = claim_element(div13_nodes, "DIV", {
        class: true
      });
      var div12_nodes = children(div12);
      span4 = claim_element(div12_nodes, "SPAN", {
        class: true
      });
      var span4_nodes = children(span4);
      div10 = claim_element(span4_nodes, "DIV", {
        class: true
      });
      var div10_nodes = children(div10);
      t10 = claim_text(div10_nodes, "Wgj");

      _forEachInstanceProperty(div10_nodes).call(div10_nodes, detach_dev);

      _forEachInstanceProperty(span4_nodes).call(span4_nodes, detach_dev);

      t11 = claim_space(div12_nodes);
      span7 = claim_element(div12_nodes, "SPAN", {
        class: true
      });
      var span7_nodes = children(span7);
      div11 = claim_element(span7_nodes, "DIV", {
        class: true,
        title: true
      });
      var div11_nodes = children(div11);
      t12 = claim_text(div11_nodes, "Wgj");

      _forEachInstanceProperty(div11_nodes).call(div11_nodes, detach_dev);

      span5 = claim_element(span7_nodes, "SPAN", {
        class: true
      });
      var span5_nodes = children(span5);
      t13 = claim_text(span5_nodes, " ");

      _forEachInstanceProperty(span5_nodes).call(span5_nodes, detach_dev);

      span6 = claim_element(span7_nodes, "SPAN", {
        class: true,
        title: true
      });
      var span6_nodes = children(span6);
      t14 = claim_text(span6_nodes, "Wgj");

      _forEachInstanceProperty(span6_nodes).call(span6_nodes, detach_dev);

      _forEachInstanceProperty(span7_nodes).call(span7_nodes, detach_dev);

      _forEachInstanceProperty(div12_nodes).call(div12_nodes, detach_dev);

      t15 = claim_space(div13_nodes);

      _forEachInstanceProperty(div13_nodes).call(div13_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "font-family__background svelte-1d5p5pw");
      add_location(div0, file, 27, 4, 1248);
      attr_dev(div1, "class", "font-family__background-2 svelte-1d5p5pw");
      add_location(div1, file, 28, 4, 1296);
      attr_dev(div2, "class", "font-family__backgrounds svelte-1d5p5pw");
      add_location(div2, file, 26, 3, 1205);
      attr_dev(div3, "class", "text svelte-1d5p5pw");
      add_location(div3, file, 31, 36, 1426);
      attr_dev(span0, "class", "font-family__base svelte-1d5p5pw");
      add_location(span0, file, 31, 4, 1394);
      attr_dev(div4, "class", "text svelte-1d5p5pw");
      attr_dev(div4, "title", div4_title_value =
      /*fontFamily*/
      ctx[3]);
      add_location(div4, file, 33, 62, 1592);
      attr_dev(span1, "class", "font-family__icon-inline icon-inline svelte-1d5p5pw");
      add_location(span1, file, 33, 110, 1640);
      attr_dev(span2, "class", "text svelte-1d5p5pw");
      attr_dev(span2, "title", span2_title_value =
      /*fontFamily*/
      ctx[3]);
      add_location(span2, file, 33, 174, 1704);
      attr_dev(span3, "class", span3_class_value = "font-family__other font-family-" +
      /*fontFamily*/
      ctx[3] + " svelte-1d5p5pw");
      add_location(span3, file, 33, 4, 1534);
      attr_dev(div5, "class", "font-family__content svelte-1d5p5pw");
      add_location(div5, file, 30, 3, 1355);
      attr_dev(div6, "class", "font-family svelte-1d5p5pw");
      add_location(div6, file, 25, 2, 1176);
      attr_dev(div7, "class", "font-family__background svelte-1d5p5pw");
      add_location(div7, file, 38, 4, 1882);
      attr_dev(div8, "class", "font-family__background-2 svelte-1d5p5pw");
      add_location(div8, file, 39, 4, 1930);
      attr_dev(div9, "class", "font-family__backgrounds svelte-1d5p5pw");
      add_location(div9, file, 37, 3, 1839);
      attr_dev(div10, "class", "text svelte-1d5p5pw");
      add_location(div10, file, 42, 36, 2060);
      attr_dev(span4, "class", "font-family__base svelte-1d5p5pw");
      add_location(span4, file, 42, 4, 2028);
      attr_dev(div11, "class", "text svelte-1d5p5pw");
      attr_dev(div11, "title", div11_title_value =
      /*fontFamily*/
      ctx[3]);
      add_location(div11, file, 44, 62, 2226);
      attr_dev(span5, "class", "font-family__icon-inline icon-inline svelte-1d5p5pw");
      add_location(span5, file, 44, 110, 2274);
      attr_dev(span6, "class", "text svelte-1d5p5pw");
      attr_dev(span6, "title", span6_title_value =
      /*fontFamily*/
      ctx[3]);
      add_location(span6, file, 44, 174, 2338);
      attr_dev(span7, "class", span7_class_value = "font-family__other font-family-" +
      /*fontFamily*/
      ctx[3] + " svelte-1d5p5pw");
      add_location(span7, file, 44, 4, 2168);
      attr_dev(div12, "class", "font-family__content svelte-1d5p5pw");
      add_location(div12, file, 41, 3, 1989);
      attr_dev(div13, "class", "font-family font-family--line-height-2 svelte-1d5p5pw");
      add_location(div13, file, 36, 2, 1783);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div6, anchor);
      append_dev(div6, div2);
      append_dev(div2, div0);
      append_dev(div2, t0);
      append_dev(div2, div1);
      append_dev(div6, t1);
      append_dev(div6, div5);
      append_dev(div5, span0);
      append_dev(span0, div3);
      append_dev(div3, t2);
      append_dev(div5, t3);
      append_dev(div5, span3);
      append_dev(span3, div4);
      append_dev(div4, t4);
      append_dev(span3, span1);
      append_dev(span1, t5);
      append_dev(span3, span2);
      append_dev(span2, t6);
      insert_dev(target, t7, anchor);
      insert_dev(target, div13, anchor);
      append_dev(div13, div9);
      append_dev(div9, div7);
      append_dev(div9, t8);
      append_dev(div9, div8);
      append_dev(div13, t9);
      append_dev(div13, div12);
      append_dev(div12, span4);
      append_dev(span4, div10);
      append_dev(div10, t10);
      append_dev(div12, t11);
      append_dev(div12, span7);
      append_dev(span7, div11);
      append_dev(div11, t12);
      append_dev(span7, span5);
      append_dev(span5, t13);
      append_dev(span7, span6);
      append_dev(span6, t14);
      append_dev(div13, t15);
    },
    p: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div6);
      if (detaching) detach_dev(t7);
      if (detaching) detach_dev(div13);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block.name,
    type: "each",
    source: "(25:1) {#each fontFamilies as fontFamily}",
    ctx: ctx
  });
  return block;
}

function create_fragment(ctx) {
  var div2;
  var div1;
  var span0;
  var div0;
  var t0;
  var t1;
  var span2;
  var span1;
  var t2;
  var t3;
  var t4;
  var each_value_1 =
  /*fontFamilies*/
  ctx[1];
  var each_blocks_1 = [];

  for (var i = 0; i < each_value_1.length; i += 1) {
    each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }

  var each_value =
  /*fontFamilies*/
  ctx[1];
  var each_blocks = [];

  for (var _i = 0; _i < each_value.length; _i += 1) {
    each_blocks[_i] = create_each_block(get_each_context(ctx, each_value, _i));
  }

  var block = {
    c: function create() {
      div2 = element("div");
      div1 = element("div");
      span0 = element("span");
      div0 = element("div");
      t0 = text("Wgj base Wgj base Wgj base Wgj base Wgj base");
      t1 = space();
      span2 = element("span");
      span1 = element("span");
      t2 = text("Wgj-base Wgj-base Wgj-base Wgj-base Wgj-base");
      t3 = space();

      for (var _i2 = 0; _i2 < each_blocks_1.length; _i2 += 1) {
        each_blocks_1[_i2].c();
      }

      t4 = space();

      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].c();
      }

      this.h();
    },
    l: function claim(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      span0 = claim_element(div1_nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      div0 = claim_element(span0_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      t0 = claim_text(div0_nodes, "Wgj base Wgj base Wgj base Wgj base Wgj base");

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      _forEachInstanceProperty(span0_nodes).call(span0_nodes, detach_dev);

      t1 = claim_space(div1_nodes);
      span2 = claim_element(div1_nodes, "SPAN", {
        class: true
      });
      var span2_nodes = children(span2);
      span1 = claim_element(span2_nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t2 = claim_text(span1_nodes, "Wgj-base Wgj-base Wgj-base Wgj-base Wgj-base");

      _forEachInstanceProperty(span1_nodes).call(span1_nodes, detach_dev);

      _forEachInstanceProperty(span2_nodes).call(span2_nodes, detach_dev);

      t3 = claim_space(div1_nodes);

      for (var _i4 = 0; _i4 < each_blocks_1.length; _i4 += 1) {
        each_blocks_1[_i4].l(div1_nodes);
      }

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      t4 = claim_space(div2_nodes);

      for (var _i5 = 0; _i5 < each_blocks.length; _i5 += 1) {
        each_blocks[_i5].l(div2_nodes);
      }

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "text svelte-1d5p5pw");
      add_location(div0, file, 16, 34, 301);
      attr_dev(span0, "class", "font-family__base svelte-1d5p5pw");
      add_location(span0, file, 16, 2, 269);
      attr_dev(span1, "class", "text svelte-1d5p5pw");
      add_location(span1, file, 17, 34, 411);
      attr_dev(span2, "class", "font-family__base svelte-1d5p5pw");
      add_location(span2, file, 17, 2, 379);
      attr_dev(div1, "class", "font-family font-family--multiline svelte-1d5p5pw");
      add_location(div1, file, 15, 1, 218);
      attr_dev(div2, "class", "container svelte-1d5p5pw");
      add_location(div2, file, 14, 0, 169);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div1);
      append_dev(div1, span0);
      append_dev(span0, div0);
      append_dev(div0, t0);
      append_dev(div1, t1);
      append_dev(div1, span2);
      append_dev(span2, span1);
      append_dev(span1, t2);
      append_dev(div1, t3);

      for (var _i6 = 0; _i6 < each_blocks_1.length; _i6 += 1) {
        each_blocks_1[_i6].m(div1, null);
      }

      append_dev(div2, t4);

      for (var _i7 = 0; _i7 < each_blocks.length; _i7 += 1) {
        each_blocks[_i7].m(div2, null);
      }
      /*div2_binding*/


      ctx[2](div2);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (dirty &
      /*fontFamilies*/
      2) {
        each_value_1 =
        /*fontFamilies*/
        ctx[1];

        var _i8;

        for (_i8 = 0; _i8 < each_value_1.length; _i8 += 1) {
          var child_ctx = get_each_context_1(ctx, each_value_1, _i8);

          if (each_blocks_1[_i8]) {
            each_blocks_1[_i8].p(child_ctx, dirty);
          } else {
            each_blocks_1[_i8] = create_each_block_1(child_ctx);

            each_blocks_1[_i8].c();

            each_blocks_1[_i8].m(div1, null);
          }
        }

        for (; _i8 < each_blocks_1.length; _i8 += 1) {
          each_blocks_1[_i8].d(1);
        }

        each_blocks_1.length = each_value_1.length;
      }

      if (dirty &
      /*fontFamilies*/
      2) {
        each_value =
        /*fontFamilies*/
        ctx[1];

        var _i9;

        for (_i9 = 0; _i9 < each_value.length; _i9 += 1) {
          var _child_ctx = get_each_context(ctx, each_value, _i9);

          if (each_blocks[_i9]) {
            each_blocks[_i9].p(_child_ctx, dirty);
          } else {
            each_blocks[_i9] = create_each_block(_child_ctx);

            each_blocks[_i9].c();

            each_blocks[_i9].m(div2, null);
          }
        }

        for (; _i9 < each_blocks.length; _i9 += 1) {
          each_blocks[_i9].d(1);
        }

        each_blocks.length = each_value.length;
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div2);
      destroy_each(each_blocks_1, detaching);
      destroy_each(each_blocks, detaching);
      /*div2_binding*/

      ctx[2](null);
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
  var container;
  var fontFamilies = ["arial", "tahoma", "timesNewRoman", "sourceSansPro"];

  function div2_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(0, container = $$value);
    });
  }

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("container" in $$props) $$invalidate(0, container = $$props.container);
  };

  return [container, fontFamilies, div2_binding];
}

var Font_families =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Font_families, _SvelteComponentDev);

  function Font_families(options) {
    var _this;

    _classCallCheck(this, Font_families);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Font_families).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Font_families",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Font_families;
}(SvelteComponentDev);

export default Font_families;
