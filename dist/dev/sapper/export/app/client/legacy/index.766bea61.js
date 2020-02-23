import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, n as noop } from './client.b598e8a3.js';

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

var Components =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Components, _SvelteComponentDev);

  function Components(options) {
    var _this;

    _classCallCheck(this, Components);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Components).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Components",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Components;
}(SvelteComponentDev);

export default Components;
