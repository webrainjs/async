import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, a4 as _JSON$stringify, g as appConfig, E as space, p as element, D as text, R as query_selector_all, h as _forEachInstanceProperty, v as detach_dev, G as claim_space, r as claim_element, t as children, F as claim_text, x as add_location, w as attr_dev, y as insert_dev, H as append_dev, n as noop } from './client.b24ea231.js';

var file = "src\\routes\\dev\\app-info.svelte";

function create_fragment(ctx) {
  var t0;
  var h2;
  var t1;
  var t2;
  var pre;
  var code;
  var t3_value = _JSON$stringify(appConfig, null, 4) + "";
  var t3;
  var block = {
    c: function create() {
      t0 = space();
      h2 = element("h2");
      t1 = text("App Info");
      t2 = space();
      pre = element("pre");
      code = element("code");
      t3 = text(t3_value);
      this.h();
    },
    l: function claim(nodes) {
      var head_nodes = query_selector_all("[data-svelte=\"svelte-bghuqt\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      h2 = claim_element(nodes, "H2", {});
      var h2_nodes = children(h2);
      t1 = claim_text(h2_nodes, "App Info");

      _forEachInstanceProperty(h2_nodes).call(h2_nodes, detach_dev);

      t2 = claim_space(nodes);
      pre = claim_element(nodes, "PRE", {
        class: true
      });
      var pre_nodes = children(pre);
      code = claim_element(pre_nodes, "CODE", {});
      var code_nodes = children(code);
      t3 = claim_text(code_nodes, t3_value);

      _forEachInstanceProperty(code_nodes).call(code_nodes, detach_dev);

      _forEachInstanceProperty(pre_nodes).call(pre_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      document.title = "App Info";
      add_location(h2, file, 4, 0, 55);
      add_location(code, file, 6, 4, 100);
      attr_dev(pre, "class", "app-info svelte-1dxj7qz");
      add_location(pre, file, 5, 0, 73);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, h2, anchor);
      append_dev(h2, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, pre, anchor);
      append_dev(pre, code);
      append_dev(code, t3);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(h2);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(pre);
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

var App_info =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(App_info, _SvelteComponentDev);

  function App_info(options) {
    var _this;

    _classCallCheck(this, App_info);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App_info).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "App_info",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return App_info;
}(SvelteComponentDev);

export default App_info;
