import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, t as element, G as text, v as claim_element, w as children, I as claim_text, k as _forEachInstanceProperty, y as detach_dev, z as attr_dev, A as add_location, B as insert_dev, K as append_dev, n as noop } from './client.f26f53d6.js';

var file = "src\\routes\\main\\parser.svelte";

function create_fragment(ctx) {
  var main;
  var span;
  var t;
  var block = {
    c: function create() {
      main = element("main");
      span = element("span");
      t = text("Main page");
      this.h();
    },
    l: function claim(nodes) {
      main = claim_element(nodes, "MAIN", {
        class: true
      });
      var main_nodes = children(main);
      span = claim_element(main_nodes, "SPAN", {
        class: true
      });
      var span_nodes = children(span);
      t = claim_text(span_nodes, "Main page");

      _forEachInstanceProperty(span_nodes).call(span_nodes, detach_dev);

      _forEachInstanceProperty(main_nodes).call(main_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(span, "class", "text svelte-1uhyz9e");
      add_location(span, file, 1, 1, 21);
      attr_dev(main, "class", "fill svelte-1uhyz9e");
      add_location(main, file, 0, 0, 0);
    },
    m: function mount(target, anchor) {
      insert_dev(target, main, anchor);
      append_dev(main, span);
      append_dev(span, t);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(main);
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

var Parser =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Parser, _SvelteComponentDev);

  function Parser(options) {
    var _this;

    _classCallCheck(this, Parser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Parser).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Parser",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Parser;
}(SvelteComponentDev);

export default Parser;
