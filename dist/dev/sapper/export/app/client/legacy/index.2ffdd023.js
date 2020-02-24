import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, n as noop } from './client.d5c92d1b.js';

function create_fragment(ctx) {
  var block = {
    c: noop,
    l: noop,
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
  return this.redirect(307, "main/parser");
}

var Main =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Main, _SvelteComponentDev);

  function Main(options) {
    var _this;

    _classCallCheck(this, Main);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Main).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Main",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Main;
}(SvelteComponentDev);

export default Main;
export { preload };
