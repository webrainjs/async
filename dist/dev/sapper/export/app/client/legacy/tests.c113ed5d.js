import { ai as global, aj as $, ah as path, _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, N as onMount, E as space, p as element, D as text, ak as svg_element, R as query_selector_all, h as _forEachInstanceProperty, v as detach_dev, G as claim_space, r as claim_element, t as children, F as claim_text, w as attr_dev, x as add_location, Q as set_style, y as insert_dev, H as append_dev, n as noop, P as binding_callbacks } from './client.b598e8a3.js';

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

var file = "src\\routes\\dev\\tests.svelte";

function create_fragment(ctx) {
  var t0;
  var h20;
  var t1;
  var t2;
  var div1;
  var t3;
  var div0;
  var t4;
  var div2;
  var t5;
  var img;
  var img_src_value;
  var t6;
  var div3;
  var t7;
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
  var t8;
  var h21;
  var t9;
  var t10;
  var div4;
  var canvas_1;
  var t11;
  var h22;
  var t12;
  var t13;
  var div5;
  var audio;
  var source;
  var source_src_value;
  var p;
  var t14;
  var a;
  var t15;
  var t16;
  var block = {
    c: function create() {
      t0 = space();
      h20 = element("h2");
      t1 = text("SVG Gradient");
      t2 = space();
      div1 = element("div");
      t3 = text("CSS:\n\t");
      div0 = element("div");
      t4 = space();
      div2 = element("div");
      t5 = text("<img />:\n\t");
      img = element("img");
      t6 = space();
      div3 = element("div");
      t7 = text("<svg />:\n\t");
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
      t8 = space();
      h21 = element("h2");
      t9 = text("Canvas");
      t10 = space();
      div4 = element("div");
      canvas_1 = element("canvas");
      t11 = space();
      h22 = element("h2");
      t12 = text("Sounds");
      t13 = space();
      div5 = element("div");
      audio = element("audio");
      source = element("source");
      p = element("p");
      t14 = text("Your browser does not support HTML5 audio, but you can still\n\t\t\t");
      a = element("a");
      t15 = text("download the music");
      t16 = text(".");
      this.h();
    },
    l: function claim(nodes) {
      var _context, _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13, _context14, _context15, _context16;

      var head_nodes = query_selector_all("[data-svelte=\"svelte-34ep71\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      h20 = claim_element(nodes, "H2", {
        class: true
      });
      var h20_nodes = children(h20);
      t1 = claim_text(h20_nodes, "SVG Gradient");

      _forEachInstanceProperty(h20_nodes).call(h20_nodes, detach_dev);

      t2 = claim_space(nodes);
      div1 = claim_element(nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      t3 = claim_text(div1_nodes, "CSS:\n\t");
      div0 = claim_element(div1_nodes, "DIV", {
        class: true
      });

      _forEachInstanceProperty(_context = children(div0)).call(_context, detach_dev);

      _forEachInstanceProperty(div1_nodes).call(div1_nodes, detach_dev);

      t4 = claim_space(nodes);
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      t5 = claim_text(div2_nodes, "<img />:\n\t");
      img = claim_element(div2_nodes, "IMG", {
        src: true,
        alt: true,
        class: true
      });

      _forEachInstanceProperty(div2_nodes).call(div2_nodes, detach_dev);

      t6 = claim_space(nodes);
      div3 = claim_element(nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      t7 = claim_text(div3_nodes, "<svg />:\n\t");
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

      t8 = claim_space(nodes);
      h21 = claim_element(nodes, "H2", {
        class: true
      });
      var h21_nodes = children(h21);
      t9 = claim_text(h21_nodes, "Canvas");

      _forEachInstanceProperty(h21_nodes).call(h21_nodes, detach_dev);

      t10 = claim_space(nodes);
      div4 = claim_element(nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      canvas_1 = claim_element(div4_nodes, "CANVAS", {
        class: true
      });

      _forEachInstanceProperty(_context16 = children(canvas_1)).call(_context16, detach_dev);

      _forEachInstanceProperty(div4_nodes).call(div4_nodes, detach_dev);

      t11 = claim_space(nodes);
      h22 = claim_element(nodes, "H2", {
        class: true
      });
      var h22_nodes = children(h22);
      t12 = claim_text(h22_nodes, "Sounds");

      _forEachInstanceProperty(h22_nodes).call(h22_nodes, detach_dev);

      t13 = claim_space(nodes);
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
      t14 = claim_text(p_nodes, "Your browser does not support HTML5 audio, but you can still\n\t\t\t");
      a = claim_element(p_nodes, "A", {
        href: true
      });
      var a_nodes = children(a);
      t15 = claim_text(a_nodes, "download the music");

      _forEachInstanceProperty(a_nodes).call(a_nodes, detach_dev);

      t16 = claim_text(p_nodes, ".");

      _forEachInstanceProperty(p_nodes).call(p_nodes, detach_dev);

      _forEachInstanceProperty(audio_nodes).call(audio_nodes, detach_dev);

      _forEachInstanceProperty(div5_nodes).call(div5_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      document.title = "Page for tests";
      attr_dev(h20, "class", "svelte-cw6q2z");
      add_location(h20, file, 4, 0, 61);
      attr_dev(div0, "class", "ref-gradient svelte-cw6q2z");
      add_location(div0, file, 7, 1, 108);
      attr_dev(div1, "class", "box svelte-cw6q2z");
      add_location(div1, file, 5, 0, 83);
      if (img.src !== (img_src_value = "client/images/tests/gradient.svg")) attr_dev(img, "src", img_src_value);
      attr_dev(img, "alt", "gradient");
      attr_dev(img, "class", "svelte-cw6q2z");
      add_location(img, file, 11, 1, 202);
      attr_dev(div2, "class", "box svelte-cw6q2z");
      add_location(div2, file, 9, 0, 167);
      attr_dev(stop0, "offset", "0%");
      set_style(stop0, "stop-color", "yellow");
      add_location(stop0, file, 23, 3, 520);
      attr_dev(stop1, "offset", "100%");
      set_style(stop1, "stop-color", "blue");
      add_location(stop1, file, 24, 3, 573);
      attr_dev(linearGradient0, "id", "gradient1");
      attr_dev(linearGradient0, "x1", "0");
      attr_dev(linearGradient0, "y1", "0");
      attr_dev(linearGradient0, "x2", "0.8");
      attr_dev(linearGradient0, "y2", "0.8");
      add_location(linearGradient0, file, 22, 2, 453);
      attr_dev(stop2, "offset", "0%");
      set_style(stop2, "stop-color", "yellow");
      add_location(stop2, file, 28, 3, 737);
      attr_dev(stop3, "offset", "50%");
      set_style(stop3, "stop-color", "blue");
      add_location(stop3, file, 29, 3, 790);
      attr_dev(stop4, "offset", "100%");
      set_style(stop4, "stop-color", "yellow");
      add_location(stop4, file, 30, 3, 841);
      attr_dev(linearGradient1, "id", "gradient2");
      attr_dev(linearGradient1, "x1", "0.4");
      attr_dev(linearGradient1, "y1", "0.4");
      attr_dev(linearGradient1, "x2", "0.5");
      attr_dev(linearGradient1, "y2", "0.5");
      attr_dev(linearGradient1, "spreadMethod", "repeat");
      add_location(linearGradient1, file, 27, 2, 644);
      attr_dev(stop5, "offset", "0%");
      set_style(stop5, "stop-color", "yellow");
      add_location(stop5, file, 34, 3, 993);
      attr_dev(stop6, "offset", "100%");
      set_style(stop6, "stop-color", "blue");
      add_location(stop6, file, 35, 3, 1046);
      attr_dev(radialGradient0, "id", "gradient3");
      attr_dev(radialGradient0, "fx", "0.7");
      attr_dev(radialGradient0, "fy", "0.7");
      attr_dev(radialGradient0, "cx", "0.5");
      attr_dev(radialGradient0, "cy", "0.5");
      attr_dev(radialGradient0, "r", "0.4");
      add_location(radialGradient0, file, 33, 2, 914);
      attr_dev(stop7, "offset", "0%");
      set_style(stop7, "stop-color", "yellow");
      add_location(stop7, file, 39, 3, 1218);
      attr_dev(stop8, "offset", "50%");
      set_style(stop8, "stop-color", "blue");
      add_location(stop8, file, 40, 3, 1271);
      attr_dev(stop9, "offset", "100%");
      set_style(stop9, "stop-color", "yellow");
      add_location(stop9, file, 41, 3, 1322);
      attr_dev(radialGradient1, "id", "gradient4");
      attr_dev(radialGradient1, "fx", "0.5");
      attr_dev(radialGradient1, "fy", "0.5");
      attr_dev(radialGradient1, "cx", "0.6");
      attr_dev(radialGradient1, "cy", "0.6");
      attr_dev(radialGradient1, "r", "0.2");
      attr_dev(radialGradient1, "spreadMethod", "repeat");
      add_location(radialGradient1, file, 38, 2, 1117);
      attr_dev(rect0, "x", "10");
      attr_dev(rect0, "y", "10");
      attr_dev(rect0, "width", "180");
      attr_dev(rect0, "height", "120");
      set_style(rect0, "fill", "url(#gradient1)");
      add_location(rect0, file, 44, 2, 1395);
      attr_dev(rect1, "x", "210");
      attr_dev(rect1, "y", "10");
      attr_dev(rect1, "width", "180");
      attr_dev(rect1, "height", "120");
      set_style(rect1, "fill", "url(#gradient2)");
      add_location(rect1, file, 46, 2, 1475);
      attr_dev(rect2, "x", "10");
      attr_dev(rect2, "y", "150");
      attr_dev(rect2, "width", "180");
      attr_dev(rect2, "height", "120");
      set_style(rect2, "fill", "url(#gradient3)");
      add_location(rect2, file, 48, 2, 1556);
      attr_dev(rect3, "x", "210");
      attr_dev(rect3, "y", "150");
      attr_dev(rect3, "width", "180");
      attr_dev(rect3, "height", "120");
      set_style(rect3, "fill", "url(#gradient4)");
      add_location(rect3, file, 50, 2, 1637);
      attr_dev(svg, "version", "1.1");
      attr_dev(svg, "id", "Layer_1");
      attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
      attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
      attr_dev(svg, "viewBox", "0 0 390 270");
      attr_dev(svg, "class", "svelte-cw6q2z");
      add_location(svg, file, 15, 1, 306);
      attr_dev(div3, "class", "box svelte-cw6q2z");
      add_location(div3, file, 13, 0, 271);
      attr_dev(h21, "class", "svelte-cw6q2z");
      add_location(h21, file, 54, 0, 1732);
      attr_dev(canvas_1, "class", "fill svelte-cw6q2z");
      add_location(canvas_1, file, 56, 1, 1767);
      attr_dev(div4, "class", "box svelte-cw6q2z");
      add_location(div4, file, 55, 0, 1748);
      attr_dev(h22, "class", "svelte-cw6q2z");
      add_location(h22, file, 59, 0, 1819);
      if (source.src !== (source_src_value = "client/sounds/click.ogg")) attr_dev(source, "src", source_src_value);
      attr_dev(source, "type", "audio/ogg");
      add_location(source, file, 63, 2, 1929);
      attr_dev(a, "href", "client/sounds/click.mp3");
      add_location(a, file, 66, 3, 2112);
      add_location(p, file, 65, 2, 2045);
      attr_dev(audio, "class", "svelte-cw6q2z");
      add_location(audio, file, 61, 1, 1854);
      attr_dev(div5, "class", "box svelte-cw6q2z");
      add_location(div5, file, 60, 0, 1835);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, h20, anchor);
      append_dev(h20, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, div1, anchor);
      append_dev(div1, t3);
      append_dev(div1, div0);
      /*div0_binding*/

      ctx[2](div0);
      insert_dev(target, t4, anchor);
      insert_dev(target, div2, anchor);
      append_dev(div2, t5);
      append_dev(div2, img);
      insert_dev(target, t6, anchor);
      insert_dev(target, div3, anchor);
      append_dev(div3, t7);
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
      insert_dev(target, t8, anchor);
      insert_dev(target, h21, anchor);
      append_dev(h21, t9);
      insert_dev(target, t10, anchor);
      insert_dev(target, div4, anchor);
      append_dev(div4, canvas_1);
      /*canvas_1_binding*/

      ctx[3](canvas_1);
      insert_dev(target, t11, anchor);
      insert_dev(target, h22, anchor);
      append_dev(h22, t12);
      insert_dev(target, t13, anchor);
      insert_dev(target, div5, anchor);
      append_dev(div5, audio);
      append_dev(audio, source);
      append_dev(audio, p);
      append_dev(p, t14);
      append_dev(p, a);
      append_dev(a, t15);
      append_dev(p, t16);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(h20);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(div1);
      /*div0_binding*/

      ctx[2](null);
      if (detaching) detach_dev(t4);
      if (detaching) detach_dev(div2);
      if (detaching) detach_dev(t6);
      if (detaching) detach_dev(div3);
      if (detaching) detach_dev(t8);
      if (detaching) detach_dev(h21);
      if (detaching) detach_dev(t10);
      if (detaching) detach_dev(div4);
      /*canvas_1_binding*/

      ctx[3](null);
      if (detaching) detach_dev(t11);
      if (detaching) detach_dev(h22);
      if (detaching) detach_dev(t13);
      if (detaching) detach_dev(div5);
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
