import { _ as _inherits, a as _classCallCheck, b as _possibleConstructorReturn, c as _getPrototypeOf, i as init, s as safe_not_equal, d as _assertThisInitialized, e as dispatch_dev, S as SvelteComponentDev, N as onMount, p as element, r as claim_element, t as children, h as _forEachInstanceProperty, v as detach_dev, w as attr_dev, x as add_location, y as insert_dev, n as noop, a0 as _Array$isArray, a1 as _getIterator, P as binding_callbacks } from './client.6a27e0ac.js';

var file = "src\\routes\\dev\\components\\small\\icons.svelte";

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
      attr_dev(div, "class", "container flex svelte-1gj9g9x");
      add_location(div, file, 12, 0, 179);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      /*div_binding*/

      ctx[1](div);
    },
    p: noop,
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
      /*div_binding*/

      ctx[1](null);
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
  var container;
  onMount(function () {
    for (var _iterator = container.children, _isArray = _Array$isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _element = _ref;
      _element.title = _element.classList[1];
    }
  });

  function div_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(0, container = $$value);
    });
  }

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("container" in $$props) $$invalidate(0, container = $$props.container);
  };

  return [container, div_binding];
}

var Icons =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Icons, _SvelteComponentDev);

  function Icons(options) {
    var _this;

    _classCallCheck(this, Icons);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Icons).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Icons",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Icons;
}(SvelteComponentDev);

export default Icons;
