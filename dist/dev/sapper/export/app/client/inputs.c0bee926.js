import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, t as element, v as claim_element, w as children, k as _forEachInstanceProperty, y as detach_dev, z as attr_dev, A as add_location, B as insert_dev, n as noop } from './client.f26f53d6.js';

var file = "src\\routes\\dev\\components\\medium\\inputs.svelte";

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
      attr_dev(div, "class", "container svelte-zcidxm");
      add_location(div, file, 4, 0, 21);
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

var Inputs =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Inputs, _SvelteComponentDev);

  function Inputs(options) {
    var _this;

    _classCallCheck(this, Inputs);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Inputs).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Inputs",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Inputs;
}(SvelteComponentDev);

export default Inputs;
