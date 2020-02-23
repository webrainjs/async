import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, p as element, r as claim_element, t as children, h as _forEachInstanceProperty, v as detach_dev, w as attr_dev, x as add_location, y as insert_dev, n as noop } from './client.b598e8a3.js';

var file = "src\\routes\\dev\\components\\medium\\dropdowns.svelte";

function create_fragment(ctx) {
  var div;
  var block = {
    c: function create() {
      div = element("div");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true
      });
      var div_nodes = children(div);

      _forEachInstanceProperty(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div, "class", "container svelte-1mhwgxz");
      add_location(div, file, 4, 0, 95);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
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

var Dropdowns =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Dropdowns, _SvelteComponentDev);

  function Dropdowns(options) {
    var _this;

    _classCallCheck(this, Dropdowns);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dropdowns).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Dropdowns",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Dropdowns;
}(SvelteComponentDev);

export default Dropdowns;
