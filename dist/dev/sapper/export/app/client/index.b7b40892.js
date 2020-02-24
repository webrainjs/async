import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, X as query_selector_all, k as _forEachInstanceProperty, y as detach_dev, n as noop } from './client.f26f53d6.js';

function create_fragment(ctx) {
  var block = {
    c: function create() {
      this.h();
    },
    l: function claim(nodes) {
      var head_nodes = query_selector_all("[data-svelte=\"svelte-1pj146i\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      document.title = "Dev page";
    },
    m: noop,
    p: noop,
    i: noop,
    o: noop,
    d: noop
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

function preload() {
  return this.redirect(307, "dev/components");
}

var Dev =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Dev, _SvelteComponentDev);

  function Dev(options) {
    var _this;

    _classCallCheck(this, Dev);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Dev).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Dev",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Dev;
}(SvelteComponentDev);

export default Dev;
export { preload };
