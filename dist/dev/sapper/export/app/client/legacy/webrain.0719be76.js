import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, ak as Webrain, al as TestView, H as space, u as create_component, X as query_selector_all, k as _forEachInstanceProperty, y as detach_dev, J as claim_space, x as claim_component, B as insert_dev, C as mount_component, n as noop, D as transition_in, E as transition_out, F as destroy_component } from './client.d5c92d1b.js';

function create_fragment(ctx) {
  var t0;
  var t1;
  var current;
  var webrain = new Webrain({
    $$inline: true
  });
  var testview = new TestView({
    $$inline: true
  });
  var block = {
    c: function create() {
      t0 = space();
      create_component(webrain.$$.fragment);
      t1 = space();
      create_component(testview.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      var head_nodes = query_selector_all("[data-svelte=\"svelte-razmw6\"]", document.head);

      _forEachInstanceProperty(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      claim_component(webrain.$$.fragment, nodes);
      t1 = claim_space(nodes);
      claim_component(testview.$$.fragment, nodes);
      this.h();
    },
    h: function hydrate() {
      document.title = "Webrain dev page";
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      mount_component(webrain, target, anchor);
      insert_dev(target, t1, anchor);
      mount_component(testview, target, anchor);
      current = true;
    },
    p: noop,
    i: function intro(local) {
      if (current) return;
      transition_in(webrain.$$.fragment, local);
      transition_in(testview.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(webrain.$$.fragment, local);
      transition_out(testview.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      destroy_component(webrain, detaching);
      if (detaching) detach_dev(t1);
      destroy_component(testview, detaching);
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

var Webrain_1 =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Webrain_1, _SvelteComponentDev);

  function Webrain_1(options) {
    var _this;

    _classCallCheck(this, Webrain_1);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Webrain_1).call(this, options));
    init(_assertThisInitialized(_this), options, null, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Webrain_1",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Webrain_1;
}(SvelteComponentDev);

export default Webrain_1;
