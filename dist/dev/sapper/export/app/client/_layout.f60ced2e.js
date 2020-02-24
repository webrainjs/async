import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, Y as _Object$entries, Z as stores$1, q as _sliceInstanceProperty, t as element, G as text, H as space, v as claim_element, w as children, I as claim_text, J as claim_space, k as _forEachInstanceProperty, y as detach_dev, z as attr_dev, $ as toggle_class, A as add_location, B as insert_dev, K as append_dev, a0 as set_data_dev, a1 as group_outros, E as transition_out, a2 as check_outros, D as transition_in, a3 as destroy_each, r as create_slot, V as set_style, L as get_slot_context, M as get_slot_changes } from './client.f26f53d6.js';

var file = "src\\routes\\dev\\components\\_layout.svelte";

function get_each_context_1(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[7] = list[i];
  return child_ctx;
}

function get_each_context(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[7] = list[i];
  return child_ctx;
}

function get_each_context_2(ctx, list, i) {
  var child_ctx = _sliceInstanceProperty(ctx).call(ctx);

  child_ctx[12] = list[i][0];
  child_ctx[1] = list[i][1];
  return child_ctx;
} // (30:2) {#each Object.entries(paths) as [path, options]}


function create_each_block_2(ctx) {
  var a;
  var t0_value =
  /*path*/
  ctx[12] + "";
  var t0;
  var t1;
  var a_href_value;
  var a_rel_value;
  var block = {
    c: function create() {
      a = element("a");
      t0 = text(t0_value);
      t1 = space();
      this.h();
    },
    l: function claim(nodes) {
      a = claim_element(nodes, "A", {
        href: true,
        rel: true,
        class: true
      });
      var a_nodes = children(a);
      t0 = claim_text(a_nodes, t0_value);
      t1 = claim_space(a_nodes);

      _forEachInstanceProperty(a_nodes).call(a_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(a, "href", a_href_value = "" + (rootPath +
      /*path*/
      ctx[12]));
      attr_dev(a, "rel", a_rel_value =
      /*options*/
      ctx[1] &&
      /*options*/
      ctx[1].prefetch === false ? null : "prefetch");
      attr_dev(a, "class", "components__menu-item button flex__item--fit flex flex--vertical svelte-15vliw5");
      toggle_class(a, "components__menu-item--selected",
      /*currentPath*/
      ctx[0] ===
      /*path*/
      ctx[12]);
      toggle_class(a, "components__menu-item--completed",
      /*options*/
      ctx[1] &&
      /*options*/
      ctx[1].completed);
      add_location(a, file, 30, 3, 1079);
    },
    m: function mount(target, anchor) {
      insert_dev(target, a, anchor);
      append_dev(a, t0);
      append_dev(a, t1);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*currentPath, Object, paths*/
      5) {
        toggle_class(a, "components__menu-item--selected",
        /*currentPath*/
        ctx[0] ===
        /*path*/
        ctx[12]);
      }

      if (dirty &
      /*Object, paths*/
      4) {
        toggle_class(a, "components__menu-item--completed",
        /*options*/
        ctx[1] &&
        /*options*/
        ctx[1].completed);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(a);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_2.name,
    type: "each",
    source: "(30:2) {#each Object.entries(paths) as [path, options]}",
    ctx: ctx
  });
  return block;
} // (86:38) 


function create_if_block_3(ctx) {
  var div;
  var current;
  var default_slot_template =
  /*$$slots*/
  ctx[6].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[5], null);
  var block = {
    c: function create() {
      div = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      var div_nodes = children(div);
      if (default_slot) default_slot.l(div_nodes);

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "flex__item--fill position-relative svelte-15vliw5");
      set_style(div, "background",
      /*options*/
      ctx[1].background || "none");
      add_location(div, file, 86, 3, 3289);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);

      if (default_slot) {
        default_slot.m(div, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      32) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[5], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[5], dirty, null));
      }

      if (!current || dirty &
      /*options*/
      2) {
        set_style(div, "background",
        /*options*/
        ctx[1].background || "none");
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
      if (detaching) detach_dev(div);
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_3.name,
    type: "if",
    source: "(86:38) ",
    ctx: ctx
  });
  return block;
} // (73:49) 


function create_if_block_2(ctx) {
  var div3;
  var div2;
  var div0;
  var t;
  var div1;
  var current;
  var default_slot_template =
  /*$$slots*/
  ctx[6].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[5], null);
  var each_value_1 =
  /*options*/
  ctx[1].images || ["client/images/design/" +
  /*currentPath*/
  ctx[0] + ".png"];
  var each_blocks = [];

  for (var i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }

  var block = {
    c: function create() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");
      if (default_slot) default_slot.c();
      t = space();
      div1 = element("div");

      for (var _i = 0; _i < each_blocks.length; _i += 1) {
        each_blocks[_i].c();
      }

      this.h();
    },
    l: function claim(nodes) {
      div3 = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      var div3_nodes = children(div3);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      if (default_slot) default_slot.l(div0_nodes);

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true,
        style: true
      });
      var div1_nodes = children(div1);

      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
        each_blocks[_i2].l(div1_nodes);
      }

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      _forEachInstanceProperty(div3_nodes).call(div3_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "components__component svelte-15vliw5");
      add_location(div0, file, 75, 5, 2895);
      attr_dev(div1, "class", "components__design flex flex--vertical svelte-15vliw5");
      set_style(div1, "padding-top", "1em");
      add_location(div1, file, 78, 5, 2968);
      attr_dev(div2, "class", "scroll-vertical__content flex flex--vertical overflow-visible svelte-15vliw5");
      add_location(div2, file, 74, 4, 2814);
      attr_dev(div3, "class", "flex__item--fill position-relative scroll-vertical svelte-15vliw5");
      set_style(div3, "background",
      /*options*/
      ctx[1].background || "none");
      add_location(div3, file, 73, 3, 2693);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div3, anchor);
      append_dev(div3, div2);
      append_dev(div2, div0);

      if (default_slot) {
        default_slot.m(div0, null);
      }

      append_dev(div2, t);
      append_dev(div2, div1);

      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].m(div1, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      32) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[5], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[5], dirty, null));
      }

      if (dirty &
      /*options, currentPath*/
      3) {
        each_value_1 =
        /*options*/
        ctx[1].images || ["client/images/design/" +
        /*currentPath*/
        ctx[0] + ".png"];

        var _i4;

        for (_i4 = 0; _i4 < each_value_1.length; _i4 += 1) {
          var child_ctx = get_each_context_1(ctx, each_value_1, _i4);

          if (each_blocks[_i4]) {
            each_blocks[_i4].p(child_ctx, dirty);
          } else {
            each_blocks[_i4] = create_each_block_1(child_ctx);

            each_blocks[_i4].c();

            each_blocks[_i4].m(div1, null);
          }
        }

        for (; _i4 < each_blocks.length; _i4 += 1) {
          each_blocks[_i4].d(1);
        }

        each_blocks.length = each_value_1.length;
      }

      if (!current || dirty &
      /*options*/
      2) {
        set_style(div3, "background",
        /*options*/
        ctx[1].background || "none");
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
      if (detaching) detach_dev(div3);
      if (default_slot) default_slot.d(detaching);
      destroy_each(each_blocks, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_2.name,
    type: "if",
    source: "(73:49) ",
    ctx: ctx
  });
  return block;
} // (60:51) 


function create_if_block_1(ctx) {
  var div3;
  var div2;
  var div0;
  var t;
  var div1;
  var current;
  var each_value =
  /*options*/
  ctx[1].images || ["client/images/design/" +
  /*currentPath*/
  ctx[0] + ".png"];
  var each_blocks = [];

  for (var i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  var default_slot_template =
  /*$$slots*/
  ctx[6].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[5], null);
  var block = {
    c: function create() {
      div3 = element("div");
      div2 = element("div");
      div0 = element("div");

      for (var _i5 = 0; _i5 < each_blocks.length; _i5 += 1) {
        each_blocks[_i5].c();
      }

      t = space();
      div1 = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div3 = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      var div3_nodes = children(div3);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true,
        style: true
      });
      var div0_nodes = children(div0);

      for (var _i6 = 0; _i6 < each_blocks.length; _i6 += 1) {
        each_blocks[_i6].l(div0_nodes);
      }

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      t = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      if (default_slot) default_slot.l(div1_nodes);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      _forEachInstanceProperty(div3_nodes).call(div3_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "components__design flex svelte-15vliw5");
      set_style(div0, "padding-right", "1em");
      add_location(div0, file, 62, 5, 2301);
      attr_dev(div1, "class", "components__component svelte-15vliw5");
      add_location(div1, file, 67, 5, 2551);
      attr_dev(div2, "class", "scroll-horizontal__content flex overflow-visible svelte-15vliw5");
      add_location(div2, file, 61, 4, 2233);
      attr_dev(div3, "class", "flex__item--fill position-relative scroll-horizontal svelte-15vliw5");
      set_style(div3, "background",
      /*options*/
      ctx[1].background || "none");
      add_location(div3, file, 60, 3, 2110);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div3, anchor);
      append_dev(div3, div2);
      append_dev(div2, div0);

      for (var _i7 = 0; _i7 < each_blocks.length; _i7 += 1) {
        each_blocks[_i7].m(div0, null);
      }

      append_dev(div2, t);
      append_dev(div2, div1);

      if (default_slot) {
        default_slot.m(div1, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*options, currentPath*/
      3) {
        each_value =
        /*options*/
        ctx[1].images || ["client/images/design/" +
        /*currentPath*/
        ctx[0] + ".png"];

        var _i8;

        for (_i8 = 0; _i8 < each_value.length; _i8 += 1) {
          var child_ctx = get_each_context(ctx, each_value, _i8);

          if (each_blocks[_i8]) {
            each_blocks[_i8].p(child_ctx, dirty);
          } else {
            each_blocks[_i8] = create_each_block(child_ctx);

            each_blocks[_i8].c();

            each_blocks[_i8].m(div0, null);
          }
        }

        for (; _i8 < each_blocks.length; _i8 += 1) {
          each_blocks[_i8].d(1);
        }

        each_blocks.length = each_value.length;
      }

      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      32) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[5], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[5], dirty, null));
      }

      if (!current || dirty &
      /*options*/
      2) {
        set_style(div3, "background",
        /*options*/
        ctx[1].background || "none");
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
      if (detaching) detach_dev(div3);
      destroy_each(each_blocks, detaching);
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_1.name,
    type: "if",
    source: "(60:51) ",
    ctx: ctx
  });
  return block;
} // (49:2) {#if options.layout === 'series'}


function create_if_block(ctx) {
  var div2;
  var div1;
  var div0;
  var div0_class_value;
  var current;
  var default_slot_template =
  /*$$slots*/
  ctx[6].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[5], null);
  var block = {
    c: function create() {
      div2 = element("div");
      div1 = element("div");
      div0 = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true,
        style: true
      });
      var div2_nodes = children(div2);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      if (default_slot) default_slot.l(div0_nodes);

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", div0_class_value = "layout-" +
      /*options*/
      ctx[1].layout + "__component" + " svelte-15vliw5");
      add_location(div0, file, 54, 5, 1953);
      attr_dev(div1, "class", "scroll-vertical__content flex overflow-visible svelte-15vliw5");
      toggle_class(div1, "flex--vertical", !
      /*options*/
      ctx[1] || !
      /*options*/
      ctx[1].vertical);
      add_location(div1, file, 50, 4, 1816);
      attr_dev(div2, "class", "flex__item--fill position-relative scroll-vertical svelte-15vliw5");
      set_style(div2, "background",
      /*options*/
      ctx[1].background || "none");
      add_location(div2, file, 49, 3, 1695);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div1);
      append_dev(div1, div0);

      if (default_slot) {
        default_slot.m(div0, null);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      32) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[5], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[5], dirty, null));
      }

      if (!current || dirty &
      /*options*/
      2 && div0_class_value !== (div0_class_value = "layout-" +
      /*options*/
      ctx[1].layout + "__component" + " svelte-15vliw5")) {
        attr_dev(div0, "class", div0_class_value);
      }

      if (dirty &
      /*options*/
      2) {
        toggle_class(div1, "flex--vertical", !
        /*options*/
        ctx[1] || !
        /*options*/
        ctx[1].vertical);
      }

      if (!current || dirty &
      /*options*/
      2) {
        set_style(div2, "background",
        /*options*/
        ctx[1].background || "none");
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
    id: create_if_block.name,
    type: "if",
    source: "(49:2) {#if options.layout === 'series'}",
    ctx: ctx
  });
  return block;
} // (80:6) {#each options.images || [`client/images/design/${currentPath}.png`] as image}


function create_each_block_1(ctx) {
  var img;
  var img_src_value;
  var block = {
    c: function create() {
      img = element("img");
      this.h();
    },
    l: function claim(nodes) {
      img = claim_element(nodes, "IMG", {
        src: true,
        class: true,
        alt: true
      });
      this.h();
    },
    h: function hydrate() {
      if (img.src !== (img_src_value =
      /*image*/
      ctx[7])) attr_dev(img, "src", img_src_value);
      attr_dev(img, "class", "design-image svelte-15vliw5");
      attr_dev(img, "alt", "Design image");
      add_location(img, file, 80, 7, 3139);
    },
    m: function mount(target, anchor) {
      insert_dev(target, img, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*options, currentPath*/
      3 && img.src !== (img_src_value =
      /*image*/
      ctx[7])) {
        attr_dev(img, "src", img_src_value);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(img);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_1.name,
    type: "each",
    source: "(80:6) {#each options.images || [`client/images/design/${currentPath}.png`] as image}",
    ctx: ctx
  });
  return block;
} // (64:6) {#each options.images || [`client/images/design/${currentPath}.png`] as image}


function create_each_block(ctx) {
  var img;
  var img_src_value;
  var block = {
    c: function create() {
      img = element("img");
      this.h();
    },
    l: function claim(nodes) {
      img = claim_element(nodes, "IMG", {
        src: true,
        class: true,
        alt: true
      });
      this.h();
    },
    h: function hydrate() {
      if (img.src !== (img_src_value =
      /*image*/
      ctx[7])) attr_dev(img, "src", img_src_value);
      attr_dev(img, "class", "design-image svelte-15vliw5");
      attr_dev(img, "alt", "Design image");
      add_location(img, file, 64, 7, 2459);
    },
    m: function mount(target, anchor) {
      insert_dev(target, img, anchor);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*options, currentPath*/
      3 && img.src !== (img_src_value =
      /*image*/
      ctx[7])) {
        attr_dev(img, "src", img_src_value);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(img);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block.name,
    type: "each",
    source: "(64:6) {#each options.images || [`client/images/design/${currentPath}.png`] as image}",
    ctx: ctx
  });
  return block;
}

function create_fragment(ctx) {
  var div3;
  var div0;
  var t0;
  var div2;
  var div1;
  var t1_value = (
  /*currentPath*/
  ctx[0] || "/") + "";
  var t1;
  var t2;
  var current_block_type_index;
  var if_block;
  var current;

  var each_value_2 = _Object$entries(
  /*paths*/
  ctx[2]);

  var each_blocks = [];

  for (var i = 0; i < each_value_2.length; i += 1) {
    each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
  }

  var if_block_creators = [create_if_block, create_if_block_1, create_if_block_2, create_if_block_3];
  var if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*options*/
    ctx[1].layout === "series") return 0;
    if (
    /*options*/
    ctx[1].layout === "design-horizontal") return 1;
    if (
    /*options*/
    ctx[1].layout === "design-vertical") return 2;
    if (
    /*options*/
    ctx[1].layout === "fill") return 3;
    return -1;
  }

  if (~(current_block_type_index = select_block_type(ctx))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }

  var block = {
    c: function create() {
      div3 = element("div");
      div0 = element("div");

      for (var _i9 = 0; _i9 < each_blocks.length; _i9 += 1) {
        each_blocks[_i9].c();
      }

      t0 = space();
      div2 = element("div");
      div1 = element("div");
      t1 = text(t1_value);
      t2 = space();
      if (if_block) if_block.c();
      this.h();
    },
    l: function claim(nodes) {
      div3 = claim_element(nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      div0 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);

      for (var _i10 = 0; _i10 < each_blocks.length; _i10 += 1) {
        each_blocks[_i10].l(div0_nodes);
      }

      _forEachInstanceProperty(div0_nodes).call(div0_nodes, detach_dev);

      t0 = claim_space(div3_nodes);
      div2 = claim_element(div3_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t1 = claim_text(div1_nodes, t1_value);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      t2 = claim_space(div2_nodes);
      if (if_block) if_block.l(div2_nodes);

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      _forEachInstanceProperty(div3_nodes).call(div3_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "components__menu flex__item--fit flex flex--vertical svelte-15vliw5");
      add_location(div0, file, 28, 1, 958);
      attr_dev(div1, "class", "components__title flex__item--fit svelte-15vliw5");
      toggle_class(div1, "components__title--completed",
      /*options*/
      ctx[1] &&
      /*options*/
      ctx[1].completed);
      add_location(div1, file, 42, 2, 1497);
      attr_dev(div2, "class", "flex__item--fill flex flex--vertical svelte-15vliw5");
      add_location(div2, file, 41, 1, 1444);
      attr_dev(div3, "class", "components flex font-base svelte-15vliw5");
      add_location(div3, file, 27, 0, 917);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div3, anchor);
      append_dev(div3, div0);

      for (var _i11 = 0; _i11 < each_blocks.length; _i11 += 1) {
        each_blocks[_i11].m(div0, null);
      }

      append_dev(div3, t0);
      append_dev(div3, div2);
      append_dev(div2, div1);
      append_dev(div1, t1);
      append_dev(div2, t2);

      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(div2, null);
      }

      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (dirty &
      /*rootPath, Object, paths, currentPath*/
      5) {
        each_value_2 = _Object$entries(
        /*paths*/
        ctx[2]);

        var _i12;

        for (_i12 = 0; _i12 < each_value_2.length; _i12 += 1) {
          var child_ctx = get_each_context_2(ctx, each_value_2, _i12);

          if (each_blocks[_i12]) {
            each_blocks[_i12].p(child_ctx, dirty);
          } else {
            each_blocks[_i12] = create_each_block_2(child_ctx);

            each_blocks[_i12].c();

            each_blocks[_i12].m(div0, null);
          }
        }

        for (; _i12 < each_blocks.length; _i12 += 1) {
          each_blocks[_i12].d(1);
        }

        each_blocks.length = each_value_2.length;
      }

      if ((!current || dirty &
      /*currentPath*/
      1) && t1_value !== (t1_value = (
      /*currentPath*/
      ctx[0] || "/") + "")) set_data_dev(t1, t1_value);

      if (dirty &
      /*options*/
      2) {
        toggle_class(div1, "components__title--completed",
        /*options*/
        ctx[1] &&
        /*options*/
        ctx[1].completed);
      }

      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, function () {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }

        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block.c();
          }

          transition_in(if_block, 1);
          if_block.m(div2, null);
        } else {
          if_block = null;
        }
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div3);
      destroy_each(each_blocks, detaching);

      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d();
      }
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

var rootPath = "dev/components/";

function instance($$self, $$props, $$invalidate) {
  var pageStore = stores$1();
  var page = pageStore && pageStore.page; // export let segment

  var paths = {
    "small/icons": {
      completed: true,
      background: "black",
      layout: "series"
    },
    "small/fonts": {
      completed: true,
      background: "black",
      layout: "series"
    },
    "small/font-families": {
      completed: true,
      background: "black",
      layout: "fill"
    },
    "small/buttons": {
      completed: true,
      background: "black",
      layout: "series"
    },
    "small/markers": {
      completed: true,
      background: "black",
      layout: "series"
    },
    "medium/dropdowns": {
      completed: true,
      background: "black",
      layout: "series"
    },
    "medium/inputs": {
      completed: true,
      background: "black",
      layout: "series"
    }
  };
  var currentPath;
  page.subscribe(function (o) {
    $$invalidate(0, currentPath = o.path.substring(rootPath.length + 1));
  });
  var options;
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("paths" in $$props) $$invalidate(2, paths = $$props.paths);
    if ("currentPath" in $$props) $$invalidate(0, currentPath = $$props.currentPath);
    if ("options" in $$props) $$invalidate(1, options = $$props.options);
  };

  $$self.$$.update = function () {
    if ($$self.$$.dirty &
    /*currentPath*/
    1) {
       $$invalidate(1, options = paths[currentPath] || {});
    }
  };

  return [currentPath, options, paths, pageStore, page, $$scope, $$slots];
}

var Layout =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Layout, _SvelteComponentDev);

  function Layout(options) {
    var _this;

    _classCallCheck(this, Layout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layout).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Layout",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Layout;
}(SvelteComponentDev);

export default Layout;
