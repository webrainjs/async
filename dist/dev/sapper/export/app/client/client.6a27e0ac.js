var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global_1 =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

// Thank's IE8 for his funny defineProperty
var descriptors = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var toString = {}.toString;

var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var indexedObject = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

// toObject with fallback for non-array-like ES3 strings



var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var hasOwnProperty = {}.hasOwnProperty;

var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var document$1 = global_1.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document$1) && isObject(document$1.createElement);

var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

// Thank's IE8 for his funny defineProperty
var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$1
};

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

var isForced_1 = isForced;

var path = {};

var aFunction = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

// optional / simple context binding
var functionBindContext = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f$2
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






var wrapConstructor = function (NativeConstructor) {
  var Wrapper = function (a, b, c) {
    if (this instanceof NativeConstructor) {
      switch (arguments.length) {
        case 0: return new NativeConstructor();
        case 1: return new NativeConstructor(a);
        case 2: return new NativeConstructor(a, b);
      } return new NativeConstructor(a, b, c);
    } return NativeConstructor.apply(this, arguments);
  };
  Wrapper.prototype = NativeConstructor.prototype;
  return Wrapper;
};

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var PROTO = options.proto;

  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
  var targetPrototype = target.prototype;

  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

  for (key in source) {
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contains in native
    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

    targetProperty = target[key];

    if (USE_NATIVE) if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
      nativeProperty = descriptor && descriptor.value;
    } else nativeProperty = nativeSource[key];

    // export native or implementation
    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

    // bind timers to global for call from export context
    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
    // wrap global constructors for prevent changs in this version
    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
    // make static versions for prototype methods
    else if (PROTO && typeof sourceProperty == 'function') resultProperty = functionBindContext(Function.call, sourceProperty);
    // default case
    else resultProperty = sourceProperty;

    // add a flag to not completely full polyfills
    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(resultProperty, 'sham', true);
    }

    target[key] = resultProperty;

    if (PROTO) {
      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
      if (!has(path, VIRTUAL_PROTOTYPE)) {
        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
      }
      // export virtual prototype methods
      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
      // export real prototype methods
      if (options.real && targetPrototype && !targetPrototype[key]) {
        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
      }
    }
  }
};

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
var isArray = Array.isArray || function isArray(arg) {
  return classofRaw(arg) == 'Array';
};

var isPure = true;

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});

var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode:  'pure' ,
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});
});

var id = 0;
var postfix = Math.random();

var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});

var useSymbolAsUid = nativeSymbol
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
var arraySpeciesCreate = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = indexedObject(O);
    var boundFunction = functionBindContext(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

var arrayIteration = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};

var aFunction$1 = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

var process$1 = global_1.process;
var versions = process$1 && process$1.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (engineUserAgent) {
  match = engineUserAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = engineUserAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

var engineV8Version = version && +version;

var SPECIES$1 = wellKnownSymbol('species');

var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return engineV8Version >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES$1] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

var arrayMethodUsesToLength = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !descriptors) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};

var $filter = arrayIteration.filter;



var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var entryVirtual = function (CONSTRUCTOR) {
  return path[CONSTRUCTOR + 'Prototype'];
};

var filter = entryVirtual('Array').filter;

var ArrayPrototype = Array.prototype;

var filter_1 = function (it) {
  var own = it.filter;
  return it === ArrayPrototype || (it instanceof Array && own === ArrayPrototype.filter) ? filter : own;
};

var filter$1 = filter_1;

var filter$2 = filter$1;

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod$1 = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = indexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

var arrayReduce = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod$1(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod$1(true)
};

var arrayMethodIsStrict = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

var $reduce = arrayReduce.left;



var STRICT_METHOD = arrayMethodIsStrict('reduce');
var USES_TO_LENGTH$1 = arrayMethodUsesToLength('reduce', { 1: 0 });

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH$1 }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var reduce = entryVirtual('Array').reduce;

var slice = [].slice;
var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
_export({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global_1.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global_1.setInterval)
});

var setTimeout$1 = path.setTimeout;

var setTimeout$2 = setTimeout$1;

var $map = arrayIteration.map;



var HAS_SPECIES_SUPPORT$1 = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH$2 = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$1 || !USES_TO_LENGTH$2 }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var map = entryVirtual('Array').map;

var ArrayPrototype$1 = Array.prototype;

var map_1 = function (it) {
  var own = it.map;
  return it === ArrayPrototype$1 || (it instanceof Array && own === ArrayPrototype$1.map) ? map : own;
};

var map$1 = map_1;

var map$2 = map$1;

var $stringify = getBuiltIn('JSON', 'stringify');
var re = /[\uD800-\uDFFF]/g;
var low = /^[\uD800-\uDBFF]$/;
var hi = /^[\uDC00-\uDFFF]$/;

var fix = function (match, offset, string) {
  var prev = string.charAt(offset - 1);
  var next = string.charAt(offset + 1);
  if ((low.test(match) && !hi.test(next)) || (hi.test(match) && !low.test(prev))) {
    return '\\u' + match.charCodeAt(0).toString(16);
  } return match;
};

var FORCED = fails(function () {
  return $stringify('\uDF06\uD834') !== '"\\udf06\\ud834"'
    || $stringify('\uDEAD') !== '"\\udead"';
});

if ($stringify) {
  // https://github.com/tc39/proposal-well-formed-stringify
  _export({ target: 'JSON', stat: true, forced: FORCED }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var result = $stringify.apply(null, arguments);
      return typeof result == 'string' ? result.replace(re, fix) : result;
    }
  });
}

if (!path.JSON) path.JSON = { stringify: JSON.stringify };

// eslint-disable-next-line no-unused-vars
var stringify = function stringify(it, replacer, space) {
  return path.JSON.stringify.apply(null, arguments);
};

var stringify$1 = stringify;

var stringify$2 = stringify$1;

var $some = arrayIteration.some;



var STRICT_METHOD$1 = arrayMethodIsStrict('some');
var USES_TO_LENGTH$3 = arrayMethodUsesToLength('some');

// `Array.prototype.some` method
// https://tc39.github.io/ecma262/#sec-array.prototype.some
_export({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$3 }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var some = entryVirtual('Array').some;

var ArrayPrototype$2 = Array.prototype;

var some_1 = function (it) {
  var own = it.some;
  return it === ArrayPrototype$2 || (it instanceof Array && own === ArrayPrototype$2.some) ? some : own;
};

var some$1 = some_1;

var some$2 = some$1;

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
var isRegexp = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classofRaw(it) == 'RegExp');
};

var notARegexp = function (it) {
  if (isRegexp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

var MATCH$1 = wellKnownSymbol('match');

var correctIsRegexpLogic = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH$1] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};

var nativeStartsWith = ''.startsWith;
var min$1 = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');

// `String.prototype.startsWith` method
// https://tc39.github.io/ecma262/#sec-string.prototype.startswith
_export({ target: 'String', proto: true, forced:  !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = String(requireObjectCoercible(this));
    notARegexp(searchString);
    var index = toLength(min$1(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return nativeStartsWith
      ? nativeStartsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

var startsWith = entryVirtual('String').startsWith;

var StringPrototype = String.prototype;

var startsWith_1 = function (it) {
  var own = it.startsWith;
  return typeof it === 'string' || it === StringPrototype
    || (it instanceof String && own === StringPrototype.startsWith) ? startsWith : own;
};

var startsWith$1 = startsWith_1;

var startsWith$2 = startsWith$1;

var max = Math.max;
var min$2 = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$2(integer, length);
};

var createProperty = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('slice');
var USES_TO_LENGTH$4 = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

var SPECIES$2 = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max$1 = Math.max;

// `Array.prototype.slice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4 }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES$2];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max$1(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

var slice$1 = entryVirtual('Array').slice;

var ArrayPrototype$3 = Array.prototype;

var slice_1 = function (it) {
  var own = it.slice;
  return it === ArrayPrototype$3 || (it instanceof Array && own === ArrayPrototype$3.slice) ? slice$1 : own;
};

var slice$2 = slice_1;

var slice$3 = slice$2;

var iterators = {};

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

var inspectSource = sharedStore.inspectSource;

var WeakMap = global_1.WeakMap;

var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var keys = shared('keys');

var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var hiddenKeys = {};

var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;

var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (nativeWeakMap) {
  var store$1 = new WeakMap$1();
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}

var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var correctPrototypeGetter = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod$2 = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

var arrayIncludes = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod$2(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod$2(false)
};

var indexOf = arrayIncludes.indexOf;


var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

// IE8- don't enum bug keys
var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var html = getBuiltIn('document', 'documentElement');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO$1 = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO$1] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO$1] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

var toStringTagSupport = String(test) === '[object z]';

var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
var classof = toStringTagSupport ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$1)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
var objectToString = toStringTagSupport ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

var defineProperty$1 = objectDefineProperty.f;





var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
  if (it) {
    var target = STATIC ? it : it.prototype;
    if (!has(target, TO_STRING_TAG$2)) {
      defineProperty$1(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
    }
    if (SET_METHOD && !toStringTagSupport) {
      createNonEnumerableProperty(target, 'toString', objectToString);
    }
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





var returnThis = function () { return this; };

var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var redefine = function (target, key, value, options) {
  if (options && options.enumerable) target[key] = value;
  else createNonEnumerableProperty(target, key, value);
};

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis$1 = function () { return this; };

var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      iterators[TO_STRING_TAG] = returnThis$1;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if (( FORCED) && IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
iterators.Arguments = iterators.Array;

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');

for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype && classof(CollectionPrototype) !== TO_STRING_TAG$3) {
    createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$3, COLLECTION_NAME);
  }
  iterators[COLLECTION_NAME] = iterators.Array;
}

var $forEach = arrayIteration.forEach;



var STRICT_METHOD$2 = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH$5 = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
var arrayForEach = (!STRICT_METHOD$2 || !USES_TO_LENGTH$5) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
  forEach: arrayForEach
});

var forEach = entryVirtual('Array').forEach;

var forEach$1 = forEach;

var ArrayPrototype$4 = Array.prototype;

var DOMIterables = {
  DOMTokenList: true,
  NodeList: true
};

var forEach_1 = function (it) {
  var own = it.forEach;
  return it === ArrayPrototype$4 || (it instanceof Array && own === ArrayPrototype$4.forEach)
    // eslint-disable-next-line no-prototype-builtins
    || DOMIterables.hasOwnProperty(classof(it)) ? forEach$1 : own;
};

var forEach$2 = forEach_1;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  create: objectCreate
});

var Object$1 = path.Object;

var create = function create(P, D) {
  return Object$1.create(P, D);
};

var create$1 = create;

var create$2 = create$1;

var nativeReverse = [].reverse;
var test$1 = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
_export({ target: 'Array', proto: true, forced: String(test$1) === String(test$1.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});

var reverse = entryVirtual('Array').reverse;

var ArrayPrototype$5 = Array.prototype;

var reverse_1 = function (it) {
  var own = it.reverse;
  return it === ArrayPrototype$5 || (it instanceof Array && own === ArrayPrototype$5.reverse) ? reverse : own;
};

var reverse$1 = reverse_1;

var reverse$2 = reverse$1;

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod$3 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

var stringMultibyte = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod$3(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod$3(true)
};

var charAt = stringMultibyte.charAt;



var STRING_ITERATOR = 'String Iterator';
var setInternalState$1 = internalState.set;
var getInternalState$1 = internalState.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState$1(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState$1(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

var nativePromiseConstructor = global_1.Promise;

var redefineAll = function (target, src, options) {
  for (var key in src) {
    if (options && options.unsafe && target[key]) target[key] = src[key];
    else redefine(target, key, src[key], options);
  } return target;
};

var SPECIES$3 = wellKnownSymbol('species');

var setSpecies = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = objectDefineProperty.f;

  if (descriptors && Constructor && !Constructor[SPECIES$3]) {
    defineProperty(Constructor, SPECIES$3, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

var anInstance = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

var ITERATOR$2 = wellKnownSymbol('iterator');
var ArrayPrototype$6 = Array.prototype;

// check on default Array iterator
var isArrayIteratorMethod = function (it) {
  return it !== undefined && (iterators.Array === it || ArrayPrototype$6[ITERATOR$2] === it);
};

var ITERATOR$3 = wellKnownSymbol('iterator');

var getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR$3]
    || it['@@iterator']
    || iterators[classof(it)];
};

// call something on iterator step with safe closing on error
var callWithSafeIterationClosing = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};

var iterate_1 = createCommonjsModule(function (module) {
var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = functionBindContext(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};
});

var ITERATOR$4 = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR$4] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR$4] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

var SPECIES$4 = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
var speciesConstructor = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES$4]) == undefined ? defaultConstructor : aFunction(S);
};

var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

var location$1 = global_1.location;
var set$1 = global_1.setImmediate;
var clear = global_1.clearImmediate;
var process$2 = global_1.process;
var MessageChannel = global_1.MessageChannel;
var Dispatch = global_1.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global_1.postMessage(id + '', location$1.protocol + '//' + location$1.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set$1 || !clear) {
  set$1 = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classofRaw(process$2) == 'process') {
    defer = function (id) {
      process$2.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !engineIsIos) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = functionBindContext(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global_1.addEventListener && typeof postMessage == 'function' && !global_1.importScripts && !fails(post)) {
    defer = post;
    global_1.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in documentCreateElement('script')) {
    defer = function (id) {
      html.appendChild(documentCreateElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

var task = {
  set: set$1,
  clear: clear
};

var getOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;

var macrotask = task.set;


var MutationObserver = global_1.MutationObserver || global_1.WebKitMutationObserver;
var process$3 = global_1.process;
var Promise = global_1.Promise;
var IS_NODE = classofRaw(process$3) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor$2(global_1, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process$3.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process$3.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !engineIsIos) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global_1, flush);
    };
  }
}

var microtask = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
var f$3 = function (C) {
  return new PromiseCapability(C);
};

var newPromiseCapability = {
	f: f$3
};

var promiseResolve = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

var hostReportErrors = function (a, b) {
  var console = global_1.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

var perform = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

var task$1 = task.set;










var SPECIES$5 = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState$2 = internalState.get;
var setInternalState$2 = internalState.set;
var getInternalPromiseState = internalState.getterFor(PROMISE);
var PromiseConstructor = nativePromiseConstructor;
var TypeError$1 = global_1.TypeError;
var document$2 = global_1.document;
var process$4 = global_1.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability$1 = newPromiseCapability.f;
var newGenericPromiseCapability = newPromiseCapability$1;
var IS_NODE$1 = classofRaw(process$4) == 'process';
var DISPATCH_EVENT = !!(document$2 && document$2.createEvent && global_1.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper;

var FORCED$1 = isForced_1(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (engineV8Version === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if ( !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES$5] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED$1 || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify$1 = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError$1('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document$2.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global_1.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global_1['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task$1.call(global_1, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE$1) {
          process$4.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE$1 || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task$1.call(global_1, function () {
    if (IS_NODE$1) {
      process$4.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify$1(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError$1("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify$1(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED$1) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState$2(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState$2(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE$1 ? process$4.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify$1(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState$2(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

_export({ global: true, wrap: true, forced: FORCED$1 }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
_export({ target: PROMISE, stat: true, forced: FORCED$1 }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability$1(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

_export({ target: PROMISE, stat: true, forced: isPure  }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve( this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate_1(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability$1(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate_1(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

// `Promise.allSettled` method
// https://github.com/tc39/proposal-promise-allSettled
_export({ target: 'Promise', stat: true }, {
  allSettled: function allSettled(iterable) {
    var C = this;
    var capability = newPromiseCapability.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate_1(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'fulfilled', value: value };
          --remaining || resolve(values);
        }, function (e) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = { status: 'rejected', reason: e };
          --remaining || resolve(values);
        });
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

// Safari bug https://bugs.webkit.org/show_bug.cgi?id=200829
var NON_GENERIC = !!nativePromiseConstructor && fails(function () {
  nativePromiseConstructor.prototype['finally'].call({ then: function () { /* empty */ } }, function () { /* empty */ });
});

// `Promise.prototype.finally` method
// https://tc39.github.io/ecma262/#sec-promise.prototype.finally
_export({ target: 'Promise', proto: true, real: true, forced: NON_GENERIC }, {
  'finally': function (onFinally) {
    var C = speciesConstructor(this, getBuiltIn('Promise'));
    var isFunction = typeof onFinally == 'function';
    return this.then(
      isFunction ? function (x) {
        return promiseResolve(C, onFinally()).then(function () { return x; });
      } : onFinally,
      isFunction ? function (e) {
        return promiseResolve(C, onFinally()).then(function () { throw e; });
      } : onFinally
    );
  }
});

var promise$1 = path.Promise;

var promise$2 = promise$1;

var promise$3 = promise$2;

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
_export({ target: 'Object', stat: true }, {
  setPrototypeOf: objectSetPrototypeOf
});

var setPrototypeOf = path.Object.setPrototypeOf;

var setPrototypeOf$1 = setPrototypeOf;

var setPrototypeOf$2 = setPrototypeOf$1;

var FAILS_ON_PRIMITIVES = fails(function () { objectGetPrototypeOf(1); });

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES, sham: !correctPrototypeGetter }, {
  getPrototypeOf: function getPrototypeOf(it) {
    return objectGetPrototypeOf(toObject(it));
  }
});

var getPrototypeOf = path.Object.getPrototypeOf;

var getPrototypeOf$1 = getPrototypeOf;

var getPrototypeOf$2 = getPrototypeOf$1;

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = engineV8Version >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED$2 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
_export({ target: 'Array', proto: true, forced: FORCED$2 }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
var f$4 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$4
};

var nativeGetOwnPropertyNames = objectGetOwnPropertyNames.f;

var toString$1 = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var f$5 = function getOwnPropertyNames(it) {
  return windowNames && toString$1.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};

var objectGetOwnPropertyNamesExternal = {
	f: f$5
};

var f$6 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$6
};

var f$7 = wellKnownSymbol;

var wellKnownSymbolWrapped = {
	f: f$7
};

var defineProperty$2 = objectDefineProperty.f;

var defineWellKnownSymbol = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty$2(Symbol, NAME, {
    value: wellKnownSymbolWrapped.f(NAME)
  });
};

var $forEach$1 = arrayIteration.forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE$1 = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState$3 = internalState.set;
var getInternalState$3 = internalState.getterFor(SYMBOL);
var ObjectPrototype$1 = Object[PROTOTYPE$1];
var $Symbol = global_1.Symbol;
var $stringify$1 = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;
var nativeDefineProperty$1 = objectDefineProperty.f;
var nativeGetOwnPropertyNames$1 = objectGetOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable$1 = objectPropertyIsEnumerable.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore$1 = shared('wks');
var QObject = global_1.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE$1] || !QObject[PROTOTYPE$1].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = descriptors && fails(function () {
  return objectCreate(nativeDefineProperty$1({}, 'a', {
    get: function () { return nativeDefineProperty$1(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor$1(ObjectPrototype$1, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype$1[P];
  nativeDefineProperty$1(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype$1) {
    nativeDefineProperty$1(ObjectPrototype$1, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty$1;

var wrap$1 = function (tag, description) {
  var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
  setInternalState$3(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!descriptors) symbol.description = description;
  return symbol;
};

var isSymbol = useSymbolAsUid ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype$1) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty$1(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = objectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty$1(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach$1(keys, function (key) {
    if (!descriptors || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? objectCreate(O) : $defineProperties(objectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable$1.call(this, P);
  if (this === ObjectPrototype$1 && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype$1 && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor$1(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames$1(toIndexedObject(O));
  var result = [];
  $forEach$1(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype$1;
  var names = nativeGetOwnPropertyNames$1(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach$1(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype$1, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!nativeSymbol) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype$1) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (descriptors && USE_SETTER) setSymbolDescriptor(ObjectPrototype$1, tag, { configurable: true, set: setter });
    return wrap$1(tag, description);
  };

  redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
    return getInternalState$3(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap$1(uid(description), description);
  });

  objectPropertyIsEnumerable.f = $propertyIsEnumerable;
  objectDefineProperty.f = $defineProperty;
  objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
  objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

  wellKnownSymbolWrapped.f = function (name) {
    return wrap$1(wellKnownSymbol(name), name);
  };

  if (descriptors) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty$1($Symbol[PROTOTYPE$1], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState$3(this).description;
      }
    });
  }
}

_export({ global: true, wrap: true, forced: !nativeSymbol, sham: !nativeSymbol }, {
  Symbol: $Symbol
});

$forEach$1(objectKeys(WellKnownSymbolsStore$1), function (name) {
  defineWellKnownSymbol(name);
});

_export({ target: SYMBOL, stat: true, forced: !nativeSymbol }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol, sham: !descriptors }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

_export({ target: 'Object', stat: true, forced: !nativeSymbol }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
_export({ target: 'Object', stat: true, forced: fails(function () { objectGetOwnPropertySymbols.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return objectGetOwnPropertySymbols.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify$1) {
  var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify$1([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify$1({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify$1(Object(symbol)) != '{}';
  });

  _export({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify$1.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE$1][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE$1], TO_PRIMITIVE, $Symbol[PROTOTYPE$1].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

// `Symbol.asyncIterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.asynciterator
defineWellKnownSymbol('asyncIterator');

// `Symbol.hasInstance` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.hasinstance
defineWellKnownSymbol('hasInstance');

// `Symbol.isConcatSpreadable` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.isconcatspreadable
defineWellKnownSymbol('isConcatSpreadable');

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

// `Symbol.match` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.match
defineWellKnownSymbol('match');

// `Symbol.matchAll` well-known symbol
defineWellKnownSymbol('matchAll');

// `Symbol.replace` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.replace
defineWellKnownSymbol('replace');

// `Symbol.search` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.search
defineWellKnownSymbol('search');

// `Symbol.species` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.species
defineWellKnownSymbol('species');

// `Symbol.split` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.split
defineWellKnownSymbol('split');

// `Symbol.toPrimitive` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.toprimitive
defineWellKnownSymbol('toPrimitive');

// `Symbol.toStringTag` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.tostringtag
defineWellKnownSymbol('toStringTag');

// `Symbol.unscopables` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.unscopables
defineWellKnownSymbol('unscopables');

// Math[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-math-@@tostringtag
setToStringTag(Math, 'Math', true);

// JSON[@@toStringTag] property
// https://tc39.github.io/ecma262/#sec-json-@@tostringtag
setToStringTag(global_1.JSON, 'JSON', true);

var symbol = path.Symbol;

var symbol$1 = symbol;

var symbol$2 = symbol$1;

var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof symbol$2 === "function" ? symbol$2 : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;

      var generator = create$2(protoGenerator.prototype);

      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = getPrototypeOf$2;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = create$2(IteratorPrototype);

    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      var _context;

      forEach$2(_context = ["next", "throw", "return"]).call(_context, function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (setPrototypeOf$2) {
        setPrototypeOf$2(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = create$2(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return promise$3.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return promise$3.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new promise$3(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];

      forEach$2(tryLocsList).call(tryLocsList, pushTryEntry, this);

      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      reverse$2(keys).call(keys); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.


      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function reset(skipTempReset) {
        var _context2;

        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;

        forEach$2(_context2 = this.tryEntries).call(_context2, resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+slice$3(name).call(name, 1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function stop() {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function dispatchException(exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function abrupt(type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function complete(record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function finish(finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function _catch(tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function delegateYield(iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports );

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
});

var regenerator = runtime_1;

var setInternalState$4 = internalState.set;
var getInternalAggregateErrorState = internalState.getterFor('AggregateError');

var $AggregateError = function AggregateError(errors, message) {
  var that = this;
  if (!(that instanceof $AggregateError)) return new $AggregateError(errors, message);
  if (objectSetPrototypeOf) {
    that = objectSetPrototypeOf(new Error(message), objectGetPrototypeOf(that));
  }
  var errorsArray = [];
  iterate_1(errors, errorsArray.push, errorsArray);
  if (descriptors) setInternalState$4(that, { errors: errorsArray, type: 'AggregateError' });
  else that.errors = errorsArray;
  if (message !== undefined) createNonEnumerableProperty(that, 'message', String(message));
  return that;
};

$AggregateError.prototype = objectCreate(Error.prototype, {
  constructor: createPropertyDescriptor(5, $AggregateError),
  message: createPropertyDescriptor(5, ''),
  name: createPropertyDescriptor(5, 'AggregateError')
});

if (descriptors) objectDefineProperty.f($AggregateError.prototype, 'errors', {
  get: function () {
    return getInternalAggregateErrorState(this).errors;
  },
  configurable: true
});

_export({ global: true }, {
  AggregateError: $AggregateError
});

// `Promise.try` method
// https://github.com/tc39/proposal-promise-try
_export({ target: 'Promise', stat: true }, {
  'try': function (callbackfn) {
    var promiseCapability = newPromiseCapability.f(this);
    var result = perform(callbackfn);
    (result.error ? promiseCapability.reject : promiseCapability.resolve)(result.value);
    return promiseCapability.promise;
  }
});

var PROMISE_ANY_ERROR = 'No one promise resolved';

// `Promise.any` method
// https://github.com/tc39/proposal-promise-any
_export({ target: 'Promise', stat: true }, {
  any: function any(iterable) {
    var C = this;
    var capability = newPromiseCapability.f(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var promiseResolve = aFunction(C.resolve);
      var errors = [];
      var counter = 0;
      var remaining = 1;
      var alreadyResolved = false;
      iterate_1(iterable, function (promise) {
        var index = counter++;
        var alreadyRejected = false;
        errors.push(undefined);
        remaining++;
        promiseResolve.call(C, promise).then(function (value) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyResolved = true;
          resolve(value);
        }, function (e) {
          if (alreadyRejected || alreadyResolved) return;
          alreadyRejected = true;
          errors[index] = e;
          --remaining || reject(new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR));
        });
      });
      --remaining || reject(new (getBuiltIn('AggregateError'))(errors, PROMISE_ANY_ERROR));
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

// TODO: Remove from `core-js@4`




var promise$4 = promise$1;

var promise$5 = promise$4;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    promise$5.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new promise$5(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var ITERATOR$5 = wellKnownSymbol('iterator');

var nativeUrl = !fails(function () {
  var url = new URL('b?a=1&b=2&c=3', 'http://a');
  var searchParams = url.searchParams;
  var result = '';
  url.pathname = 'c%20d';
  searchParams.forEach(function (value, key) {
    searchParams['delete']('b');
    result += key + value;
  });
  return (isPure && !url.toJSON)
    || !searchParams.sort
    || url.href !== 'http://a/c%20d?a=1&c=3'
    || searchParams.get('c') !== '3'
    || String(new URLSearchParams('?a=1')) !== 'a=1'
    || !searchParams[ITERATOR$5]
    // throws in Edge
    || new URL('https://a@b').username !== 'a'
    || new URLSearchParams(new URLSearchParams('a=b')).get('a') !== 'b'
    // not punycoded in Edge
    || new URL('http://тест').host !== 'xn--e1aybc'
    // not escaped in Chrome 62-
    || new URL('http://a#б').hash !== '#%D0%B1'
    // fails in Chrome 66-
    || result !== 'a1c3'
    // throws in Safari
    || new URL('http://x', undefined).host !== 'x';
});

var nativeAssign = Object.assign;
var defineProperty$3 = Object.defineProperty;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
var objectAssign = !nativeAssign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$3({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty$3(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
  while (argumentsLength > index) {
    var S = indexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : nativeAssign;

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
var arrayFrom = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = functionBindContext(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

// based on https://github.com/bestiejs/punycode.js/blob/master/punycode.js
var maxInt = 2147483647; // aka. 0x7FFFFFFF or 2^31-1
var base = 36;
var tMin = 1;
var tMax = 26;
var skew = 38;
var damp = 700;
var initialBias = 72;
var initialN = 128; // 0x80
var delimiter = '-'; // '\x2D'
var regexNonASCII = /[^\0-\u007E]/; // non-ASCII chars
var regexSeparators = /[.\u3002\uFF0E\uFF61]/g; // RFC 3490 separators
var OVERFLOW_ERROR = 'Overflow: input needs wider integers to process';
var baseMinusTMin = base - tMin;
var floor$1 = Math.floor;
var stringFromCharCode = String.fromCharCode;

/**
 * Creates an array containing the numeric code points of each Unicode
 * character in the string. While JavaScript uses UCS-2 internally,
 * this function will convert a pair of surrogate halves (each of which
 * UCS-2 exposes as separate characters) into a single code point,
 * matching UTF-16.
 */
var ucs2decode = function (string) {
  var output = [];
  var counter = 0;
  var length = string.length;
  while (counter < length) {
    var value = string.charCodeAt(counter++);
    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
      // It's a high surrogate, and there is a next character.
      var extra = string.charCodeAt(counter++);
      if ((extra & 0xFC00) == 0xDC00) { // Low surrogate.
        output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
      } else {
        // It's an unmatched surrogate; only append this code unit, in case the
        // next code unit is the high surrogate of a surrogate pair.
        output.push(value);
        counter--;
      }
    } else {
      output.push(value);
    }
  }
  return output;
};

/**
 * Converts a digit/integer into a basic code point.
 */
var digitToBasic = function (digit) {
  //  0..25 map to ASCII a..z or A..Z
  // 26..35 map to ASCII 0..9
  return digit + 22 + 75 * (digit < 26);
};

/**
 * Bias adaptation function as per section 3.4 of RFC 3492.
 * https://tools.ietf.org/html/rfc3492#section-3.4
 */
var adapt = function (delta, numPoints, firstTime) {
  var k = 0;
  delta = firstTime ? floor$1(delta / damp) : delta >> 1;
  delta += floor$1(delta / numPoints);
  for (; delta > baseMinusTMin * tMax >> 1; k += base) {
    delta = floor$1(delta / baseMinusTMin);
  }
  return floor$1(k + (baseMinusTMin + 1) * delta / (delta + skew));
};

/**
 * Converts a string of Unicode symbols (e.g. a domain name label) to a
 * Punycode string of ASCII-only symbols.
 */
// eslint-disable-next-line  max-statements
var encode = function (input) {
  var output = [];

  // Convert the input in UCS-2 to an array of Unicode code points.
  input = ucs2decode(input);

  // Cache the length.
  var inputLength = input.length;

  // Initialize the state.
  var n = initialN;
  var delta = 0;
  var bias = initialBias;
  var i, currentValue;

  // Handle the basic code points.
  for (i = 0; i < input.length; i++) {
    currentValue = input[i];
    if (currentValue < 0x80) {
      output.push(stringFromCharCode(currentValue));
    }
  }

  var basicLength = output.length; // number of basic code points.
  var handledCPCount = basicLength; // number of code points that have been handled;

  // Finish the basic string with a delimiter unless it's empty.
  if (basicLength) {
    output.push(delimiter);
  }

  // Main encoding loop:
  while (handledCPCount < inputLength) {
    // All non-basic code points < n have been handled already. Find the next larger one:
    var m = maxInt;
    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue >= n && currentValue < m) {
        m = currentValue;
      }
    }

    // Increase `delta` enough to advance the decoder's <n,i> state to <m,0>, but guard against overflow.
    var handledCPCountPlusOne = handledCPCount + 1;
    if (m - n > floor$1((maxInt - delta) / handledCPCountPlusOne)) {
      throw RangeError(OVERFLOW_ERROR);
    }

    delta += (m - n) * handledCPCountPlusOne;
    n = m;

    for (i = 0; i < input.length; i++) {
      currentValue = input[i];
      if (currentValue < n && ++delta > maxInt) {
        throw RangeError(OVERFLOW_ERROR);
      }
      if (currentValue == n) {
        // Represent delta as a generalized variable-length integer.
        var q = delta;
        for (var k = base; /* no condition */; k += base) {
          var t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
          if (q < t) break;
          var qMinusT = q - t;
          var baseMinusT = base - t;
          output.push(stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT)));
          q = floor$1(qMinusT / baseMinusT);
        }

        output.push(stringFromCharCode(digitToBasic(q)));
        bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
        delta = 0;
        ++handledCPCount;
      }
    }

    ++delta;
    ++n;
  }
  return output.join('');
};

var stringPunycodeToAscii = function (input) {
  var encoded = [];
  var labels = input.toLowerCase().replace(regexSeparators, '\u002E').split('.');
  var i, label;
  for (i = 0; i < labels.length; i++) {
    label = labels[i];
    encoded.push(regexNonASCII.test(label) ? 'xn--' + encode(label) : label);
  }
  return encoded.join('.');
};

var getIterator = function (it) {
  var iteratorMethod = getIteratorMethod(it);
  if (typeof iteratorMethod != 'function') {
    throw TypeError(String(it) + ' is not iterable');
  } return anObject(iteratorMethod.call(it));
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















var $fetch$1 = getBuiltIn('fetch');
var Headers = getBuiltIn('Headers');
var ITERATOR$6 = wellKnownSymbol('iterator');
var URL_SEARCH_PARAMS = 'URLSearchParams';
var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
var setInternalState$5 = internalState.set;
var getInternalParamsState = internalState.getterFor(URL_SEARCH_PARAMS);
var getInternalIteratorState = internalState.getterFor(URL_SEARCH_PARAMS_ITERATOR);

var plus = /\+/g;
var sequences = Array(4);

var percentSequence = function (bytes) {
  return sequences[bytes - 1] || (sequences[bytes - 1] = RegExp('((?:%[\\da-f]{2}){' + bytes + '})', 'gi'));
};

var percentDecode = function (sequence) {
  try {
    return decodeURIComponent(sequence);
  } catch (error) {
    return sequence;
  }
};

var deserialize = function (it) {
  var result = it.replace(plus, ' ');
  var bytes = 4;
  try {
    return decodeURIComponent(result);
  } catch (error) {
    while (bytes) {
      result = result.replace(percentSequence(bytes--), percentDecode);
    }
    return result;
  }
};

var find = /[!'()~]|%20/g;

var replace = {
  '!': '%21',
  "'": '%27',
  '(': '%28',
  ')': '%29',
  '~': '%7E',
  '%20': '+'
};

var replacer = function (match) {
  return replace[match];
};

var serialize = function (it) {
  return encodeURIComponent(it).replace(find, replacer);
};

var parseSearchParams = function (result, query) {
  if (query) {
    var attributes = query.split('&');
    var index = 0;
    var attribute, entry;
    while (index < attributes.length) {
      attribute = attributes[index++];
      if (attribute.length) {
        entry = attribute.split('=');
        result.push({
          key: deserialize(entry.shift()),
          value: deserialize(entry.join('='))
        });
      }
    }
  }
};

var updateSearchParams = function (query) {
  this.entries.length = 0;
  parseSearchParams(this.entries, query);
};

var validateArgumentsLength = function (passed, required) {
  if (passed < required) throw TypeError('Not enough arguments');
};

var URLSearchParamsIterator = createIteratorConstructor(function Iterator(params, kind) {
  setInternalState$5(this, {
    type: URL_SEARCH_PARAMS_ITERATOR,
    iterator: getIterator(getInternalParamsState(params).entries),
    kind: kind
  });
}, 'Iterator', function next() {
  var state = getInternalIteratorState(this);
  var kind = state.kind;
  var step = state.iterator.next();
  var entry = step.value;
  if (!step.done) {
    step.value = kind === 'keys' ? entry.key : kind === 'values' ? entry.value : [entry.key, entry.value];
  } return step;
});

// `URLSearchParams` constructor
// https://url.spec.whatwg.org/#interface-urlsearchparams
var URLSearchParamsConstructor = function URLSearchParams(/* init */) {
  anInstance(this, URLSearchParamsConstructor, URL_SEARCH_PARAMS);
  var init = arguments.length > 0 ? arguments[0] : undefined;
  var that = this;
  var entries = [];
  var iteratorMethod, iterator, next, step, entryIterator, entryNext, first, second, key;

  setInternalState$5(that, {
    type: URL_SEARCH_PARAMS,
    entries: entries,
    updateURL: function () { /* empty */ },
    updateSearchParams: updateSearchParams
  });

  if (init !== undefined) {
    if (isObject(init)) {
      iteratorMethod = getIteratorMethod(init);
      if (typeof iteratorMethod === 'function') {
        iterator = iteratorMethod.call(init);
        next = iterator.next;
        while (!(step = next.call(iterator)).done) {
          entryIterator = getIterator(anObject(step.value));
          entryNext = entryIterator.next;
          if (
            (first = entryNext.call(entryIterator)).done ||
            (second = entryNext.call(entryIterator)).done ||
            !entryNext.call(entryIterator).done
          ) throw TypeError('Expected sequence with length 2');
          entries.push({ key: first.value + '', value: second.value + '' });
        }
      } else for (key in init) if (has(init, key)) entries.push({ key: key, value: init[key] + '' });
    } else {
      parseSearchParams(entries, typeof init === 'string' ? init.charAt(0) === '?' ? init.slice(1) : init : init + '');
    }
  }
};

var URLSearchParamsPrototype = URLSearchParamsConstructor.prototype;

redefineAll(URLSearchParamsPrototype, {
  // `URLSearchParams.prototype.appent` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-append
  append: function append(name, value) {
    validateArgumentsLength(arguments.length, 2);
    var state = getInternalParamsState(this);
    state.entries.push({ key: name + '', value: value + '' });
    state.updateURL();
  },
  // `URLSearchParams.prototype.delete` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-delete
  'delete': function (name) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index].key === key) entries.splice(index, 1);
      else index++;
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.get` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-get
  get: function get(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) return entries[index].value;
    }
    return null;
  },
  // `URLSearchParams.prototype.getAll` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-getall
  getAll: function getAll(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var result = [];
    var index = 0;
    for (; index < entries.length; index++) {
      if (entries[index].key === key) result.push(entries[index].value);
    }
    return result;
  },
  // `URLSearchParams.prototype.has` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-has
  has: function has(name) {
    validateArgumentsLength(arguments.length, 1);
    var entries = getInternalParamsState(this).entries;
    var key = name + '';
    var index = 0;
    while (index < entries.length) {
      if (entries[index++].key === key) return true;
    }
    return false;
  },
  // `URLSearchParams.prototype.set` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-set
  set: function set(name, value) {
    validateArgumentsLength(arguments.length, 1);
    var state = getInternalParamsState(this);
    var entries = state.entries;
    var found = false;
    var key = name + '';
    var val = value + '';
    var index = 0;
    var entry;
    for (; index < entries.length; index++) {
      entry = entries[index];
      if (entry.key === key) {
        if (found) entries.splice(index--, 1);
        else {
          found = true;
          entry.value = val;
        }
      }
    }
    if (!found) entries.push({ key: key, value: val });
    state.updateURL();
  },
  // `URLSearchParams.prototype.sort` method
  // https://url.spec.whatwg.org/#dom-urlsearchparams-sort
  sort: function sort() {
    var state = getInternalParamsState(this);
    var entries = state.entries;
    // Array#sort is not stable in some engines
    var slice = entries.slice();
    var entry, entriesIndex, sliceIndex;
    entries.length = 0;
    for (sliceIndex = 0; sliceIndex < slice.length; sliceIndex++) {
      entry = slice[sliceIndex];
      for (entriesIndex = 0; entriesIndex < sliceIndex; entriesIndex++) {
        if (entries[entriesIndex].key > entry.key) {
          entries.splice(entriesIndex, 0, entry);
          break;
        }
      }
      if (entriesIndex === sliceIndex) entries.push(entry);
    }
    state.updateURL();
  },
  // `URLSearchParams.prototype.forEach` method
  forEach: function forEach(callback /* , thisArg */) {
    var entries = getInternalParamsState(this).entries;
    var boundFunction = functionBindContext(callback, arguments.length > 1 ? arguments[1] : undefined, 3);
    var index = 0;
    var entry;
    while (index < entries.length) {
      entry = entries[index++];
      boundFunction(entry.value, entry.key, this);
    }
  },
  // `URLSearchParams.prototype.keys` method
  keys: function keys() {
    return new URLSearchParamsIterator(this, 'keys');
  },
  // `URLSearchParams.prototype.values` method
  values: function values() {
    return new URLSearchParamsIterator(this, 'values');
  },
  // `URLSearchParams.prototype.entries` method
  entries: function entries() {
    return new URLSearchParamsIterator(this, 'entries');
  }
}, { enumerable: true });

// `URLSearchParams.prototype[@@iterator]` method
redefine(URLSearchParamsPrototype, ITERATOR$6, URLSearchParamsPrototype.entries);

// `URLSearchParams.prototype.toString` method
// https://url.spec.whatwg.org/#urlsearchparams-stringification-behavior
redefine(URLSearchParamsPrototype, 'toString', function toString() {
  var entries = getInternalParamsState(this).entries;
  var result = [];
  var index = 0;
  var entry;
  while (index < entries.length) {
    entry = entries[index++];
    result.push(serialize(entry.key) + '=' + serialize(entry.value));
  } return result.join('&');
}, { enumerable: true });

setToStringTag(URLSearchParamsConstructor, URL_SEARCH_PARAMS);

_export({ global: true, forced: !nativeUrl }, {
  URLSearchParams: URLSearchParamsConstructor
});

// Wrap `fetch` for correct work with polyfilled `URLSearchParams`
// https://github.com/zloirock/core-js/issues/674
if (!nativeUrl && typeof $fetch$1 == 'function' && typeof Headers == 'function') {
  _export({ global: true, enumerable: true, forced: true }, {
    fetch: function fetch(input /* , init */) {
      var args = [input];
      var init, body, headers;
      if (arguments.length > 1) {
        init = arguments[1];
        if (isObject(init)) {
          body = init.body;
          if (classof(body) === URL_SEARCH_PARAMS) {
            headers = init.headers ? new Headers(init.headers) : new Headers();
            if (!headers.has('content-type')) {
              headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
            }
            init = objectCreate(init, {
              body: createPropertyDescriptor(0, String(body)),
              headers: createPropertyDescriptor(0, headers)
            });
          }
        }
        args.push(init);
      } return $fetch$1.apply(this, args);
    }
  });
}

var web_urlSearchParams = {
  URLSearchParams: URLSearchParamsConstructor,
  getState: getInternalParamsState
};

// TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`











var codeAt = stringMultibyte.codeAt;





var NativeURL = global_1.URL;
var URLSearchParams$1 = web_urlSearchParams.URLSearchParams;
var getInternalSearchParamsState = web_urlSearchParams.getState;
var setInternalState$6 = internalState.set;
var getInternalURLState = internalState.getterFor('URL');
var floor$2 = Math.floor;
var pow = Math.pow;

var INVALID_AUTHORITY = 'Invalid authority';
var INVALID_SCHEME = 'Invalid scheme';
var INVALID_HOST = 'Invalid host';
var INVALID_PORT = 'Invalid port';

var ALPHA = /[A-Za-z]/;
var ALPHANUMERIC = /[\d+\-.A-Za-z]/;
var DIGIT = /\d/;
var HEX_START = /^(0x|0X)/;
var OCT = /^[0-7]+$/;
var DEC = /^\d+$/;
var HEX = /^[\dA-Fa-f]+$/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT = /[\u0000\u0009\u000A\u000D #%/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT = /[\u0000\u0009\u000A\u000D #/:?@[\\]]/;
// eslint-disable-next-line no-control-regex
var LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE = /^[\u0000-\u001F ]+|[\u0000-\u001F ]+$/g;
// eslint-disable-next-line no-control-regex
var TAB_AND_NEW_LINE = /[\u0009\u000A\u000D]/g;
var EOF;

var parseHost = function (url, input) {
  var result, codePoints, index;
  if (input.charAt(0) == '[') {
    if (input.charAt(input.length - 1) != ']') return INVALID_HOST;
    result = parseIPv6(input.slice(1, -1));
    if (!result) return INVALID_HOST;
    url.host = result;
  // opaque host
  } else if (!isSpecial(url)) {
    if (FORBIDDEN_HOST_CODE_POINT_EXCLUDING_PERCENT.test(input)) return INVALID_HOST;
    result = '';
    codePoints = arrayFrom(input);
    for (index = 0; index < codePoints.length; index++) {
      result += percentEncode(codePoints[index], C0ControlPercentEncodeSet);
    }
    url.host = result;
  } else {
    input = stringPunycodeToAscii(input);
    if (FORBIDDEN_HOST_CODE_POINT.test(input)) return INVALID_HOST;
    result = parseIPv4(input);
    if (result === null) return INVALID_HOST;
    url.host = result;
  }
};

var parseIPv4 = function (input) {
  var parts = input.split('.');
  var partsLength, numbers, index, part, radix, number, ipv4;
  if (parts.length && parts[parts.length - 1] == '') {
    parts.pop();
  }
  partsLength = parts.length;
  if (partsLength > 4) return input;
  numbers = [];
  for (index = 0; index < partsLength; index++) {
    part = parts[index];
    if (part == '') return input;
    radix = 10;
    if (part.length > 1 && part.charAt(0) == '0') {
      radix = HEX_START.test(part) ? 16 : 8;
      part = part.slice(radix == 8 ? 1 : 2);
    }
    if (part === '') {
      number = 0;
    } else {
      if (!(radix == 10 ? DEC : radix == 8 ? OCT : HEX).test(part)) return input;
      number = parseInt(part, radix);
    }
    numbers.push(number);
  }
  for (index = 0; index < partsLength; index++) {
    number = numbers[index];
    if (index == partsLength - 1) {
      if (number >= pow(256, 5 - partsLength)) return null;
    } else if (number > 255) return null;
  }
  ipv4 = numbers.pop();
  for (index = 0; index < numbers.length; index++) {
    ipv4 += numbers[index] * pow(256, 3 - index);
  }
  return ipv4;
};

// eslint-disable-next-line max-statements
var parseIPv6 = function (input) {
  var address = [0, 0, 0, 0, 0, 0, 0, 0];
  var pieceIndex = 0;
  var compress = null;
  var pointer = 0;
  var value, length, numbersSeen, ipv4Piece, number, swaps, swap;

  var char = function () {
    return input.charAt(pointer);
  };

  if (char() == ':') {
    if (input.charAt(1) != ':') return;
    pointer += 2;
    pieceIndex++;
    compress = pieceIndex;
  }
  while (char()) {
    if (pieceIndex == 8) return;
    if (char() == ':') {
      if (compress !== null) return;
      pointer++;
      pieceIndex++;
      compress = pieceIndex;
      continue;
    }
    value = length = 0;
    while (length < 4 && HEX.test(char())) {
      value = value * 16 + parseInt(char(), 16);
      pointer++;
      length++;
    }
    if (char() == '.') {
      if (length == 0) return;
      pointer -= length;
      if (pieceIndex > 6) return;
      numbersSeen = 0;
      while (char()) {
        ipv4Piece = null;
        if (numbersSeen > 0) {
          if (char() == '.' && numbersSeen < 4) pointer++;
          else return;
        }
        if (!DIGIT.test(char())) return;
        while (DIGIT.test(char())) {
          number = parseInt(char(), 10);
          if (ipv4Piece === null) ipv4Piece = number;
          else if (ipv4Piece == 0) return;
          else ipv4Piece = ipv4Piece * 10 + number;
          if (ipv4Piece > 255) return;
          pointer++;
        }
        address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
        numbersSeen++;
        if (numbersSeen == 2 || numbersSeen == 4) pieceIndex++;
      }
      if (numbersSeen != 4) return;
      break;
    } else if (char() == ':') {
      pointer++;
      if (!char()) return;
    } else if (char()) return;
    address[pieceIndex++] = value;
  }
  if (compress !== null) {
    swaps = pieceIndex - compress;
    pieceIndex = 7;
    while (pieceIndex != 0 && swaps > 0) {
      swap = address[pieceIndex];
      address[pieceIndex--] = address[compress + swaps - 1];
      address[compress + --swaps] = swap;
    }
  } else if (pieceIndex != 8) return;
  return address;
};

var findLongestZeroSequence = function (ipv6) {
  var maxIndex = null;
  var maxLength = 1;
  var currStart = null;
  var currLength = 0;
  var index = 0;
  for (; index < 8; index++) {
    if (ipv6[index] !== 0) {
      if (currLength > maxLength) {
        maxIndex = currStart;
        maxLength = currLength;
      }
      currStart = null;
      currLength = 0;
    } else {
      if (currStart === null) currStart = index;
      ++currLength;
    }
  }
  if (currLength > maxLength) {
    maxIndex = currStart;
    maxLength = currLength;
  }
  return maxIndex;
};

var serializeHost = function (host) {
  var result, index, compress, ignore0;
  // ipv4
  if (typeof host == 'number') {
    result = [];
    for (index = 0; index < 4; index++) {
      result.unshift(host % 256);
      host = floor$2(host / 256);
    } return result.join('.');
  // ipv6
  } else if (typeof host == 'object') {
    result = '';
    compress = findLongestZeroSequence(host);
    for (index = 0; index < 8; index++) {
      if (ignore0 && host[index] === 0) continue;
      if (ignore0) ignore0 = false;
      if (compress === index) {
        result += index ? ':' : '::';
        ignore0 = true;
      } else {
        result += host[index].toString(16);
        if (index < 7) result += ':';
      }
    }
    return '[' + result + ']';
  } return host;
};

var C0ControlPercentEncodeSet = {};
var fragmentPercentEncodeSet = objectAssign({}, C0ControlPercentEncodeSet, {
  ' ': 1, '"': 1, '<': 1, '>': 1, '`': 1
});
var pathPercentEncodeSet = objectAssign({}, fragmentPercentEncodeSet, {
  '#': 1, '?': 1, '{': 1, '}': 1
});
var userinfoPercentEncodeSet = objectAssign({}, pathPercentEncodeSet, {
  '/': 1, ':': 1, ';': 1, '=': 1, '@': 1, '[': 1, '\\': 1, ']': 1, '^': 1, '|': 1
});

var percentEncode = function (char, set) {
  var code = codeAt(char, 0);
  return code > 0x20 && code < 0x7F && !has(set, char) ? char : encodeURIComponent(char);
};

var specialSchemes = {
  ftp: 21,
  file: null,
  http: 80,
  https: 443,
  ws: 80,
  wss: 443
};

var isSpecial = function (url) {
  return has(specialSchemes, url.scheme);
};

var includesCredentials = function (url) {
  return url.username != '' || url.password != '';
};

var cannotHaveUsernamePasswordPort = function (url) {
  return !url.host || url.cannotBeABaseURL || url.scheme == 'file';
};

var isWindowsDriveLetter = function (string, normalized) {
  var second;
  return string.length == 2 && ALPHA.test(string.charAt(0))
    && ((second = string.charAt(1)) == ':' || (!normalized && second == '|'));
};

var startsWithWindowsDriveLetter = function (string) {
  var third;
  return string.length > 1 && isWindowsDriveLetter(string.slice(0, 2)) && (
    string.length == 2 ||
    ((third = string.charAt(2)) === '/' || third === '\\' || third === '?' || third === '#')
  );
};

var shortenURLsPath = function (url) {
  var path = url.path;
  var pathSize = path.length;
  if (pathSize && (url.scheme != 'file' || pathSize != 1 || !isWindowsDriveLetter(path[0], true))) {
    path.pop();
  }
};

var isSingleDot = function (segment) {
  return segment === '.' || segment.toLowerCase() === '%2e';
};

var isDoubleDot = function (segment) {
  segment = segment.toLowerCase();
  return segment === '..' || segment === '%2e.' || segment === '.%2e' || segment === '%2e%2e';
};

// States:
var SCHEME_START = {};
var SCHEME = {};
var NO_SCHEME = {};
var SPECIAL_RELATIVE_OR_AUTHORITY = {};
var PATH_OR_AUTHORITY = {};
var RELATIVE = {};
var RELATIVE_SLASH = {};
var SPECIAL_AUTHORITY_SLASHES = {};
var SPECIAL_AUTHORITY_IGNORE_SLASHES = {};
var AUTHORITY = {};
var HOST = {};
var HOSTNAME = {};
var PORT = {};
var FILE = {};
var FILE_SLASH = {};
var FILE_HOST = {};
var PATH_START = {};
var PATH = {};
var CANNOT_BE_A_BASE_URL_PATH = {};
var QUERY = {};
var FRAGMENT = {};

// eslint-disable-next-line max-statements
var parseURL = function (url, input, stateOverride, base) {
  var state = stateOverride || SCHEME_START;
  var pointer = 0;
  var buffer = '';
  var seenAt = false;
  var seenBracket = false;
  var seenPasswordToken = false;
  var codePoints, char, bufferCodePoints, failure;

  if (!stateOverride) {
    url.scheme = '';
    url.username = '';
    url.password = '';
    url.host = null;
    url.port = null;
    url.path = [];
    url.query = null;
    url.fragment = null;
    url.cannotBeABaseURL = false;
    input = input.replace(LEADING_AND_TRAILING_C0_CONTROL_OR_SPACE, '');
  }

  input = input.replace(TAB_AND_NEW_LINE, '');

  codePoints = arrayFrom(input);

  while (pointer <= codePoints.length) {
    char = codePoints[pointer];
    switch (state) {
      case SCHEME_START:
        if (char && ALPHA.test(char)) {
          buffer += char.toLowerCase();
          state = SCHEME;
        } else if (!stateOverride) {
          state = NO_SCHEME;
          continue;
        } else return INVALID_SCHEME;
        break;

      case SCHEME:
        if (char && (ALPHANUMERIC.test(char) || char == '+' || char == '-' || char == '.')) {
          buffer += char.toLowerCase();
        } else if (char == ':') {
          if (stateOverride && (
            (isSpecial(url) != has(specialSchemes, buffer)) ||
            (buffer == 'file' && (includesCredentials(url) || url.port !== null)) ||
            (url.scheme == 'file' && !url.host)
          )) return;
          url.scheme = buffer;
          if (stateOverride) {
            if (isSpecial(url) && specialSchemes[url.scheme] == url.port) url.port = null;
            return;
          }
          buffer = '';
          if (url.scheme == 'file') {
            state = FILE;
          } else if (isSpecial(url) && base && base.scheme == url.scheme) {
            state = SPECIAL_RELATIVE_OR_AUTHORITY;
          } else if (isSpecial(url)) {
            state = SPECIAL_AUTHORITY_SLASHES;
          } else if (codePoints[pointer + 1] == '/') {
            state = PATH_OR_AUTHORITY;
            pointer++;
          } else {
            url.cannotBeABaseURL = true;
            url.path.push('');
            state = CANNOT_BE_A_BASE_URL_PATH;
          }
        } else if (!stateOverride) {
          buffer = '';
          state = NO_SCHEME;
          pointer = 0;
          continue;
        } else return INVALID_SCHEME;
        break;

      case NO_SCHEME:
        if (!base || (base.cannotBeABaseURL && char != '#')) return INVALID_SCHEME;
        if (base.cannotBeABaseURL && char == '#') {
          url.scheme = base.scheme;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          url.cannotBeABaseURL = true;
          state = FRAGMENT;
          break;
        }
        state = base.scheme == 'file' ? FILE : RELATIVE;
        continue;

      case SPECIAL_RELATIVE_OR_AUTHORITY:
        if (char == '/' && codePoints[pointer + 1] == '/') {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
          pointer++;
        } else {
          state = RELATIVE;
          continue;
        } break;

      case PATH_OR_AUTHORITY:
        if (char == '/') {
          state = AUTHORITY;
          break;
        } else {
          state = PATH;
          continue;
        }

      case RELATIVE:
        url.scheme = base.scheme;
        if (char == EOF) {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
        } else if (char == '/' || (char == '\\' && isSpecial(url))) {
          state = RELATIVE_SLASH;
        } else if (char == '?') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.query = base.query;
          url.fragment = '';
          state = FRAGMENT;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          url.path = base.path.slice();
          url.path.pop();
          state = PATH;
          continue;
        } break;

      case RELATIVE_SLASH:
        if (isSpecial(url) && (char == '/' || char == '\\')) {
          state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        } else if (char == '/') {
          state = AUTHORITY;
        } else {
          url.username = base.username;
          url.password = base.password;
          url.host = base.host;
          url.port = base.port;
          state = PATH;
          continue;
        } break;

      case SPECIAL_AUTHORITY_SLASHES:
        state = SPECIAL_AUTHORITY_IGNORE_SLASHES;
        if (char != '/' || buffer.charAt(pointer + 1) != '/') continue;
        pointer++;
        break;

      case SPECIAL_AUTHORITY_IGNORE_SLASHES:
        if (char != '/' && char != '\\') {
          state = AUTHORITY;
          continue;
        } break;

      case AUTHORITY:
        if (char == '@') {
          if (seenAt) buffer = '%40' + buffer;
          seenAt = true;
          bufferCodePoints = arrayFrom(buffer);
          for (var i = 0; i < bufferCodePoints.length; i++) {
            var codePoint = bufferCodePoints[i];
            if (codePoint == ':' && !seenPasswordToken) {
              seenPasswordToken = true;
              continue;
            }
            var encodedCodePoints = percentEncode(codePoint, userinfoPercentEncodeSet);
            if (seenPasswordToken) url.password += encodedCodePoints;
            else url.username += encodedCodePoints;
          }
          buffer = '';
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (seenAt && buffer == '') return INVALID_AUTHORITY;
          pointer -= arrayFrom(buffer).length + 1;
          buffer = '';
          state = HOST;
        } else buffer += char;
        break;

      case HOST:
      case HOSTNAME:
        if (stateOverride && url.scheme == 'file') {
          state = FILE_HOST;
          continue;
        } else if (char == ':' && !seenBracket) {
          if (buffer == '') return INVALID_HOST;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PORT;
          if (stateOverride == HOSTNAME) return;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url))
        ) {
          if (isSpecial(url) && buffer == '') return INVALID_HOST;
          if (stateOverride && buffer == '' && (includesCredentials(url) || url.port !== null)) return;
          failure = parseHost(url, buffer);
          if (failure) return failure;
          buffer = '';
          state = PATH_START;
          if (stateOverride) return;
          continue;
        } else {
          if (char == '[') seenBracket = true;
          else if (char == ']') seenBracket = false;
          buffer += char;
        } break;

      case PORT:
        if (DIGIT.test(char)) {
          buffer += char;
        } else if (
          char == EOF || char == '/' || char == '?' || char == '#' ||
          (char == '\\' && isSpecial(url)) ||
          stateOverride
        ) {
          if (buffer != '') {
            var port = parseInt(buffer, 10);
            if (port > 0xFFFF) return INVALID_PORT;
            url.port = (isSpecial(url) && port === specialSchemes[url.scheme]) ? null : port;
            buffer = '';
          }
          if (stateOverride) return;
          state = PATH_START;
          continue;
        } else return INVALID_PORT;
        break;

      case FILE:
        url.scheme = 'file';
        if (char == '/' || char == '\\') state = FILE_SLASH;
        else if (base && base.scheme == 'file') {
          if (char == EOF) {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
          } else if (char == '?') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.host = base.host;
            url.path = base.path.slice();
            url.query = base.query;
            url.fragment = '';
            state = FRAGMENT;
          } else {
            if (!startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
              url.host = base.host;
              url.path = base.path.slice();
              shortenURLsPath(url);
            }
            state = PATH;
            continue;
          }
        } else {
          state = PATH;
          continue;
        } break;

      case FILE_SLASH:
        if (char == '/' || char == '\\') {
          state = FILE_HOST;
          break;
        }
        if (base && base.scheme == 'file' && !startsWithWindowsDriveLetter(codePoints.slice(pointer).join(''))) {
          if (isWindowsDriveLetter(base.path[0], true)) url.path.push(base.path[0]);
          else url.host = base.host;
        }
        state = PATH;
        continue;

      case FILE_HOST:
        if (char == EOF || char == '/' || char == '\\' || char == '?' || char == '#') {
          if (!stateOverride && isWindowsDriveLetter(buffer)) {
            state = PATH;
          } else if (buffer == '') {
            url.host = '';
            if (stateOverride) return;
            state = PATH_START;
          } else {
            failure = parseHost(url, buffer);
            if (failure) return failure;
            if (url.host == 'localhost') url.host = '';
            if (stateOverride) return;
            buffer = '';
            state = PATH_START;
          } continue;
        } else buffer += char;
        break;

      case PATH_START:
        if (isSpecial(url)) {
          state = PATH;
          if (char != '/' && char != '\\') continue;
        } else if (!stateOverride && char == '?') {
          url.query = '';
          state = QUERY;
        } else if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          state = PATH;
          if (char != '/') continue;
        } break;

      case PATH:
        if (
          char == EOF || char == '/' ||
          (char == '\\' && isSpecial(url)) ||
          (!stateOverride && (char == '?' || char == '#'))
        ) {
          if (isDoubleDot(buffer)) {
            shortenURLsPath(url);
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else if (isSingleDot(buffer)) {
            if (char != '/' && !(char == '\\' && isSpecial(url))) {
              url.path.push('');
            }
          } else {
            if (url.scheme == 'file' && !url.path.length && isWindowsDriveLetter(buffer)) {
              if (url.host) url.host = '';
              buffer = buffer.charAt(0) + ':'; // normalize windows drive letter
            }
            url.path.push(buffer);
          }
          buffer = '';
          if (url.scheme == 'file' && (char == EOF || char == '?' || char == '#')) {
            while (url.path.length > 1 && url.path[0] === '') {
              url.path.shift();
            }
          }
          if (char == '?') {
            url.query = '';
            state = QUERY;
          } else if (char == '#') {
            url.fragment = '';
            state = FRAGMENT;
          }
        } else {
          buffer += percentEncode(char, pathPercentEncodeSet);
        } break;

      case CANNOT_BE_A_BASE_URL_PATH:
        if (char == '?') {
          url.query = '';
          state = QUERY;
        } else if (char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          url.path[0] += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case QUERY:
        if (!stateOverride && char == '#') {
          url.fragment = '';
          state = FRAGMENT;
        } else if (char != EOF) {
          if (char == "'" && isSpecial(url)) url.query += '%27';
          else if (char == '#') url.query += '%23';
          else url.query += percentEncode(char, C0ControlPercentEncodeSet);
        } break;

      case FRAGMENT:
        if (char != EOF) url.fragment += percentEncode(char, fragmentPercentEncodeSet);
        break;
    }

    pointer++;
  }
};

// `URL` constructor
// https://url.spec.whatwg.org/#url-class
var URLConstructor = function URL(url /* , base */) {
  var that = anInstance(this, URLConstructor, 'URL');
  var base = arguments.length > 1 ? arguments[1] : undefined;
  var urlString = String(url);
  var state = setInternalState$6(that, { type: 'URL' });
  var baseState, failure;
  if (base !== undefined) {
    if (base instanceof URLConstructor) baseState = getInternalURLState(base);
    else {
      failure = parseURL(baseState = {}, String(base));
      if (failure) throw TypeError(failure);
    }
  }
  failure = parseURL(state, urlString, null, baseState);
  if (failure) throw TypeError(failure);
  var searchParams = state.searchParams = new URLSearchParams$1();
  var searchParamsState = getInternalSearchParamsState(searchParams);
  searchParamsState.updateSearchParams(state.query);
  searchParamsState.updateURL = function () {
    state.query = String(searchParams) || null;
  };
  if (!descriptors) {
    that.href = serializeURL.call(that);
    that.origin = getOrigin.call(that);
    that.protocol = getProtocol.call(that);
    that.username = getUsername.call(that);
    that.password = getPassword.call(that);
    that.host = getHost.call(that);
    that.hostname = getHostname.call(that);
    that.port = getPort.call(that);
    that.pathname = getPathname.call(that);
    that.search = getSearch.call(that);
    that.searchParams = getSearchParams.call(that);
    that.hash = getHash.call(that);
  }
};

var URLPrototype = URLConstructor.prototype;

var serializeURL = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var username = url.username;
  var password = url.password;
  var host = url.host;
  var port = url.port;
  var path = url.path;
  var query = url.query;
  var fragment = url.fragment;
  var output = scheme + ':';
  if (host !== null) {
    output += '//';
    if (includesCredentials(url)) {
      output += username + (password ? ':' + password : '') + '@';
    }
    output += serializeHost(host);
    if (port !== null) output += ':' + port;
  } else if (scheme == 'file') output += '//';
  output += url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
  if (query !== null) output += '?' + query;
  if (fragment !== null) output += '#' + fragment;
  return output;
};

var getOrigin = function () {
  var url = getInternalURLState(this);
  var scheme = url.scheme;
  var port = url.port;
  if (scheme == 'blob') try {
    return new URL(scheme.path[0]).origin;
  } catch (error) {
    return 'null';
  }
  if (scheme == 'file' || !isSpecial(url)) return 'null';
  return scheme + '://' + serializeHost(url.host) + (port !== null ? ':' + port : '');
};

var getProtocol = function () {
  return getInternalURLState(this).scheme + ':';
};

var getUsername = function () {
  return getInternalURLState(this).username;
};

var getPassword = function () {
  return getInternalURLState(this).password;
};

var getHost = function () {
  var url = getInternalURLState(this);
  var host = url.host;
  var port = url.port;
  return host === null ? ''
    : port === null ? serializeHost(host)
    : serializeHost(host) + ':' + port;
};

var getHostname = function () {
  var host = getInternalURLState(this).host;
  return host === null ? '' : serializeHost(host);
};

var getPort = function () {
  var port = getInternalURLState(this).port;
  return port === null ? '' : String(port);
};

var getPathname = function () {
  var url = getInternalURLState(this);
  var path = url.path;
  return url.cannotBeABaseURL ? path[0] : path.length ? '/' + path.join('/') : '';
};

var getSearch = function () {
  var query = getInternalURLState(this).query;
  return query ? '?' + query : '';
};

var getSearchParams = function () {
  return getInternalURLState(this).searchParams;
};

var getHash = function () {
  var fragment = getInternalURLState(this).fragment;
  return fragment ? '#' + fragment : '';
};

var accessorDescriptor = function (getter, setter) {
  return { get: getter, set: setter, configurable: true, enumerable: true };
};

if (descriptors) {
  objectDefineProperties(URLPrototype, {
    // `URL.prototype.href` accessors pair
    // https://url.spec.whatwg.org/#dom-url-href
    href: accessorDescriptor(serializeURL, function (href) {
      var url = getInternalURLState(this);
      var urlString = String(href);
      var failure = parseURL(url, urlString);
      if (failure) throw TypeError(failure);
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.origin` getter
    // https://url.spec.whatwg.org/#dom-url-origin
    origin: accessorDescriptor(getOrigin),
    // `URL.prototype.protocol` accessors pair
    // https://url.spec.whatwg.org/#dom-url-protocol
    protocol: accessorDescriptor(getProtocol, function (protocol) {
      var url = getInternalURLState(this);
      parseURL(url, String(protocol) + ':', SCHEME_START);
    }),
    // `URL.prototype.username` accessors pair
    // https://url.spec.whatwg.org/#dom-url-username
    username: accessorDescriptor(getUsername, function (username) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(username));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.username = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.username += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.password` accessors pair
    // https://url.spec.whatwg.org/#dom-url-password
    password: accessorDescriptor(getPassword, function (password) {
      var url = getInternalURLState(this);
      var codePoints = arrayFrom(String(password));
      if (cannotHaveUsernamePasswordPort(url)) return;
      url.password = '';
      for (var i = 0; i < codePoints.length; i++) {
        url.password += percentEncode(codePoints[i], userinfoPercentEncodeSet);
      }
    }),
    // `URL.prototype.host` accessors pair
    // https://url.spec.whatwg.org/#dom-url-host
    host: accessorDescriptor(getHost, function (host) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(host), HOST);
    }),
    // `URL.prototype.hostname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hostname
    hostname: accessorDescriptor(getHostname, function (hostname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      parseURL(url, String(hostname), HOSTNAME);
    }),
    // `URL.prototype.port` accessors pair
    // https://url.spec.whatwg.org/#dom-url-port
    port: accessorDescriptor(getPort, function (port) {
      var url = getInternalURLState(this);
      if (cannotHaveUsernamePasswordPort(url)) return;
      port = String(port);
      if (port == '') url.port = null;
      else parseURL(url, port, PORT);
    }),
    // `URL.prototype.pathname` accessors pair
    // https://url.spec.whatwg.org/#dom-url-pathname
    pathname: accessorDescriptor(getPathname, function (pathname) {
      var url = getInternalURLState(this);
      if (url.cannotBeABaseURL) return;
      url.path = [];
      parseURL(url, pathname + '', PATH_START);
    }),
    // `URL.prototype.search` accessors pair
    // https://url.spec.whatwg.org/#dom-url-search
    search: accessorDescriptor(getSearch, function (search) {
      var url = getInternalURLState(this);
      search = String(search);
      if (search == '') {
        url.query = null;
      } else {
        if ('?' == search.charAt(0)) search = search.slice(1);
        url.query = '';
        parseURL(url, search, QUERY);
      }
      getInternalSearchParamsState(url.searchParams).updateSearchParams(url.query);
    }),
    // `URL.prototype.searchParams` getter
    // https://url.spec.whatwg.org/#dom-url-searchparams
    searchParams: accessorDescriptor(getSearchParams),
    // `URL.prototype.hash` accessors pair
    // https://url.spec.whatwg.org/#dom-url-hash
    hash: accessorDescriptor(getHash, function (hash) {
      var url = getInternalURLState(this);
      hash = String(hash);
      if (hash == '') {
        url.fragment = null;
        return;
      }
      if ('#' == hash.charAt(0)) hash = hash.slice(1);
      url.fragment = '';
      parseURL(url, hash, FRAGMENT);
    })
  });
}

// `URL.prototype.toJSON` method
// https://url.spec.whatwg.org/#dom-url-tojson
redefine(URLPrototype, 'toJSON', function toJSON() {
  return serializeURL.call(this);
}, { enumerable: true });

// `URL.prototype.toString` method
// https://url.spec.whatwg.org/#URL-stringification-behavior
redefine(URLPrototype, 'toString', function toString() {
  return serializeURL.call(this);
}, { enumerable: true });

if (NativeURL) {
  var nativeCreateObjectURL = NativeURL.createObjectURL;
  var nativeRevokeObjectURL = NativeURL.revokeObjectURL;
  // `URL.createObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeCreateObjectURL) redefine(URLConstructor, 'createObjectURL', function createObjectURL(blob) {
    return nativeCreateObjectURL.apply(NativeURL, arguments);
  });
  // `URL.revokeObjectURL` method
  // https://developer.mozilla.org/en-US/docs/Web/API/URL/revokeObjectURL
  // eslint-disable-next-line no-unused-vars
  if (nativeRevokeObjectURL) redefine(URLConstructor, 'revokeObjectURL', function revokeObjectURL(url) {
    return nativeRevokeObjectURL.apply(NativeURL, arguments);
  });
}

setToStringTag(URLConstructor, 'URL');

_export({ global: true, forced: !nativeUrl, sham: !descriptors }, {
  URL: URLConstructor
});

var url = path.URL;

var url$1 = url;

var url$2 = url$1;

var nativeGetOwnPropertyDescriptor$2 = objectGetOwnPropertyDescriptor.f;


var FAILS_ON_PRIMITIVES$1 = fails(function () { nativeGetOwnPropertyDescriptor$2(1); });
var FORCED$3 = !descriptors || FAILS_ON_PRIMITIVES$1;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
_export({ target: 'Object', stat: true, forced: FORCED$3, sham: !descriptors }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor$2(toIndexedObject(it), key);
  }
});

var getOwnPropertyDescriptor_1 = createCommonjsModule(function (module) {
var Object = path.Object;

var getOwnPropertyDescriptor = module.exports = function getOwnPropertyDescriptor(it, key) {
  return Object.getOwnPropertyDescriptor(it, key);
};

if (Object.getOwnPropertyDescriptor.sham) getOwnPropertyDescriptor.sham = true;
});

var getOwnPropertyDescriptor$3 = getOwnPropertyDescriptor_1;

var getOwnPropertyDescriptor$4 = getOwnPropertyDescriptor$3;

// `Reflect.get` method
// https://tc39.github.io/ecma262/#sec-reflect.get
function get$1(target, propertyKey /* , receiver */) {
  var receiver = arguments.length < 3 ? target : arguments[2];
  var descriptor, prototype;
  if (anObject(target) === receiver) return target[propertyKey];
  if (descriptor = objectGetOwnPropertyDescriptor.f(target, propertyKey)) return has(descriptor, 'value')
    ? descriptor.value
    : descriptor.get === undefined
      ? undefined
      : descriptor.get.call(receiver);
  if (isObject(prototype = objectGetPrototypeOf(target))) return get$1(prototype, propertyKey, receiver);
}

_export({ target: 'Reflect', stat: true }, {
  get: get$1
});

var get$2 = path.Reflect.get;

var get$3 = get$2;

var get$4 = get$3;

var getPrototypeOf$3 = getPrototypeOf;

var getPrototypeOf$4 = getPrototypeOf$3;

var setPrototypeOf$3 = setPrototypeOf;

var setPrototypeOf$4 = setPrototypeOf$3;

function _getPrototypeOf(o) {
  _getPrototypeOf = setPrototypeOf$4 ? getPrototypeOf$4 : function _getPrototypeOf(o) {
    return o.__proto__ || getPrototypeOf$4(o);
  };
  return _getPrototypeOf(o);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && get$4) {
    _get = get$4;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;

      var desc = getOwnPropertyDescriptor$4(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

var iterator = wellKnownSymbolWrapped.f('iterator');

var iterator$1 = iterator;

var iterator$2 = iterator$1;

// `Symbol.asyncDispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('asyncDispose');

// `Symbol.dispose` well-known symbol
// https://github.com/tc39/proposal-using-statement
defineWellKnownSymbol('dispose');

// `Symbol.observable` well-known symbol
// https://github.com/tc39/proposal-observable
defineWellKnownSymbol('observable');

// `Symbol.patternMatch` well-known symbol
// https://github.com/tc39/proposal-pattern-matching
defineWellKnownSymbol('patternMatch');

// TODO: remove from `core-js@4`


defineWellKnownSymbol('replaceAll');

// TODO: Remove from `core-js@4`


var symbol$3 = symbol;

var symbol$4 = symbol$3;

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof symbol$4 === "function" && typeof iterator$2 === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj && typeof symbol$4 === "function" && obj.constructor === symbol$4 && obj !== symbol$4.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

var create$3 = create;

var create$4 = create$3;

function _setPrototypeOf(o, p) {
  _setPrototypeOf = setPrototypeOf$4 || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = create$4(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

var freezing = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});

var internalMetadata = createCommonjsModule(function (module) {
var defineProperty = objectDefineProperty.f;



var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (freezing && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;
});
var internalMetadata_1 = internalMetadata.REQUIRED;
var internalMetadata_2 = internalMetadata.fastKey;
var internalMetadata_3 = internalMetadata.getWeakData;
var internalMetadata_4 = internalMetadata.onFreeze;

var defineProperty$4 = objectDefineProperty.f;
var forEach$3 = arrayIteration.forEach;



var setInternalState$7 = internalState.set;
var internalStateGetterFor = internalState.getterFor;

var collection = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global_1[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var exported = {};
  var Constructor;

  if (!descriptors || typeof NativeConstructor != 'function'
    || !(IS_WEAK || NativePrototype.forEach && !fails(function () { new NativeConstructor().entries().next(); }))
  ) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    internalMetadata.REQUIRED = true;
  } else {
    Constructor = wrapper(function (target, iterable) {
      setInternalState$7(anInstance(target, Constructor, CONSTRUCTOR_NAME), {
        type: CONSTRUCTOR_NAME,
        collection: new NativeConstructor()
      });
      if (iterable != undefined) iterate_1(iterable, target[ADDER], target, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    forEach$3(['add', 'clear', 'delete', 'forEach', 'get', 'has', 'set', 'keys', 'values', 'entries'], function (KEY) {
      var IS_ADDER = KEY == 'add' || KEY == 'set';
      if (KEY in NativePrototype && !(IS_WEAK && KEY == 'clear')) {
        createNonEnumerableProperty(Constructor.prototype, KEY, function (a, b) {
          var collection = getInternalState(this).collection;
          if (!IS_ADDER && IS_WEAK && !isObject(a)) return KEY == 'get' ? undefined : false;
          var result = collection[KEY](a === 0 ? 0 : a, b);
          return IS_ADDER ? this : result;
        });
      }
    });

    IS_WEAK || defineProperty$4(Constructor.prototype, 'size', {
      configurable: true,
      get: function () {
        return getInternalState(this).collection.size;
      }
    });
  }

  setToStringTag(Constructor, CONSTRUCTOR_NAME, false, true);

  exported[CONSTRUCTOR_NAME] = Constructor;
  _export({ global: true, forced: true }, exported);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

var defineProperty$5 = objectDefineProperty.f;








var fastKey = internalMetadata.fastKey;


var setInternalState$8 = internalState.set;
var internalStateGetterFor$1 = internalState.getterFor;

var collectionStrong = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState$8(that, {
        type: CONSTRUCTOR_NAME,
        index: objectCreate(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!descriptors) that.size = 0;
      if (iterable != undefined) iterate_1(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor$1(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (descriptors) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (descriptors) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (descriptors) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (descriptors) defineProperty$5(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor$1(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor$1(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState$8(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
var es_map = collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var map$3 = path.Map;

// https://tc39.github.io/proposal-setmap-offrom/




var collectionFrom = function from(source /* , mapFn, thisArg */) {
  var length = arguments.length;
  var mapFn = length > 1 ? arguments[1] : undefined;
  var mapping, A, n, boundFunction;
  aFunction(this);
  mapping = mapFn !== undefined;
  if (mapping) aFunction(mapFn);
  if (source == undefined) return new this();
  A = [];
  if (mapping) {
    n = 0;
    boundFunction = functionBindContext(mapFn, length > 2 ? arguments[2] : undefined, 2);
    iterate_1(source, function (nextItem) {
      A.push(boundFunction(nextItem, n++));
    });
  } else {
    iterate_1(source, A.push, A);
  }
  return new this(A);
};

// `Map.from` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.from
_export({ target: 'Map', stat: true }, {
  from: collectionFrom
});

// https://tc39.github.io/proposal-setmap-offrom/
var collectionOf = function of() {
  var length = arguments.length;
  var A = new Array(length);
  while (length--) A[length] = arguments[length];
  return new this(A);
};

// `Map.of` method
// https://tc39.github.io/proposal-setmap-offrom/#sec-map.of
_export({ target: 'Map', stat: true }, {
  of: collectionOf
});

// https://github.com/tc39/collection-methods
var collectionDeleteAll = function (/* ...elements */) {
  var collection = anObject(this);
  var remover = aFunction(collection['delete']);
  var allDeleted = true;
  var wasDeleted;
  for (var k = 0, len = arguments.length; k < len; k++) {
    wasDeleted = remover.call(collection, arguments[k]);
    allDeleted = allDeleted && wasDeleted;
  }
  return !!allDeleted;
};

// `Map.prototype.deleteAll` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  deleteAll: function deleteAll(/* ...elements */) {
    return collectionDeleteAll.apply(this, arguments);
  }
});

var getMapIterator =  getIterator ;

// `Map.prototype.every` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  every: function every(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    return !iterate_1(iterator, function (key, value) {
      if (!boundFunction(value, key, map)) return iterate_1.stop();
    }, undefined, true, true).stopped;
  }
});

// `Map.prototype.filter` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  filter: function filter(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
    var setter = aFunction(newMap.set);
    iterate_1(iterator, function (key, value) {
      if (boundFunction(value, key, map)) setter.call(newMap, key, value);
    }, undefined, true, true);
    return newMap;
  }
});

// `Map.prototype.find` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  find: function find(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    return iterate_1(iterator, function (key, value) {
      if (boundFunction(value, key, map)) return iterate_1.stop(value);
    }, undefined, true, true).result;
  }
});

// `Map.prototype.findKey` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  findKey: function findKey(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    return iterate_1(iterator, function (key, value) {
      if (boundFunction(value, key, map)) return iterate_1.stop(key);
    }, undefined, true, true).result;
  }
});

// `Map.groupBy` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', stat: true }, {
  groupBy: function groupBy(iterable, keyDerivative) {
    var newMap = new this();
    aFunction(keyDerivative);
    var has = aFunction(newMap.has);
    var get = aFunction(newMap.get);
    var set = aFunction(newMap.set);
    iterate_1(iterable, function (element) {
      var derivedKey = keyDerivative(element);
      if (!has.call(newMap, derivedKey)) set.call(newMap, derivedKey, [element]);
      else get.call(newMap, derivedKey).push(element);
    });
    return newMap;
  }
});

// `SameValueZero` abstract operation
// https://tc39.github.io/ecma262/#sec-samevaluezero
var sameValueZero = function (x, y) {
  // eslint-disable-next-line no-self-compare
  return x === y || x != x && y != y;
};

// `Map.prototype.includes` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  includes: function includes(searchElement) {
    return iterate_1(getMapIterator(anObject(this)), function (key, value) {
      if (sameValueZero(value, searchElement)) return iterate_1.stop();
    }, undefined, true, true).stopped;
  }
});

// `Map.keyBy` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', stat: true }, {
  keyBy: function keyBy(iterable, keyDerivative) {
    var newMap = new this();
    aFunction(keyDerivative);
    var setter = aFunction(newMap.set);
    iterate_1(iterable, function (element) {
      setter.call(newMap, keyDerivative(element), element);
    });
    return newMap;
  }
});

// `Map.prototype.includes` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  keyOf: function keyOf(searchElement) {
    return iterate_1(getMapIterator(anObject(this)), function (key, value) {
      if (value === searchElement) return iterate_1.stop(key);
    }, undefined, true, true).result;
  }
});

// `Map.prototype.mapKeys` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  mapKeys: function mapKeys(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
    var setter = aFunction(newMap.set);
    iterate_1(iterator, function (key, value) {
      setter.call(newMap, boundFunction(value, key, map), value);
    }, undefined, true, true);
    return newMap;
  }
});

// `Map.prototype.mapValues` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  mapValues: function mapValues(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    var newMap = new (speciesConstructor(map, getBuiltIn('Map')))();
    var setter = aFunction(newMap.set);
    iterate_1(iterator, function (key, value) {
      setter.call(newMap, key, boundFunction(value, key, map));
    }, undefined, true, true);
    return newMap;
  }
});

// `Map.prototype.merge` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  // eslint-disable-next-line no-unused-vars
  merge: function merge(iterable /* ...iterbles */) {
    var map = anObject(this);
    var setter = aFunction(map.set);
    var i = 0;
    while (i < arguments.length) {
      iterate_1(arguments[i++], setter, map, true);
    }
    return map;
  }
});

// `Map.prototype.reduce` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var noInitial = arguments.length < 2;
    var accumulator = noInitial ? undefined : arguments[1];
    aFunction(callbackfn);
    iterate_1(iterator, function (key, value) {
      if (noInitial) {
        noInitial = false;
        accumulator = value;
      } else {
        accumulator = callbackfn(accumulator, value, key, map);
      }
    }, undefined, true, true);
    if (noInitial) throw TypeError('Reduce of empty map with no initial value');
    return accumulator;
  }
});

// `Set.prototype.some` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  some: function some(callbackfn /* , thisArg */) {
    var map = anObject(this);
    var iterator = getMapIterator(map);
    var boundFunction = functionBindContext(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
    return iterate_1(iterator, function (key, value) {
      if (boundFunction(value, key, map)) return iterate_1.stop();
    }, undefined, true, true).stopped;
  }
});

// `Set.prototype.update` method
// https://github.com/tc39/proposal-collection-methods
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  update: function update(key, callback /* , thunk */) {
    var map = anObject(this);
    var length = arguments.length;
    aFunction(callback);
    var isPresentInMap = map.has(key);
    if (!isPresentInMap && length < 3) {
      throw TypeError('Updating absent value');
    }
    var value = isPresentInMap ? map.get(key) : aFunction(length > 2 ? arguments[2] : undefined)(key, map);
    map.set(key, callback(value, key, map));
    return map;
  }
});

// `Map.prototype.upsert` method
// https://github.com/thumbsupep/proposal-upsert
var mapUpsert = function upsert(key, updateFn /* , insertFn */) {
  var map = anObject(this);
  var insertFn = arguments.length > 2 ? arguments[2] : undefined;
  var value;
  if (typeof updateFn != 'function' && typeof insertFn != 'function') {
    throw TypeError('At least one callback required');
  }
  if (map.has(key)) {
    value = map.get(key);
    if (typeof updateFn == 'function') {
      value = updateFn(value);
      map.set(key, value);
    }
  } else if (typeof insertFn == 'function') {
    value = insertFn();
    map.set(key, value);
  } return value;
};

// `Map.prototype.upsert` method
// https://github.com/thumbsupep/proposal-upsert
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  upsert: mapUpsert
});

// TODO: remove from `core-js@4`




// `Map.prototype.updateOrInsert` method (replaced by `Map.prototype.upsert`)
// https://github.com/thumbsupep/proposal-upsert
_export({ target: 'Map', proto: true, real: true, forced: isPure }, {
  updateOrInsert: mapUpsert
});

// TODO: remove from `core-js@4`


var map$4 = map$3;

var map$5 = map$4;

var $indexOf = arrayIncludes.indexOf;



var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD$3 = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
_export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$3 || !USES_TO_LENGTH$6 }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

var indexOf$1 = entryVirtual('Array').indexOf;

var ArrayPrototype$7 = Array.prototype;

var indexOf_1 = function (it) {
  var own = it.indexOf;
  return it === ArrayPrototype$7 || (it instanceof Array && own === ArrayPrototype$7.indexOf) ? indexOf$1 : own;
};

var indexOf$2 = indexOf_1;

var indexOf$3 = indexOf$2;

function _isNativeFunction(fn) {
  var _context;

  return indexOf$3(_context = Function.toString.call(fn)).call(_context, "[native code]") !== -1;
}

var slice$4 = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
var functionBind = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice$4.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice$4.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};

// `Function.prototype.bind` method
// https://tc39.github.io/ecma262/#sec-function.prototype.bind
_export({ target: 'Function', proto: true }, {
  bind: functionBind
});

var bind$1 = entryVirtual('Function').bind;

var FunctionPrototype = Function.prototype;

var bind_1 = function (it) {
  var own = it.bind;
  return it === FunctionPrototype || (it instanceof Function && own === FunctionPrototype.bind) ? bind$1 : own;
};

var bind$2 = bind_1;

var bind$3 = bind$2;

var nativeConstruct = getBuiltIn('Reflect', 'construct');

// `Reflect.construct` method
// https://tc39.github.io/ecma262/#sec-reflect.construct
// MS Edge supports only 2 arguments and argumentsList argument is optional
// FF Nightly sets third argument as `new.target`, but does not create `this` from it
var NEW_TARGET_BUG = fails(function () {
  function F() { /* empty */ }
  return !(nativeConstruct(function () { /* empty */ }, [], F) instanceof F);
});
var ARGS_BUG = !fails(function () {
  nativeConstruct(function () { /* empty */ });
});
var FORCED$4 = NEW_TARGET_BUG || ARGS_BUG;

_export({ target: 'Reflect', stat: true, forced: FORCED$4, sham: FORCED$4 }, {
  construct: function construct(Target, args /* , newTarget */) {
    aFunction(Target);
    anObject(args);
    var newTarget = arguments.length < 3 ? Target : aFunction(arguments[2]);
    if (ARGS_BUG && !NEW_TARGET_BUG) return nativeConstruct(Target, args, newTarget);
    if (Target == newTarget) {
      // w/o altered newTarget, optimization for 0-4 arguments
      switch (args.length) {
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
      // w/o altered newTarget, lot of arguments case
      var $args = [null];
      $args.push.apply($args, args);
      return new (functionBind.apply(Target, $args))();
    }
    // with altered newTarget, not support built-in constructors
    var proto = newTarget.prototype;
    var instance = objectCreate(isObject(proto) ? proto : Object.prototype);
    var result = Function.apply.call(Target, instance, args);
    return isObject(result) ? result : instance;
  }
});

var construct$1 = path.Reflect.construct;

var construct$2 = construct$1;

var construct$3 = construct$2;

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !construct$3) return false;
  if (construct$3.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(construct$3(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = construct$3;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);

      var Constructor = bind$3(Function).apply(Parent, a);

      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _wrapNativeSuper(Class) {
  var _cache = typeof map$5 === "function" ? new map$5() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = create$4(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
var arrayFill = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

// `Array.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
_export({ target: 'Array', proto: true }, {
  fill: arrayFill
});

var fill = entryVirtual('Array').fill;

var ArrayPrototype$8 = Array.prototype;

var fill_1 = function (it) {
  var own = it.fill;
  return it === ArrayPrototype$8 || (it instanceof Array && own === ArrayPrototype$8.fill) ? fill : own;
};

var fill$1 = fill_1;

var fill$2 = fill$1;

var FAILS_ON_PRIMITIVES$2 = fails(function () { objectKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
  keys: function keys(it) {
    return objectKeys(toObject(it));
  }
});

var keys$1 = path.Object.keys;

var keys$2 = keys$1;

var keys$3 = keys$2;

// `Object.assign` method
// https://tc39.github.io/ecma262/#sec-object.assign
_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
  assign: objectAssign
});

var assign = path.Object.assign;

var assign$1 = assign;

var assign$2 = assign$1;

var map$6 = map$3;

var map$7 = map$6;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
_export({ target: 'Object', stat: true, forced: !descriptors, sham: !descriptors }, {
  defineProperty: objectDefineProperty.f
});

var defineProperty_1 = createCommonjsModule(function (module) {
var Object = path.Object;

var defineProperty = module.exports = function defineProperty(it, key, desc) {
  return Object.defineProperty(it, key, desc);
};

if (Object.defineProperty.sham) defineProperty.sham = true;
});

var defineProperty$6 = defineProperty_1;

var defineProperty$7 = defineProperty$6;

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;

    defineProperty$7(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
var USES_TO_LENGTH$7 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

var max$2 = Math.max;
var min$3 = Math.min;
var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.github.io/ecma262/#sec-array.prototype.splice
// with adding support of @@species
_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$7 }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min$3(max$2(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER$1) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

var splice = entryVirtual('Array').splice;

var ArrayPrototype$9 = Array.prototype;

var splice_1 = function (it) {
  var own = it.splice;
  return it === ArrayPrototype$9 || (it instanceof Array && own === ArrayPrototype$9.splice) ? splice : own;
};

var splice$1 = splice_1;

var splice$2 = splice$1;

var INCORRECT_ITERATION$1 = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
_export({ target: 'Array', stat: true, forced: INCORRECT_ITERATION$1 }, {
  from: arrayFrom
});

var from_1 = path.Array.from;

var from_1$1 = from_1;

var from_1$2 = from_1$1;

// all object keys, includes non-enumerable and symbols
var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
_export({ target: 'Object', stat: true, sham: !descriptors }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});

var getOwnPropertyDescriptors = path.Object.getOwnPropertyDescriptors;

var indexOf$4 = indexOf_1;

var indexOf$5 = indexOf$4;

// `Set` constructor
// https://tc39.github.io/ecma262/#sec-set-objects
var es_set = collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

var set$2 = path.Set;

var set$3 = set$2;

var set$4 = set$3;

// `Date.now` method
// https://tc39.github.io/ecma262/#sec-date.now
_export({ target: 'Date', stat: true }, {
  now: function now() {
    return new Date().getTime();
  }
});

var now = path.Date.now;

var now$1 = now;

var now$2 = now$1;

var concat = entryVirtual('Array').concat;

var ArrayPrototype$a = Array.prototype;

var concat_1 = function (it) {
  var own = it.concat;
  return it === ArrayPrototype$a || (it instanceof Array && own === ArrayPrototype$a.concat) ? concat : own;
};

var concat$1 = concat_1;

var concat$2 = concat$1;

function noop() {}

function assign$3(tar, src) {
  // @ts-ignore
  for (var k in src) {
    tar[k] = src[k];
  }

  return tar;
}

function add_location(element, file, line, column, char) {
  element.__svelte_meta = {
    loc: {
      file: file,
      line: line,
      column: column,
      char: char
    }
  };
}

function run$1(fn) {
  return fn();
}

function blank_object() {
  return create$2(null);
}

function run_all(fns) {
  forEach$2(fns).call(fns, run$1);
}

function is_function(thing) {
  return typeof thing === 'function';
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

function subscribe(store) {
  if (store == null) {
    return noop;
  }

  for (var _len = arguments.length, callbacks = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    callbacks[_key - 1] = arguments[_key];
  }

  var unsub = store.subscribe.apply(store, callbacks);
  return unsub.unsubscribe ? function () {
    return unsub.unsubscribe();
  } : unsub;
}

function get_store_value(store) {
  var value;
  subscribe(store, function (_) {
    return value = _;
  })();
  return value;
}

function create_slot(definition, ctx, $$scope, fn) {
  if (definition) {
    var slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
    return definition[0](slot_ctx);
  }
}

function get_slot_context(definition, ctx, $$scope, fn) {
  var _context;

  return definition[1] && fn ? assign$3(slice$3(_context = $$scope.ctx).call(_context), definition[1](fn(ctx))) : $$scope.ctx;
}

function get_slot_changes(definition, $$scope, dirty, fn) {
  if (definition[2] && fn) {
    var lets = definition[2](fn(dirty));

    if (typeof $$scope.dirty === 'object') {
      var merged = [];
      var len = Math.max($$scope.dirty.length, lets.length);

      for (var i = 0; i < len; i += 1) {
        merged[i] = $$scope.dirty[i] | lets[i];
      }

      return merged;
    }

    return $$scope.dirty | lets;
  }

  return $$scope.dirty;
}

function null_to_empty(value) {
  return value == null ? '' : value;
}

var tasks = new set$4();

function append(target, node) {
  target.appendChild(node);
}

function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}

function detach(node) {
  node.parentNode.removeChild(node);
}

function destroy_each(iterations, detaching) {
  for (var i = 0; i < iterations.length; i += 1) {
    if (iterations[i]) iterations[i].d(detaching);
  }
}

function element(name) {
  return document.createElement(name);
}

function svg_element(name) {
  return document.createElementNS('http://www.w3.org/2000/svg', name);
}

function text(data) {
  return document.createTextNode(data);
}

function space() {
  return text(' ');
}

function empty() {
  return text('');
}

function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return function () {
    return node.removeEventListener(event, handler, options);
  };
}

function prevent_default(fn) {
  return function (event) {
    event.preventDefault(); // @ts-ignore

    return fn.call(this, event);
  };
}

function attr(node, attribute, value) {
  if (value == null) node.removeAttribute(attribute);else if (node.getAttribute(attribute) !== value) node.setAttribute(attribute, value);
}

function children(element) {
  return from_1$2(element.childNodes);
}

function claim_element(nodes, name, attributes, svg) {
  for (var i = 0; i < nodes.length; i += 1) {
    var node = nodes[i];

    if (node.nodeName === name) {
      var j = 0;

      while (j < node.attributes.length) {
        var attribute = node.attributes[j];

        if (attributes[attribute.name]) {
          j++;
        } else {
          node.removeAttribute(attribute.name);
        }
      }

      return splice$2(nodes).call(nodes, i, 1)[0];
    }
  }

  return svg ? svg_element(name) : element(name);
}

function claim_text(nodes, data) {
  for (var i = 0; i < nodes.length; i += 1) {
    var node = nodes[i];

    if (node.nodeType === 3) {
      node.data = '' + data;
      return splice$2(nodes).call(nodes, i, 1)[0];
    }
  }

  return text(data);
}

function claim_space(nodes) {
  return claim_text(nodes, ' ');
}

function set_input_value(input, value) {
  if (value != null || input.value) {
    input.value = value;
  }
}

function set_style(node, key, value, important) {
  node.style.setProperty(key, value, important ? 'important' : '');
}

function add_resize_listener(element, fn) {
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  var object = document.createElement('object');
  object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
  object.setAttribute('aria-hidden', 'true');
  object.type = 'text/html';
  object.tabIndex = -1;
  var win;

  object.onload = function () {
    win = object.contentDocument.defaultView;
    win.addEventListener('resize', fn);
  };

  if (/Trident/.test(navigator.userAgent)) {
    element.appendChild(object);
    object.data = 'about:blank';
  } else {
    object.data = 'about:blank';
    element.appendChild(object);
  }

  return {
    cancel: function cancel() {
      win && win.removeEventListener && win.removeEventListener('resize', fn);
      element.removeChild(object);
    }
  };
}

function toggle_class(element, name, toggle) {
  element.classList[toggle ? 'add' : 'remove'](name);
}

function custom_event(type, detail) {
  var e = document.createEvent('CustomEvent');
  e.initCustomEvent(type, false, false, detail);
  return e;
}

function query_selector_all(selector, parent) {
  if (parent === void 0) {
    parent = document.body;
  }

  return from_1$2(parent.querySelectorAll(selector));
}

var current_component;

function set_current_component(component) {
  current_component = component;
}

function get_current_component() {
  if (!current_component) throw new Error("Function called outside component initialization");
  return current_component;
}

function onMount(fn) {
  get_current_component().$$.on_mount.push(fn);
}

function onDestroy(fn) {
  get_current_component().$$.on_destroy.push(fn);
}

function setContext(key, context) {
  get_current_component().$$.context.set(key, context);
}

function getContext(key) {
  return get_current_component().$$.context.get(key);
} // TODO figure out if we still want to support
// shorthand events, or if we want to implement
// a real bubbling mechanism


function bubble(component, event) {
  var callbacks = component.$$.callbacks[event.type];

  if (callbacks) {
    var _context6;

    forEach$2(_context6 = slice$3(callbacks).call(callbacks)).call(_context6, function (fn) {
      return fn(event);
    });
  }
}

var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];

var resolved_promise = promise$3.resolve();

var update_scheduled = false;

function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush$1);
  }
}

function add_render_callback(fn) {
  render_callbacks.push(fn);
}

function add_flush_callback(fn) {
  flush_callbacks.push(fn);
}

var flushing = false;
var seen_callbacks = new set$4();

function flush$1() {
  if (flushing) return;
  flushing = true;

  do {
    // first, call beforeUpdate functions
    // and update components
    for (var i = 0; i < dirty_components.length; i += 1) {
      var component = dirty_components[i];
      set_current_component(component);
      update(component.$$);
    }

    dirty_components.length = 0;

    while (binding_callbacks.length) {
      binding_callbacks.pop()();
    } // then, once components are updated, call
    // afterUpdate functions. This may cause
    // subsequent updates...


    for (var _i = 0; _i < render_callbacks.length; _i += 1) {
      var callback = render_callbacks[_i];

      if (!seen_callbacks.has(callback)) {
        // ...so guard against infinite loops
        seen_callbacks.add(callback);
        callback();
      }
    }

    render_callbacks.length = 0;
  } while (dirty_components.length);

  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }

  update_scheduled = false;
  flushing = false;
  seen_callbacks.clear();
}

function update($$) {
  if ($$.fragment !== null) {
    var _context7;

    $$.update();
    run_all($$.before_update);
    var dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);

    forEach$2(_context7 = $$.after_update).call(_context7, add_render_callback);
  }
}

var outroing = new set$4();
var outros;

function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros // parent group

  };
}

function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }

  outros = outros.p;
}

function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}

function transition_out(block, local, detach, callback) {
  if (block && block.o) {
    if (outroing.has(block)) return;
    outroing.add(block);
    outros.c.push(function () {
      outroing.delete(block);

      if (callback) {
        if (detach) block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}

var globals = typeof window !== 'undefined' ? window : global;

function get_spread_update(levels, updates) {
  var update = {};
  var to_null_out = {};
  var accounted_for = {
    $$scope: 1
  };
  var i = levels.length;

  while (i--) {
    var o = levels[i];
    var n = updates[i];

    if (n) {
      for (var key in o) {
        if (!(key in n)) to_null_out[key] = 1;
      }

      for (var _key3 in n) {
        if (!accounted_for[_key3]) {
          update[_key3] = n[_key3];
          accounted_for[_key3] = 1;
        }
      }

      levels[i] = n;
    } else {
      for (var _key4 in o) {
        accounted_for[_key4] = 1;
      }
    }
  }

  for (var _key5 in to_null_out) {
    if (!(_key5 in update)) update[_key5] = undefined;
  }

  return update;
}

function get_spread_object(spread_props) {
  return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
} // source: https://html.spec.whatwg.org/multipage/indices.html


var boolean_attributes = new set$4(['allowfullscreen', 'allowpaymentrequest', 'async', 'autofocus', 'autoplay', 'checked', 'controls', 'default', 'defer', 'disabled', 'formnovalidate', 'hidden', 'ismap', 'loop', 'multiple', 'muted', 'nomodule', 'novalidate', 'open', 'playsinline', 'readonly', 'required', 'reversed', 'selected']);

function bind$4(component, name, callback) {
  var index = component.$$.props[name];

  if (index !== undefined) {
    component.$$.bound[index] = callback;
    callback(component.$$.ctx[index]);
  }
}

function create_component(block) {
  block && block.c();
}

function claim_component(block, parent_nodes) {
  block && block.l(parent_nodes);
}

function mount_component(component, target, anchor) {
  var _component$$$ = component.$$,
      fragment = _component$$$.fragment,
      on_mount = _component$$$.on_mount,
      on_destroy = _component$$$.on_destroy,
      after_update = _component$$$.after_update;
  fragment && fragment.m(target, anchor); // onMount happens before the initial afterUpdate

  add_render_callback(function () {
    var _context12;

    var new_on_destroy = filter$2(_context12 = map$2(on_mount).call(on_mount, run$1)).call(_context12, is_function);

    if (on_destroy) {
      on_destroy.push.apply(on_destroy, new_on_destroy);
    } else {
      // Edge case - component was destroyed immediately,
      // most likely as a result of a binding initialising
      run_all(new_on_destroy);
    }

    component.$$.on_mount = [];
  });

  forEach$2(after_update).call(after_update, add_render_callback);
}

function destroy_component(component, detaching) {
  var $$ = component.$$;

  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching); // TODO null out other refs, including component.$$ (but need to
    // preserve final state?)

    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}

function make_dirty(component, i) {
  if (component.$$.dirty[0] === -1) {
    var _context13;

    dirty_components.push(component);
    schedule_update();

    fill$2(_context13 = component.$$.dirty).call(_context13, 0);
  }

  component.$$.dirty[i / 31 | 0] |= 1 << i % 31;
}

function init(component, options, instance, create_fragment, not_equal, props, dirty) {
  if (dirty === void 0) {
    dirty = [-1];
  }

  var parent_component = current_component;
  set_current_component(component);
  var prop_values = options.props || {};
  var $$ = component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props: props,
    update: noop,
    not_equal: not_equal,
    bound: blank_object(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    before_update: [],
    after_update: [],
    context: new map$7(parent_component ? parent_component.$$.context : []),
    // everything else
    callbacks: blank_object(),
    dirty: dirty
  };
  var ready = false;
  $$.ctx = instance ? instance(component, prop_values, function (i, ret) {
    var value = (arguments.length <= 2 ? 0 : arguments.length - 2) ? arguments.length <= 2 ? undefined : arguments[2] : ret;

    if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
      if ($$.bound[i]) $$.bound[i](value);
      if (ready) make_dirty(component, i);
    }

    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update); // `false` as a special case of no DOM component

  $$.fragment = create_fragment ? create_fragment($$.ctx) : false;

  if (options.target) {
    if (options.hydrate) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.l(children(options.target));
    } else {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      $$.fragment && $$.fragment.c();
    }

    if (options.intro) transition_in(component.$$.fragment);
    mount_component(component, options.target, options.anchor);
    flush$1();
  }

  set_current_component(parent_component);
}

var SvelteElement;

if (typeof HTMLElement === 'function') {
  SvelteElement =
  /*#__PURE__*/
  function (_HTMLElement) {
    _inherits(SvelteElement, _HTMLElement);

    function SvelteElement() {
      var _this;

      _classCallCheck(this, SvelteElement);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(SvelteElement).call(this));

      _this.attachShadow({
        mode: 'open'
      });

      return _this;
    }

    _createClass(SvelteElement, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        // @ts-ignore todo: improve typings
        for (var key in this.$$.slotted) {
          // @ts-ignore todo: improve typings
          this.appendChild(this.$$.slotted[key]);
        }
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(attr, _oldValue, newValue) {
        this[attr] = newValue;
      }
    }, {
      key: "$destroy",
      value: function $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
      }
    }, {
      key: "$on",
      value: function $on(type, callback) {
        // TODO should this delegate to addEventListener?
        var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
        callbacks.push(callback);
        return function () {
          var index = indexOf$5(callbacks).call(callbacks, callback);

          if (index !== -1) splice$2(callbacks).call(callbacks, index, 1);
        };
      }
    }, {
      key: "$set",
      value: function $set() {// overridden by instance, if it has props
      }
    }]);

    return SvelteElement;
  }(_wrapNativeSuper(HTMLElement));
}

var SvelteComponent =
/*#__PURE__*/
function () {
  function SvelteComponent() {
    _classCallCheck(this, SvelteComponent);
  }

  _createClass(SvelteComponent, [{
    key: "$destroy",
    value: function $destroy() {
      destroy_component(this, 1);
      this.$destroy = noop;
    }
  }, {
    key: "$on",
    value: function $on(type, callback) {
      var callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
      callbacks.push(callback);
      return function () {
        var index = indexOf$5(callbacks).call(callbacks, callback);

        if (index !== -1) splice$2(callbacks).call(callbacks, index, 1);
      };
    }
  }, {
    key: "$set",
    value: function $set() {// overridden by instance, if it has props
    }
  }]);

  return SvelteComponent;
}();

function dispatch_dev(type, detail) {
  document.dispatchEvent(custom_event(type, assign$2({
    version: '3.18.2'
  }, detail)));
}

function append_dev(target, node) {
  dispatch_dev("SvelteDOMInsert", {
    target: target,
    node: node
  });
  append(target, node);
}

function insert_dev(target, node, anchor) {
  dispatch_dev("SvelteDOMInsert", {
    target: target,
    node: node,
    anchor: anchor
  });
  insert(target, node, anchor);
}

function detach_dev(node) {
  dispatch_dev("SvelteDOMRemove", {
    node: node
  });
  detach(node);
}

function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
  var modifiers = options === true ? ["capture"] : options ? from_1$2(keys$3(options)) : [];
  if (has_prevent_default) modifiers.push('preventDefault');
  if (has_stop_propagation) modifiers.push('stopPropagation');
  dispatch_dev("SvelteDOMAddEventListener", {
    node: node,
    event: event,
    handler: handler,
    modifiers: modifiers
  });
  var dispose = listen(node, event, handler, options);
  return function () {
    dispatch_dev("SvelteDOMRemoveEventListener", {
      node: node,
      event: event,
      handler: handler,
      modifiers: modifiers
    });
    dispose();
  };
}

function attr_dev(node, attribute, value) {
  attr(node, attribute, value);
  if (value == null) dispatch_dev("SvelteDOMRemoveAttribute", {
    node: node,
    attribute: attribute
  });else dispatch_dev("SvelteDOMSetAttribute", {
    node: node,
    attribute: attribute,
    value: value
  });
}

function prop_dev(node, property, value) {
  node[property] = value;
  dispatch_dev("SvelteDOMSetProperty", {
    node: node,
    property: property,
    value: value
  });
}

function set_data_dev(text, data) {
  data = '' + data;
  if (text.data === data) return;
  dispatch_dev("SvelteDOMSetData", {
    node: text,
    data: data
  });
  text.data = data;
}

var SvelteComponentDev =
/*#__PURE__*/
function (_SvelteComponent) {
  _inherits(SvelteComponentDev, _SvelteComponent);

  function SvelteComponentDev(options) {
    _classCallCheck(this, SvelteComponentDev);

    if (!options || !options.target && !options.$$inline) {
      throw new Error("'target' is a required option");
    }

    return _possibleConstructorReturn(this, _getPrototypeOf(SvelteComponentDev).call(this));
  }

  _createClass(SvelteComponentDev, [{
    key: "$destroy",
    value: function $destroy() {
      _get(_getPrototypeOf(SvelteComponentDev.prototype), "$destroy", this).call(this);

      this.$destroy = function () {
        console.warn("Component was already destroyed"); // eslint-disable-line no-console
      };
    }
  }]);

  return SvelteComponentDev;
}(SvelteComponent);

var CONTEXT_KEY = {};
var preload = function preload() {
  return {};
};

// `Array.isArray` method
// https://tc39.github.io/ecma262/#sec-array.isarray
_export({ target: 'Array', stat: true }, {
  isArray: isArray
});

var isArray$1 = path.Array.isArray;

var isArray$2 = isArray$1;

var isArray$3 = isArray$2;

var subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */


function writable(value, start) {
  if (start === void 0) {
    start = noop;
  }

  var stop;
  var subscribers = [];

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        // store is ready
        var run_queue = !subscriber_queue.length;

        for (var i = 0; i < subscribers.length; i += 1) {
          var s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }

        if (run_queue) {
          for (var _i = 0; _i < subscriber_queue.length; _i += 2) {
            subscriber_queue[_i][0](subscriber_queue[_i + 1]);
          }

          subscriber_queue.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run, invalidate) {
    if (invalidate === void 0) {
      invalidate = noop;
    }

    var subscriber = [run, invalidate];
    subscribers.push(subscriber);

    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }

    run(value);
    return function () {
      var index = indexOf$5(subscribers).call(subscribers, subscriber);

      if (index !== -1) {
        splice$2(subscribers).call(subscribers, index, 1);
      }

      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }

  return {
    set: set,
    update: update,
    subscribe: subscribe
  };
}

function create_fragment(ctx) {
  var current;
  var default_slot_template =
  /*$$slots*/
  ctx[1].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[0], null);
  var block = {
    c: function create() {
      if (default_slot) default_slot.c();
    },
    l: function claim(nodes) {
      if (default_slot) default_slot.l(nodes);
    },
    m: function mount(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      1) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[0], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[0], dirty, null));
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (default_slot) default_slot.d(detaching);
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
  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  $$self.$set = function ($$props) {
    if ("$$scope" in $$props) $$invalidate(0, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {};

  return [$$scope, $$slots];
}

var Layout =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Layout, _SvelteComponentDev);

  function Layout(options) {
    var _this;

    _classCallCheck(this, Layout);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Layout).call(this, options));
    init(_assertThisInitialized(_this), options, instance, create_fragment, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Layout",
      options: options,
      id: create_fragment.name
    });
    return _this;
  }

  return Layout;
}(SvelteComponentDev);

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod$4 = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

var stringTrim = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod$4(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod$4(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod$4(3)
};

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
var stringTrimForced = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};

var $trim = stringTrim.trim;


// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
_export({ target: 'String', proto: true, forced: stringTrimForced('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});

var trim = entryVirtual('String').trim;

var StringPrototype$1 = String.prototype;

var trim_1 = function (it) {
  var own = it.trim;
  return typeof it === 'string' || it === StringPrototype$1
    || (it instanceof String && own === StringPrototype$1.trim) ? trim : own;
};

var trim$1 = trim_1;

var trim$2 = trim$1;

var _context;

/* eslint-disable no-process-env */
var base$1 = {
  appId: 'com.app-template',
  packageName: 'app-template',
  appName: 'App Template',
  appVersion: '0.0.1',
  description: 'App Template',
  // logUrl     : 'http://app-template.logger.com/log.php', // TODO
  installer: {
    electronVersion: '6.0.11',
    nodeVersion: '12.4.0'
  },
  sapper: {
    devServer: trim$2(_context =  '').call(_context) === 'development'
  },
  tests: {
    intern: {}
  }
};

/* tslint:disable:no-var-requires */

var dev = {
  // base
  appId: base$1.appId + ".dev",
  packageName: base$1.packageName + "-dev",
  appName: base$1.appName + " Dev",
  appVersion: "" + base$1.appVersion,
  logUrl: base$1.logUrl,
  installer: base$1.installer,
  type: 'dev',
  dev: {
    devTools: {
      openAtStart: false
    }
  },
  tests: {
    intern: {
      staticPort: 3012,
      serverPort: 3022,
      socketPort: 3032
    }
  },
  sapper: {
    buildMode: 'development',
    port: base$1.sapper.devServer ? 3000 : 3002,
    devServer: base$1.sapper.devServer
  }
};

var Error_1 = globals.Error;
var file = "src\\routes\\_error.svelte"; // (19:0) {#if dev && error.stack}

function create_if_block(ctx) {
  var pre;
  var t_value =
  /*error*/
  ctx[1].stack + "";
  var t;
  var block = {
    c: function create() {
      pre = element("pre");
      t = text(t_value);
      this.h();
    },
    l: function claim(nodes) {
      pre = claim_element(nodes, "PRE", {});
      var pre_nodes = children(pre);
      t = claim_text(pre_nodes, t_value);

      forEach$2(pre_nodes).call(pre_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      add_location(pre, file, 19, 1, 336);
    },
    m: function mount(target, anchor) {
      insert_dev(target, pre, anchor);
      append_dev(pre, t);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*error*/
      2 && t_value !== (t_value =
      /*error*/
      ctx[1].stack + "")) set_data_dev(t, t_value);
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(pre);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block.name,
    type: "if",
    source: "(19:0) {#if dev && error.stack}",
    ctx: ctx
  });
  return block;
}

function create_fragment$1(ctx) {
  var title_value;
  var t0;
  var h1;
  var t1;
  var t2;
  var p;
  var t3_value =
  /*error*/
  ctx[1].message + "";
  var t3;
  var t4;
  var if_block_anchor;
  document.title = title_value =
  /*status*/
  ctx[0];
  var if_block =
  /*dev*/
  ctx[2] &&
  /*error*/
  ctx[1].stack && create_if_block(ctx);
  var block = {
    c: function create() {
      t0 = space();
      h1 = element("h1");
      t1 = text(
      /*status*/
      ctx[0]);
      t2 = space();
      p = element("p");
      t3 = text(t3_value);
      t4 = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      this.h();
    },
    l: function claim(nodes) {
      var head_nodes = query_selector_all("[data-svelte=\"svelte-1o9r2ue\"]", document.head);

      forEach$2(head_nodes).call(head_nodes, detach_dev);

      t0 = claim_space(nodes);
      h1 = claim_element(nodes, "H1", {
        class: true
      });
      var h1_nodes = children(h1);
      t1 = claim_text(h1_nodes,
      /*status*/
      ctx[0]);

      forEach$2(h1_nodes).call(h1_nodes, detach_dev);

      t2 = claim_space(nodes);
      p = claim_element(nodes, "P", {
        class: true
      });
      var p_nodes = children(p);
      t3 = claim_text(p_nodes, t3_value);

      forEach$2(p_nodes).call(p_nodes, detach_dev);

      t4 = claim_space(nodes);
      if (if_block) if_block.l(nodes);
      if_block_anchor = empty();
      this.h();
    },
    h: function hydrate() {
      attr_dev(h1, "class", "svelte-16vgqk5");
      add_location(h1, file, 14, 0, 267);
      attr_dev(p, "class", "svelte-16vgqk5");
      add_location(p, file, 16, 0, 286);
    },
    m: function mount(target, anchor) {
      insert_dev(target, t0, anchor);
      insert_dev(target, h1, anchor);
      append_dev(h1, t1);
      insert_dev(target, t2, anchor);
      insert_dev(target, p, anchor);
      append_dev(p, t3);
      insert_dev(target, t4, anchor);
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (dirty &
      /*status*/
      1 && title_value !== (title_value =
      /*status*/
      ctx[0])) {
        document.title = title_value;
      }

      if (dirty &
      /*status*/
      1) set_data_dev(t1,
      /*status*/
      ctx[0]);
      if (dirty &
      /*error*/
      2 && t3_value !== (t3_value =
      /*error*/
      ctx[1].message + "")) set_data_dev(t3, t3_value);

      if (
      /*dev*/
      ctx[2] &&
      /*error*/
      ctx[1].stack) {
        if (if_block) {
          if_block.p(ctx, dirty);
        } else {
          if_block = create_if_block(ctx);
          if_block.c();
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(t0);
      if (detaching) detach_dev(h1);
      if (detaching) detach_dev(t2);
      if (detaching) detach_dev(p);
      if (detaching) detach_dev(t4);
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$1.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$1($$self, $$props, $$invalidate) {
  var _context;

  var status = $$props.status;
  var error = $$props.error;
  var dev$1 = dev.dev;
  var writable_props = ["status", "error"];

  forEach$2(_context = keys$3($$props)).call(_context, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<Error> was created with unknown prop '" + key + "'");
  });

  $$self.$set = function ($$props) {
    if ("status" in $$props) $$invalidate(0, status = $$props.status);
    if ("error" in $$props) $$invalidate(1, error = $$props.error);
  };

  $$self.$capture_state = function () {
    return {
      status: status,
      error: error
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("status" in $$props) $$invalidate(0, status = $$props.status);
    if ("error" in $$props) $$invalidate(1, error = $$props.error);
  };

  return [status, error, dev$1];
}

var Error$1 =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Error, _SvelteComponentDev);

  function Error(options) {
    var _this;

    _classCallCheck(this, Error);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Error).call(this, options));
    init(_assertThisInitialized(_this), options, instance$1, create_fragment$1, safe_not_equal, {
      status: 0,
      error: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Error",
      options: options,
      id: create_fragment$1.name
    });
    var ctx = _this.$$.ctx;
    var props = options.props || {};

    if (
    /*status*/
    ctx[0] === undefined && !("status" in props)) {
      console.warn("<Error> was created without expected prop 'status'");
    }

    if (
    /*error*/
    ctx[1] === undefined && !("error" in props)) {
      console.warn("<Error> was created without expected prop 'error'");
    }

    return _this;
  }

  _createClass(Error, [{
    key: "status",
    get: function get() {
      throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "error",
    get: function get() {
      throw new Error_1("<Error>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1("<Error>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return Error;
}(SvelteComponentDev);

var Error_1$1 = globals.Error;

function create_else_block(ctx) {
  var switch_instance_anchor;
  var current;
  var switch_instance_spread_levels = [{
    segment:
    /*segments*/
    ctx[2][1]
  },
  /*level1*/
  ctx[4].props];
  var switch_value =
  /*level1*/
  ctx[4].component;

  function switch_props(ctx) {
    var switch_instance_props = {
      $$slots: {
        default: [create_default_slot_1]
      },
      $$scope: {
        ctx: ctx
      }
    };

    for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign$3(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props,
      $$inline: true
    };
  }

  if (switch_value) {
    var switch_instance = new switch_value(switch_props(ctx));
  }

  var block = {
    c: function create() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l: function claim(nodes) {
      if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert_dev(target, switch_instance_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var switch_instance_changes = dirty &
      /*segments, level1*/
      20 ? get_spread_update(switch_instance_spread_levels, [dirty &
      /*segments*/
      4 && {
        segment:
        /*segments*/
        ctx[2][1]
      }, dirty &
      /*level1*/
      16 && get_spread_object(
      /*level1*/
      ctx[4].props)]) : {};

      if (dirty &
      /*$$scope, level2, segments, level3*/
      356) {
        switch_instance_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      if (switch_value !== (switch_value =
      /*level1*/
      ctx[4].component)) {
        if (switch_instance) {
          group_outros();
          var old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, function () {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i: function intro(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_else_block.name,
    type: "else",
    source: "(23:1) {:else}",
    ctx: ctx
  });
  return block;
} // (21:1) {#if error}


function create_if_block$1(ctx) {
  var current;
  var error_1 = new Error$1({
    props: {
      error:
      /*error*/
      ctx[0],
      status:
      /*status*/
      ctx[1]
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(error_1.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(error_1.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(error_1, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var error_1_changes = {};
      if (dirty &
      /*error*/
      1) error_1_changes.error =
      /*error*/
      ctx[0];
      if (dirty &
      /*status*/
      2) error_1_changes.status =
      /*status*/
      ctx[1];
      error_1.$set(error_1_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(error_1.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(error_1.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(error_1, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block$1.name,
    type: "if",
    source: "(21:1) {#if error}",
    ctx: ctx
  });
  return block;
} // (25:3) {#if level2}


function create_if_block_1(ctx) {
  var switch_instance_anchor;
  var current;
  var switch_instance_spread_levels = [{
    segment:
    /*segments*/
    ctx[2][2]
  },
  /*level2*/
  ctx[5].props];
  var switch_value =
  /*level2*/
  ctx[5].component;

  function switch_props(ctx) {
    var switch_instance_props = {
      $$slots: {
        default: [create_default_slot_2]
      },
      $$scope: {
        ctx: ctx
      }
    };

    for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign$3(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props,
      $$inline: true
    };
  }

  if (switch_value) {
    var switch_instance = new switch_value(switch_props(ctx));
  }

  var block = {
    c: function create() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l: function claim(nodes) {
      if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert_dev(target, switch_instance_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var switch_instance_changes = dirty &
      /*segments, level2*/
      36 ? get_spread_update(switch_instance_spread_levels, [dirty &
      /*segments*/
      4 && {
        segment:
        /*segments*/
        ctx[2][2]
      }, dirty &
      /*level2*/
      32 && get_spread_object(
      /*level2*/
      ctx[5].props)]) : {};

      if (dirty &
      /*$$scope, level3*/
      320) {
        switch_instance_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      if (switch_value !== (switch_value =
      /*level2*/
      ctx[5].component)) {
        if (switch_instance) {
          group_outros();
          var old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, function () {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props(ctx));
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i: function intro(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_1.name,
    type: "if",
    source: "(25:3) {#if level2}",
    ctx: ctx
  });
  return block;
} // (27:5) {#if level3}


function create_if_block_2(ctx) {
  var switch_instance_anchor;
  var current;
  var switch_instance_spread_levels = [
  /*level3*/
  ctx[6].props];
  var switch_value =
  /*level3*/
  ctx[6].component;

  function switch_props(ctx) {
    var switch_instance_props = {};

    for (var i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign$3(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props,
      $$inline: true
    };
  }

  if (switch_value) {
    var switch_instance = new switch_value(switch_props());
  }

  var block = {
    c: function create() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },
    l: function claim(nodes) {
      if (switch_instance) claim_component(switch_instance.$$.fragment, nodes);
      switch_instance_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert_dev(target, switch_instance_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var switch_instance_changes = dirty &
      /*level3*/
      64 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*level3*/
      ctx[6].props)]) : {};

      if (switch_value !== (switch_value =
      /*level3*/
      ctx[6].component)) {
        if (switch_instance) {
          group_outros();
          var old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, function () {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },
    i: function intro(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_2.name,
    type: "if",
    source: "(27:5) {#if level3}",
    ctx: ctx
  });
  return block;
} // (26:4) <svelte:component this="{level2.component}" segment="{segments[2]}" {...level2.props}>


function create_default_slot_2(ctx) {
  var if_block_anchor;
  var current;
  var if_block =
  /*level3*/
  ctx[6] && create_if_block_2(ctx);
  var block = {
    c: function create() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if (if_block) if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (
      /*level3*/
      ctx[6]) {
        if (if_block) {
          if_block.p(ctx, dirty);
          transition_in(if_block, 1);
        } else {
          if_block = create_if_block_2(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot_2.name,
    type: "slot",
    source: "(26:4) <svelte:component this=\\\"{level2.component}\\\" segment=\\\"{segments[2]}\\\" {...level2.props}>",
    ctx: ctx
  });
  return block;
} // (24:2) <svelte:component this="{level1.component}" segment="{segments[1]}" {...level1.props}>


function create_default_slot_1(ctx) {
  var if_block_anchor;
  var current;
  var if_block =
  /*level2*/
  ctx[5] && create_if_block_1(ctx);
  var block = {
    c: function create() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if (if_block) if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (
      /*level2*/
      ctx[5]) {
        if (if_block) {
          if_block.p(ctx, dirty);
          transition_in(if_block, 1);
        } else {
          if_block = create_if_block_1(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot_1.name,
    type: "slot",
    source: "(24:2) <svelte:component this=\\\"{level1.component}\\\" segment=\\\"{segments[1]}\\\" {...level1.props}>",
    ctx: ctx
  });
  return block;
} // (20:0) <Layout segment="{segments[0]}" {...level0.props}>


function create_default_slot(ctx) {
  var current_block_type_index;
  var if_block;
  var if_block_anchor;
  var current;
  var if_block_creators = [create_if_block$1, create_else_block];
  var if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*error*/
    ctx[0]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  var block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, function () {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot.name,
    type: "slot",
    source: "(20:0) <Layout segment=\\\"{segments[0]}\\\" {...level0.props}>",
    ctx: ctx
  });
  return block;
}

function create_fragment$2(ctx) {
  var current;
  var layout_spread_levels = [{
    segment:
    /*segments*/
    ctx[2][0]
  },
  /*level0*/
  ctx[3].props];
  var layout_props = {
    $$slots: {
      default: [create_default_slot]
    },
    $$scope: {
      ctx: ctx
    }
  };

  for (var i = 0; i < layout_spread_levels.length; i += 1) {
    layout_props = assign$3(layout_props, layout_spread_levels[i]);
  }

  var layout = new Layout({
    props: layout_props,
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(layout.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(layout.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(layout, target, anchor);
      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];
      var layout_changes = dirty &
      /*segments, level0*/
      12 ? get_spread_update(layout_spread_levels, [dirty &
      /*segments*/
      4 && {
        segment:
        /*segments*/
        ctx[2][0]
      }, dirty &
      /*level0*/
      8 && get_spread_object(
      /*level0*/
      ctx[3].props)]) : {};

      if (dirty &
      /*$$scope, error, status, level1, segments, level2, level3*/
      375) {
        layout_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      layout.$set(layout_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(layout.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(layout.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(layout, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$2.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$2($$self, $$props, $$invalidate) {
  var _context;

  var stores = $$props.stores;
  var error = $$props.error;
  var status = $$props.status;
  var segments = $$props.segments;
  var level0 = $$props.level0;
  var _$$props$level = $$props.level1,
      level1 = _$$props$level === void 0 ? null : _$$props$level;
  var _$$props$level2 = $$props.level2,
      level2 = _$$props$level2 === void 0 ? null : _$$props$level2;
  var _$$props$level3 = $$props.level3,
      level3 = _$$props$level3 === void 0 ? null : _$$props$level3;
  setContext(CONTEXT_KEY, stores);
  var writable_props = ["stores", "error", "status", "segments", "level0", "level1", "level2", "level3"];

  forEach$2(_context = keys$3($$props)).call(_context, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<App> was created with unknown prop '" + key + "'");
  });

  $$self.$set = function ($$props) {
    if ("stores" in $$props) $$invalidate(7, stores = $$props.stores);
    if ("error" in $$props) $$invalidate(0, error = $$props.error);
    if ("status" in $$props) $$invalidate(1, status = $$props.status);
    if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
    if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
    if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
    if ("level2" in $$props) $$invalidate(5, level2 = $$props.level2);
    if ("level3" in $$props) $$invalidate(6, level3 = $$props.level3);
  };

  $$self.$capture_state = function () {
    return {
      stores: stores,
      error: error,
      status: status,
      segments: segments,
      level0: level0,
      level1: level1,
      level2: level2,
      level3: level3
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("stores" in $$props) $$invalidate(7, stores = $$props.stores);
    if ("error" in $$props) $$invalidate(0, error = $$props.error);
    if ("status" in $$props) $$invalidate(1, status = $$props.status);
    if ("segments" in $$props) $$invalidate(2, segments = $$props.segments);
    if ("level0" in $$props) $$invalidate(3, level0 = $$props.level0);
    if ("level1" in $$props) $$invalidate(4, level1 = $$props.level1);
    if ("level2" in $$props) $$invalidate(5, level2 = $$props.level2);
    if ("level3" in $$props) $$invalidate(6, level3 = $$props.level3);
  };

  return [error, status, segments, level0, level1, level2, level3, stores];
}

var App =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(App, _SvelteComponentDev);

  function App(options) {
    var _this;

    _classCallCheck(this, App);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(App).call(this, options));
    init(_assertThisInitialized(_this), options, instance$2, create_fragment$2, safe_not_equal, {
      stores: 7,
      error: 0,
      status: 1,
      segments: 2,
      level0: 3,
      level1: 4,
      level2: 5,
      level3: 6
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "App",
      options: options,
      id: create_fragment$2.name
    });
    var ctx = _this.$$.ctx;
    var props = options.props || {};

    if (
    /*stores*/
    ctx[7] === undefined && !("stores" in props)) {
      console.warn("<App> was created without expected prop 'stores'");
    }

    if (
    /*error*/
    ctx[0] === undefined && !("error" in props)) {
      console.warn("<App> was created without expected prop 'error'");
    }

    if (
    /*status*/
    ctx[1] === undefined && !("status" in props)) {
      console.warn("<App> was created without expected prop 'status'");
    }

    if (
    /*segments*/
    ctx[2] === undefined && !("segments" in props)) {
      console.warn("<App> was created without expected prop 'segments'");
    }

    if (
    /*level0*/
    ctx[3] === undefined && !("level0" in props)) {
      console.warn("<App> was created without expected prop 'level0'");
    }

    return _this;
  }

  _createClass(App, [{
    key: "stores",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "error",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "status",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "segments",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "level0",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "level1",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "level2",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "level3",
    get: function get() {
      throw new Error_1$1("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error_1$1("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return App;
}(SvelteComponentDev);

// This file is generated by Sapper — do not edit it!
var ignore = [];
var components = [{
  js: function js() {
    return import('./index.3eeb7f40.js');
  },
  css: ["client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./_layout.ba29b98d.js');
  },
  css: ["_layout.ba29b98d.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./index.9ed6fc63.js');
  },
  css: ["client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./parser.3d337824.js');
  },
  css: ["parser.3d337824.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./_layout.0e6e2b1d.js');
  },
  css: ["_layout.0e6e2b1d.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./index.1cac8ed5.js');
  },
  css: ["client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./_layout.d6c5612d.js');
  },
  css: ["_layout.d6c5612d.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./index.0a24f45d.js');
  },
  css: ["client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./dropdowns.823aa012.js');
  },
  css: ["dropdowns.823aa012.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./inputs.e8268601.js');
  },
  css: ["inputs.e8268601.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./font-families.75c4ae30.js');
  },
  css: ["font-families.75c4ae30.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./buttons.1e957cec.js');
  },
  css: ["buttons.1e957cec.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./markers.dd570815.js');
  },
  css: ["markers.dd570815.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./fonts.c1826d7c.js');
  },
  css: ["fonts.c1826d7c.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./icons.ff185184.js');
  },
  css: ["icons.ff185184.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./app-info.4beb458e.js');
  },
  css: ["app-info.4beb458e.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./validate.badbe1fc.js');
  },
  css: ["validate.badbe1fc.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./webrain.3d15143d.js');
  },
  css: ["client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./status.7f931122.js');
  },
  css: ["status.7f931122.css","client.6a27e0ac.css"]
}, {
  js: function js() {
    return import('./tests.339ed8db.js');
  },
  css: ["tests.339ed8db.css","client.6a27e0ac.css"]
}];
var routes = [{
  // index.svelte
  pattern: /^\/$/,
  parts: [{
    i: 0
  }]
}, {
  // main/index.svelte
  pattern: /^\/main\/?$/,
  parts: [{
    i: 1
  }, {
    i: 2
  }]
}, {
  // main/parser.svelte
  pattern: /^\/main\/parser\/?$/,
  parts: [{
    i: 1
  }, {
    i: 3
  }]
}, {
  // dev/index.svelte
  pattern: /^\/dev\/?$/,
  parts: [{
    i: 4
  }, {
    i: 5
  }]
}, {
  // dev/components/index.svelte
  pattern: /^\/dev\/components\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, {
    i: 7
  }]
}, {
  // dev/components/medium/dropdowns.svelte
  pattern: /^\/dev\/components\/medium\/dropdowns\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 8
  }]
}, {
  // dev/components/medium/inputs.svelte
  pattern: /^\/dev\/components\/medium\/inputs\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 9
  }]
}, {
  // dev/components/small/font-families.svelte
  pattern: /^\/dev\/components\/small\/font-families\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 10
  }]
}, {
  // dev/components/small/buttons.svelte
  pattern: /^\/dev\/components\/small\/buttons\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 11
  }]
}, {
  // dev/components/small/markers.svelte
  pattern: /^\/dev\/components\/small\/markers\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 12
  }]
}, {
  // dev/components/small/fonts.svelte
  pattern: /^\/dev\/components\/small\/fonts\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 13
  }]
}, {
  // dev/components/small/icons.svelte
  pattern: /^\/dev\/components\/small\/icons\/?$/,
  parts: [{
    i: 4
  }, {
    i: 6
  }, null, {
    i: 14
  }]
}, {
  // dev/app-info.svelte
  pattern: /^\/dev\/app-info\/?$/,
  parts: [{
    i: 4
  }, {
    i: 15
  }]
}, {
  // dev/validate.svelte
  pattern: /^\/dev\/validate\/?$/,
  parts: [{
    i: 4
  }, {
    i: 16
  }]
}, {
  // dev/webrain.svelte
  pattern: /^\/dev\/webrain\/?$/,
  parts: [{
    i: 4
  }, {
    i: 17
  }]
}, {
  // dev/status.svelte
  pattern: /^\/dev\/status\/?$/,
  parts: [{
    i: 4
  }, {
    i: 18
  }]
}, {
  // dev/tests.svelte
  pattern: /^\/dev\/tests\/?$/,
  parts: [{
    i: 4
  }, {
    i: 19
  }]
}];

function goto(href, opts) {
  if (opts === void 0) {
    opts = {
      replaceState: false
    };
  }

  var target = select_target(new url$2(href, document.baseURI));

  if (target) {
    _history[opts.replaceState ? 'replaceState' : 'pushState']({
      id: cid
    }, '', href);

    return navigate(target, null).then(function () {});
  }

  location.href = href;
  return new promise$3(function (f) {}); // never resolves
}

var initial_data = typeof __SAPPER__ !== 'undefined' && __SAPPER__;
var ready = false;
var root_component;
var current_token;
var root_preloaded;
var current_branch = [];
var current_query = '{}';
var stores = {
  page: writable({}),
  preloading: writable(null),
  session: writable(initial_data && initial_data.session)
};
var $session;
var session_dirty;
stores.session.subscribe(
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee(value) {
    var target, token, _ref2, redirect, props, branch;

    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            $session = value;

            if (ready) {
              _context.next = 3;
              break;
            }

            return _context.abrupt("return");

          case 3:
            session_dirty = true;
            target = select_target(new url$2(location.href));
            token = current_token = {};
            _context.next = 8;
            return hydrate_target(target);

          case 8:
            _ref2 = _context.sent;
            redirect = _ref2.redirect;
            props = _ref2.props;
            branch = _ref2.branch;

            if (!(token !== current_token)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return");

          case 14:
            _context.next = 16;
            return render(redirect, branch, props, target.page);

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
var prefetching = null;

function set_prefetching(href, promise) {
  prefetching = {
    href: href,
    promise: promise
  };
}

var target;

function set_target(element) {
  target = element;
}

var uid$1 = 1;

function set_uid(n) {
  uid$1 = n;
}

var cid;

function set_cid(n) {
  cid = n;
}

var _history = typeof history !== 'undefined' ? history : {
  pushState: function pushState(state, title, href) {},
  replaceState: function replaceState(state, title, href) {},
  scrollRestoration: ''
};

var scroll_history = {};

function extract_query(search) {
  var query = create$2(null);

  if (search.length > 0) {
    var _context2;

    forEach$2(_context2 = slice$3(search).call(search, 1).split('&')).call(_context2, function (searchParam) {
      var _$exec = /([^=]*)(?:=(.*))?/.exec(decodeURIComponent(searchParam.replace(/\+/g, ' '))),
          key = _$exec[1],
          _$exec$ = _$exec[2],
          value = _$exec$ === void 0 ? '' : _$exec$;

      if (typeof query[key] === 'string') query[key] = [query[key]];
      if (typeof query[key] === 'object') query[key].push(value);else query[key] = value;
    });
  }

  return query;
}

function select_target(url) {
  var _context3, _context4;

  if (url.origin !== location.origin) return null;
  if (!startsWith$2(_context3 = url.pathname).call(_context3, initial_data.baseUrl)) return null;

  var path = slice$3(_context4 = url.pathname).call(_context4, initial_data.baseUrl.length);

  if (path === '') {
    path = '/';
  } // avoid accidental clashes between server routes and page routes


  if (some$2(ignore).call(ignore, function (pattern) {
    return pattern.test(path);
  })) return;

  for (var i = 0; i < routes.length; i += 1) {
    var route = routes[i];
    var match = route.pattern.exec(path);

    if (match) {
      var query = extract_query(url.search);
      var part = route.parts[route.parts.length - 1];
      var params = part.params ? part.params(match) : {};
      var page = {
        host: location.host,
        path: path,
        query: query,
        params: params
      };
      return {
        href: url.href,
        route: route,
        match: match,
        page: page
      };
    }
  }
}

function handle_error(url) {
  var _location = location,
      host = _location.host,
      pathname = _location.pathname,
      search = _location.search;
  var session = initial_data.session,
      preloaded = initial_data.preloaded,
      status = initial_data.status,
      error = initial_data.error;

  if (!root_preloaded) {
    root_preloaded = preloaded && preloaded[0];
  }

  var props = {
    error: error,
    status: status,
    session: session,
    level0: {
      props: root_preloaded
    },
    level1: {
      props: {
        status: status,
        error: error
      },
      component: Error$1
    },
    segments: preloaded
  };
  var query = extract_query(search);
  render(null, [], props, {
    host: host,
    path: pathname,
    query: query,
    params: {}
  });
}

function scroll_state() {
  return {
    x: pageXOffset,
    y: pageYOffset
  };
}

function navigate(_x2, _x3, _x4, _x5) {
  return _navigate.apply(this, arguments);
}

function _navigate() {
  _navigate = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2(target, id, noscroll, hash) {
    var current_scroll, loaded, token, _ref3, redirect, props, branch, scroll, deep_linked;

    return regenerator.wrap(function _callee2$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (id) {
              // popstate or initial navigation
              cid = id;
            } else {
              current_scroll = scroll_state(); // clicked on a link. preserve scroll state

              scroll_history[cid] = current_scroll;
              id = cid = ++uid$1;
              scroll_history[cid] = noscroll ? current_scroll : {
                x: 0,
                y: 0
              };
            }

            cid = id;
            if (root_component) stores.preloading.set(true);
            loaded = prefetching && prefetching.href === target.href ? prefetching.promise : hydrate_target(target);
            prefetching = null;
            token = current_token = {};
            _context9.next = 8;
            return loaded;

          case 8:
            _ref3 = _context9.sent;
            redirect = _ref3.redirect;
            props = _ref3.props;
            branch = _ref3.branch;

            if (!(token !== current_token)) {
              _context9.next = 14;
              break;
            }

            return _context9.abrupt("return");

          case 14:
            _context9.next = 16;
            return render(redirect, branch, props, target.page);

          case 16:
            if (document.activeElement) document.activeElement.blur();

            if (!noscroll) {
              scroll = scroll_history[id];

              if (hash) {
                // scroll is an element id (from a hash), we need to compute y.
                deep_linked = document.getElementById(slice$3(hash).call(hash, 1));

                if (deep_linked) {
                  scroll = {
                    x: 0,
                    y: deep_linked.getBoundingClientRect().top
                  };
                }
              }

              scroll_history[cid] = scroll;
              if (scroll) scrollTo(scroll.x, scroll.y);
            }

          case 18:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee2);
  }));
  return _navigate.apply(this, arguments);
}

function render(_x6, _x7, _x8, _x9) {
  return _render.apply(this, arguments);
}

function _render() {
  _render = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee3(redirect, branch, props, page) {
    var _start, end;

    return regenerator.wrap(function _callee3$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (!redirect) {
              _context10.next = 2;
              break;
            }

            return _context10.abrupt("return", goto(redirect.location, {
              replaceState: true
            }));

          case 2:
            stores.page.set(page);
            stores.preloading.set(false);

            if (!root_component) {
              _context10.next = 8;
              break;
            }

            root_component.$set(props);
            _context10.next = 17;
            break;

          case 8:
            props.stores = {
              page: {
                subscribe: stores.page.subscribe
              },
              preloading: {
                subscribe: stores.preloading.subscribe
              },
              session: stores.session
            };
            _context10.next = 11;
            return root_preloaded;

          case 11:
            _context10.t0 = _context10.sent;
            props.level0 = {
              props: _context10.t0
            };
            // first load — remove SSR'd <head> contents
            _start = document.querySelector('#sapper-head-start');
            end = document.querySelector('#sapper-head-end');

            if (_start && end) {
              while (_start.nextSibling !== end) {
                detach$1(_start.nextSibling);
              }

              detach$1(_start);
              detach$1(end);
            }

            root_component = new App({
              target: target,
              props: props,
              hydrate: true
            });

          case 17:
            current_branch = branch;
            current_query = stringify$2(page.query);
            ready = true;
            session_dirty = false;

          case 21:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee3);
  }));
  return _render.apply(this, arguments);
}

function part_changed(i, segment, match, stringified_query) {
  // TODO only check query string changes for preload functions
  // that do in fact depend on it (using static analysis or
  // runtime instrumentation)
  if (stringified_query !== current_query) return true;
  var previous = current_branch[i];
  if (!previous) return false;
  if (segment !== previous.segment) return true;

  if (previous.match) {
    var _context5;

    if (stringify$2(slice$3(_context5 = previous.match).call(_context5, 1, i + 2)) !== stringify$2(slice$3(match).call(match, 1, i + 2))) {
      return true;
    }
  }
}

function hydrate_target(_x10) {
  return _hydrate_target.apply(this, arguments);
}

function _hydrate_target() {
  _hydrate_target = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee5(target) {
    var _context11;

    var route, page, segments, _redirect, props, preload_context, branch, l, _context12, stringified_query, match, segment_dirty;

    return regenerator.wrap(function _callee5$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            route = target.route, page = target.page;
            segments = filter$2(_context11 = page.path.split('/')).call(_context11, Boolean);
            _redirect = null;
            props = {
              error: null,
              status: 200,
              segments: [segments[0]]
            };
            preload_context = {
              fetch: function (_fetch) {
                function fetch(_x11, _x12) {
                  return _fetch.apply(this, arguments);
                }

                fetch.toString = function () {
                  return _fetch.toString();
                };

                return fetch;
              }(function (url, opts) {
                return fetch(url, opts);
              }),
              redirect: function redirect(statusCode, location) {
                if (_redirect && (_redirect.statusCode !== statusCode || _redirect.location !== location)) {
                  throw new Error("Conflicting redirects");
                }

                _redirect = {
                  statusCode: statusCode,
                  location: location
                };
              },
              error: function error(status, _error) {
                props.error = typeof _error === 'string' ? new Error(_error) : _error;
                props.status = status;
              }
            };

            if (!root_preloaded) {
              root_preloaded = initial_data.preloaded[0] || preload.call(preload_context, {
                host: page.host,
                path: page.path,
                query: page.query,
                params: {}
              }, $session);
            }

            l = 1;
            _context14.prev = 7;
            stringified_query = stringify$2(page.query);
            match = route.pattern.exec(page.path);
            segment_dirty = false;
            _context14.next = 13;
            return promise$3.all(map$2(_context12 = route.parts).call(_context12,
            /*#__PURE__*/
            function () {
              var _ref4 = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee4(part, i) {
                var segment, j, _ref5, component, preload, preloaded;

                return regenerator.wrap(function _callee4$(_context13) {
                  while (1) {
                    switch (_context13.prev = _context13.next) {
                      case 0:
                        segment = segments[i];
                        if (part_changed(i, segment, match, stringified_query)) segment_dirty = true;
                        props.segments[l] = segments[i + 1]; // TODO make this less confusing

                        if (part) {
                          _context13.next = 5;
                          break;
                        }

                        return _context13.abrupt("return", {
                          segment: segment
                        });

                      case 5:
                        j = l++;

                        if (!(!session_dirty && !segment_dirty && current_branch[i] && current_branch[i].part === part.i)) {
                          _context13.next = 8;
                          break;
                        }

                        return _context13.abrupt("return", current_branch[i]);

                      case 8:
                        segment_dirty = false;
                        _context13.next = 11;
                        return load_component(components[part.i]);

                      case 11:
                        _ref5 = _context13.sent;
                        component = _ref5.default;
                        preload = _ref5.preload;

                        if (!(ready || !initial_data.preloaded[i + 1])) {
                          _context13.next = 25;
                          break;
                        }

                        if (!preload) {
                          _context13.next = 21;
                          break;
                        }

                        _context13.next = 18;
                        return preload.call(preload_context, {
                          host: page.host,
                          path: page.path,
                          query: page.query,
                          params: part.params ? part.params(target.match) : {}
                        }, $session);

                      case 18:
                        _context13.t0 = _context13.sent;
                        _context13.next = 22;
                        break;

                      case 21:
                        _context13.t0 = {};

                      case 22:
                        preloaded = _context13.t0;
                        _context13.next = 26;
                        break;

                      case 25:
                        preloaded = initial_data.preloaded[i + 1];

                      case 26:
                        return _context13.abrupt("return", props["level" + j] = {
                          component: component,
                          props: preloaded,
                          segment: segment,
                          match: match,
                          part: part.i
                        });

                      case 27:
                      case "end":
                        return _context13.stop();
                    }
                  }
                }, _callee4);
              }));

              return function (_x13, _x14) {
                return _ref4.apply(this, arguments);
              };
            }()));

          case 13:
            branch = _context14.sent;
            _context14.next = 21;
            break;

          case 16:
            _context14.prev = 16;
            _context14.t0 = _context14["catch"](7);
            props.error = _context14.t0;
            props.status = 500;
            branch = [];

          case 21:
            return _context14.abrupt("return", {
              redirect: _redirect,
              props: props,
              branch: branch
            });

          case 22:
          case "end":
            return _context14.stop();
        }
      }
    }, _callee5, null, [[7, 16]]);
  }));
  return _hydrate_target.apply(this, arguments);
}

function load_css(chunk) {
  var href = "client/" + chunk;
  if (document.querySelector("link[href=\"" + href + "\"]")) return;
  return new promise$3(function (fulfil, reject) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;

    link.onload = function () {
      return fulfil();
    };

    link.onerror = reject;
    document.head.appendChild(link);
  });
}

function load_component(component) {
  var _context6;

  // TODO this is temporary — once placeholders are
  // always rewritten, scratch the ternary
  var promises = typeof component.css === 'string' ? [] : map$2(_context6 = component.css).call(_context6, load_css);
  promises.unshift(component.js());
  return promise$3.all(promises).then(function (values) {
    return values[0];
  });
}

function detach$1(node) {
  node.parentNode.removeChild(node);
}

function prefetch(href) {
  var target = select_target(new url$2(href, document.baseURI));

  if (target) {
    if (!prefetching || href !== prefetching.href) {
      set_prefetching(href, hydrate_target(target));
    }

    return prefetching.promise;
  }
}

function start(opts) {
  if ('scrollRestoration' in _history) {
    _history.scrollRestoration = 'manual';
  }

  set_target(opts.target);
  addEventListener('click', handle_click);
  addEventListener('popstate', handle_popstate); // prefetch

  addEventListener('touchstart', trigger_prefetch);
  addEventListener('mousemove', handle_mousemove);
  return promise$3.resolve().then(function () {
    var _location2 = location,
        hash = _location2.hash,
        href = _location2.href;

    _history.replaceState({
      id: uid$1
    }, '', href);

    var url = new url$2(location.href);
    if (initial_data.error) return handle_error();
    var target = select_target(url);
    if (target) return navigate(target, uid$1, true, hash);
  });
}

var mousemove_timeout;

function handle_mousemove(event) {
  clearTimeout(mousemove_timeout);
  mousemove_timeout = setTimeout$2(function () {
    trigger_prefetch(event);
  }, 20);
}

function trigger_prefetch(event) {
  var a = find_anchor(event.target);
  if (!a || a.rel !== 'prefetch') return;
  prefetch(a.href);
}

function handle_click(event) {
  // Adapted from https://github.com/visionmedia/page.js
  // MIT license https://github.com/visionmedia/page.js#license
  if (which(event) !== 1) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey) return;
  if (event.defaultPrevented) return;
  var a = find_anchor(event.target);
  if (!a) return;
  if (!a.href) return; // check if link is inside an svg
  // in this case, both href and target are always inside an object

  var svg = typeof a.href === 'object' && a.href.constructor.name === 'SVGAnimatedString';
  var href = String(svg ? a.href.baseVal : a.href);

  if (href === location.href) {
    if (!location.hash) event.preventDefault();
    return;
  } // Ignore if tag has
  // 1. 'download' attribute
  // 2. rel='external' attribute


  if (a.hasAttribute('download') || a.getAttribute('rel') === 'external') return; // Ignore if <a> has a target

  if (svg ? a.target.baseVal : a.target) return;
  var url = new url$2(href); // Don't handle hash changes

  if (url.pathname === location.pathname && url.search === location.search) return;
  var target = select_target(url);

  if (target) {
    var noscroll = a.hasAttribute('sapper-noscroll');
    navigate(target, null, noscroll, url.hash);
    event.preventDefault();

    _history.pushState({
      id: cid
    }, '', url.href);
  }
}

function which(event) {
  return event.which === null ? event.button : event.which;
}

function find_anchor(node) {
  while (node && node.nodeName.toUpperCase() !== 'A') {
    node = node.parentNode;
  } // SVG <a> elements have a lowercase name


  return node;
}

function handle_popstate(event) {
  scroll_history[cid] = scroll_state();

  if (event.state) {
    var url = new url$2(location.href);

    var _target = select_target(url);

    if (_target) {
      navigate(_target, event.state.id);
    } else {
      location.href = location.href;
    }
  } else {
    // hashchange
    set_uid(uid$1 + 1);
    set_cid(uid$1);

    _history.replaceState({
      id: cid
    }, '', location.href);
  }
}

var stores$1 = function stores$1() {
  return getContext(CONTEXT_KEY);
};

var assign$4 = assign;

var assign$5 = assign$4;

function _extends() {
  _extends = assign$5 || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var LogLevel;

(function (LogLevel) {
  LogLevel[LogLevel["Trace"] = 1] = "Trace";
  LogLevel[LogLevel["Debug"] = 2] = "Debug";
  LogLevel[LogLevel["Info"] = 4] = "Info";
  LogLevel[LogLevel["UserAction"] = 8] = "UserAction";
  LogLevel[LogLevel["Action"] = 16] = "Action";
  LogLevel[LogLevel["UserWarning"] = 32] = "UserWarning";
  LogLevel[LogLevel["UserError"] = 64] = "UserError";
  LogLevel[LogLevel["Warning"] = 128] = "Warning";
  LogLevel[LogLevel["Error"] = 256] = "Error";
  LogLevel[LogLevel["Fatal"] = 512] = "Fatal";
  LogLevel[LogLevel["None"] = 0] = "None";
  LogLevel[LogLevel["Any"] = 1023] = "Any";
})(LogLevel || (LogLevel = {}));

var ActionMode;

(function (ActionMode) {
  ActionMode[ActionMode["Default"] = 0] = "Default";
  ActionMode[ActionMode["Always"] = 1] = "Always";
  ActionMode[ActionMode["Never"] = 2] = "Never";
})(ActionMode || (ActionMode = {}));

var trim$3 = stringTrim.trim;


var $parseInt = global_1.parseInt;
var hex = /^[+-]?0[Xx]/;
var FORCED$5 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
var numberParseInt = FORCED$5 ? function parseInt(string, radix) {
  var S = trim$3(String(string));
  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
} : $parseInt;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
_export({ global: true, forced: parseInt != numberParseInt }, {
  parseInt: numberParseInt
});

var _parseInt = path.parseInt;

var _parseInt$1 = _parseInt;

var _parseInt$2 = _parseInt$1;

var sparkMd5 = createCommonjsModule(function (module, exports) {
  (function (factory) {
    {
      // Node/CommonJS
      module.exports = factory();
    }
  })(function (undefined$1) {
    /*
     * Fastest md5 implementation around (JKM md5).
     * Credits: Joseph Myers
     *
     * @see http://www.myersdaily.org/joseph/javascript/md5-text.html
     * @see http://jsperf.com/md5-shootout/7
     */

    /* this function is much faster,
      so if possible we use it. Some IEs
      are the only ones I know of that
      need the idiotic second function,
      generated by an if clause.  */

    var hex_chr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

    function md5cycle(x, k) {
      var a = x[0],
          b = x[1],
          c = x[2],
          d = x[3];
      a += (b & c | ~b & d) + k[0] - 680876936 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[1] - 389564586 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[2] + 606105819 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[4] - 176418897 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[7] - 45705983 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[10] - 42063 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
      a = (a << 7 | a >>> 25) + b | 0;
      d += (a & b | ~a & c) + k[13] - 40341101 | 0;
      d = (d << 12 | d >>> 20) + a | 0;
      c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
      c = (c << 17 | c >>> 15) + d | 0;
      b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
      b = (b << 22 | b >>> 10) + c | 0;
      a += (b & d | c & ~d) + k[1] - 165796510 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[11] + 643717713 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[0] - 373897302 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[5] - 701558691 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[10] + 38016083 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[15] - 660478335 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[4] - 405537848 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[9] + 568446438 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[3] - 187363961 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
      a = (a << 5 | a >>> 27) + b | 0;
      d += (a & c | b & ~c) + k[2] - 51403784 | 0;
      d = (d << 9 | d >>> 23) + a | 0;
      c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
      c = (c << 14 | c >>> 18) + d | 0;
      b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
      b = (b << 20 | b >>> 12) + c | 0;
      a += (b ^ c ^ d) + k[5] - 378558 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[14] - 35309556 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[7] - 155497632 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[13] + 681279174 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[0] - 358537222 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[3] - 722521979 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[6] + 76029189 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (b ^ c ^ d) + k[9] - 640364487 | 0;
      a = (a << 4 | a >>> 28) + b | 0;
      d += (a ^ b ^ c) + k[12] - 421815835 | 0;
      d = (d << 11 | d >>> 21) + a | 0;
      c += (d ^ a ^ b) + k[15] + 530742520 | 0;
      c = (c << 16 | c >>> 16) + d | 0;
      b += (c ^ d ^ a) + k[2] - 995338651 | 0;
      b = (b << 23 | b >>> 9) + c | 0;
      a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
      a = (a << 6 | a >>> 26) + b | 0;
      d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
      d = (d << 10 | d >>> 22) + a | 0;
      c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
      c = (c << 15 | c >>> 17) + d | 0;
      b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
      b = (b << 21 | b >>> 11) + c | 0;
      x[0] = a + x[0] | 0;
      x[1] = b + x[1] | 0;
      x[2] = c + x[2] | 0;
      x[3] = d + x[3] | 0;
    }

    function md5blk(s) {
      var md5blks = [],
          i;
      /* Andy King said do it this way. */

      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24);
      }

      return md5blks;
    }

    function md5blk_array(a) {
      var md5blks = [],
          i;
      /* Andy King said do it this way. */

      for (i = 0; i < 64; i += 4) {
        md5blks[i >> 2] = a[i] + (a[i + 1] << 8) + (a[i + 2] << 16) + (a[i + 3] << 24);
      }

      return md5blks;
    }

    function md51(s) {
      var n = s.length,
          state = [1732584193, -271733879, -1732584194, 271733878],
          i,
          length,
          tail,
          tmp,
          lo,
          hi;

      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }

      s = s.substring(i - 64);
      length = s.length;
      tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= s.charCodeAt(i) << (i % 4 << 3);
      }

      tail[i >> 2] |= 0x80 << (i % 4 << 3);

      if (i > 55) {
        md5cycle(state, tail);

        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      } // Beware that the final length might not fit in 32 bits so we take care of that


      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = _parseInt$2(tmp[2], 16);
      hi = _parseInt$2(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    }

    function md51_array(a) {
      var n = a.length,
          state = [1732584193, -271733879, -1732584194, 271733878],
          i,
          length,
          tail,
          tmp,
          lo,
          hi;

      for (i = 64; i <= n; i += 64) {
        md5cycle(state, md5blk_array(a.subarray(i - 64, i)));
      } // Not sure if it is a bug, however IE10 will always produce a sub array of length 1
      // containing the last element of the parent array if the sub array specified starts
      // beyond the length of the parent array - weird.
      // https://connect.microsoft.com/IE/feedback/details/771452/typed-array-subarray-issue


      a = i - 64 < n ? a.subarray(i - 64) : new Uint8Array(0);
      length = a.length;
      tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= a[i] << (i % 4 << 3);
      }

      tail[i >> 2] |= 0x80 << (i % 4 << 3);

      if (i > 55) {
        md5cycle(state, tail);

        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      } // Beware that the final length might not fit in 32 bits so we take care of that


      tmp = n * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = _parseInt$2(tmp[2], 16);
      hi = _parseInt$2(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(state, tail);
      return state;
    }

    function rhex(n) {
      var s = '',
          j;

      for (j = 0; j < 4; j += 1) {
        s += hex_chr[n >> j * 8 + 4 & 0x0F] + hex_chr[n >> j * 8 & 0x0F];
      }

      return s;
    }

    function hex(x) {
      var i;

      for (i = 0; i < x.length; i += 1) {
        x[i] = rhex(x[i]);
      }

      return x.join('');
    } // In some cases the fast add32 function cannot be used..


    if (hex(md51('hello')) !== '5d41402abc4b2a76b9719d911017c592') ; // ---------------------------------------------------

    /**
     * ArrayBuffer slice polyfill.
     *
     * @see https://github.com/ttaubert/node-arraybuffer-slice
     */


    if (typeof ArrayBuffer !== 'undefined' && !slice$3(ArrayBuffer.prototype)) {
      (function () {
        function clamp(val, length) {
          val = val | 0 || 0;

          if (val < 0) {
            return Math.max(val + length, 0);
          }

          return Math.min(val, length);
        }

        ArrayBuffer.prototype.slice = function (from, to) {
          var length = this.byteLength,
              begin = clamp(from, length),
              end = length,
              num,
              target,
              targetArray,
              sourceArray;

          if (to !== undefined$1) {
            end = clamp(to, length);
          }

          if (begin > end) {
            return new ArrayBuffer(0);
          }

          num = end - begin;
          target = new ArrayBuffer(num);
          targetArray = new Uint8Array(target);
          sourceArray = new Uint8Array(this, begin, num);
          targetArray.set(sourceArray);
          return target;
        };
      })();
    } // ---------------------------------------------------

    /**
     * Helpers.
     */


    function toUtf8(str) {
      if (/[\u0080-\uFFFF]/.test(str)) {
        str = unescape(encodeURIComponent(str));
      }

      return str;
    }

    function utf8Str2ArrayBuffer(str, returnUInt8Array) {
      var length = str.length,
          buff = new ArrayBuffer(length),
          arr = new Uint8Array(buff),
          i;

      for (i = 0; i < length; i += 1) {
        arr[i] = str.charCodeAt(i);
      }

      return returnUInt8Array ? arr : buff;
    }

    function arrayBuffer2Utf8Str(buff) {
      return String.fromCharCode.apply(null, new Uint8Array(buff));
    }

    function concatenateArrayBuffers(first, second, returnUInt8Array) {
      var result = new Uint8Array(first.byteLength + second.byteLength);
      result.set(new Uint8Array(first));
      result.set(new Uint8Array(second), first.byteLength);
      return returnUInt8Array ? result : result.buffer;
    }

    function hexToBinaryString(hex) {
      var bytes = [],
          length = hex.length,
          x;

      for (x = 0; x < length - 1; x += 2) {
        bytes.push(_parseInt$2(hex.substr(x, 2), 16));
      }

      return String.fromCharCode.apply(String, bytes);
    } // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation.
     *
     * Use this class to perform an incremental md5, otherwise use the
     * static methods instead.
     */


    function SparkMD5() {
      // call reset to init the instance
      this.reset();
    }
    /**
     * Appends a string.
     * A conversion will be applied if an utf8 string is detected.
     *
     * @param {String} str The string to be appended
     *
     * @return {SparkMD5} The instance itself
     */


    SparkMD5.prototype.append = function (str) {
      // Converts the string to utf8 bytes if necessary
      // Then append as binary
      this.appendBinary(toUtf8(str));
      return this;
    };
    /**
     * Appends a binary string.
     *
     * @param {String} contents The binary string to be appended
     *
     * @return {SparkMD5} The instance itself
     */


    SparkMD5.prototype.appendBinary = function (contents) {
      this._buff += contents;
      this._length += contents.length;
      var length = this._buff.length,
          i;

      for (i = 64; i <= length; i += 64) {
        md5cycle(this._hash, md5blk(this._buff.substring(i - 64, i)));
      }

      this._buff = this._buff.substring(i - 64);
      return this;
    };
    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */


    SparkMD5.prototype.end = function (raw) {
      var buff = this._buff,
          length = buff.length,
          i,
          tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          ret;

      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= buff.charCodeAt(i) << (i % 4 << 3);
      }

      this._finish(tail, length);

      ret = hex(this._hash);

      if (raw) {
        ret = hexToBinaryString(ret);
      }

      this.reset();
      return ret;
    };
    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5} The instance itself
     */


    SparkMD5.prototype.reset = function () {
      this._buff = '';
      this._length = 0;
      this._hash = [1732584193, -271733879, -1732584194, 271733878];
      return this;
    };
    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */


    SparkMD5.prototype.getState = function () {
      return {
        buff: this._buff,
        length: this._length,
        hash: this._hash
      };
    };
    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5} The instance itself
     */


    SparkMD5.prototype.setState = function (state) {
      this._buff = state.buff;
      this._length = state.length;
      this._hash = state.hash;
      return this;
    };
    /**
     * Releases memory used by the incremental buffer and other additional
     * resources. If you plan to use the instance again, use reset instead.
     */


    SparkMD5.prototype.destroy = function () {
      delete this._hash;
      delete this._buff;
      delete this._length;
    };
    /**
     * Finish the final calculation based on the tail.
     *
     * @param {Array}  tail   The tail (will be modified)
     * @param {Number} length The length of the remaining buffer
     */


    SparkMD5.prototype._finish = function (tail, length) {
      var i = length,
          tmp,
          lo,
          hi;
      tail[i >> 2] |= 0x80 << (i % 4 << 3);

      if (i > 55) {
        md5cycle(this._hash, tail);

        for (i = 0; i < 16; i += 1) {
          tail[i] = 0;
        }
      } // Do the final computation based on the tail and length
      // Beware that the final length may not fit in 32 bits so we take care of that


      tmp = this._length * 8;
      tmp = tmp.toString(16).match(/(.*?)(.{0,8})$/);
      lo = _parseInt$2(tmp[2], 16);
      hi = _parseInt$2(tmp[1], 16) || 0;
      tail[14] = lo;
      tail[15] = hi;
      md5cycle(this._hash, tail);
    };
    /**
     * Performs the md5 hash on a string.
     * A conversion will be applied if utf8 string is detected.
     *
     * @param {String}  str The string
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */


    SparkMD5.hash = function (str, raw) {
      // Converts the string to utf8 bytes if necessary
      // Then compute it using the binary function
      return SparkMD5.hashBinary(toUtf8(str), raw);
    };
    /**
     * Performs the md5 hash on a binary string.
     *
     * @param {String}  content The binary string
     * @param {Boolean} raw     True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */


    SparkMD5.hashBinary = function (content, raw) {
      var hash = md51(content),
          ret = hex(hash);
      return raw ? hexToBinaryString(ret) : ret;
    }; // ---------------------------------------------------

    /**
     * SparkMD5 OOP implementation for array buffers.
     *
     * Use this class to perform an incremental md5 ONLY for array buffers.
     */


    SparkMD5.ArrayBuffer = function () {
      // call reset to init the instance
      this.reset();
    };
    /**
     * Appends an array buffer.
     *
     * @param {ArrayBuffer} arr The array to be appended
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */


    SparkMD5.ArrayBuffer.prototype.append = function (arr) {
      var _context;

      var buff = concatenateArrayBuffers(this._buff.buffer, arr, true),
          length = buff.length,
          i;
      this._length += arr.byteLength;

      for (i = 64; i <= length; i += 64) {
        md5cycle(this._hash, md5blk_array(buff.subarray(i - 64, i)));
      }

      this._buff = i - 64 < length ? new Uint8Array(slice$3(_context = buff.buffer).call(_context, i - 64)) : new Uint8Array(0);
      return this;
    };
    /**
     * Finishes the incremental computation, reseting the internal state and
     * returning the result.
     *
     * @param {Boolean} raw True to get the raw string, false to get the hex string
     *
     * @return {String} The result
     */


    SparkMD5.ArrayBuffer.prototype.end = function (raw) {
      var buff = this._buff,
          length = buff.length,
          tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          i,
          ret;

      for (i = 0; i < length; i += 1) {
        tail[i >> 2] |= buff[i] << (i % 4 << 3);
      }

      this._finish(tail, length);

      ret = hex(this._hash);

      if (raw) {
        ret = hexToBinaryString(ret);
      }

      this.reset();
      return ret;
    };
    /**
     * Resets the internal state of the computation.
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */


    SparkMD5.ArrayBuffer.prototype.reset = function () {
      this._buff = new Uint8Array(0);
      this._length = 0;
      this._hash = [1732584193, -271733879, -1732584194, 271733878];
      return this;
    };
    /**
     * Gets the internal state of the computation.
     *
     * @return {Object} The state
     */


    SparkMD5.ArrayBuffer.prototype.getState = function () {
      var state = SparkMD5.prototype.getState.call(this); // Convert buffer to a string

      state.buff = arrayBuffer2Utf8Str(state.buff);
      return state;
    };
    /**
     * Gets the internal state of the computation.
     *
     * @param {Object} state The state
     *
     * @return {SparkMD5.ArrayBuffer} The instance itself
     */


    SparkMD5.ArrayBuffer.prototype.setState = function (state) {
      // Convert string to buffer
      state.buff = utf8Str2ArrayBuffer(state.buff, true);
      return SparkMD5.prototype.setState.call(this, state);
    };

    SparkMD5.ArrayBuffer.prototype.destroy = SparkMD5.prototype.destroy;
    SparkMD5.ArrayBuffer.prototype._finish = SparkMD5.prototype._finish;
    /**
     * Performs the md5 hash on an array buffer.
     *
     * @param {ArrayBuffer} arr The array buffer
     * @param {Boolean}     raw True to get the raw string, false to get the hex one
     *
     * @return {String} The result
     */

    SparkMD5.ArrayBuffer.hash = function (arr, raw) {
      var hash = md51_array(new Uint8Array(arr)),
          ret = hex(hash);
      return raw ? hexToBinaryString(ret) : ret;
    };

    return SparkMD5;
  });
});

/**
 * Copyright (C) 2017-present by Andrea Giammarchi - @WebReflection
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var replace$1 = ''.replace;
var ca = /[&<>'"]/g;
var es = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
var esca = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  "'": '&#39;',
  '"': '&quot;'
};
var unes = {
  '&amp;': '&',
  '&#38;': '&',
  '&lt;': '<',
  '&#60;': '<',
  '&gt;': '>',
  '&#62;': '>',
  '&apos;': "'",
  '&#39;': "'",
  '&quot;': '"',
  '&#34;': '"'
};
function escape(es) {
  return replace$1.call(es, ca, pe);
}
function unescape$1(un) {
  return replace$1.call(un, es, cape);
}

function pe(m) {
  return esca[m];
}

function cape(m) {
  return unes[m];
}

var esm = /*#__PURE__*/Object.freeze({
	__proto__: null,
	escape: escape,
	unescape: unescape$1
});

/* tslint:disable:no-var-requires */
// @ts-ignore
// @ts-ignore
// don't mix require and import/export; see: https://github.com/rollup/rollup/issues/1058#issuecomment-254187433

var helpersCjs = {
  SparkMD5: sparkMd5,
  html: esm
};
var helpersCjs_1 = helpersCjs.SparkMD5;
var helpersCjs_2 = helpersCjs.html;

function md5(str) {
  var spark = new helpersCjs_1();
  spark.append(str);
  return spark.end();
}
function escapeHtml(str) {
  return helpersCjs_2.escape(str);
}
function delay(timeMilliseconds) {
  return new promise$3(function (resolve) {
    return setTimeout$2(resolve, timeMilliseconds);
  });
}

var _spacesRegex = new RegExp('\\s+');

var _spacesWithoutNewLinesRegex = new RegExp('[^\\S\\n]+');

var _fixNewLines = new RegExp('([^\\S\\n]*\\n[^\\S\\n]*)');

function removeExcessSpaces(text, keepLines) {
  if (!text) {
    return text;
  }

  if (keepLines) {
    var _context;

    text = trim$2(_context = text.replace(_spacesWithoutNewLinesRegex, ' ')).call(_context);
    text = text.replace(_fixNewLines, '\\r\\n');
    text = text.replace(new RegExp('((\\r\\n){' + keepLines + '})[\\r\\n]*'), '$1');
  } else {
    var _context2;

    text = trim$2(_context2 = text.replace(_spacesRegex, ' ')).call(_context2);
  }

  return text;
}
function getGlobalScope() {
  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return null;
}
var globalScope = getGlobalScope();

function canDoAction(actionMode, allowedLevels, level) {
  return actionMode === ActionMode.Always || actionMode !== ActionMode.Never && (allowedLevels & level) !== 0;
}
var LogHandler =
/*#__PURE__*/
function () {
  function LogHandler(_ref) {
    var name = _ref.name,
        logger = _ref.logger,
        allowLogLevels = _ref.allowLogLevels,
        maxQueueSize = _ref.maxQueueSize,
        throttleMaxQueueSize = _ref.throttleMaxQueueSize,
        throttleTime = _ref.throttleTime;

    _classCallCheck(this, LogHandler);

    this._queue = [];
    this.name = name;
    this._logger = logger;
    this.allowLogLevels = allowLogLevels || LogLevel.Any;
    this._maxQueueSize = maxQueueSize || 10;
    this._throttleMaxQueueSize = throttleMaxQueueSize || 5;
    this._throttleTime = throttleTime || 0;
  }

  _createClass(LogHandler, [{
    key: "init",
    value: function init() {}
  }, {
    key: "canLog",
    value: function canLog(logEvent) {
      return canDoAction(logEvent.handlersModes ? logEvent.handlersModes[this.name] || ActionMode.Default : ActionMode.Default, this.allowLogLevels, logEvent.level);
    }
  }, {
    key: "onError",
    value: function onError(logEvents, error) {
      var _this = this;

      handleLogErrorHandler(logEvents, error, this._logger, function (newLogEvent) {
        if (!newLogEvent.handlersModes) {
          newLogEvent.handlersModes = {};
        }

        newLogEvent.handlersModes[_this.name] = ActionMode.Never;
      });
    }
  }, {
    key: "enqueueLog",
    value: function enqueueLog(logEvent) {
      var canLog = this.canLog(logEvent);

      while (this._queue.length > this._maxQueueSize && !this.canLog(this._queue[0])) {
        this._queue.shift();
      }

      this._queue.push(logEvent);

      if (!canLog || this._inProcess) {
        return;
      } // noinspection JSIgnoredPromiseFromCall


      this.handleLogs();
    }
  }, {
    key: "handleLogs",
    value: function () {
      var _handleLogs = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee() {
        var _this2 = this;

        var _context, _context2, logEvents;

        return regenerator.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._inProcess) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.prev = 2;

              case 3:
                if (!(this._throttleTime && this._queue.length < this._throttleMaxQueueSize)) {
                  _context3.next = 6;
                  break;
                }

                _context3.next = 6;
                return delay(this._throttleTime);

              case 6:
                if (this._queue.length) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("break", 18);

              case 8:
                logEvents = splice$2(_context2 = this._queue).call(_context2, 0);
                _context3.prev = 9;
                _context3.next = 12;
                return this.handleLog(logEvents);

              case 12:
                _context3.next = 17;
                break;

              case 14:
                _context3.prev = 14;
                _context3.t0 = _context3["catch"](9);
                this.onError(logEvents, _context3.t0);

              case 17:
                if (some$2(_context = this._queue).call(_context, function (o) {
                  return _this2.canLog(o);
                })) {
                  _context3.next = 3;
                  break;
                }

              case 18:
                _context3.prev = 18;
                this._inProcess = false;
                return _context3.finish(18);

              case 21:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this, [[2,, 18, 21], [9, 14]]);
      }));

      function handleLogs() {
        return _handleLogs.apply(this, arguments);
      }

      return handleLogs;
    }()
  }]);

  return LogHandler;
}();
function handleLogErrorHandler(logEvents, error, logger, changeNewLogEvent) {
  var _changeNewLogEvent = function _changeNewLogEvent(newLogEvent) {
    changeNewLogEvent(newLogEvent);
    return newLogEvent;
  }; // for (let i = 0, len = logEvents.length; i < len; i++) {
  // 	const logEvent = logEvents[i]
  // 	logger.log(_changeNewLogEvent({
  // 		level: logEvent.level,
  // 		message: logEvent.message,
  // 		error: logEvent.error,
  // 		stack: logEvent.stack,
  // 		time: logEvent.time,
  // 		writeConsoleMode: logEvent.writeConsoleMode,
  // 		sendLogMode: logEvent.sendLogMode,
  // 		writeFileMode: logEvent.writeFileMode,
  // 	}))
  // }


  var lastLogEvent = logEvents[logEvents.length - 1];
  logger.log(_changeNewLogEvent({
    level: LogLevel.Error,
    messagesOrErrors: ['Logger self error', error],
    handlersModes: lastLogEvent.handlersModes
  }));
}

var EmitEventHandler =
/*#__PURE__*/
function (_LogHandler) {
  _inherits(EmitEventHandler, _LogHandler);

  function EmitEventHandler(logger, allowLogLevels) {
    _classCallCheck(this, EmitEventHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(EmitEventHandler).call(this, {
      name: 'emitEvent',
      logger: logger,
      allowLogLevels: allowLogLevels
    }));
  }

  _createClass(EmitEventHandler, [{
    key: "handleLog",
    value: function () {
      var _handleLog = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(logEvents) {
        var i, len;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                i = 0, len = logEvents.length;

              case 1:
                if (!(i < len)) {
                  _context.next = 7;
                  break;
                }

                _context.next = 4;
                return this._logger.onLog(logEvents[i]);

              case 4:
                i++;
                _context.next = 1;
                break;

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function handleLog(_x) {
        return _handleLog.apply(this, arguments);
      }

      return handleLog;
    }()
  }]);

  return EmitEventHandler;
}(LogHandler);

var getIterator_1 = getIterator;

var getIterator$1 = getIterator_1;

var ITERATOR$7 = wellKnownSymbol('iterator');

var isIterable = function (it) {
  var O = Object(it);
  return O[ITERATOR$7] !== undefined
    || '@@iterator' in O
    // eslint-disable-next-line no-prototype-builtins
    || iterators.hasOwnProperty(classof(O));
};

var isIterable_1 = isIterable;

var isIterable$1 = isIterable_1;

// `Number.isNaN` method
// https://tc39.github.io/ecma262/#sec-number.isnan
_export({ target: 'Number', stat: true }, {
  isNaN: function isNaN(number) {
    // eslint-disable-next-line no-self-compare
    return number != number;
  }
});

var isNan = path.Number.isNaN;

var isNan$1 = isNan;

var isNan$2 = isNan$1;

var bind$5 = bind_1;

var bind$6 = bind$5;

var defineProperty$8 = defineProperty_1;

var defineProperty$9 = defineProperty$8;

var getOwnPropertyDescriptor$5 = getOwnPropertyDescriptor_1;

var getOwnPropertyDescriptor$6 = getOwnPropertyDescriptor$5;

var getIteratorMethod_1 = getIteratorMethod;

var getIteratorMethod$1 = getIteratorMethod_1;

function isIterable$2(value) {
  return value != null && typeof getIteratorMethod$1(value) === 'function';
}
function isIterator(value) {
  return value != null && typeof getIteratorMethod$1(value) === 'function' && typeof value.next === 'function';
}
function typeToDebugString(type) {
  return type == null ? type + '' : type && type.name || type.toString();
} // tslint:disable-next-line:no-empty no-shadowed-variable

var EMPTY = function EMPTY() {};
function checkIsFuncOrNull(func) {
  // PROF: 66 - 0.1%
  if (func != null && typeof func !== 'function') {
    throw new Error("Value is not a function or null/undefined: " + func);
  }

  return func;
}
function toSingleCall(func, throwOnMultipleCall) {
  if (func == null) {
    return func;
  }

  func = checkIsFuncOrNull(func);
  var isCalled = false;
  return function () {
    if (isCalled) {
      if (throwOnMultipleCall) {
        throw new Error("Multiple call for single call function: " + func);
      }

      return;
    }

    isCalled = true;
    return func.apply(void 0, arguments);
  };
}

var allowCreateFunction = function () {
  try {
    var func = new Function('a', 'b', 'return a + b');
    return !!func;
  } catch (err) {
    return false;
  }
}();

var createFunctionCache = {}; // tslint:disable-next-line:ban-types

function createFunction(alternativeFuncFactory) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var id = args[args.length - 1] + '';
  var func = createFunctionCache[id];

  if (!func) {
    createFunctionCache[id] = func = allowCreateFunction ? Function.apply(void 0, args) : alternativeFuncFactory();
  }

  return func;
}
function equalsObjects(o1, o2) {
  if (o1 === o2) {
    return true;
  }

  if (o1 && typeof o1 === 'object' && typeof o1.equals === 'function') {
    return o1.equals(o2);
  }

  if (o2 && typeof o2 === 'object' && typeof o2.equals === 'function') {
    return o2.equals(o1);
  }

  return false;
}

function isThenable$1(value) {
  return value != null && typeof value.then === 'function';
}
function isAsync(value) {
  return isThenable$1(value) || isIterator(value);
}
var ResolveResult;

(function (ResolveResult) {
  ResolveResult[ResolveResult["None"] = 0] = "None";
  ResolveResult[ResolveResult["Immediate"] = 1] = "Immediate";
  ResolveResult[ResolveResult["Deferred"] = 2] = "Deferred";
  ResolveResult[ResolveResult["Error"] = 4] = "Error";
  ResolveResult[ResolveResult["ImmediateError"] = 5] = "ImmediateError";
  ResolveResult[ResolveResult["DeferredError"] = 6] = "DeferredError";
})(ResolveResult || (ResolveResult = {}));

function resolveIterator(iterator, isError, onImmediate, onDeferred, customResolveValue) {
  if (!isIterator(iterator)) {
    return ResolveResult.None;
  }

  function iterate(nextValue, isThrow, nextOnImmediate, nextOnDeferred) {
    var body = function body() {
      while (true) {
        var iteratorResult = void 0;

        if (isThrow) {
          isThrow = false;
          iteratorResult = iterator.throw(nextValue);
        } else {
          iteratorResult = iterator.next(nextValue);
        }

        if (iteratorResult.done) {
          nextOnImmediate(iteratorResult.value, isError);
          return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
        }

        var result = _resolveValue(iteratorResult.value, false, function (o, nextIsError) {
          nextValue = o;
          isThrow = nextIsError;
        }, function (o, nextIsError) {
          iterate(o, nextIsError, nextOnDeferred, nextOnDeferred);
        }, customResolveValue);

        if ((result & ResolveResult.Deferred) !== 0) {
          return result;
        }
      }
    };

    try {
      return body();
    } catch (err) {
      nextOnImmediate(err, true);
      return ResolveResult.ImmediateError;
    }
  }

  return iterate(void 0, false, onImmediate, onDeferred);
}
function resolveThenable(thenable, isError, onImmediate, onDeferred) {
  if (!isThenable$1(thenable)) {
    return ResolveResult.None;
  }

  var result = isError ? ResolveResult.DeferredError : ResolveResult.Deferred;
  var deferred;
  (thenable.thenLast || thenable.then).call(thenable, function (value) {
    if (deferred) {
      onDeferred(value, isError);
    } else {
      result = isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
      onImmediate(value, isError);
    }
  }, function (err) {
    if (deferred) {
      onDeferred(err, true);
    } else {
      result = ResolveResult.ImmediateError;
      onImmediate(err, true);
    }
  });
  deferred = true;
  return result;
}

function _resolveValue(value, isError, onImmediate, onDeferred, customResolveValue) {
  var nextOnImmediate = function nextOnImmediate(o, nextIsError) {
    if (nextIsError) {
      isError = true;
    }

    value = o;
  };

  var nextOnDeferred = function nextOnDeferred(val, nextIsError) {
    _resolveValue(val, isError || nextIsError, onDeferred, onDeferred, customResolveValue);
  };

  while (true) {
    {
      var result = resolveThenable(value, isError, nextOnImmediate, nextOnDeferred);

      if ((result & ResolveResult.Deferred) !== 0) {
        return result;
      }

      if ((result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }
    {
      var _result = resolveIterator(value, isError, nextOnImmediate, nextOnDeferred, customResolveValue);

      if ((_result & ResolveResult.Deferred) !== 0) {
        return _result;
      }

      if ((_result & ResolveResult.Immediate) !== 0) {
        continue;
      }
    }

    if (value != null && customResolveValue != null) {
      var newValue = customResolveValue(value);

      if (newValue !== value) {
        value = newValue;
        continue;
      }
    }

    onImmediate(value, isError);
    return isError ? ResolveResult.ImmediateError : ResolveResult.Immediate;
  }
}

function resolveValue(value, onImmediate, onDeferred, customResolveValue) {
  return _resolveValue(value, false, onImmediate, onDeferred, customResolveValue);
}
function resolveValueFunc(func, onImmediate, onDeferred, customResolveValue) {
  try {
    return resolveValue(func(), onImmediate, onDeferred, customResolveValue);
  } catch (err) {
    onImmediate(err, true);
    return ResolveResult.ImmediateError;
  }
}

var ThenableSyncStatus;

(function (ThenableSyncStatus) {
  ThenableSyncStatus["Resolving"] = "Resolving";
  ThenableSyncStatus["Resolved"] = "Resolved";
  ThenableSyncStatus["Rejected"] = "Rejected";
})(ThenableSyncStatus || (ThenableSyncStatus = {}));

function createResolved(value, customResolveValue) {
  var thenable = new ThenableSync(null, customResolveValue);
  thenable.resolve(value);
  return thenable;
}
function createRejected(error, customResolveValue) {
  var thenable = new ThenableSync(null, customResolveValue);
  thenable.reject(error);
  return thenable;
}
var ThenableSync =
/*#__PURE__*/
function () {
  function ThenableSync(executor, customResolveValue) {
    _classCallCheck(this, ThenableSync);

    if (customResolveValue != null) {
      this._customResolveValue = customResolveValue;
    }

    if (executor) {
      try {
        var _context, _context2;

        executor(bind$6(_context = this.resolve).call(_context, this), bind$6(_context2 = this.reject).call(_context2, this));
      } catch (err) {
        this.reject(err);
      }
    }
  } // region resolve


  _createClass(ThenableSync, [{
    key: "resolve",
    value: function resolve(value) {
      if (this._status != null) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + this._status);
      }

      this._resolve(value);
    }
  }, {
    key: "_resolve",
    value: function _resolve(value) {
      var _this = this;

      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + _status);
      }

      var result = resolveValue(value, function (o, e) {
        if (e) {
          _this._reject(o);
        } else {
          value = o;
        }
      }, function (o, e) {
        if (e) {
          _this._reject(o);
        } else {
          _this._resolve(o);
        }
      }, this._customResolveValue);

      if ((result & ResolveResult.Deferred) !== 0) {
        this._status = ThenableSyncStatus.Resolving;
        return;
      }

      if ((result & ResolveResult.Error) !== 0) {
        return;
      }

      this._status = ThenableSyncStatus.Resolved;
      this._value = value;
      var _onfulfilled = this._onfulfilled;

      if (_onfulfilled) {
        this._onfulfilled = void 0;
        this._onrejected = void 0;

        for (var i = 0, len = _onfulfilled.length; i < len; i++) {
          _onfulfilled[i](value);
        }
      }
    } // endregion
    // region reject

  }, {
    key: "reject",
    value: function reject(error) {
      if (this._status != null) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + this._status);
      }

      this._reject(error);
    }
  }, {
    key: "_reject",
    value: function _reject(error) {
      var _this2 = this;

      var _status = this._status;

      if (_status != null && _status !== ThenableSyncStatus.Resolving) {
        throw new Error("Multiple call resolve/reject() is forbidden; status = " + _status);
      }

      var result = resolveValue(error, function (o) {
        error = o;
      }, function (o) {
        _this2._reject(o);
      }, this._customResolveValue);

      if ((result & ResolveResult.Deferred) !== 0) {
        this._status = ThenableSyncStatus.Resolving;
        return;
      }

      this._status = ThenableSyncStatus.Rejected;
      this._error = error;
      var _onrejected = this._onrejected;

      if (_onrejected) {
        this._onfulfilled = void 0;
        this._onrejected = void 0;

        for (var i = 0, len = _onrejected.length; i < len; i++) {
          _onrejected[i](error);
        }
      }
    } // endregion
    // region then

  }, {
    key: "_then",
    value: function _then(onfulfilled, onrejected, lastExpression, customResolveValue) {
      var reject = function reject(error) {
        if (!onrejected) {
          if (lastExpression) {
            throw error;
          }

          return ThenableSync.createRejected(error, customResolveValue);
        }

        var isError;

        error = function () {
          try {
            return onrejected(error);
          } catch (err) {
            isError = true;
            return err;
          }
        }();

        var result = resolveAsync(error, null, null, !lastExpression, customResolveValue);

        if (isThenable$1(result)) {
          return isError ? result.then(function (o) {
            return createRejected(o, customResolveValue);
          }) : result;
        }

        if (lastExpression) {
          if (!isError) {
            return result;
          }

          throw result;
        }

        return isError ? createRejected(result, customResolveValue) : createResolved(result, customResolveValue);
      };

      switch (this._status) {
        case ThenableSyncStatus.Resolved:
          {
            var _value = this._value;

            if (!onfulfilled) {
              return lastExpression ? _value : this;
            }

            var isError;

            _value = function () {
              try {
                return onfulfilled(_value);
              } catch (err) {
                isError = true;
                return err;
              }
            }();

            if (isError) {
              var result = resolveAsync(_value, null, null, !lastExpression, customResolveValue);

              if (isThenable$1(result)) {
                return result.then(function (o) {
                  return reject(o);
                }, onrejected);
              }

              return reject(result);
            } else {
              var _result = resolveAsync(_value, null, onrejected, !lastExpression, customResolveValue);

              return lastExpression || isThenable$1(_result) ? _result : createResolved(_result, customResolveValue);
            }
          }

        case ThenableSyncStatus.Rejected:
          if (!onrejected && !lastExpression && (!customResolveValue || customResolveValue === this._customResolveValue)) {
            return this;
          }

          return reject(this._error);

        default:
          {
            if (!onfulfilled && !onrejected && (!customResolveValue || customResolveValue === this._customResolveValue)) {
              return this;
            }

            var _result2 = new ThenableSync(null, customResolveValue);

            var _onrejected = this._onrejected;

            if (!_onrejected) {
              this._onrejected = _onrejected = [];
            }

            var rejected = onrejected ? function (value) {
              var isError;

              value = function () {
                try {
                  return onrejected(value);
                } catch (err) {
                  isError = true;
                  return err;
                }
              }();

              if (isError) {
                _result2.reject(value);
              } else {
                _result2.resolve(value);
              }
            } : function (value) {
              _result2.reject(value);
            };

            _onrejected.push(rejected);

            var _onfulfilled = this._onfulfilled;

            if (!_onfulfilled) {
              this._onfulfilled = _onfulfilled = [];
            }

            _onfulfilled.push(onfulfilled ? function (value) {
              var isError;

              value = function () {
                try {
                  return onfulfilled(value);
                } catch (err) {
                  isError = true;
                  return err;
                }
              }();

              if (isError) {
                resolveValue(value, rejected, rejected, customResolveValue);
              } else {
                _result2.resolve(value);
              }
            } : function (value) {
              _result2.resolve(value);
            });

            return _result2;
          }
      }
    }
  }, {
    key: "then",
    value: function then(onfulfilled, onrejected, customResolveValue) {
      return this._then(onfulfilled, onrejected, false, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
    }
  }, {
    key: "thenLast",
    value: function thenLast(onfulfilled, onrejected, customResolveValue) {
      return this._then(onfulfilled, onrejected, true, customResolveValue === false ? null : customResolveValue || this._customResolveValue);
    } // endregion
    // region static helpers
    // endregion

  }]);

  return ThenableSync;
}();
ThenableSync.createResolved = createResolved;
ThenableSync.createRejected = createRejected;
ThenableSync.isThenable = isThenable$1;
ThenableSync.resolve = resolveAsync;
function resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  // Optimization
  if (!onfulfilled && !isAsync(input)) {
    if (input != null && customResolveValue) {
      var newInput = customResolveValue(input);

      if (input === newInput) {
        return input;
      }

      input = newInput;
    } else {
      return input;
    }
  }

  return _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue);
}

function _resolveAsync(input, onfulfilled, onrejected, dontThrowOnImmediateError, customResolveValue) {
  var result;
  var isError;

  var onResult = function onResult(o, e) {
    result = o;
    isError = e;
  };

  var thenable;

  var createThenable = function createThenable() {
    if (!thenable) {
      thenable = new ThenableSync(function (resolve, reject) {
        onResult = function onResult(o, e) {
          if (e) {
            reject(o);
          } else {
            resolve(o);
          }
        };
      }, customResolveValue);
    }

    return thenable;
  };

  var resolveOnResult = function resolveOnResult(o, e) {
    var handler = e ? onrejected : onfulfilled;

    if (handler) {
      if ((resolveValueFunc(function () {
        return handler(o);
      }, function (o2, e2) {
        onResult(o2, e2);
      }, function (o2, e2) {
        onResult(o2, e2);
      }, customResolveValue) & ResolveResult.Deferred) !== 0) {
        result = createThenable();
      }
    } else {
      onResult(o, e);
    }
  };

  if ((resolveValue(input, resolveOnResult, resolveOnResult, customResolveValue) & ResolveResult.Deferred) !== 0) {
    return createThenable();
  }

  if (isError) {
    if (dontThrowOnImmediateError) {
      return ThenableSync.createRejected(result, customResolveValue);
    }

    throw result;
  }

  return result;
}

function resolveAsyncFunc(func, onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue) {
  try {
    return resolveAsync(func(), onfulfilled, onrejected, dontThrowOnImmediateReject, customResolveValue);
  } catch (err) {
    return resolveAsync(err, onrejected, onrejected, dontThrowOnImmediateReject, customResolveValue);
  }
}

var webrainOptions = {
  equalsFunc: function equalsFunc(oldValue, newValue) {
    if (oldValue instanceof Date) {
      return newValue instanceof Date && oldValue.getTime() === newValue.getTime();
    }

    return equalsObjects(oldValue, newValue);
  },
  debugInfo: true
};

var Observable =
/*#__PURE__*/
function () {
  function Observable() {
    _classCallCheck(this, Observable);
  }

  _createClass(Observable, [{
    key: "call",
    value: function call(func) {
      return func(this);
    }
  }]);

  return Observable;
}();

Observable.prototype.autoConnect = function (connectPredicate, connectFunc) {
  var disconnect;
  return this.subscribe(function (value) {
    if (connectPredicate && connectPredicate(value) || !connectPredicate && value) {
      if (!disconnect) {
        disconnect = connectFunc();
      }
    } else if (disconnect) {
      disconnect();
    }
  });
};

function subject(base) {
  // eslint-disable-next-line no-shadow
  // tslint:disable-next-line:no-shadowed-variable
  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(Subject, _base);

      function Subject() {
        _classCallCheck(this, Subject);

        return _possibleConstructorReturn(this, _getPrototypeOf(Subject).apply(this, arguments));
      }

      _createClass(Subject, [{
        key: "subscribe",
        value: function subscribe(subscriber, description) {
          var _this = this;

          if (!subscriber) {
            return null;
          }

          if (description) {
            subscriber.description = description;
          }

          var _subscribers = this._subscribers;

          if (!_subscribers) {
            this._subscribers = [subscriber];
          } else {
            _subscribers[_subscribers.length] = subscriber;
          }

          return function () {
            if (!subscriber) {
              return;
            } // tslint:disable-next-line:no-shadowed-variable


            var _subscribers = _this._subscribers;
            var len = _subscribers.length;

            var index = indexOf$5(_subscribers).call(_subscribers, subscriber);

            if (index >= 0) {
              if (_this._subscribersInProcess === _subscribers) {
                var subscribers = new Array(len - 1);

                for (var i = 0; i < index; i++) {
                  subscribers[i] = _subscribers[i];
                }

                for (var _i = index + 1; _i < len; _i++) {
                  subscribers[_i - 1] = _subscribers[_i];
                }

                _this._subscribers = subscribers;
              } else {
                for (var _i2 = index + 1; _i2 < len; _i2++) {
                  _subscribers[_i2 - 1] = _subscribers[_i2];
                }

                _subscribers.length = len - 1;
              }
            }

            subscriber = null;
          };
        }
      }, {
        key: "emit",
        value: function emit(value) {
          var _subscribers = this._subscribers;

          if (!_subscribers) {
            return this;
          }

          if (this._subscribersInProcess !== _subscribers) {
            this._subscribersInProcess = _subscribers;
          }

          for (var i = 0, len = _subscribers.length; i < len; i++) {
            _subscribers[i](value);
          }

          if (this._subscribersInProcess === _subscribers) {
            this._subscribersInProcess = null;
          }

          return this;
        }
      }, {
        key: "hasSubscribers",
        get: function get() {
          return !!(this._subscribers && this._subscribers.length);
        }
      }, {
        key: "subscribersCount",
        get: function get() {
          return this._subscribers && this._subscribers.length;
        }
      }]);

      return Subject;
    }(base)
  );
}
var Subject = subject(Observable); // export function createSubjectClass(base, ...extensions) {
// 	for (const extension of extensions) {
// 		base = extension(base)
// 	}
//
// 	return base
// }

function behavior(base) {
  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(Behavior, _base);

      function Behavior(value) {
        var _this;

        _classCallCheck(this, Behavior);

        _this = _possibleConstructorReturn(this, _getPrototypeOf(Behavior).call(this));

        if (typeof value !== 'undefined') {
          _this.value = value;
        }

        return _this;
      }

      _createClass(Behavior, [{
        key: "subscribe",
        value: function subscribe(subscriber, description) {
          var _this2 = this;

          if (!subscriber) {
            return null;
          }

          if (description) {
            subscriber.description = description;
          }

          var unsubscribe = _get(_getPrototypeOf(Behavior.prototype), "subscribe", this).call(this, subscriber);

          var value = this.value;

          if (typeof value !== 'undefined') {
            subscriber(value);
          }

          return function () {
            var _unsubscribe = unsubscribe;

            if (!_unsubscribe) {
              return;
            }

            unsubscribe = null;

            try {
              // eslint-disable-next-line no-shadow
              // tslint:disable-next-line:no-shadowed-variable
              var _value = _this2.value,
                  unsubscribeValue = _this2.unsubscribeValue;

              if (typeof unsubscribeValue !== 'undefined' && unsubscribeValue !== _value) {
                subscriber(unsubscribeValue);
              }
            } finally {
              _unsubscribe();
            }
          };
        }
      }, {
        key: "emit",
        value: function emit(value) {
          this.value = value;

          _get(_getPrototypeOf(Behavior.prototype), "emit", this).call(this, value);

          return this;
        }
      }]);

      return Behavior;
    }(base)
  );
}
var BehaviorSubject = behavior(Subject);

// tslint:disable-next-line:no-shadowed-variable

function createHasSubscribersSubjectDefault(hasSubscribers) {
  var subject = new BehaviorSubject(hasSubscribers);
  subject.unsubscribeValue = null;
  return subject;
}

function hasSubscribers(base, createHasSubscribersSubject) {
  if (createHasSubscribersSubject === void 0) {
    createHasSubscribersSubject = createHasSubscribersSubjectDefault;
  }

  return (
    /*#__PURE__*/
    function (_base) {
      _inherits(HasSubscribers, _base);

      function HasSubscribers() {
        _classCallCheck(this, HasSubscribers);

        return _possibleConstructorReturn(this, _getPrototypeOf(HasSubscribers).apply(this, arguments));
      }

      _createClass(HasSubscribers, [{
        key: "subscribe",
        value: function subscribe(subscriber, description) {
          var _this = this;

          if (!subscriber) {
            return null;
          }

          if (description) {
            subscriber.description = description;
          } // eslint-disable-next-line no-shadow
          // tslint:disable-next-line:no-shadowed-variable


          var hasSubscribers = this.hasSubscribers;

          var unsubscribe = _get(_getPrototypeOf(HasSubscribers.prototype), "subscribe", this).call(this, subscriber);

          if (!hasSubscribers && this._hasSubscribersSubject && this.hasSubscribers) {
            this._hasSubscribersSubject.emit(true);
          }

          return function () {
            // eslint-disable-next-line no-shadow
            // tslint:disable-next-line:no-shadowed-variable
            var hasSubscribers = _this.hasSubscribers;
            unsubscribe();

            if (hasSubscribers && _this._hasSubscribersSubject && !_this.hasSubscribers) {
              _this._hasSubscribersSubject.emit(false);
            }
          };
        }
      }, {
        key: "hasSubscribersObservable",
        get: function get() {
          var _hasSubscribersSubject = this._hasSubscribersSubject;

          if (!_hasSubscribersSubject) {
            this._hasSubscribersSubject = _hasSubscribersSubject = createHasSubscribersSubject(this.hasSubscribers);
          }

          return _hasSubscribersSubject;
        }
      }]);

      return HasSubscribers;
    }(base)
  );
}
var HasSubscribersSubject = hasSubscribers(Subject);
var HasSubscribersBehaviorSubject = hasSubscribers(BehaviorSubject);

// 	if (inputItems == null) {
// 		return output
// 	}
//
// 	if (Array.isArray(inputItems)) {
// 		for (const item of inputItems) {
// 			expandAndDistinct(item, output, map)
// 		}
// 		return output
// 	}
//
// 	if (!map[inputItems]) {
// 		map[inputItems] = true
// 		output[output.length] = inputItems
// 	}
//
// 	return output
// }

var PropertyChangedSubject =
/*#__PURE__*/
function (_HasSubscribersSubjec) {
  _inherits(PropertyChangedSubject, _HasSubscribersSubjec);

  function PropertyChangedSubject(object) {
    var _this;

    _classCallCheck(this, PropertyChangedSubject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(PropertyChangedSubject).call(this));
    _this._object = object;
    return _this;
  }

  _createClass(PropertyChangedSubject, [{
    key: "onPropertyChanged",
    value: function onPropertyChanged() {
      for (var i = 0, len = arguments.length; i < len; i++) {
        var event = i < 0 || arguments.length <= i ? undefined : arguments[i];

        if (event == null) {
          event = {};
        }

        if (typeof event !== 'object') {
          var value = this._object[event];
          event = {
            name: event,
            oldValue: value,
            newValue: value
          };
        }

        this.emit(event);
      }

      return this;
    }
  }]);

  return PropertyChangedSubject;
}(HasSubscribersSubject);
var PropertyChangedObject =
/*#__PURE__*/
function () {
  /** @internal */
  function PropertyChangedObject() {
    _classCallCheck(this, PropertyChangedObject);

    defineProperty$9(this, '__meta', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });
  }
  /** @internal */


  _createClass(PropertyChangedObject, [{
    key: "_setUnsubscriber",
    value: function _setUnsubscriber(propertyName, unsubscribe) {
      var __meta = this.__meta;
      var unsubscribers = __meta.unsubscribers;

      if (unsubscribers) {
        var oldUnsubscribe = unsubscribers[propertyName];

        if (unsubscribe !== oldUnsubscribe) {
          if (oldUnsubscribe) {
            unsubscribers[propertyName] = unsubscribe;
            oldUnsubscribe();
          } else if (unsubscribe) {
            unsubscribers[propertyName] = unsubscribe;
          }
        }
      } else if (unsubscribe) {
        var _meta$unsubscribers;

        __meta.unsubscribers = (_meta$unsubscribers = {}, _meta$unsubscribers[propertyName] = unsubscribe, _meta$unsubscribers);
      }
    } // region propertyChanged

  }, {
    key: "propertyChanged",
    get: function get() {
      var propertyChanged = this.__meta.propertyChanged;

      if (!propertyChanged) {
        this.__meta.propertyChanged = propertyChanged = new PropertyChangedSubject(this);
      }

      return propertyChanged;
    }
  }, {
    key: "propertyChangedIfCanEmit",
    get: function get() {
      var _this$__meta = this.__meta,
          propertyChangedDisabled = _this$__meta.propertyChangedDisabled,
          propertyChanged = _this$__meta.propertyChanged;
      return !propertyChangedDisabled && propertyChanged && propertyChanged.hasSubscribers ? propertyChanged : null;
    } // endregion

  }]);

  return PropertyChangedObject;
}();

var ObservableClass =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(ObservableClass, _PropertyChangedObjec);

  /** @internal */
  function ObservableClass() {
    var _this;

    _classCallCheck(this, ObservableClass);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableClass).call(this));

    defineProperty$9(_assertThisInitialized(_this), '__fields', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: {}
    });

    return _this;
  }

  return ObservableClass;
}(PropertyChangedObject);
/** @internal */

function _setExt(name, getValue, setValue, options, object, newValue) {
  if (!options) {
    return _set(name, getValue, setValue, object, newValue);
  }

  var oldValue = getValue ? getValue.call(object) : object.__fields[name];
  var equalsFunc = options.equalsFunc || webrainOptions.equalsFunc;

  if (oldValue === newValue || equalsFunc && equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  var fillFunc = options.fillFunc;

  if (fillFunc && oldValue != null && newValue != null && fillFunc.call(object, oldValue, newValue)) {
    return false;
  }

  var convertFunc = options.convertFunc;

  if (convertFunc) {
    newValue = convertFunc.call(object, oldValue, newValue);
  } // if (oldValue === newValue) {
  // 	return false
  // }


  var beforeChange = options.beforeChange;

  if (beforeChange) {
    beforeChange.call(object, oldValue, newValue);
  }

  if (setValue) {
    setValue.call(object, newValue);
  } else {
    object.__fields[name] = newValue;
  }

  if (!options || !options.suppressPropertyChanged) {
    var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

    if (propertyChangedIfCanEmit) {
      propertyChangedIfCanEmit.onPropertyChanged({
        name: name,
        oldValue: oldValue,
        newValue: newValue
      });
    }
  }

  var afterChange = options.afterChange;

  if (afterChange) {
    afterChange.call(object, oldValue, newValue);
  }

  return true;
}
/** @internal */

function _set(name, getValue, setValue, object, newValue) {
  var oldValue = getValue.call(object);

  if (oldValue === newValue || webrainOptions.equalsFunc && webrainOptions.equalsFunc.call(object, oldValue, newValue)) {
    return false;
  }

  setValue.call(object, newValue);
  var _object$__meta = object.__meta,
      propertyChangedDisabled = _object$__meta.propertyChangedDisabled,
      propertyChanged = _object$__meta.propertyChanged;

  if (!propertyChangedDisabled && propertyChanged) {
    propertyChanged.emit({
      name: name,
      oldValue: oldValue,
      newValue: newValue
    });
  }

  return true;
}

var nativeIsFrozen = Object.isFrozen;
var FAILS_ON_PRIMITIVES$3 = fails(function () { nativeIsFrozen(1); });

// `Object.isFrozen` method
// https://tc39.github.io/ecma262/#sec-object.isfrozen
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3 }, {
  isFrozen: function isFrozen(it) {
    return isObject(it) ? nativeIsFrozen ? nativeIsFrozen(it) : false : true;
  }
});

var isFrozen = path.Object.isFrozen;

var isFrozen$1 = isFrozen;

var isFrozen$2 = isFrozen$1;

var toStringTag = wellKnownSymbolWrapped.f('toStringTag');

var toStringTag$1 = toStringTag;

var toStringTag$2 = toStringTag$1;

var keys$4 = entryVirtual('Array').keys;

var keys$5 = keys$4;

var ArrayPrototype$b = Array.prototype;

var DOMIterables$1 = {
  DOMTokenList: true,
  NodeList: true
};

var keys_1 = function (it) {
  var own = it.keys;
  return it === ArrayPrototype$b || (it instanceof Array && own === ArrayPrototype$b.keys)
    // eslint-disable-next-line no-prototype-builtins
    || DOMIterables$1.hasOwnProperty(classof(it)) ? keys$5 : own;
};

var keys$6 = keys_1;

function mergeMapWrappers(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  var changed = false;
  var addItems = [];

  var fill = function fill(olderItem, newerItem) {
    var setItem = EMPTY;
    merge(EMPTY, olderItem, newerItem, function (o) {
      setItem = o;
    }, preferCloneOlder, preferCloneNewer, options);

    if (setItem === EMPTY) {
      throw new Error('setItem === NONE');
    }

    return setItem;
  };

  if (older === newer) {
    // [- n n]
    newer.forEachKeys(function (key) {
      if (!base.has(key)) {
        addItems.push([key, fill(EMPTY, newer.get(key))]);
      }
    });
  } else {
    // [- - n]
    newer.forEachKeys(function (key) {
      if (!base.has(key) && !older.has(key)) {
        addItems.push([key, fill(EMPTY, newer.get(key))]);
      }
    }); // [- o *]

    older.forEachKeys(function (key) {
      if (!base.has(key)) {
        if (!newer.has(key)) {
          addItems.push([key, fill(older.get(key), EMPTY)]);
        } else {
          addItems.push([key, fill(older.get(key), newer.get(key))]);
        }
      }
    });
  }

  var deleteItems = []; // [b * *]

  base.forEachKeys(function (key) {
    changed = merge(base.get(key), older.has(key) ? older.get(key) : EMPTY, newer.has(key) ? newer.get(key) : EMPTY, function (o) {
      if (o === EMPTY) {
        deleteItems.push(key);
      } else {
        base.set(key, o);
      }
    }, preferCloneOlder, preferCloneNewer, options) || changed;
  });
  var len = deleteItems.length;

  if (len > 0) {
    changed = true;

    for (var i = len - 1; i >= 0; i--) {
      base.delete(deleteItems[i]);
    }
  }

  len = addItems.length;

  if (len > 0) {
    changed = true;

    for (var _i = 0; _i < len; _i++) {
      base.set.apply(base, addItems[_i]);
    }
  }

  return changed;
}
var MergeObjectWrapper =
/*#__PURE__*/
function () {
  function MergeObjectWrapper(object, keyAsValue) {
    _classCallCheck(this, MergeObjectWrapper);

    this._object = object;

    if (keyAsValue) {
      this._keyAsValue = true;
    }
  }

  _createClass(MergeObjectWrapper, [{
    key: "delete",
    value: function _delete(key) {
      delete this._object[key];
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      var _object = this._object;

      for (var key in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, key)) {
          callbackfn(key);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._keyAsValue ? key : this._object[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return Object.prototype.hasOwnProperty.call(this._object, key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._object[key] = this._keyAsValue ? true : value;
    }
  }]);

  return MergeObjectWrapper;
}();
var MergeMapWrapper =
/*#__PURE__*/
function () {
  function MergeMapWrapper(map) {
    _classCallCheck(this, MergeMapWrapper);

    this._map = map;
  }

  _createClass(MergeMapWrapper, [{
    key: "delete",
    value: function _delete(key) {
      this._map.delete(key);
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      for (var _iterator = keys$6(_context = this._map).call(_context), _isArray = isArray$3(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
        var _context;

        var _ref;

        if (_isArray) {
          if (_i2 >= _iterator.length) break;
          _ref = _iterator[_i2++];
        } else {
          _i2 = _iterator.next();
          if (_i2.done) break;
          _ref = _i2.value;
        }

        var key = _ref;
        callbackfn(key);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._map.set(key, value);
    }
  }]);

  return MergeMapWrapper;
}();
function createMergeMapWrapper(target, source, arrayOrIterableToMap) {
  if (source[toStringTag$2] === 'Map') {
    return new MergeMapWrapper(source);
  }

  if (arrayOrIterableToMap && (isArray$3(source) || isIterable$2(source))) {
    return createMergeMapWrapper(target, arrayOrIterableToMap(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source);
  }

  throw new Error(target.constructor.name + " cannot be merge with " + source.constructor.name);
} // 10039 cycles

function mergeMaps(createSourceMapWrapper, merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
  var baseWrapper = createSourceMapWrapper(base, base);
  var olderWrapper = older === base ? baseWrapper : createSourceMapWrapper(base, older);
  var newerWrapper = newer === base ? baseWrapper : newer === older ? olderWrapper : createSourceMapWrapper(base, newer);
  return mergeMapWrappers(merge, baseWrapper, olderWrapper, newerWrapper, preferCloneOlder, preferCloneNewer, options);
}

var onFreeze = internalMetadata.onFreeze;

var nativeFreeze = Object.freeze;
var FAILS_ON_PRIMITIVES$4 = fails(function () { nativeFreeze(1); });

// `Object.freeze` method
// https://tc39.github.io/ecma262/#sec-object.freeze
_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4, sham: !freezing }, {
  freeze: function freeze(it) {
    return nativeFreeze && isObject(it) ? nativeFreeze(onFreeze(it)) : it;
  }
});

var freeze = path.Object.freeze;

var freeze$1 = freeze;

var freeze$2 = freeze$1;

var nextObjectId = 1;
function getNextObjectId() {
  return nextObjectId++;
}
var UNIQUE_ID_PROPERTY_NAME = '458d576952bc489ab45e98ac7f296fd9';
function hasObjectUniqueId(object) {
  return object != null && Object.prototype.hasOwnProperty.call(object, UNIQUE_ID_PROPERTY_NAME);
}
function canHaveUniqueId(object) {
  return !isFrozen$2(object) || hasObjectUniqueId(object);
}
function getObjectUniqueId(object) {
  // PROF: 129 - 0.3%
  if (object == null) {
    return null;
  }

  var id = object[UNIQUE_ID_PROPERTY_NAME];

  if (id != null) {
    return id;
  }

  if (isFrozen$2(object)) {
    return null;
  }

  var uniqueId = getNextObjectId();

  defineProperty$9(object, UNIQUE_ID_PROPERTY_NAME, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: uniqueId
  });

  return uniqueId;
} // tslint:disable-next-line:ban-types

function fillCollection(collection, arrayOrIterable, add) {
  if (isArray$3(arrayOrIterable)) {
    for (var i = 0, len = arrayOrIterable.length; i < len; i++) {
      add(collection, arrayOrIterable[i]);
    }
  } else {
    for (var _iterator = arrayOrIterable, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var item = _ref;
      add(collection, item);
    }
  }

  return collection;
}
function fillSet(set, arrayOrIterable) {
  return fillCollection(set, arrayOrIterable, function (c, o) {
    return c.add(o);
  });
}
function fillMap(map, arrayOrIterable) {
  return fillCollection(map, arrayOrIterable, function (c, o) {
    return c.set.apply(c, o);
  });
}
function fillObjectKeys(object, arrayOrIterable) {
  return fillCollection(object, arrayOrIterable, function (c, o) {
    return c[o] = true;
  });
}

var typeMetaPropertyNameBase = '043a558080e94cbda1add09753c28772';
var typeMetaPropertyNameIndex = 0;
var TypeMetaCollection =
/*#__PURE__*/
function () {
  // noinspection JSUnusedLocalSymbols
  function TypeMetaCollection(proto) {
    _classCallCheck(this, TypeMetaCollection);

    this._typeMetaPropertyName = typeMetaPropertyNameBase + typeMetaPropertyNameIndex++;

    if (proto) {
      this._proto = proto;
    }
  }

  _createClass(TypeMetaCollection, [{
    key: "getMeta",
    value: function getMeta(type) {
      var meta;
      var _typeMetaPropertyName = this._typeMetaPropertyName;

      if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
        meta = type[_typeMetaPropertyName];
      }

      if (typeof meta === 'undefined') {
        var _proto = this._proto;

        if (_proto) {
          return _proto.getMeta(type);
        }
      }

      return meta;
    }
  }, {
    key: "putType",
    value: function putType(type, meta) {
      if (!type || typeof type !== 'function') {
        throw new Error("type (" + type + ") should be function");
      }

      var _typeMetaPropertyName = this._typeMetaPropertyName;
      var prevMeta;

      if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
        prevMeta = type[_typeMetaPropertyName];
        delete type[_typeMetaPropertyName];
      }

      defineProperty$9(type, _typeMetaPropertyName, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: meta
      });

      return prevMeta;
    }
  }, {
    key: "deleteType",
    value: function deleteType(type) {
      var _typeMetaPropertyName = this._typeMetaPropertyName;
      var prevMeta;

      if (Object.prototype.hasOwnProperty.call(type, _typeMetaPropertyName)) {
        prevMeta = type[_typeMetaPropertyName];
        delete type[_typeMetaPropertyName];
      }

      return prevMeta;
    }
  }]);

  return TypeMetaCollection;
}();
var TypeMetaCollectionWithId =
/*#__PURE__*/
function (_TypeMetaCollection) {
  _inherits(TypeMetaCollectionWithId, _TypeMetaCollection);

  function TypeMetaCollectionWithId(proto) {
    var _this;

    _classCallCheck(this, TypeMetaCollectionWithId);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaCollectionWithId).call(this, proto));
    _this._typeMap = {};
    return _this;
  }

  _createClass(TypeMetaCollectionWithId, [{
    key: "getType",
    value: function getType(uuid) {
      var type = this._typeMap[uuid];

      if (typeof type === 'undefined') {
        var _proto = this._proto;

        if (_proto) {
          return _proto.getType(uuid);
        }
      }

      return type;
    }
  }, {
    key: "putType",
    value: function putType(type, meta) {
      var uuid = meta && meta.uuid;

      if (!uuid || typeof uuid !== 'string') {
        throw new Error("meta.uuid (" + uuid + ") should be a string with length > 0");
      }

      var prevType = this._typeMap[uuid];

      if (prevType && prevType !== type) {
        throw new Error("Same uuid (" + uuid + ") used for different types: " + (typeToDebugString(prevType) + ", " + typeToDebugString(type)));
      }

      var prevMeta = _get(_getPrototypeOf(TypeMetaCollectionWithId.prototype), "putType", this).call(this, type, meta);

      this._typeMap[uuid] = type;
      return prevMeta;
    }
  }, {
    key: "deleteType",
    value: function deleteType(typeOrUuid) {
      var uuid;
      var type;

      if (typeof typeOrUuid === 'function') {
        var meta = this.getMeta(typeOrUuid);
        uuid = meta && meta.uuid;
        type = typeOrUuid;
      } else if (typeof typeOrUuid === 'string') {
        type = this.getType(typeOrUuid);
        uuid = typeOrUuid;
      } else {
        throw new Error("typeOrUuid (" + (typeOrUuid == null ? typeOrUuid : typeof typeOrUuid) + ") is not a Function or String");
      }

      var prevMeta = _get(_getPrototypeOf(TypeMetaCollectionWithId.prototype), "deleteType", this).call(this, type);

      delete this._typeMap[uuid];
      return prevMeta;
    }
  }]);

  return TypeMetaCollectionWithId;
}(TypeMetaCollection);

var MergeSetWrapper =
/*#__PURE__*/
function () {
  function MergeSetWrapper(set) {
    _classCallCheck(this, MergeSetWrapper);

    this._set = set;
  }

  _createClass(MergeSetWrapper, [{
    key: "delete",
    value: function _delete(key) {
      this._set.delete(key);
    }
  }, {
    key: "forEachKeys",
    value: function forEachKeys(callbackfn) {
      for (var _iterator = this._set, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var key = _ref;
        callbackfn(key);
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return key;
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._set.has(key);
    }
  }, {
    key: "set",
    value: function set(key, value) {
      this._set.add(value);
    }
  }]);

  return MergeSetWrapper;
}();
function createMergeSetWrapper(target, source, arrayOrIterableToSet) {
  if (source[toStringTag$2] === 'Set') {
    return new MergeSetWrapper(source);
  }

  if (arrayOrIterableToSet && (isArray$3(source) || isIterable$2(source))) {
    return createMergeSetWrapper(target, arrayOrIterableToSet(source), null);
  }

  if (source.constructor === Object) {
    return new MergeObjectWrapper(source, true);
  }

  throw new Error(target.constructor.name + " cannot be merge with " + source.constructor.name);
}

var ValueState =
/*#__PURE__*/
function () {
  function ValueState(mergerState, target, preferClone, selfAsValue, refs) {
    _classCallCheck(this, ValueState);

    this.mergerState = mergerState;
    this.target = target;
    this.preferClone = preferClone;
    this.selfAsValue = selfAsValue;
    this.refs = refs;
    var options = this.mergerState.options;
    this.type = options && options.valueType || target.constructor;
  }

  _createClass(ValueState, [{
    key: "resolveRef",
    value: function resolveRef() {
      if (this._isRef == null) {
        if (this.selfAsValue) {
          this._isRef = false;
        } else {
          var ref = this.getRef();

          if (ref) {
            this.target = ref;
            this._isRef = true;
          } else {
            this._isRef = false;
          }
        }
      }
    }
  }, {
    key: "getRef",
    value: function getRef() {
      var refs = this.refs;

      if (refs) {
        var id = getObjectUniqueId(this.target);

        if (id != null) {
          var ref = refs[id];
          return ref;
        }
      }

      return null;
    }
  }, {
    key: "setRef",
    value: function setRef(refObj) {
      var id = getObjectUniqueId(this.target);

      if (id != null) {
        var refs = this.refs;

        if (refs == null) {
          this.refs = refs = [];
        }

        refs[id] = refObj;
      }
    }
  }, {
    key: "canMerge",
    value: function canMerge(source, target) {
      var canMerge = this.merger.canMerge;

      if (canMerge) {
        if (target == null) {
          target = this.target;

          if (this.isRef || source.isRef) {
            return target === source.target ? null : false;
          }
        }

        var result = canMerge(target, source.target);

        if (result == null) {
          return null;
        }

        if (typeof result !== 'boolean') {
          throw new Error("Unknown canMerge() result (" + result.constructor.name + ") for " + this.type.name);
        }

        return result;
      }

      return this.target.constructor === source.constructor;
    }
  }, {
    key: "isRef",
    get: function get() {
      this.resolveRef();
      return this._isRef;
    }
  }, {
    key: "meta",
    get: function get() {
      var _meta = this._meta;

      if (!_meta) {
        _meta = this.mergerState.mergerVisitor.getMeta(this.type);

        if (!_meta) {
          throw new Error("Class (" + (this.type && this.type.name) + ") have no type meta");
        }

        this._meta = _meta;
      }

      return _meta;
    }
  }, {
    key: "merger",
    get: function get() {
      var _merger = this._merger;

      if (!_merger) {
        var meta = this.meta;
        _merger = meta.merger;

        if (!_merger) {
          throw new Error("Class (" + (this.type && this.type.name) + ") type meta have no merger");
        }

        this._merger = _merger;
      }

      return _merger;
    }
  }, {
    key: "merge",
    get: function get() {
      var merger = this.merger;

      if (!merger.merge) {
        throw new Error("Class (" + (this.type && this.type.name) + ") merger have no merge method");
      }

      return merger.merge;
    }
  }, {
    key: "mustBeCloned",
    get: function get() {
      var _mustBeCloned = this._mustBeCloned;

      if (_mustBeCloned == null) {
        var options = this.mergerState.options;
        var valueType = options && options.valueType;
        var metaPreferClone = this.meta.preferClone;

        if (typeof metaPreferClone === 'function') {
          metaPreferClone = metaPreferClone(this.target);
        }

        this._mustBeCloned = _mustBeCloned = (metaPreferClone != null ? metaPreferClone : this.preferClone && !this.isRef && !this.mergerState.mergerVisitor.getStatus(this.target)) || valueType && valueType !== this.target.constructor;
      }

      return _mustBeCloned;
    }
  }, {
    key: "cloneInstance",
    get: function get() {
      var _this = this;

      var _cloneInstance = this._cloneInstance;

      if (_cloneInstance == null) {
        var target = this.target,
            type = this.type;
        var options = this.mergerState.options;

        _cloneInstance = (options && options.valueFactory || this.meta.valueFactory || function () {
          return (!options || !options.valueType || _this.target.constructor === (options && options.valueType)) && new type();
        })(target);

        if (!_cloneInstance) {
          throw new Error("Class (" + typeToDebugString(type) + ") cannot be clone");
        }

        if (_cloneInstance === target) {
          throw new Error("Clone result === Source for (" + typeToDebugString(type) + ")");
        }

        if (_cloneInstance.constructor !== type) {
          throw new Error("Clone type !== (" + typeToDebugString(type) + ")");
        }

        this._cloneInstance = _cloneInstance;
      }

      return _cloneInstance;
    }
  }, {
    key: "clone",
    get: function get() {
      var _this2 = this;

      var _clone = this._clone;

      if (_clone == null) {
        var target = this.target;

        if (this.mustBeCloned) {
          _clone = this.cloneInstance;
          var canMergeResult = this.canMerge(this, _clone);

          switch (canMergeResult) {
            case null:
              break;

            case true:
              var _this$mergerState = this.mergerState,
                  mergerVisitor = _this$mergerState.mergerVisitor,
                  options = _this$mergerState.options;
              this.setRef(_clone); // mergerVisitor.setStatus(_clone, ObjectStatus.Cloned)

              var preferClone = this.preferClone,
                  refs = this.refs;
              this.merge(mergerVisitor.getNextMerge(preferClone, preferClone, refs, refs, refs, options), _clone, target, target, function () {
                throw new Error("Class (" + _this2.type.name + ") cannot be merged with clone");
              }, preferClone, preferClone // options,
              );
              break;

            case false:
              if (this.merger.merge) {
                throw new Error("Class (" + this.type.name + ") cannot be merged with clone");
              }

              break;
          }
        } else {
          _clone = target;
        }

        this._clone = _clone;
      }

      return _clone;
    }
  }]);

  return ValueState;
}();

var MergeState =
/*#__PURE__*/
function () {
  // noinspection DuplicatedCode
  function MergeState(mergerVisitor, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
    _classCallCheck(this, MergeState);

    this.mergerVisitor = mergerVisitor;
    this.base = base;
    this.older = older;
    this.newer = newer;
    this.set = set;
    this.preferCloneBase = preferCloneBase;
    this.preferCloneOlder = preferCloneOlder;
    this.preferCloneNewer = preferCloneNewer;
    this.refsBase = refsBase;
    this.refsOlder = refsOlder;
    this.refsNewer = refsNewer;
    this.options = options;
  }

  _createClass(MergeState, [{
    key: "fillOlderNewer",
    value: function fillOlderNewer() {
      var olderState = this.olderState,
          newerState = this.newerState; // this.mergerVisitor.setStatus(olderState.clone, ObjectStatus.Merged)
      // const idNewer = getObjectUniqueId(newerState.target as any)
      // if (idNewer != null) {
      // 	refsNewer[idNewer] = olderState.clone
      // }

      var older = olderState.clone;
      newerState.setRef(older);
      var options = this.options,
          set = this.set,
          preferCloneNewer = this.preferCloneNewer,
          refsOlder = this.refsOlder,
          refsNewer = this.refsNewer;
      var isSet;
      var result = olderState.merge(this.mergerVisitor.getNextMerge(preferCloneNewer, preferCloneNewer, refsOlder, refsNewer, refsNewer, options), older, newerState.target, newerState.target, set ? function (o) {
        // if (idNewer != null) {
        // 	refsNewer[idNewer] = o
        // }
        set(o);
        isSet = true;
      } : function () {
        throw new Error("Class " + olderState.type.name + " does not need cloning." + 'You should use "preferClone: false" in merger options for this class');
      }, preferCloneNewer, preferCloneNewer // options,
      );

      if (isSet) {
        return;
      }

      if (result || newerState.mustBeCloned) {
        set(older);
        return;
      }

      set(newerState.target);
    }
  }, {
    key: "mergeWithBase",
    value: function mergeWithBase(olderState, newerState) {
      var baseState = this.baseState;
      var base = baseState.clone; // baseState.setRef(base)

      olderState.setRef(base);
      newerState.setRef(base);
      var options = this.options,
          set = this.set;
      var refsBase = baseState.refs;
      var preferCloneOlder = olderState.preferClone,
          refsOlder = olderState.refs;
      var preferCloneNewer = newerState.preferClone,
          refsNewer = newerState.refs;
      var isSet;
      var result = baseState.merge(this.mergerVisitor.getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options), base, olderState.target, newerState.target, // for String() etc., that cannot be changed
      set ? function (o) {
        baseState.setRef(o);
        olderState.setRef(o);
        newerState.setRef(o);
        set(o);
        isSet = true;
      } : function () {
        if (baseState.mustBeCloned) {
          throw new Error("Class " + baseState.type.name + " does not need cloning." + 'You should use "preferClone: false" in merger options for this class');
        } else {
          isSet = true;
        }
      }, preferCloneOlder, preferCloneNewer // options,
      );

      if (isSet) {
        return !!set;
      }

      if (!result) {
        return false;
      }

      if (baseState.mustBeCloned) {
        set(base);
      }

      return true;
    }
  }, {
    key: "baseState",
    get: function get() {
      var _baseState = this._baseState;

      if (_baseState == null) {
        var options = this.options;
        this._baseState = _baseState = new ValueState(this, this.base, this.preferCloneBase, options && options.selfAsValueBase, this.refsBase);
      }

      return _baseState;
    },
    set: function set(value) {
      this._baseState = value;
    }
  }, {
    key: "olderState",
    get: function get() {
      var _olderState = this._olderState;

      if (_olderState == null) {
        var options = this.options;
        this._olderState = _olderState = new ValueState(this, this.older, this.preferCloneOlder, options && options.selfAsValueOlder, this.refsOlder);
      }

      return _olderState;
    },
    set: function set(value) {
      this._olderState = value;
    }
  }, {
    key: "newerState",
    get: function get() {
      var _newerState = this._newerState;

      if (_newerState == null) {
        var options = this.options;
        this._newerState = _newerState = new ValueState(this, this.newer, this.preferCloneNewer, options && options.selfAsValueNewer, this.refsNewer);
      }

      return _newerState;
    },
    set: function set(value) {
      this._newerState = value;
    }
  }]);

  return MergeState;
}();

function mergePreferClone(o1, o2) {
  if (o1 || o2) {
    return true;
  }

  return o1 == null ? o2 : o1;
}

var ObjectStatus;

(function (ObjectStatus) {
  ObjectStatus[ObjectStatus["Cloned"] = 1] = "Cloned";
  ObjectStatus[ObjectStatus["Merged"] = 2] = "Merged";
})(ObjectStatus || (ObjectStatus = {}));

var MergerVisitor =
/*#__PURE__*/
function () {
  // public refs: IRef[]
  function MergerVisitor(getMeta) {
    _classCallCheck(this, MergerVisitor);

    this.getMeta = getMeta;
  }

  _createClass(MergerVisitor, [{
    key: "getStatus",
    value: function getStatus(object) {
      var statuses = this.statuses;

      if (!statuses) {
        return null;
      }

      var id = getObjectUniqueId(object);

      if (id == null) {
        throw new Error("object is primitive: " + object);
      }

      return statuses[id];
    }
  }, {
    key: "setStatus",
    value: function setStatus(object, status) {
      var statuses = this.statuses;

      if (!statuses) {
        this.statuses = statuses = [];
      }

      var id = getObjectUniqueId(object);

      if (id == null) {
        throw new Error("object is primitive: " + object);
      }

      statuses[id] = status;
      return object;
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextMerge",
    value: function getNextMerge(preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options) {
      var _this3 = this;

      return function (next_base, next_older, next_newer, next_set, next_preferCloneOlder, next_preferCloneNewer, next_options) {
        return _this3.merge(next_base, next_older, next_newer, next_set, next_preferCloneOlder == null ? preferCloneOlder : next_preferCloneOlder, next_preferCloneNewer == null ? preferCloneNewer : next_preferCloneNewer, next_options, // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        refsBase, refsOlder, refsNewer);
      };
    }
  }, {
    key: "merge",
    value: function merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options, refsBase, refsOlder, refsNewer) {
      var preferCloneBase = null;

      if (base === newer) {
        if (base === older) {
          return false;
        }

        preferCloneBase = preferCloneNewer;
        preferCloneNewer = preferCloneOlder;
        newer = older;
      }

      if (isPrimitive(newer)) {
        if (set) {
          set(newer);
          return true;
        }

        return false;
      }

      if (base === older) {
        preferCloneBase = preferCloneOlder = mergePreferClone(preferCloneBase, preferCloneOlder);
      }

      if (older === newer) {
        preferCloneOlder = preferCloneNewer = mergePreferClone(preferCloneOlder, preferCloneNewer);
      }

      var mergeState = new MergeState(this, base, older, newer, set, preferCloneBase, preferCloneOlder, preferCloneNewer, refsBase, refsOlder, refsNewer, options); // region refs

      if (!isPrimitive(base) && mergeState.baseState.isRef) {
        mergeState.newerState.resolveRef();

        if (mergeState.baseState.target === mergeState.newerState.target) {
          if (!isPrimitive(older)) {
            mergeState.olderState.resolveRef();

            if (mergeState.baseState.target === mergeState.olderState.target) {
              return false;
            }
          }

          mergeState.baseState = mergeState.newerState;
          mergeState.newerState = mergeState.olderState;
          newer = mergeState.newerState.target;
        }

        if (!isPrimitive(older)) {
          mergeState.olderState.resolveRef();

          if (mergeState.baseState.target === mergeState.olderState.target) {
            mergeState.olderState.preferClone = mergePreferClone(mergeState.baseState.preferClone, mergeState.olderState.preferClone);
            mergeState.baseState = mergeState.olderState;
          }

          older = mergeState.olderState.target;
        }

        base = mergeState.baseState.target;
      }

      if (!isPrimitive(older)) {
        mergeState.olderState.resolveRef();
        mergeState.newerState.resolveRef();

        if ((mergeState.olderState.isRef || mergeState.newerState.isRef) && mergeState.olderState.target === mergeState.newerState.target) {
          mergeState.newerState.preferClone = mergePreferClone(mergeState.olderState.preferClone, mergeState.newerState.preferClone);
          mergeState.olderState = mergeState.newerState;
        }

        older = mergeState.olderState.target;
        newer = mergeState.newerState.target;
      } // endregion


      var fillOlderNewer = function fillOlderNewer() {
        switch (mergeState.olderState.canMerge(mergeState.newerState)) {
          case null:
            if (mergeState.olderState.mustBeCloned) {
              set(mergeState.newerState.clone);
            } else {
              if (mergeState.newerState.mustBeCloned) {
                set(mergeState.olderState.target);
              } else {
                set(mergeState.newerState.target);
              }
            }

            break;

          case false:
            set(mergeState.newerState.clone);
            break;

          case true:
            mergeState.fillOlderNewer();
            return true;
        }
      };

      if (isPrimitive(base)) {
        if (set) {
          if (isPrimitive(older) || older === newer) {
            set(mergeState.newerState.clone);
          } else {
            fillOlderNewer();
          }

          return true;
        }

        return false;
      }

      if (!set && mergeState.baseState.mustBeCloned) {
        return false;
      }

      if (isPrimitive(older)) {
        switch (mergeState.baseState.canMerge(mergeState.newerState)) {
          case null:
            if (set) {
              set(older);
              return true;
            }

            break;

          case false:
            if (set) {
              set(mergeState.newerState.clone);
              return true;
            }

            break;

          case true:
            if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
              if (set) {
                set(older);
                return true;
              }

              return false;
            }

            return true;
        }

        return false;
      }

      switch (mergeState.baseState.canMerge(mergeState.newerState)) {
        case false:
          if (set) {
            fillOlderNewer();
            return true;
          }

          return false;

        case null:
          switch (mergeState.baseState.canMerge(mergeState.olderState)) {
            case null:
              return false;

            case false:
              if (set) {
                set(mergeState.olderState.clone);
                return true;
              }

              return false;

            case true:
              return mergeState.mergeWithBase(mergeState.olderState, mergeState.olderState);
          }

          throw new Error('Unreachable code');
      }

      switch (mergeState.baseState.canMerge(mergeState.olderState)) {
        case null:
          return mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState);
        // if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
        // 	if (set) {
        // 		throw new Error('base != newer; base == older; base == newer')
        // 	}
        // 	return false
        // }
        // return true

        case false:
          if (!mergeState.mergeWithBase(mergeState.newerState, mergeState.newerState)) {
            if (set) {
              set(mergeState.olderState.clone);
              return true;
            }

            return false;
          }

          return true;

        case true:
          return mergeState.mergeWithBase(mergeState.olderState, mergeState.newerState);
      }

      throw new Error('Unreachable code');
    }
  }]);

  return MergerVisitor;
}(); // endregion
// region TypeMetaMergerCollection

var TypeMetaMergerCollection =
/*#__PURE__*/
function (_TypeMetaCollection) {
  _inherits(TypeMetaMergerCollection, _TypeMetaCollection);

  function TypeMetaMergerCollection(_temp) {
    var _this4;

    var _ref = _temp === void 0 ? {} : _temp,
        proto = _ref.proto,
        customMeta = _ref.customMeta;

    _classCallCheck(this, TypeMetaMergerCollection);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaMergerCollection).call(this, proto || TypeMetaMergerCollection.default));
    _this4.customMeta = customMeta;
    return _this4;
  }

  _createClass(TypeMetaMergerCollection, [{
    key: "getMeta",
    value: function getMeta(type) {
      return this.customMeta && this.customMeta(type) || _get(_getPrototypeOf(TypeMetaMergerCollection.prototype), "getMeta", this).call(this, type);
    }
  }, {
    key: "putMergeableType",
    value: function putMergeableType(type, meta) {
      return this.putType(type, TypeMetaMergerCollection.makeTypeMetaMerger(type, meta));
    }
  }], [{
    key: "makeTypeMetaMerger",
    value: function makeTypeMetaMerger(type, meta) {
      return _extends({
        valueFactory: function valueFactory() {
          return new type();
        }
      }, meta, {
        merger: _extends({
          canMerge: function canMerge(target, source) {
            return target._canMerge ? target._canMerge(source) : target.constructor === source.constructor;
          },
          merge: function merge(_merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
            return base._merge(_merge, older, newer, preferCloneOlder, preferCloneNewer, options);
          }
        }, meta ? meta.merger : {})
      });
    }
  }]);

  return TypeMetaMergerCollection;
}(TypeMetaCollection);
TypeMetaMergerCollection.default = new TypeMetaMergerCollection();
function registerMergeable(type, meta) {
  TypeMetaMergerCollection.default.putMergeableType(type, meta);
}
function registerMerger(type, meta) {
  TypeMetaMergerCollection.default.putType(type, meta);
}

function createPrimitiveTypeMetaMerger(meta) {
  return _extends({
    preferClone: false
  }, meta, {
    merger: _extends({
      merge: function merge(_merge2, base, older, newer, set) {
        set(newer.valueOf());
        return true;
      }
    }, meta ? meta.merger : {})
  });
}

function registerMergerPrimitive(type, meta) {
  registerMerger(type, createPrimitiveTypeMetaMerger(meta));
} // endregion
// region ObjectMerger

var primitiveTypeMetaMerger = createPrimitiveTypeMetaMerger();
var observableObjectProperties = ['propertyChanged'];
var ObjectMerger =
/*#__PURE__*/
function () {
  function ObjectMerger(typeMeta) {
    var _context;

    _classCallCheck(this, ObjectMerger);

    this.typeMeta = new TypeMetaMergerCollection({
      proto: typeMeta
    });
    this.merge = bind$6(_context = this.merge).call(_context, this);
  }

  _createClass(ObjectMerger, [{
    key: "merge",
    value: function merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      var _this5 = this;

      var merger = new MergerVisitor(function (type) {
        return _this5.typeMeta.getMeta(type);
      });
      var mergedValue = merger.merge(base, older, newer, set, preferCloneOlder, preferCloneNewer, options);
      return mergedValue;
    }
  }]);

  return ObjectMerger;
}(); // endregion
// region Primitive Mergers
// Handled in MergerVisitor:

ObjectMerger.default = new ObjectMerger();
ObjectMerger.observableOnly = new ObjectMerger(new TypeMetaMergerCollection({
  customMeta: function customMeta(type) {
    var prototype = type.prototype;

    for (var i = 0, len = observableObjectProperties.length; i < len; i++) {
      if (Object.prototype.hasOwnProperty.call(prototype, observableObjectProperties[i])) {
        return primitiveTypeMetaMerger;
      }
    }

    return null;
  }
}));

function isPrimitive(value) {
  return !canHaveUniqueId(value) || typeof value === 'function'; // value == null
  // || typeof value === 'number'
  // || typeof value === 'boolean'
}

registerMerger(String, {
  merger: {
    canMerge: function canMerge(target, source) {
      target = target.valueOf();
      source = source.valueOf();

      if (typeof source !== 'string') {
        return false;
      }

      if (target === source) {
        return null;
      }

      return true;
    },
    merge: function merge(_merge3, base, older, newer, set) {
      // base = base.valueOf()
      // older = older.valueOf()
      // newer = newer.valueOf()
      // if (base === newer) {
      // 	if (base === older) {
      // 		return false
      // 	}
      // 	set(older)
      // 	return true
      // }
      set(newer.valueOf());
      return true;
    }
  },
  preferClone: false
});
registerMergerPrimitive(Number);
registerMergerPrimitive(Boolean);
registerMergerPrimitive(Array);
registerMergerPrimitive(Error); // endregion
// region Array
// @ts-ignore
// registerMerger<any[], any[]>(Array, {
// 	merger: {
// 		canMerge(target: any[], source: any[]): boolean {
// 			return Array.isArray(source)
// 		},
// 		merge(
// 			merge: IMergeValue,
// 			base: any[],
// 			older: any[],
// 			newer: any[],
// 			set?: (value: any[]) => void,
// 			preferCloneOlder?: boolean,
// 			preferCloneNewer?: boolean,
// 			options?: IMergeOptions,
// 		): boolean {
// 			let changed = false
// 			const lenBase = base.length
// 			const lenOlder = older.length
// 			const lenNewer = newer.length
// 			for (let i = 0; i < lenNewer; i++) {
// 				if (i < lenBase) {
// 					if (i < lenOlder) {
// 						changed = merge(base[i], older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 							|| changed
// 					} else {
// 						changed = merge(base[i], newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 							|| changed
// 					}
// 				} else if (i < lenOlder) {
// 					changed = merge(EMPTY, older[i], newer[i], o => base[i] = o, preferCloneOlder, preferCloneNewer)
// 						|| changed
// 				} else {
// 					changed = merge(EMPTY, newer[i], newer[i], o => base[i] = o, preferCloneNewer, preferCloneNewer)
// 						|| changed
// 				}
// 			}
// 		},
// 	},
// 	preferClone: o => Array.isFrozen(o) ? true : null,
// })
// endregion
// region Object

registerMerger(Object, {
  merger: {
    canMerge: function canMerge(target, source) {
      return source.constructor === Object;
    },
    merge: function merge(_merge4, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(createMergeMapWrapper, _merge4, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  },
  preferClone: function preferClone(o) {
    return isFrozen$2(o) ? true : null;
  }
}); // endregion
// region Date

registerMerger(Date, {
  merger: {
    canMerge: function canMerge(target, source) {
      if (source.constructor !== Date) {
        return false;
      }

      return target.getTime() === source.getTime() ? null : false;
    }
  },
  valueFactory: function valueFactory(source) {
    return new Date(source);
  }
}); // endregion
// region Set

registerMerger(set$4, {
  merger: {
    canMerge: function canMerge(target, source) {
      return source.constructor === Object || source[toStringTag$2] === 'Set' || isArray$3(source) || isIterable$2(source);
    },
    merge: function merge(_merge5, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
          return fillSet(new set$4(), arrayOrIterable);
        });
      }, _merge5, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  } // valueFactory: (source: Set<any>) => new Set(source),

}); // endregion
// region Map

registerMerger(map$7, {
  merger: {
    // tslint:disable-next-line:no-identical-functions
    canMerge: function canMerge(target, source) {
      return source.constructor === Object || source[toStringTag$2] === 'Map' || isArray$3(source) || isIterable$2(source);
    },
    merge: function merge(_merge6, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new map$7(), arrayOrIterable);
        });
      }, _merge6, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  } // valueFactory: (source: Map<any, any>) => new Map(source),

}); // endregion

var _marked =
/*#__PURE__*/
regenerator.mark(deSerializeIterableOrdered);

var SerializerVisitor =
/*#__PURE__*/
function () {
  function SerializerVisitor(typeMeta) {
    var _context;

    _classCallCheck(this, SerializerVisitor);

    this._typeMeta = typeMeta;
    this.serialize = bind$6(_context = this.serialize).call(_context, this);
  }

  _createClass(SerializerVisitor, [{
    key: "addType",
    value: function addType(uuid) {
      // tslint:disable-next-line:prefer-const
      var types = this.types,
          typesMap = this.typesMap;

      if (!typesMap) {
        this.typesMap = typesMap = {};
        this.types = types = [];
      }

      var typeIndex = typesMap[uuid];

      if (typeIndex == null) {
        typeIndex = types.length;
        types[typeIndex] = uuid;
        typesMap[uuid] = typeIndex;
      }

      return typeIndex;
    }
  }, {
    key: "addObject",
    value: function addObject(object, serialize) {
      // tslint:disable-next-line:prefer-const
      var objects = this.objects,
          objectsMap = this.objectsMap;

      if (!objectsMap) {
        this.objectsMap = objectsMap = [];
        this.objects = objects = [];
      }

      var id = getObjectUniqueId(object);
      var ref = objectsMap[id];

      if (ref == null) {
        var index = objects.length;
        ref = {
          id: index
        };
        objectsMap[id] = ref;
        var data = {};
        objects[index] = data;
        serialize(data);
      }

      return ref;
    }
  }, {
    key: "serializeObject",
    value: function serializeObject(out, value, options) {
      var meta = this._typeMeta.getMeta(options && options.valueType || value.constructor);

      if (!meta) {
        throw new Error("Class (" + value.constructor.name + ") have no type meta");
      }

      var uuid = meta.uuid;

      if (!uuid) {
        throw new Error("Class (" + value.constructor.name + ") type meta have no uuid");
      }

      var serializer = meta.serializer;

      if (!serializer) {
        throw new Error("Class (" + value.constructor.name + ") type meta have no serializer");
      }

      if (!serializer.serialize) {
        throw new Error("Class (" + value.constructor.name + ") serializer have no serialize method");
      }

      out.type = this.addType(uuid);
      out.data = serializer.serialize(this.getNextSerialize(options), value, options);
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextSerialize",
    value: function getNextSerialize(options) {
      var _this = this;

      return function (next_value, next_options) {
        return _this.serialize(next_value, next_options // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        );
      };
    }
  }, {
    key: "serialize",
    value: function serialize(value, options) {
      var _this2 = this;

      if (value == null || typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') {
        return value;
      }

      return this.addObject(value, function (out) {
        _this2.serializeObject(out, value, options);
      });
    }
  }]);

  return SerializerVisitor;
}(); // tslint:disable-next-line:no-shadowed-variable no-empty

var LOCKED = function LOCKED() {};

var DeSerializerVisitor =
/*#__PURE__*/
function () {
  function DeSerializerVisitor(typeMeta, types, objects) {
    var _context2;

    _classCallCheck(this, DeSerializerVisitor);

    this._countDeserialized = 0;
    this._typeMeta = typeMeta;
    this._types = types;
    this._objects = objects;
    var len = objects.length;
    var instances = new Array(len);

    for (var i = 0; i < len; i++) {
      instances[i] = null;
    }

    this._instances = instances;
    this.deSerialize = bind$6(_context2 = this.deSerialize).call(_context2, this);
  }

  _createClass(DeSerializerVisitor, [{
    key: "assertEnd",
    value: function assertEnd() {
      var _types = this._types,
          _objects = this._objects,
          _instances = this._instances,
          _typeMeta = this._typeMeta;

      var getDebugObject = function getDebugObject(deserialized, id) {
        var object = _objects[id];
        var uuid = _types[object.type];

        var type = _typeMeta.getType(uuid); // noinspection HtmlUnknownTag


        return {
          type: type == null ? "<Type not found: " + uuid + ">" : type.name,
          data: object.data,
          deserialized: deserialized == null ? deserialized : deserialized.constructor.name
        };
      };

      if (this._countDeserialized !== _instances.length) {
        var _context3, _context4;

        throw new Error(_instances.length - this._countDeserialized + " instances is not deserialized\r\n" + stringify$2(map$2(_context3 = filter$2(_context4 = map$2(_instances).call(_instances, function (o, i) {
          return [o, i];
        })).call(_context4, function (o) {
          return !o[0] || o[0] === LOCKED || ThenableSync.isThenable(o[0]);
        })).call(_context3, function (o) {
          return getDebugObject(o[0], o[1]);
        })));
      }
    } // noinspection JSUnusedLocalSymbols

  }, {
    key: "getNextDeSerialize",
    value: function getNextDeSerialize(options) {
      var _this3 = this;

      return function (next_serializedValue, next_onfulfilled, next_options) {
        return _this3.deSerialize(next_serializedValue, next_onfulfilled, next_options // next_options == null || next_options === options
        // 	? options
        // 	: (options == null ? next_options : {
        // 		...options,
        // 		...next_options,
        // 	}),
        );
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(serializedValue, _onfulfilled, options) {
      var _this4 = this;

      if (_onfulfilled) {
        var input_onfulfilled = _onfulfilled;

        _onfulfilled = function onfulfilled(value) {
          var result = input_onfulfilled(value);
          _onfulfilled = null;
          return result;
        };
      }

      if (serializedValue == null || typeof serializedValue === 'number' || typeof serializedValue === 'string' || typeof serializedValue === 'boolean') {
        if (_onfulfilled) {
          return ThenableSync.resolve(_onfulfilled(serializedValue));
        }

        return serializedValue;
      }

      var id = serializedValue.id;

      if (id != null) {
        var cachedInstance = this._instances[id];

        if (cachedInstance) {
          if (cachedInstance === LOCKED) {
            this._instances[id] = cachedInstance = new ThenableSync();
          }

          if (_onfulfilled) {
            if (cachedInstance instanceof ThenableSync) {
              cachedInstance.thenLast(_onfulfilled);
            } else {
              return ThenableSync.resolve(_onfulfilled(cachedInstance));
            }
          }

          return cachedInstance;
        }

        this._instances[id] = LOCKED;
        serializedValue = this._objects[id];
      }

      var type = options && options.valueType;

      if (!type) {
        var typeIndex = serializedValue.type;

        if (typeof typeIndex !== 'number') {
          throw new Error("Serialized value have no type field: " + stringify$2(serializedValue, null, 4));
        }

        var uuid = this._types[typeIndex];

        if (typeof uuid !== 'string') {
          throw new Error("type uuid not found for index (" + typeIndex + "): " + stringify$2(serializedValue, null, 4));
        }

        type = this._typeMeta.getType(uuid);

        if (!type) {
          throw new Error("type not found for uuid (" + uuid + "): " + stringify$2(serializedValue, null, 4));
        }
      }

      var meta = this._typeMeta.getMeta(type);

      if (!meta) {
        throw new Error("Class (" + typeToDebugString(type) + ") have no type meta");
      }

      var serializer = meta.serializer;

      if (!serializer) {
        throw new Error("Class (" + typeToDebugString(type) + ") type meta have no serializer");
      }

      if (!serializer.deSerialize) {
        throw new Error("Class (" + typeToDebugString(type) + ") serializer have no deSerialize method");
      }

      var factory = options && options.valueFactory || meta.valueFactory || function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _construct(type, args);
      };

      if (id != null && !factory) {
        throw new Error("valueFactory not found for " + typeToDebugString(type) + ". " + 'Any object serializers should have valueFactory');
      }

      var instance;
      var iteratorOrValue = serializer.deSerialize(this.getNextDeSerialize(options), serializedValue.data, function () {
        if (!factory) {
          throw new Error('Multiple call valueFactory is forbidden');
        }

        instance = factory.apply(void 0, arguments);
        factory = null;
        return instance;
      }, options);

      var resolveInstance = function resolveInstance(value) {
        var cachedInstance = _this4._instances[id];
        _this4._instances[id] = value;

        if (cachedInstance instanceof ThenableSync) {
          cachedInstance.resolve(value);
        }
      };

      var resolveValue = function resolveValue(value) {
        if (id != null) {
          if (!factory && instance !== value) {
            throw new Error("valueFactory instance !== return value in serializer for " + typeToDebugString(type));
          }

          resolveInstance(value);
          _this4._countDeserialized++;
        }

        if (_onfulfilled) {
          return ThenableSync.resolve(_onfulfilled(value));
        }

        return value;
      };

      var valueOrThenFunc = ThenableSync.resolve(iteratorOrValue, resolveValue);

      if (id != null && !factory && ThenableSync.isThenable(valueOrThenFunc)) {
        resolveInstance(instance);

        if (_onfulfilled) {
          return ThenableSync.resolve(_onfulfilled(instance));
        }

        return instance;
      }

      return valueOrThenFunc;
    }
  }]);

  return DeSerializerVisitor;
}(); // endregion
// region TypeMetaSerializerCollection

var TypeMetaSerializerCollection =
/*#__PURE__*/
function (_TypeMetaCollectionWi) {
  _inherits(TypeMetaSerializerCollection, _TypeMetaCollectionWi);

  function TypeMetaSerializerCollection(proto) {
    _classCallCheck(this, TypeMetaSerializerCollection);

    return _possibleConstructorReturn(this, _getPrototypeOf(TypeMetaSerializerCollection).call(this, proto || TypeMetaSerializerCollection.default));
  }

  _createClass(TypeMetaSerializerCollection, [{
    key: "putSerializableType",
    value: function putSerializableType(type, meta) {
      return this.putType(type, TypeMetaSerializerCollection.makeTypeMetaSerializer(type, meta));
    }
  }], [{
    key: "makeTypeMetaSerializer",
    value: function makeTypeMetaSerializer(type, meta) {
      return _extends({
        uuid: type.uuid
      }, meta, {
        serializer: _extends({
          serialize: function serialize(_serialize, value, options) {
            return value.serialize(_serialize, options);
          },
          deSerialize:
          /*#__PURE__*/
          regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory, options) {
            var value;
            return regenerator.wrap(function deSerialize$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    value = valueFactory();
                    _context5.next = 3;
                    return value.deSerialize(_deSerialize, serializedValue, options);

                  case 3:
                    return _context5.abrupt("return", value);

                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }
            }, deSerialize);
          })
        }, meta ? meta.serializer : {})
      });
    }
  }]);

  return TypeMetaSerializerCollection;
}(TypeMetaCollectionWithId);
TypeMetaSerializerCollection.default = new TypeMetaSerializerCollection();
function registerSerializable(type, meta) {
  TypeMetaSerializerCollection.default.putSerializableType(type, meta);
}
function registerSerializer(type, meta) {
  TypeMetaSerializerCollection.default.putType(type, meta);
} // endregion
// region ObjectSerializer

var ObjectSerializer =
/*#__PURE__*/
function () {
  function ObjectSerializer(typeMeta) {
    _classCallCheck(this, ObjectSerializer);

    this.typeMeta = new TypeMetaSerializerCollection(typeMeta);
  }

  _createClass(ObjectSerializer, [{
    key: "serialize",
    value: function serialize(value, options) {
      var serializer = new SerializerVisitor(this.typeMeta);
      var serializedValue = serializer.serialize(value, options);

      if (!serializedValue || typeof serializedValue !== 'object') {
        return serializedValue;
      }

      var serializedData = {
        data: serializedValue
      };

      if (serializer.types) {
        serializedData.types = serializer.types;
      }

      if (serializer.objects) {
        serializedData.objects = serializer.objects;
      }

      return serializedData;
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(serializedValue, options) {
      if (!serializedValue || typeof serializedValue !== 'object') {
        return serializedValue;
      }

      var types = serializedValue.types,
          objects = serializedValue.objects,
          data = serializedValue.data;

      if (!isArray$3(types)) {
        throw new Error("serialized value types field is not array: " + types);
      }

      var deSerializer = new DeSerializerVisitor(this.typeMeta, types, objects);
      var value = deSerializer.deSerialize(data, null, options);
      deSerializer.assertEnd();
      return value;
    }
  }]);

  return ObjectSerializer;
}(); // endregion
// region Primitive Serializers
// Handled in SerializerVisitor:
// undefined
// null
// number
// string
// boolean
// region Helpers

ObjectSerializer.default = new ObjectSerializer();
function serializeArray(serialize, value, length) {
  if (length == null) {
    length = value.length;
  }

  var serializedValue = [];

  for (var i = 0; i < length; i++) {
    serializedValue[i] = serialize(value[i]);
  }

  return serializedValue;
}
function deSerializeArray(deSerialize, serializedValue, value) {
  var _loop = function _loop(i, _len2) {
    var index = i;

    if (ThenableSync.isThenable(deSerialize(serializedValue[index], function (o) {
      value[index] = o;
    }))) {
      value[index] = null;
    }
  };

  for (var i = 0, _len2 = serializedValue.length; i < _len2; i++) {
    _loop(i);
  }

  return value;
}
function serializeIterable(serialize, value) {
  var serializedValue = [];

  for (var _iterator = value, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var item = _ref;
    serializedValue.push(serialize(item));
  }

  return serializedValue;
}
function deSerializeIterableOrdered(serializedValue, add) {
  var i, _len3;

  return regenerator.wrap(function deSerializeIterableOrdered$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          i = 0, _len3 = serializedValue.length;

        case 1:
          if (!(i < _len3)) {
            _context6.next = 7;
            break;
          }

          _context6.next = 4;
          return add(serializedValue[i]);

        case 4:
          i++;
          _context6.next = 1;
          break;

        case 7:
        case "end":
          return _context6.stop();
      }
    }
  }, _marked);
}
// region Object

function serializeObject(serialize, value, options) {
  var keepUndefined = options && options.objectKeepUndefined;
  var serializedValue = {};

  for (var key in value) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      var item = value[key];

      if (keepUndefined || typeof item !== 'undefined') {
        serializedValue[key] = serialize(item);
      }
    }
  }

  return serializedValue;
}
function deSerializeObject(deSerialize, serializedValue, value) {
  var _loop2 = function _loop2(key) {
    if (Object.prototype.hasOwnProperty.call(serializedValue, key)) {
      // tslint:disable-next-line:no-collapsible-if
      if (ThenableSync.isThenable(deSerialize(serializedValue[key], function (o) {
        value[key] = o;
      }))) {
        value[key] = null;
      }
    }
  };

  for (var key in serializedValue) {
    _loop2(key);
  }

  return value;
} // noinspection SpellCheckingInspection

registerSerializer(Object, {
  uuid: '88968a59178c4e73a99f801e8cdfc37d',
  serializer: {
    serialize: function serialize(_serialize2, value, options) {
      return serializeObject(_serialize2, value, options);
    },
    deSerialize: function (_deSerialize2) {
      function deSerialize(_x, _x2, _x3) {
        return _deSerialize2.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize2.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      var value = valueFactory();
      return deSerializeObject(deSerialize, serializedValue, value);
    })
  },
  valueFactory: function valueFactory() {
    return {};
  }
}); // endregion
// region Primitive as object

function serializePrimitiveAsObject(serialize, object) {
  var value = object.valueOf();

  if (value === object) {
    throw new Error("value is not primitive as object: " + (value && value.constructor.name));
  }

  return value; // return {
  // 	value: serialize(value),
  // 	object: serializeObject(serialize, object, options) as any,
  // }
}
function deSerializePrimitiveAsObject(deSerialize, serializedValue, valueFactory) {
  var object = valueFactory(serializedValue); // deSerializeObject(deSerialize, serializedValue.object as any, object)

  return object;
}
var primitiveAsObjectSerializer = {
  serialize: serializePrimitiveAsObject,
  deSerialize: deSerializePrimitiveAsObject
}; // @ts-ignore
// noinspection SpellCheckingInspection

registerSerializer(String, {
  uuid: '96104fd7d6f84a32b8f2feaa4f3666d8',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Number, {
  uuid: 'dea0de4018014025b6a4b6f6c7a4fa11',
  serializer: primitiveAsObjectSerializer
}); // @ts-ignore

registerSerializer(Boolean, {
  uuid: 'e8d1ac82a0fa4431a23e3d8f954f736f',
  serializer: primitiveAsObjectSerializer
}); // endregion
// region Array

registerSerializer(Array, {
  uuid: 'f8c84ed084634f45b14a228967dfb0de',
  serializer: {
    serialize: function serialize(_serialize3, value, options) {
      if (options && options.arrayAsObject) {
        return serializeObject(_serialize3, value, options);
      }

      return serializeArray(_serialize3, value, options && options.arrayLength);
    },
    deSerialize: function (_deSerialize3) {
      function deSerialize(_x4, _x5, _x6, _x7) {
        return _deSerialize3.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize3.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory, options) {
      var value = valueFactory();

      if (options && options.arrayAsObject) {
        return deSerializeObject(deSerialize, serializedValue, value);
      }

      return deSerializeArray(deSerialize, serializedValue, value);
    })
  },
  valueFactory: function valueFactory() {
    return [];
  }
}); // endregion
// region Set

registerSerializer(set$4, {
  uuid: '17b11d99ce034349969e4f9291d0778c',
  serializer: {
    serialize: function serialize(_serialize4, value) {
      return serializeIterable(_serialize4, value);
    },
    deSerialize: function (_deSerialize4) {
      var _marked2 =
      /*#__PURE__*/
      regenerator.mark(deSerialize);

      function deSerialize(_x8, _x9, _x10) {
        var _args3 = arguments;
        return regenerator.wrap(function deSerialize$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                return _context7.delegateYield(_deSerialize4.apply(this, _args3), "t0", 1);

              case 1:
                return _context7.abrupt("return", _context7.t0);

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _marked2, this);
      }

      deSerialize.toString = function () {
        return _deSerialize4.toString();
      };

      return deSerialize;
    }(
    /*#__PURE__*/
    regenerator.mark(function _callee(deSerialize, serializedValue, valueFactory) {
      var value;
      return regenerator.wrap(function _callee$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              value = valueFactory();
              _context8.next = 3;
              return deSerializeIterableOrdered(serializedValue, function (o) {
                return deSerialize(o, function (val) {
                  value.add(val);
                });
              });

            case 3:
              return _context8.abrupt("return", value);

            case 4:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee);
    }))
  } // valueFactory: () => new Set(),

}); // endregion
// region Map

registerSerializer(map$7, {
  uuid: 'fdf40f2159b74cb2804f3d18ebb19b57',
  serializer: {
    serialize: function serialize(_serialize5, value) {
      return serializeIterable(function (item) {
        return [_serialize5(item[0]), _serialize5(item[1])];
      }, value);
    },
    deSerialize: function (_deSerialize5) {
      var _marked3 =
      /*#__PURE__*/
      regenerator.mark(deSerialize);

      function deSerialize(_x11, _x12, _x13) {
        var _args5 = arguments;
        return regenerator.wrap(function deSerialize$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                return _context9.delegateYield(_deSerialize5.apply(this, _args5), "t0", 1);

              case 1:
                return _context9.abrupt("return", _context9.t0);

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _marked3, this);
      }

      deSerialize.toString = function () {
        return _deSerialize5.toString();
      };

      return deSerialize;
    }(
    /*#__PURE__*/
    regenerator.mark(function _callee2(deSerialize, serializedValue, valueFactory) {
      var value;
      return regenerator.wrap(function _callee2$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              value = valueFactory();
              _context10.next = 3;
              return deSerializeIterableOrdered(serializedValue, function (item) {
                return deSerialize(item[0], function (key) {
                  return deSerialize(item[1], function (val) {
                    value.set(key, val);
                  });
                });
              });

            case 3:
              return _context10.abrupt("return", value);

            case 4:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee2);
    }))
  } // valueFactory: () => new Map(),

}); // endregion
// region Date

registerSerializer(Date, {
  uuid: '7a6c01dba6b84822a9a586e4d3a4460b',
  serializer: {
    serialize: function serialize(_serialize6, value) {
      return value.getTime();
    },
    deSerialize: function (_deSerialize6) {
      function deSerialize(_x14, _x15, _x16) {
        return _deSerialize6.apply(this, arguments);
      }

      deSerialize.toString = function () {
        return _deSerialize6.toString();
      };

      return deSerialize;
    }(function (deSerialize, serializedValue, valueFactory) {
      return valueFactory(serializedValue);
    })
  } // valueFactory: (value: number|string|Date) => new Date(value),

}); // endregion
// endregion

var ObservableObject =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(ObservableObject, _ObservableClass);

  function ObservableObject() {
    _classCallCheck(this, ObservableObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(ObservableObject).apply(this, arguments));
  }

  return ObservableObject;
}(ObservableClass);
registerMerger(ObservableObject, {
  merger: {
    canMerge: function canMerge(target, source) {
      return source instanceof Object;
    },
    merge: function merge(_merge, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return new MergeObjectWrapper(source);
      }, _merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  },
  preferClone: function preferClone(o) {
    return isFrozen$2(o) ? true : null;
  }
});
registerSerializer(ObservableObject, {
  uuid: '1380d053394748e58406c1c0e62a2be9',
  serializer: {
    serialize: function serialize(_serialize, value, options) {
      return serializeObject(_serialize, value, options);
    },
    deSerialize: function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var value = valueFactory();
      return deSerializeObject(_deSerialize, serializedValue, value);
    }
  },
  valueFactory: function valueFactory() {
    return new ObservableObject();
  }
});

var CalcStat =
/*#__PURE__*/
function () {
  function CalcStat() {
    _classCallCheck(this, CalcStat);

    this.count = 0;
    this.sum = 0;
    this.sumSqr = 0;
  }

  _createClass(CalcStat, [{
    key: "add",
    value: function add(value) {
      this.count++;
      this.sum += value;
      this.sumSqr += value * value;
    }
  }, {
    key: "toString",
    value: function toString() {
      return this.count ? round(this.sum) + " | " + round(this.average) + " \xB1" + round(this.range) : '-';
    }
  }, {
    key: "average",
    get: function get() {
      return this.sum / this.count;
    }
  }, {
    key: "dispersion",
    get: function get() {
      var count = this.count,
          sum = this.sum;
      return this.sumSqr / count - sum * sum / (count * count);
    }
  }, {
    key: "standardDeviation",
    get: function get() {
      return Math.sqrt(this.dispersion);
    } // value is in the: average ± range

  }, {
    key: "range",
    get: function get() {
      return 2.5 * this.standardDeviation;
    }
  }]);

  return CalcStat;
}();

function round(value) {
  return +value.toPrecision(3);
}

/* tslint:disable:no-shadowed-variable */
var now$3;

if (typeof performance !== 'undefined' && performance.now) {
  var _context$1;

  now$3 = bind$6(_context$1 = performance.now).call(_context$1, performance);
} else {
  var start$1 = process.hrtime();

  now$3 = function now() {
    var end = process.hrtime(start$1);
    return end[0] * 1000 + end[1] / 1000000;
  };
}

var VALUE_PROPERTY_DEFAULT = '';

var Debugger =
/*#__PURE__*/
function () {
  function Debugger() {
    _classCallCheck(this, Debugger);

    this._dependencySubject = new Subject();
    this._connectorSubject = new Subject();
    this._invalidatedSubject = new Subject();
    this._calculatedSubject = new Subject();
    this._deepSubscribeSubject = new Subject();
    this._deepSubscribeLastValueSubject = new Subject();
    this._errorSubject = new Subject();
  } // region onDependencyChanged


  _createClass(Debugger, [{
    key: "onDependencyChanged",
    value: function onDependencyChanged(target, value, parent, key, keyType) {
      if (this._dependencySubject.hasSubscribers) {
        this._dependencySubject.emit({
          target: target,
          value: value,
          parent: parent,
          key: key,
          keyType: keyType
        });
      }
    } // endregion
    // region onConnectorChanged

  }, {
    key: "onConnectorChanged",
    value: function onConnectorChanged(target, targetKey, value, parent, key, keyType) {
      if (this._connectorSubject.hasSubscribers) {
        this._connectorSubject.emit({
          target: target,
          targetKey: targetKey,
          value: value,
          parent: parent,
          key: key,
          keyType: keyType
        });
      }
    } // endregion
    // region onInvalidated

  }, {
    key: "onInvalidated",
    value: function onInvalidated(target, value) {
      if (this._invalidatedSubject.hasSubscribers) {
        this._invalidatedSubject.emit({
          target: target,
          value: value
        });
      }
    } // endregion
    // region onCalculated

  }, {
    key: "onCalculated",
    value: function onCalculated(target, oldValue, newValue) {
      if (this._calculatedSubject.hasSubscribers) {
        this._calculatedSubject.emit({
          target: target,
          newValue: newValue,
          oldValue: oldValue
        });
      }
    } // endregion
    // region onDeepSubscribe

  }, {
    key: "onDeepSubscribe",
    value: function onDeepSubscribe(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule, oldIsLeaf, newIsLeaf, target) {
      if (this._deepSubscribeSubject.hasSubscribers) {
        this._deepSubscribeSubject.emit({
          key: key,
          oldValue: oldValue,
          newValue: newValue,
          parent: parent,
          changeType: changeType,
          keyType: keyType,
          propertiesPath: propertiesPath,
          rule: rule,
          oldIsLeaf: oldIsLeaf,
          newIsLeaf: newIsLeaf,
          target: target
        });
      }
    } // endregion
    // region onDeepSubscribeLastValue

  }, {
    key: "onDeepSubscribeLastValue",
    value: function onDeepSubscribeLastValue(unsubscribedValue, subscribedValue, target) {
      if (this._deepSubscribeLastValueSubject.hasSubscribers) {
        this._deepSubscribeLastValueSubject.emit({
          unsubscribedValue: unsubscribedValue,
          subscribedValue: subscribedValue,
          target: target
        });
      }
    } // endregion
    // region onError

  }, {
    key: "onError",
    value: function onError(target, newValue, oldValue, err) {
      if (this._errorSubject.hasSubscribers) {
        this._errorSubject.emit({
          target: target,
          newValue: newValue,
          oldValue: oldValue,
          error: err
        });
      }
    } // endregion

  }, {
    key: "dependencyObservable",
    get: function get() {
      return this._dependencySubject;
    }
  }, {
    key: "connectorObservable",
    get: function get() {
      return this._connectorSubject;
    }
  }, {
    key: "invalidatedObservable",
    get: function get() {
      return this._invalidatedSubject;
    }
  }, {
    key: "calculatedObservable",
    get: function get() {
      return this._calculatedSubject;
    }
  }, {
    key: "deepSubscribeObservable",
    get: function get() {
      return this._deepSubscribeSubject;
    }
  }, {
    key: "deepSubscribeLastValueHasSubscribers",
    get: function get() {
      return this._deepSubscribeLastValueSubject.hasSubscribers;
    }
  }, {
    key: "deepSubscribeLastValueObservable",
    get: function get() {
      return this._deepSubscribeLastValueSubject;
    }
  }, {
    key: "errorObservable",
    get: function get() {
      return this._errorSubject;
    }
  }]);

  return Debugger;
}();
Debugger.Instance = new Debugger();

var timingDefault = {
  now: now$2,
  setTimeout: typeof window === 'undefined' ? setTimeout$2 : bind$6(setTimeout$2).call(setTimeout$2, window),
  clearTimeout: typeof window === 'undefined' ? clearTimeout : bind$6(clearTimeout).call(clearTimeout, window)
};

var DeferredCalc =
/*#__PURE__*/
function () {
  function DeferredCalc(canBeCalcCallback, calcFunc, calcCompletedCallback, options) {
    _classCallCheck(this, DeferredCalc);

    this._canBeCalcCallback = canBeCalcCallback;
    this._calcFunc = calcFunc;
    this._calcCompletedCallback = calcCompletedCallback;
    this._options = options || {};
    this._timing = this._options.timing || timingDefault;
    this.invalidate();
  } // region Properties
  // region minTimeBetweenCalc


  _createClass(DeferredCalc, [{
    key: "_calc",
    // endregion
    // endregion
    // region Private methods
    value: function _calc() {
      var _this = this;

      this._timeInvalidateFirst = null;
      this._timeInvalidateLast = null;
      this._canBeCalcEmitted = false;
      this._calcRequested = false;
      this._timeCalcStart = this._timing.now();
      this._timeCalcEnd = null;

      this._pulse();

      this._calcFunc.call(this, function () {
        _this._timeCalcEnd = _this._timing.now();

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this._calcCompletedCallback.apply(_this, args);

        _this._pulse();
      });
    }
  }, {
    key: "_canBeCalc",
    value: function _canBeCalc() {
      this._canBeCalcEmitted = true;

      this._canBeCalcCallback.call(this);
    }
  }, {
    key: "_getNextCalcTime",
    value: function _getNextCalcTime() {
      var _this$_options = this._options,
          throttleTime = _this$_options.throttleTime,
          maxThrottleTime = _this$_options.maxThrottleTime,
          minTimeBetweenCalc = _this$_options.minTimeBetweenCalc;
      var nextCalcTime = this._timeInvalidateLast + (throttleTime || 0);

      if (maxThrottleTime != null) {
        nextCalcTime = Math.min(nextCalcTime, this._timeInvalidateFirst + (maxThrottleTime || 0));
      }

      if (this._timeCalcEnd) {
        nextCalcTime = Math.max(nextCalcTime, this._timeCalcEnd + (minTimeBetweenCalc || 0));
      }

      return nextCalcTime;
    }
  }, {
    key: "_pulse",
    value: function _pulse() {
      var _this2 = this;

      // region Timer
      var _timing = this._timing;

      var now = _timing.now();

      var timeNextPulse = this._timeNextPulse;

      if (timeNextPulse == null) {
        timeNextPulse = now;
      } else if (timeNextPulse <= now) {
        this._timerId = null;
      } // endregion
      // region Auto invalidate


      var autoInvalidateInterval = this._options.autoInvalidateInterval;

      if (autoInvalidateInterval != null) {
        var autoInvalidateTime = Math.max((this._timeCalcStart || 0) + autoInvalidateInterval, (this._timeInvalidateLast || 0) + autoInvalidateInterval, now);

        if (autoInvalidateTime <= now) {
          this._invalidate();
        } else if (timeNextPulse <= now || autoInvalidateTime < timeNextPulse) {
          timeNextPulse = autoInvalidateTime;
        }
      } // endregion
      // region Can be calc


      if (!this._canBeCalcEmitted && !this._calcRequested && this._timeInvalidateLast && (this._timeCalcEnd || !this._timeCalcStart)) {
        var canBeCalcTime = this._getNextCalcTime();

        if (canBeCalcTime <= now) {
          this._canBeCalc();

          this._pulse();

          return;
        } else if (timeNextPulse <= now || canBeCalcTime < timeNextPulse) {
          timeNextPulse = canBeCalcTime;
        }
      } // endregion
      // region Calc


      if (this._calcRequested && (this._timeCalcEnd || !this._timeCalcStart)) {
        var calcTime = this._getNextCalcTime();

        if (calcTime <= now) {
          this._calc();

          return;
        } else if (timeNextPulse <= now || calcTime < timeNextPulse) {
          timeNextPulse = calcTime;
        }
      } // endregion
      // region Timer


      if (timeNextPulse > now && timeNextPulse !== this._timeNextPulse) {
        var timerId = this._timerId;

        if (timerId != null) {
          _timing.clearTimeout(timerId);
        }

        this._timeNextPulse = timeNextPulse;
        this._timerId = _timing.setTimeout(function () {
          _this2._pulse();
        }, timeNextPulse - now);
      } // endregion

    }
  }, {
    key: "_invalidate",
    value: function _invalidate() {
      var now = this._timing.now();

      if (this._timeInvalidateFirst == null) {
        this._timeInvalidateFirst = now;
      }

      this._timeInvalidateLast = now;
    } // endregion
    // region Public methods

  }, {
    key: "invalidate",
    value: function invalidate() {
      this._invalidate();

      this._pulse();
    }
  }, {
    key: "calc",
    value: function calc() {
      if (!this._calcRequested && this._canBeCalcEmitted) {
        this._calcRequested = true;

        this._pulse();
      }
    }
  }, {
    key: "reCalc",
    value: function reCalc() {
      this._calcRequested = true;

      this._pulse();
    } // endregion

  }, {
    key: "minTimeBetweenCalc",
    get: function get() {
      return this._options.minTimeBetweenCalc;
    },
    set: function set(value) {
      if (this._options.minTimeBetweenCalc === value) {
        return;
      }

      this._options.minTimeBetweenCalc = value;

      this._pulse();
    } // endregion
    // region throttleTime

  }, {
    key: "throttleTime",
    get: function get() {
      return this._options.throttleTime;
    },
    set: function set(value) {
      if (this._options.throttleTime === value) {
        return;
      }

      this._options.throttleTime = value;

      this._pulse();
    } // endregion
    // region maxThrottleTime

  }, {
    key: "maxThrottleTime",
    get: function get() {
      return this._options.maxThrottleTime;
    },
    set: function set(value) {
      if (this._options.maxThrottleTime === value) {
        return;
      }

      this._options.maxThrottleTime = value;

      this._pulse();
    } // endregion
    // region autoInvalidateInterval

  }, {
    key: "autoInvalidateInterval",
    get: function get() {
      return this._options.autoInvalidateInterval;
    },
    set: function set(value) {
      if (this._options.autoInvalidateInterval === value) {
        return;
      }

      this._options.autoInvalidateInterval = value;

      this._pulse();
    }
  }]);

  return DeferredCalc;
}();

// Is slower than simple object
// export class PropertyChangedEvent<TValue> implements IPropertyChangedEvent {
// 	public name: string
// 	public oldValue: TValue
// 	public newValue: TValue
//
// 	constructor(name, oldValue: TValue, newValue: TValue) {
// 		this.name = name
// 		this.oldValue = oldValue
// 		this.newValue = newValue
// 	}
// }
var PropertyChangedEvent =
/*#__PURE__*/
function () {
  function PropertyChangedEvent(name, oldValue, getNewValue) {
    _classCallCheck(this, PropertyChangedEvent);

    this.name = name;
    this.oldValue = oldValue;
    this._getNewValue = getNewValue;
  }

  _createClass(PropertyChangedEvent, [{
    key: "newValue",
    get: function get() {
      return this._getNewValue();
    }
  }]);

  return PropertyChangedEvent;
}();

var ObservableObjectBuilder =
/*#__PURE__*/
function () {
  function ObservableObjectBuilder(object) {
    _classCallCheck(this, ObservableObjectBuilder);

    this.object = object || new ObservableClass();
  }

  _createClass(ObservableObjectBuilder, [{
    key: "writable",
    value: function writable(name, options, initValue) {
      var _ref = options || {},
          setOptions = _ref.setOptions,
          hidden = _ref.hidden;

      var object = this.object;
      var __fields = object.__fields;

      if (__fields) {
        __fields[name] = object[name];
      } else if (typeof initValue !== 'undefined') {
        throw new Error("You can't set initValue for prototype writable property");
      } // optimization


      var getValue = options && options.getValue || createFunction(function () {
        return function () {
          return this.__fields[name];
        };
      }, "return this.__fields[\"" + name + "\"]");
      var setValue = options && options.setValue || createFunction(function () {
        return function (v) {
          this.__fields[name] = v;
        };
      }, 'v', "this.__fields[\"" + name + "\"] = v");

      var _set2 = setOptions ? bind$6(_setExt).call(_setExt, null, name, getValue, setValue, setOptions) : bind$6(_set).call(_set, null, name, getValue, setValue);

      defineProperty$9(object, name, {
        configurable: true,
        enumerable: !hidden,
        get: function get() {
          return getValue.call(this);
        },
        set: function set(newValue) {
          _set2(this, newValue);
        }
      });

      if (__fields && typeof initValue !== 'undefined') {
        var value = __fields[name];

        if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(object, value, initValue) : value !== initValue) {
          object[name] = initValue;
        }
      }

      return this;
    }
  }, {
    key: "readable",
    value: function readable(name, options, initValue) {
      return this.updatable(name, options, initValue);
    }
  }, {
    key: "updatable",
    value: function updatable(name, options, initValue) {
      var hidden = options && options.hidden;
      var object = this.object;
      var __fields = object.__fields;

      if (__fields) {
        __fields[name] = object[name];
      }

      var factory = options && options.factory;

      if (!factory && !__fields && typeof initValue !== 'undefined') {
        factory = function factory(o) {
          return o;
        };
      }

      var update = options && options.update; // optimization

      var getValue = options && options.getValue || createFunction(function () {
        return function () {
          return this.__fields[name];
        };
      }, "return this.__fields[\"" + name + "\"]");
      var setValue;

      if (update || factory) {
        setValue = options && options.setValue || createFunction(function () {
          return function (v) {
            this.__fields[name] = v;
          };
        }, 'v', "this.__fields[\"" + name + "\"] = v");
      }

      var setOnUpdate;

      if (update) {
        // tslint:disable-next-line
        var setOptions = options && options.setOptions;
        setOnUpdate = setOptions ? bind$6(_setExt).call(_setExt, null, name, getValue, setValue, setOptions) : bind$6(_set).call(_set, null, name, getValue, setValue);
      }

      var setOnInit;

      if (factory) {
        var _setOptions = _extends({}, options && options.setOptions, {
          suppressPropertyChanged: true
        });

        setOnInit = _setOptions ? bind$6(_setExt).call(_setExt, null, name, getValue, setValue, _setOptions) : bind$6(_set).call(_set, null, name, getValue, setValue);
      }

      var createInstanceProperty = function createInstanceProperty(instance) {
        var attributes = {
          configurable: true,
          enumerable: !hidden,
          get: function get() {
            return getValue.call(this);
          }
        };

        if (update) {
          attributes.set = function (value) {
            var newValue = update.call(this, value);

            if (typeof newValue !== 'undefined') {
              setOnUpdate(this, newValue);
            }
          };
        }

        defineProperty$9(instance, name, attributes);
      };

      var initializeValue = options && options.init;

      if (factory) {
        var init = function init() {
          var factoryValue = factory.call(this, initValue);
          createInstanceProperty(this);

          if (initializeValue) {
            initializeValue.call(this, factoryValue);
          }

          return factoryValue;
        };

        var initAttributes = {
          configurable: true,
          enumerable: !hidden,
          get: function get() {
            var factoryValue = init.call(this);

            if (typeof factoryValue !== 'undefined') {
              var oldValue = getValue.call(this);

              if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(this, oldValue, factoryValue) : oldValue !== factoryValue) {
                setOnInit(this, factoryValue);
              }
            }

            return factoryValue;
          }
        };

        if (update) {
          initAttributes.set = function (value) {
            // tslint:disable:no-dead-store
            var factoryValue = init.call(this);
            var newValue = update.call(this, value);

            if (typeof newValue !== 'undefined') {
              var oldValue = getValue.call(this);

              if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue !== newValue) {
                setOnInit(this, newValue);
              }
            }
          };
        }

        defineProperty$9(object, name, initAttributes);

        if (__fields) {
          var oldValue = __fields[name];
          var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

          if (propertyChangedIfCanEmit) {
            propertyChangedIfCanEmit.onPropertyChanged(new PropertyChangedEvent(name, oldValue, function () {
              return object[name];
            }));
          }
        }
      } else {
        createInstanceProperty(object);

        if (__fields && typeof initValue !== 'undefined') {
          var _oldValue = __fields[name];

          if (initializeValue) {
            initializeValue.call(this, initValue);
          }

          if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(object, _oldValue, initValue) : _oldValue !== initValue) {
            __fields[name] = initValue;
            var _propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

            if (_propertyChangedIfCanEmit) {
              _propertyChangedIfCanEmit.onPropertyChanged({
                name: name,
                oldValue: _oldValue,
                newValue: initValue
              });
            }
          }
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(name) {
      var object = this.object;
      var oldValue = object[name];

      object._setUnsubscriber(name, null);

      delete object[name];
      var __fields = object.__fields;

      if (__fields) {
        delete __fields[name];

        if (typeof oldValue !== 'undefined') {
          var propertyChangedIfCanEmit = object.propertyChangedIfCanEmit;

          if (propertyChangedIfCanEmit) {
            propertyChangedIfCanEmit.onPropertyChanged({
              name: name,
              oldValue: oldValue
            });
          }
        }
      }

      return this;
    }
  }]);

  return ObservableObjectBuilder;
}(); // Test:
// export const obj = new ObservableObjectBuilder()
// 	.writable<number, 'prop1'>('prop1')
// 	.readable<string, 'prop2'>('prop2')
// 	.readable<string, 'prop3'>('prop3')
// 	.delete('prop3')
// 	.object
//
// export const x = obj.prop1 + obj.prop2 + obj.propertyChanged + obj.prop3
// const builder = new ObservableObjectBuilder(true as any)
//
// export function writable<T = any>(
// 	options?: IWritableFieldOptions,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string, descriptor: PropertyDescriptor) => {
// 		builder.object = target
// 		builder.writable(propertyKey, options, initValue)
// 	}
// }
//
// export function readable<T = any>(
// 	options?: IReadableFieldOptions<T>,
// 	initValue?: T,
// ) {
// 	return (target: ObservableClass, propertyKey: string) => {
// 		builder.object = target
// 		builder.readable(propertyKey, options, initValue)
// 	}
// }
// class Class extends ObservableClass {
// 	@writable()
// 	public prop: number
//
// 	@readable()
// 	public prop2: number
// }

var CalcPropertyValue = function CalcPropertyValue(property) {
  _classCallCheck(this, CalcPropertyValue);

  this.get = function () {
    return property;
  };
};
var CalcPropertyState =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(CalcPropertyState, _ObservableClass);

  function CalcPropertyState(calcOptions, initValue) {
    var _this;

    _classCallCheck(this, CalcPropertyState);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CalcPropertyState).call(this));
    _this.calcOptions = calcOptions;
    _this.value = initValue;
    return _this;
  }

  return CalcPropertyState;
}(ObservableClass);
new ObservableObjectBuilder(CalcPropertyState.prototype).writable('input').writable('value');
var CalcProperty =
/*#__PURE__*/
function (_ObservableClass2) {
  _inherits(CalcProperty, _ObservableClass2);

  function CalcProperty(_ref) {
    var _this2;

    var calcFunc = _ref.calcFunc,
        name = _ref.name,
        calcOptions = _ref.calcOptions,
        initValue = _ref.initValue;

    _classCallCheck(this, CalcProperty);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(CalcProperty).call(this));

    if (typeof calcFunc !== 'function') {
      throw new Error("calcFunc must be a function: " + calcFunc);
    }

    if (typeof initValue !== 'function') {
      _this2._initValue = initValue;
    }

    if (!calcOptions) {
      calcOptions = {};
    }

    _this2.timeSyncStat = new CalcStat();
    _this2.timeAsyncStat = new CalcStat();
    _this2.timeDebuggerStat = new CalcStat();
    _this2.timeEmitEventsStat = new CalcStat();
    _this2.timeTotalStat = new CalcStat();
    _this2._calcFunc = calcFunc;
    _this2.state = new CalcPropertyState(calcOptions, initValue);

    if (typeof name !== 'undefined') {
      _this2.state.name = name;
    }

    _this2._deferredCalc = new DeferredCalc(function () {
      _this2.onInvalidated();
    }, function (done) {
      var prevValue = _this2.state.value;
      var timeStart = now$3();
      var timeSync;
      var timeAsync;
      var timeDebugger;
      var timeEmitEvents;
      var deferredValue = resolveAsyncFunc(function () {
        if (typeof _this2.state.input === 'undefined') {
          return false;
        }

        var result = _this2._calcFunc(_this2.state);

        timeSync = now$3();
        return result;
      }, function (isChangedForce) {
        _this2._hasValue = true;
        var val = _this2.state.value;

        if (webrainOptions.equalsFunc.call(_this2.state, prevValue, _this2.state.value)) {
          _this2.state.value = val = prevValue;
        }

        timeAsync = now$3();
        Debugger.Instance.onCalculated(_assertThisInitialized(_this2), prevValue, val);
        timeDebugger = now$3();
        done(isChangedForce, prevValue, val);
        timeEmitEvents = now$3();

        _this2.timeSyncStat.add(timeSync - timeStart);

        _this2.timeAsyncStat.add(timeAsync - timeStart);

        _this2.timeDebuggerStat.add(timeDebugger - timeAsync);

        _this2.timeEmitEventsStat.add(timeEmitEvents - timeDebugger);

        _this2.timeTotalStat.add(timeEmitEvents - timeStart);

        return val;
      }, function (err) {
        _this2._error = err;
        timeAsync = now$3();
        console.error(err);
        Debugger.Instance.onError(_assertThisInitialized(_this2), _this2.state.value, prevValue, err);
        timeDebugger = now$3();
        var val = _this2.state.value;

        if (webrainOptions.equalsFunc.call(_this2.state, prevValue, _this2.state.value)) {
          _this2.state.value = val = prevValue;
        }

        done(prevValue !== val, prevValue, val);
        timeEmitEvents = now$3();

        _this2.timeSyncStat.add(timeSync - timeStart);

        _this2.timeAsyncStat.add(timeAsync - timeStart);

        _this2.timeDebuggerStat.add(timeDebugger - timeAsync);

        _this2.timeEmitEventsStat.add(timeEmitEvents - timeDebugger);

        _this2.timeTotalStat.add(timeEmitEvents - timeStart);

        return val; // ThenableSync.createRejected(err)
      }, true);

      if (isAsync(deferredValue)) {
        _this2.setDeferredValue(deferredValue);
      }
    }, function (isChangedForce, oldValue, newValue) {
      if (isChangedForce || oldValue !== newValue) {
        if (!isChangedForce && isAsync(_this2._deferredValue)) {
          _this2._deferredValue = newValue;
        } else {
          _this2.setDeferredValue(newValue, isChangedForce);
        }

        _this2.onValueChanged(oldValue, newValue, isChangedForce);
      }
    }, calcOptions);
    return _this2;
  }

  _createClass(CalcProperty, [{
    key: "setDeferredValue",
    value: function setDeferredValue(newValue, force) {
      var oldValue = this._deferredValue;

      if (!force && (webrainOptions.equalsFunc ? webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue === newValue)) {
        return;
      }

      this._deferredValue = newValue;
      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: VALUE_PROPERTY_DEFAULT,
          oldValue: oldValue,
          newValue: newValue
        }, {
          name: 'wait',
          oldValue: oldValue,
          newValue: newValue
        } // this._hasValue ? null : {name: 'lastOrWait', oldValue, newValue},
        );
      }
    }
  }, {
    key: "onValueChanged",
    value: function onValueChanged(oldValue, newValue, force) {
      if (!force && (webrainOptions.equalsFunc ? webrainOptions.equalsFunc.call(this, oldValue, newValue) : oldValue === newValue)) {
        return;
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'last',
          oldValue: oldValue,
          newValue: newValue
        } // {name: 'lastOrWait', oldValue, newValue},
        );
      }
    }
  }, {
    key: "invalidate",
    value: function invalidate() {
      if (!this._error) {
        // console.log('invalidate: ' + this.state.name)
        this._deferredCalc.invalidate();
      }
    }
  }, {
    key: "onInvalidated",
    value: function onInvalidated() {
      Debugger.Instance.onInvalidated(this, this.state.value);
      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        this._deferredCalc.calc();
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      if (webrainOptions.equalsFunc ? !webrainOptions.equalsFunc.call(this, this.state.value, this._initValue) : this.state.value !== this._initValue) {
        var oldValue = this.state.value;
        var newValue = this._initValue;
        this.state.value = newValue;
        this.onValueChanged(oldValue, newValue);
        this.setDeferredValue(newValue);
        this.invalidate();
      }
    }
  }, {
    key: VALUE_PROPERTY_DEFAULT,
    get: function get() {
      return this.wait;
    }
  }, {
    key: "wait",
    get: function get() {
      this._deferredCalc.calc();

      return this._deferredValue;
    }
  }, {
    key: "last",
    get: function get() {
      this._deferredCalc.calc();

      return this.state.value;
    }
    /** @deprecated not needed and not implemented. Use 'last' instead. */

  }, {
    key: "lastOrWait",
    get: function get() {
      this._deferredCalc.calc();

      return this._hasValue ? this.state.value : this._deferredValue;
    }
  }]);

  return CalcProperty;
}(ObservableClass); // Test:
// const test: RuleGetValueFunc<CalcProperty<any, { test1: { test2: 123 } }, any>, number> =
// 	o => o['@last']['@last']['@last'].test1['@last']['@wait'].test2['@last']

var ValueChangeType;

(function (ValueChangeType) {
  ValueChangeType[ValueChangeType["None"] = 0] = "None";
  ValueChangeType[ValueChangeType["Unsubscribe"] = 1] = "Unsubscribe";
  ValueChangeType[ValueChangeType["Subscribe"] = 2] = "Subscribe";
  ValueChangeType[ValueChangeType["Changed"] = 3] = "Changed";
})(ValueChangeType || (ValueChangeType = {}));

var ValueKeyType;

(function (ValueKeyType) {
  ValueKeyType[ValueKeyType["Property"] = 0] = "Property";
  ValueKeyType[ValueKeyType["ValueProperty"] = 1] = "ValueProperty";
  ValueKeyType[ValueKeyType["MapKey"] = 2] = "MapKey";
  ValueKeyType[ValueKeyType["CollectionAny"] = 3] = "CollectionAny";
  ValueKeyType[ValueKeyType["ChangeCount"] = 4] = "ChangeCount";
})(ValueKeyType || (ValueKeyType = {}));

var RuleType;

(function (RuleType) {
  RuleType[RuleType["Nothing"] = 0] = "Nothing";
  RuleType[RuleType["Never"] = 1] = "Never";
  RuleType[RuleType["Action"] = 2] = "Action";
  RuleType[RuleType["If"] = 3] = "If";
  RuleType[RuleType["Any"] = 4] = "Any";
  RuleType[RuleType["Repeat"] = 5] = "Repeat";
})(RuleType || (RuleType = {}));

var RuleRepeatAction;

(function (RuleRepeatAction) {
  RuleRepeatAction[RuleRepeatAction["Never"] = 0] = "Never";
  RuleRepeatAction[RuleRepeatAction["Next"] = 1] = "Next";
  RuleRepeatAction[RuleRepeatAction["Fork"] = 2] = "Fork";
  RuleRepeatAction[RuleRepeatAction["All"] = 3] = "All";
})(RuleRepeatAction || (RuleRepeatAction = {}));

var PropertiesPath =
/*#__PURE__*/
function () {
  function PropertiesPath(value, parent, key, keyType, rule) {
    _classCallCheck(this, PropertiesPath);

    this.value = value;
    this.parent = parent;
    this.key = key;
    this.keyType = keyType;
    this.rule = rule;
  } // region id


  _createClass(PropertiesPath, [{
    key: "buildId",
    value: function buildId(buffer) {
      if (buffer === void 0) {
        buffer = [];
      }

      if (this.parent) {
        buffer.push(this.parent.id);
        buffer.push(getObjectUniqueId(this.parent.value));
        buffer.push(this.keyType);
        buffer.push(this.key);
      }

      return buffer;
    }
  }, {
    key: "buildString",
    // endregion
    // region description
    value: function buildString(buffer) {
      if (buffer === void 0) {
        buffer = [];
      }

      if (this.parent) {
        buffer.push(this.parent.toString());
        buffer.push('.');
      }

      buffer.push(this.key);

      if (this.rule) {
        buffer.push('(');
        buffer.push(this.rule.description);
        buffer.push(')');
      }

      return buffer;
    }
  }, {
    key: "toString",
    value: function toString() {
      var _description = this._description;

      if (!_description) {
        _description = this.buildString().join('_');
        this._description = _description;
      }

      return _description;
    } // endregion

  }, {
    key: "id",
    get: function get() {
      var _id = this._id;

      if (!_id) {
        _id = this.buildId().join('_');
        this._id = _id;
      }

      return _id;
    }
  }]);

  return PropertiesPath;
}();

function ruleTypeToString(ruleType) {
  switch (ruleType) {
    case RuleType.Never:
      return 'Never';

    case RuleType.Action:
      return 'Action';

    case RuleType.Any:
      return 'Any';

    case RuleType.If:
      return 'If';

    case RuleType.Nothing:
      return 'Nothing';

    case RuleType.Repeat:
      return 'Repeat';

    default:
      throw new Error('Unknown RuleType: ' + ruleType);
  }
}

function ruleToString(rule, customDescription, nestedRulesStr) {
  var description = customDescription || this.description || ruleTypeToString(this.type);
  return "" + description + (nestedRulesStr ? '(' + nestedRulesStr + ')' : '') + (this.next ? ' > ' + this.next : '');
}

var Rule =
/*#__PURE__*/
function () {
  function Rule(type, description) {
    _classCallCheck(this, Rule);

    this.type = type;

    if (description != null) {
      this.description = description;
    }
  }

  _createClass(Rule, [{
    key: "clone",
    value: function clone() {
      var type = this.type,
          subType = this.subType,
          description = this.description,
          next = this.next,
          toString = this.toString;
      var clone = {
        type: type,
        subType: subType,
        description: description,
        toString: toString
      };

      if (next != null) {
        clone.next = next.clone();
      }

      return clone;
    }
  }, {
    key: "toString",
    value: function toString() {
      return ruleToString();
    }
  }]);

  return Rule;
}();
var RuleNothing =
/*#__PURE__*/
function (_Rule) {
  _inherits(RuleNothing, _Rule);

  function RuleNothing() {
    var _this;

    _classCallCheck(this, RuleNothing);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RuleNothing).call(this, RuleType.Nothing));
    _this.description = 'nothing';
    return _this;
  }

  return RuleNothing;
}(Rule);
RuleNothing.instance = freeze$2(new RuleNothing());
var RuleNever =
/*#__PURE__*/
function (_Rule2) {
  _inherits(RuleNever, _Rule2);

  function RuleNever() {
    var _this2;

    _classCallCheck(this, RuleNever);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(RuleNever).call(this, RuleType.Never));
    _this2.description = 'never';
    return _this2;
  }

  _createClass(RuleNever, [{
    key: "clone",
    value: function clone() {
      return this;
    }
  }, {
    key: "next",
    get: function get() {
      return null;
    } // tslint:disable-next-line:no-empty
    ,
    set: function set(value) {}
  }]);

  return RuleNever;
}(Rule);
RuleNever.instance = freeze$2(new RuleNever());
var RuleIf =
/*#__PURE__*/
function (_Rule3) {
  _inherits(RuleIf, _Rule3);

  function RuleIf(conditionRules) {
    var _this3;

    _classCallCheck(this, RuleIf);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RuleIf).call(this, RuleType.If));
    _this3.conditionRules = conditionRules;
    _this3.description = '<if>';
    return _this3;
  }

  _createClass(RuleIf, [{
    key: "clone",
    value: function clone() {
      var _context;

      var clone = _get(_getPrototypeOf(RuleIf.prototype), "clone", this).call(this);

      clone.conditionRules = map$2(_context = this.conditionRules).call(_context, function (o) {
        return isArray$3(o) ? [o[0], o[1].clone()] : o.clone();
      });
      return clone;
    }
  }]);

  return RuleIf;
}(Rule);
var RuleAny =
/*#__PURE__*/
function (_Rule4) {
  _inherits(RuleAny, _Rule4);

  function RuleAny(rules) {
    var _this4;

    _classCallCheck(this, RuleAny);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(RuleAny).call(this, RuleType.Any));
    _this4.rules = rules;
    _this4.description = '<any>';
    return _this4;
  }

  _createClass(RuleAny, [{
    key: "clone",
    value: function clone() {
      var _context2;

      var clone = _get(_getPrototypeOf(RuleAny.prototype), "clone", this).call(this);

      clone.rules = map$2(_context2 = this.rules).call(_context2, function (o) {
        return o.clone();
      });
      return clone;
    }
  }]);

  return RuleAny;
}(Rule);
var RuleRepeat =
/*#__PURE__*/
function (_Rule5) {
  _inherits(RuleRepeat, _Rule5);

  function RuleRepeat(countMin, countMax, condition, rule) {
    var _this5;

    _classCallCheck(this, RuleRepeat);

    _this5 = _possibleConstructorReturn(this, _getPrototypeOf(RuleRepeat).call(this, RuleType.Repeat));
    _this5.countMin = countMin;
    _this5.countMax = countMax;
    _this5.condition = condition;
    _this5.rule = rule;
    _this5.description = '<repeat>';
    return _this5;
  }

  _createClass(RuleRepeat, [{
    key: "clone",
    value: function clone() {
      var clone = _get(_getPrototypeOf(RuleRepeat.prototype), "clone", this).call(this);

      clone.rule = this.rule.clone();
      clone.countMin = this.countMin;
      clone.countMax = this.countMax;
      clone.condition = this.condition;
      return clone;
    }
  }]);

  return RuleRepeat;
}(Rule);

var _marked$1 =
/*#__PURE__*/
regenerator.mark(iterateFork),
    _marked2 =
/*#__PURE__*/
regenerator.mark(compressForks),
    _marked3 =
/*#__PURE__*/
regenerator.mark(_iterateRule);
var ARRAY_EMPTY = [];

function forkToArray(ruleIterable) {
  var array;
  var nothing;
  var never;

  for (var _iterator = ruleIterable, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var item = _ref;

    if (isIterable$2(item)) {
      var itemArray = from_1$2(item);

      if (!itemArray.length) {
        if (!nothing) {
          if (!array) {
            array = [itemArray];
          } else {
            array.unshift(itemArray);
          }

          nothing = true;
        }

        continue;
      }

      if (!array) {
        array = [itemArray];
      } else {
        array.push(itemArray);
      }
    } else {
      if (item.type === RuleType.Never) {
        never = true;
      } else {
        throw new Error('Unexpected rule type: ' + RuleType[item.type]);
      }
    }
  }

  if (array) {
    return array;
  } else {
    if (never) {
      return RuleNever.instance;
    }

    return ARRAY_EMPTY;
  }
}

function iterateFork(fork) {
  var _iterator2, _isArray2, _i2, _ref2, ruleIterable, iterator, iteration;

  return regenerator.wrap(function iterateFork$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _iterator2 = fork, _isArray2 = isArray$3(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : getIterator$1(_iterator2);

        case 1:
          if (!_isArray2) {
            _context.next = 7;
            break;
          }

          if (!(_i2 >= _iterator2.length)) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("break", 42);

        case 4:
          _ref2 = _iterator2[_i2++];
          _context.next = 11;
          break;

        case 7:
          _i2 = _iterator2.next();

          if (!_i2.done) {
            _context.next = 10;
            break;
          }

          return _context.abrupt("break", 42);

        case 10:
          _ref2 = _i2.value;

        case 11:
          ruleIterable = _ref2;

          if (!isIterable$2(ruleIterable)) {
            _context.next = 38;
            break;
          }

          {
            _context.next = 18;
            break;
          }

        case 16:
          _context.next = 36;
          break;

        case 18:
          iterator = getIterator$1(ruleIterable);
          iteration = iterator.next();

          if (iteration.done) {
            _context.next = 34;
            break;
          }

          if (!isIterable$2(iteration.value)) {
            _context.next = 25;
            break;
          }

          return _context.delegateYield(iterateFork(iteration.value), "t0", 23);

        case 23:
          _context.next = 32;
          break;

        case 25:
          if (!(iteration.value.type === RuleType.Never)) {
            _context.next = 30;
            break;
          }

          _context.next = 28;
          return iteration.value;

        case 28:
          _context.next = 32;
          break;

        case 30:
          _context.next = 32;
          return compressForks(ruleIterable, iterator, iteration);

        case 32:
          _context.next = 36;
          break;

        case 34:
          _context.next = 36;
          return ARRAY_EMPTY;

        case 36:
          _context.next = 40;
          break;

        case 38:
          _context.next = 40;
          return ruleIterable;

        case 40:
          _context.next = 1;
          break;

        case 42:
        case "end":
          return _context.stop();
      }
    }
  }, _marked$1);
}

function compressForks(ruleOrForkIterable, iterator, iteration) {
  var ruleOrFork, fork, array, nextIterable;
  return regenerator.wrap(function compressForks$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!iterator) {
            iterator = getIterator$1(ruleOrForkIterable);
          }

          if (!iteration) {
            iteration = iterator.next();
          }

          if (!iteration.done) {
            _context2.next = 4;
            break;
          }

          return _context2.abrupt("return");

        case 4:
          ruleOrFork = iteration.value;

          if (!isIterable$2(ruleOrFork)) {
            _context2.next = 13;
            break;
          }

          fork = iterateFork(ruleOrFork);
          array = forkToArray(fork); // TODO optimize this array

          _context2.next = 10;
          return array;

        case 10:
          return _context2.abrupt("return");

        case 13:
          _context2.next = 15;
          return ruleOrFork;

        case 15:
          iteration = iterator.next();
          nextIterable = iteration.value;

          if (!nextIterable) {
            _context2.next = 20;
            break;
          }

          _context2.next = 20;
          return function (nextObject) {
            return compressForks(nextIterable(nextObject));
          };

        case 20:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2);
}
function iterateRule(object, rule, next) {
  if (next === void 0) {
    next = null;
  }

  return compressForks(_iterateRule(object, rule, next));
}

function _iterateRule(object, rule, next) {
  var ruleNext, conditionRules, len, i, conditionRule, rules, any, countMin, countMax, condition, subRule, repeatNext;
  return regenerator.wrap(function _iterateRule$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          if (rule) {
            _context5.next = 4;
            break;
          }

          if (!next) {
            _context5.next = 3;
            break;
          }

          return _context5.delegateYield(next(object), "t0", 3);

        case 3:
          return _context5.abrupt("return");

        case 4:
          ruleNext = rule.next || next ? function (nextObject) {
            return _iterateRule(nextObject, rule.next, next);
          } : null;
          _context5.t1 = rule.type;
          _context5.next = _context5.t1 === RuleType.Nothing ? 8 : _context5.t1 === RuleType.Never ? 11 : _context5.t1 === RuleType.Action ? 14 : _context5.t1 === RuleType.If ? 19 : _context5.t1 === RuleType.Any ? 38 : _context5.t1 === RuleType.Repeat ? 50 : 58;
          break;

        case 8:
          if (!ruleNext) {
            _context5.next = 10;
            break;
          }

          return _context5.delegateYield(ruleNext(object), "t2", 10);

        case 10:
          return _context5.abrupt("break", 59);

        case 11:
          _context5.next = 13;
          return rule;

        case 13:
          return _context5.abrupt("break", 59);

        case 14:
          _context5.next = 16;
          return rule;

        case 16:
          _context5.next = 18;
          return ruleNext;

        case 18:
          return _context5.abrupt("break", 59);

        case 19:
          conditionRules = rule.conditionRules;
          len = conditionRules.length;
          i = 0;

        case 22:
          if (!(i < len)) {
            _context5.next = 35;
            break;
          }

          conditionRule = conditionRules[i];

          if (!isArray$3(conditionRule)) {
            _context5.next = 30;
            break;
          }

          if (!conditionRule[0](object)) {
            _context5.next = 28;
            break;
          }

          return _context5.delegateYield(_iterateRule(object, conditionRule[1], ruleNext), "t3", 27);

        case 27:
          return _context5.abrupt("break", 35);

        case 28:
          _context5.next = 32;
          break;

        case 30:
          return _context5.delegateYield(_iterateRule(object, conditionRule, ruleNext), "t4", 31);

        case 31:
          return _context5.abrupt("break", 35);

        case 32:
          i++;
          _context5.next = 22;
          break;

        case 35:
          if (!(i === len && ruleNext)) {
            _context5.next = 37;
            break;
          }

          return _context5.delegateYield(ruleNext(object), "t5", 37);

        case 37:
          return _context5.abrupt("break", 59);

        case 38:
          rules = rule.rules;

          if (rules.length) {
            _context5.next = 43;
            break;
          }

          _context5.next = 42;
          return RuleNever.instance;

        case 42:
          return _context5.abrupt("break", 59);

        case 43:
          if (!(rules.length === 1)) {
            _context5.next = 46;
            break;
          }

          _context5.next = 46;
          return [_iterateRule(object, rules[0], ruleNext)];

        case 46:
          any =
          /*#__PURE__*/
          regenerator.mark(function any() {
            var _i3, _len, subRule;

            return regenerator.wrap(function any$(_context3) {
              while (1) {
                switch (_context3.prev = _context3.next) {
                  case 0:
                    _i3 = 0, _len = rules.length;

                  case 1:
                    if (!(_i3 < _len)) {
                      _context3.next = 10;
                      break;
                    }

                    subRule = rules[_i3];

                    if (subRule) {
                      _context3.next = 5;
                      break;
                    }

                    throw new Error("RuleType.Any rule=" + subRule);

                  case 5:
                    _context3.next = 7;
                    return _iterateRule(object, subRule, ruleNext);

                  case 7:
                    _i3++;
                    _context3.next = 1;
                    break;

                  case 10:
                  case "end":
                    return _context3.stop();
                }
              }
            }, any);
          });
          _context5.next = 49;
          return any();

        case 49:
          return _context5.abrupt("break", 59);

        case 50:
          countMin = rule.countMin, countMax = rule.countMax, condition = rule.condition, subRule = rule.rule; // if (countMin === 0 && countMin === countMax) {
          // 	// == RuleType.Nothing
          // 	if (ruleNext) {
          // 		yield* ruleNext(object)
          // 	}
          // 	break
          // }

          if (!(countMax < countMin || countMax < 0)) {
            _context5.next = 55;
            break;
          }

          _context5.next = 54;
          return RuleNever.instance;

        case 54:
          return _context5.abrupt("break", 59);

        case 55:
          repeatNext =
          /*#__PURE__*/
          regenerator.mark(function repeatNext(nextObject, index) {
            var repeatAction, nextIteration;
            return regenerator.wrap(function repeatNext$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    nextIteration = function _ref3(newCount) {
                      return _iterateRule(nextObject, subRule, function (nextIterationObject) {
                        return repeatNext(nextIterationObject, newCount);
                      });
                    };

                    repeatAction = condition ? condition(nextObject, index) : RuleRepeatAction.All;

                    if (index < countMin) {
                      repeatAction = repeatAction & ~RuleRepeatAction.Fork;
                    }

                    if (index >= countMax) {
                      repeatAction = repeatAction & ~RuleRepeatAction.Next;
                    }

                    if (!((repeatAction & RuleRepeatAction.Fork) === 0)) {
                      _context4.next = 11;
                      break;
                    }

                    if (!((repeatAction & RuleRepeatAction.Next) === 0)) {
                      _context4.next = 9;
                      break;
                    }

                    _context4.next = 8;
                    return RuleNever.instance;

                  case 8:
                    return _context4.abrupt("return");

                  case 9:
                    return _context4.delegateYield(nextIteration(index + 1), "t0", 10);

                  case 10:
                    return _context4.abrupt("return");

                  case 11:
                    if (!((repeatAction & RuleRepeatAction.Next) === 0)) {
                      _context4.next = 15;
                      break;
                    }

                    if (!ruleNext) {
                      _context4.next = 14;
                      break;
                    }

                    return _context4.delegateYield(ruleNext(nextObject), "t1", 14);

                  case 14:
                    return _context4.abrupt("return");

                  case 15:
                    _context4.next = 17;
                    return [ruleNext ? ruleNext(nextObject) : ARRAY_EMPTY, nextIteration(index + 1)];

                  case 17:
                  case "end":
                    return _context4.stop();
                }
              }
            }, repeatNext);
          });
          return _context5.delegateYield(repeatNext(object, 0), "t6", 57);

        case 57:
          return _context5.abrupt("break", 59);

        case 58:
          throw new Error('Unknown RuleType: ' + rule.type);

        case 59:
        case "end":
          return _context5.stop();
      }
    }
  }, _marked3);
}

function subscribeNextRule(ruleIterator, iteration, fork, subscribeNode) {
  var ruleOrIterable = iteration.value;

  if (isIterable$2(ruleOrIterable)) {
    var unsubscribers; // for (let step, innerIterator = ruleOrIterable[Symbol.iterator](); !(step = innerIterator.next()).done;) {
    // 	const ruleIterable = step.value
    // 	const unsubscribe = fork(ruleIterable[Symbol.iterator]())
    // 	if (unsubscribe != null) {
    // 		if (!unsubscribers) {
    // 			unsubscribers = [unsubscribe]
    // 		} else {
    // 			unsubscribers.push(unsubscribe)
    // 		}
    // 	}
    // }

    for (var _iterator3 = ruleOrIterable, _isArray3 = isArray$3(_iterator3), _i4 = 0, _iterator3 = _isArray3 ? _iterator3 : getIterator$1(_iterator3);;) {
      var _ref4;

      if (_isArray3) {
        if (_i4 >= _iterator3.length) break;
        _ref4 = _iterator3[_i4++];
      } else {
        _i4 = _iterator3.next();
        if (_i4.done) break;
        _ref4 = _i4.value;
      }

      var ruleIterable = _ref4;
      var unsubscribe = fork(getIterator$1(ruleIterable));

      if (unsubscribe) {
        if (!unsubscribers) {
          unsubscribers = [unsubscribe];
        } else {
          unsubscribers.push(unsubscribe);
        }
      }
    }

    if (!unsubscribers) {
      return null;
    }

    return function () {
      for (var i = 0, len = unsubscribers.length; i < len; i++) {
        unsubscribers[i]();
      }
    };
  }

  var nextIterable = ruleIterator.next().value;
  return subscribeNode(ruleOrIterable, nextIterable // ? () => nextIterable(object)[Symbol.iterator]()
  // : null,
  );
}

function defaultCompare(o1, o2) {
  if (o1 < o2) {
    return -1;
  }

  if (o1 > o2) {
    return 1;
  }

  return 0;
}
/**
 * @param array sorted array with compare func
 * @param item search item
 * @param start (optional) start index
 * @param end (optional) exclusive end index
 * @param compare (optional) custom compare func
 * @param bound (optional) (-1) first index; (1) last index; (0) doesn't matter
 */

function binarySearch(array, item, start, end, compare, bound) {
  if (!compare) {
    compare = defaultCompare;
  }

  var from = start == null ? 0 : start;
  var to = (end == null ? array.length : end) - 1;

  if (to < from) {
    return ~from;
  }

  var found = -1;

  while (from <= to) {
    var middle = from + to >>> 1;
    var compareResult = compare(array[middle], item);

    if (compareResult < 0) {
      from = middle + 1;
    } else if (compareResult > 0) {
      to = middle - 1;
    } else if (!bound) {
      return middle;
    } else if (bound < 0) {
      // First occurrence:
      found = middle;
      to = middle - 1;
    } else {
      // Last occurrence:
      found = middle;
      from = middle + 1;
    }
  }

  return found >= 0 ? found : -from - 1;
}

var undefinedSubscribedValue = {
  value: void 0,
  parent: null,
  key: null,
  keyType: null
};

function valuesEqual(v1, v2) {
  return v1 === v2 || isNan$2(v1) && isNan$2(v2);
}

function subscribedValueEquals(o1, o2) {
  if (o1 === o2) {
    return true;
  }

  if (!o1 || !o2) {
    return false;
  }

  return valuesEqual(o1.value, o2.value) && o1.parent === o2.parent && o1.keyType === o2.keyType && o1.key === o2.key;
}

function compareSubscribed(o1, o2) {
  if (typeof o1.value !== 'undefined') {
    if (typeof o2.value !== 'undefined') {
      return 0;
    }

    return 1;
  }

  if (typeof o2.value !== 'undefined') {
    return -1;
  }

  if (typeof o1.isOwnProperty !== 'undefined' && typeof o2.isOwnProperty !== 'undefined') {
    if (o1.isOwnProperty) {
      if (o2.isOwnProperty) {
        return 0;
      }

      return 1;
    }

    if (o2.isOwnProperty) {
      return -1;
    }
  }

  return 0;
}

var ObjectSubscriber =
/*#__PURE__*/
function () {
  function ObjectSubscriber(changeValue, lastValue, debugTarget) {
    _classCallCheck(this, ObjectSubscriber);

    this._changeValue = changeValue;
    this._lastValue = lastValue;
    this.debugTarget = debugTarget;
  }

  _createClass(ObjectSubscriber, [{
    key: "insertSubscribed",
    value: function insertSubscribed(subscribedValue) {
      var _subscribedValues = this._subscribedValues;

      if (!_subscribedValues) {
        this._subscribedValues = _subscribedValues = [];
      }

      var index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, 1);
      var len = _subscribedValues.length;

      if (index < 0) {
        index = ~index;

        if (index === len) {
          _subscribedValues.push(subscribedValue);

          return subscribedValue;
        }
      }

      for (var i = len - 1; i >= index; i--) {
        _subscribedValues[i + 1] = _subscribedValues[i];
      }

      _subscribedValues[index] = subscribedValue;
    }
  }, {
    key: "removeSubscribed",
    value: function removeSubscribed(subscribedValue) {
      var _subscribedValues = this._subscribedValues;

      if (_subscribedValues) {
        var index = binarySearch(_subscribedValues, subscribedValue, null, null, compareSubscribed, -1);

        if (index >= 0) {
          var len = _subscribedValues.length;

          for (; index < len; index++) {
            if (subscribedValueEquals(_subscribedValues[index], subscribedValue)) {
              break;
            }
          }

          if (index >= 0 && index < len) {
            for (var i = index + 1; i < len; i++) {
              _subscribedValues[i - 1] = _subscribedValues[i];
            }

            _subscribedValues.length = len - 1;

            if (len === 1) {
              return undefinedSubscribedValue;
            } else if (index === len - 1) {
              var nextSubscribedValue = _subscribedValues[len - 2];
              return nextSubscribedValue;
            }

            return null;
          }
        }
      }

      if (typeof subscribedValue.value !== 'undefined') {
        throw new Error("subscribedValue no found: " + subscribedValue.parent.constructor.name + "." + subscribedValue.key + " = " + subscribedValue.value);
      }
    }
  }, {
    key: "change",
    value: function change(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule) {
      var _this = this;

      var unsubscribedLast;
      var nextChangeType = ValueChangeType.None;

      if (this._changeValue) {
        if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
          var unsubscribed;

          if (oldValue instanceof Object) {
            var _unsubscribersCount = this._unsubscribersCount;

            if (_unsubscribersCount) {
              var itemUniqueId = getObjectUniqueId(oldValue);
              var unsubscribeCount = _unsubscribersCount[itemUniqueId];

              if (unsubscribeCount != null) {
                if (unsubscribeCount) {
                  if (unsubscribeCount > 1) {
                    _unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
                  } else {
                    var _unsubscribers = this._unsubscribers;
                    var unsubscribe = _unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

                    delete _unsubscribers[itemUniqueId];
                    delete _unsubscribersCount[itemUniqueId];

                    if (isArray$3(unsubscribe)) {
                      for (var i = 0, len = unsubscribe.length; i < len; i++) {
                        unsubscribe[i]();
                      }
                    } else {
                      unsubscribe();
                    }

                    unsubscribedLast = true;
                  }
                }

                unsubscribed = true;
              }
            }
          }

          if (unsubscribedLast || !unsubscribed) {
            nextChangeType |= ValueChangeType.Unsubscribe;
          }
        }

        if ((changeType & ValueChangeType.Subscribe) !== 0) {
          if (!(newValue instanceof Object)) {
            var unsubscribeValue = checkIsFuncOrNull(this._changeValue(key, oldValue, newValue, parent, nextChangeType | ValueChangeType.Subscribe, keyType, propertiesPath, rule, unsubscribedLast));

            if (unsubscribeValue) {
              unsubscribeValue();
              throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + ("Unsubscribe function: " + unsubscribeValue + "\nValue: " + newValue + "\n") + ("Value property path: " + new PropertiesPath(newValue, propertiesPath, key, keyType, rule)));
            }
          } else {
            var _itemUniqueId = getObjectUniqueId(newValue);

            var _unsubscribers2 = this._unsubscribers,
                _unsubscribersCount2 = this._unsubscribersCount;

            if (_unsubscribers2 && _unsubscribers2[_itemUniqueId]) {
              this._changeValue(key, oldValue, newValue, parent, nextChangeType, keyType, propertiesPath, rule, unsubscribedLast);

              _unsubscribersCount2[_itemUniqueId]++;
            } else {
              if (!_unsubscribers2) {
                this._unsubscribers = _unsubscribers2 = [];
                this._unsubscribersCount = _unsubscribersCount2 = [];
              }

              var _unsubscribeValue = checkIsFuncOrNull(this._changeValue(key, oldValue, newValue, parent, nextChangeType | ValueChangeType.Subscribe, keyType, propertiesPath, rule, unsubscribedLast));

              if (_unsubscribeValue) {
                _unsubscribers2[_itemUniqueId] = _unsubscribeValue;
                _unsubscribersCount2[_itemUniqueId] = 1; // return this._setUnsubscribeObject(itemUniqueId, unsubscribeValue)
              }
            }
          }
        } else {
          this._changeValue(key, oldValue, newValue, parent, nextChangeType, keyType, propertiesPath, rule, unsubscribedLast);
        }
      }

      if (this._lastValue || Debugger.Instance.deepSubscribeLastValueHasSubscribers) {
        var unsubscribedValue;

        if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
          unsubscribedValue = this.removeSubscribed({
            value: oldValue,
            parent: parent,
            key: key,
            keyType: keyType
          });
        }

        var subscribedValue;

        if ((changeType & ValueChangeType.Subscribe) !== 0) {
          subscribedValue = this.insertSubscribed({
            value: newValue,
            parent: parent,
            key: key,
            keyType: keyType,
            isOwnProperty: parent != null && key in parent
          });
        }

        if (!subscribedValueEquals(subscribedValue, unsubscribedValue)) {
          var lastValue = subscribedValue || unsubscribedValue;

          if (lastValue) {
            Debugger.Instance.onDeepSubscribeLastValue(unsubscribedValue, subscribedValue, this.debugTarget);

            if (this._lastValue) {
              this._lastValue(lastValue.value, lastValue.parent, lastValue.key, lastValue.keyType);
            }
          }
        }
      }

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        return function () {
          _this.change(key, newValue, void 0, parent, ValueChangeType.Unsubscribe, keyType, propertiesPath, rule);
        };
      }
    }
  }]);

  return ObjectSubscriber;
}();

// `Number.MAX_SAFE_INTEGER` constant
// https://tc39.github.io/ecma262/#sec-number.max_safe_integer
_export({ target: 'Number', stat: true }, {
  MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
});

var maxSafeInteger = 0x1FFFFFFFFFFFFF;

var maxSafeInteger$1 = maxSafeInteger;

var maxSafeInteger$2 = maxSafeInteger$1;

// `String.prototype.repeat` method implementation
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
var stringRepeat = ''.repeat || function repeat(count) {
  var str = String(requireObjectCoercible(this));
  var result = '';
  var n = toInteger(count);
  if (n < 0 || n == Infinity) throw RangeError('Wrong number of repetitions');
  for (;n > 0; (n >>>= 1) && (str += str)) if (n & 1) result += str;
  return result;
};

// `String.prototype.repeat` method
// https://tc39.github.io/ecma262/#sec-string.prototype.repeat
_export({ target: 'String', proto: true }, {
  repeat: stringRepeat
});

var repeat = entryVirtual('String').repeat;

var StringPrototype$2 = String.prototype;

var repeat_1 = function (it) {
  var own = it.repeat;
  return typeof it === 'string' || it === StringPrototype$2
    || (it instanceof String && own === StringPrototype$2.repeat) ? repeat : own;
};

var repeat$1 = repeat_1;

var repeat$2 = repeat$1;

var ANY = '*';
var ANY_DISPLAY = ANY;
var COLLECTION_PREFIX = '#';
var CHANGE_COUNT_PREFIX = '~';
var VALUE_PROPERTY_PREFIX = '@';

// const variablePattern = '([$A-Za-z_][$A-Za-z_]*)'
// const propertyPattern = variablePattern
function parsePropertiesPathString(getValueFunc) {
  if (typeof getValueFunc !== 'string') {
    getValueFunc = getValueFunc.toString();
  } // noinspection RegExpRedundantEscape


  var match = getValueFunc // tslint:disable-next-line:max-line-length
  .match(/^[\s\S]*?\(?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:\/\*[\s\S]*?\*\/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?\)?[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:(?:=>[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)?\{[\s\S]*?\breturn[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]|=>)(?:[\t-\r \(\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]|[\0-!#-&\(-\+\x2D-\uFFFF]*,)*[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\1[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([\s\S]*?)[\t-\r ;\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\}?[\t-\r \)\xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*$/);
  var path = match && match[2];

  if (!path) {
    throw new Error("Error parse getValueFunc:\n" + getValueFunc + "\n\n" + 'This parameter should be a function which simple return nested property value, like that:\n' + '(o) => o.o["/\\"\'"].o[0].o.o\n' + 'o => (o.o["/\\"\'"].o[0].o.o)\n' + '(o) => {return o.o["/\\"\'"].o[0].o.o}\n' + 'function (o) { return o.o["/\\"\'"].o[0].o.o }\n' + 'y(o) {\n' + '\t\treturn o.o["/\\"\'"].o[0].o.o\n' + '}');
  }

  return path;
}
function parsePropertiesPath(propertiesPathString) {
  var propertiesPath = [];
  var remains = propertiesPathString.replace( // tslint:disable-next-line:max-line-length
  /(?:\.[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*([0-9A-Z_a-z]+)[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|\[[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*(?:([0-9]+)|("(?:[\0-!#-\[\]-\uFFFF]*|\\[\s\S])+"|'(?:[\0-&\(-\[\]-\uFFFF]*|\\[\s\S])+'))[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*\][\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|(\/\/)[\0-\t\x0B\f\x0E-\uFFFF]*[\n\r]+[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*|(\/\*)[\s\S]*?\*\/[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]*)/g, function (s, g1, g2, g3, g4, g5) {
    if (!g4 && !g5) {
      propertiesPath.push(g1 || g2 || g3 && new Function('return ' + g3)());
    }

    return '';
  });

  if (remains) {
    // noinspection SpellCheckingInspection
    throw new Error("Error parse properties path from:\n" + propertiesPathString + "\nerror in: " + remains);
  }

  return propertiesPath;
}
var PROPERTIES_PATH_CACHE_ID = 'propertiesPath_26lds5zs9ft';
function getFuncPropertiesPath(getValueFunc) {
  var propertiesPath = getValueFunc[PROPERTIES_PATH_CACHE_ID];

  if (!propertiesPath) {
    getValueFunc[PROPERTIES_PATH_CACHE_ID] = propertiesPath = parsePropertiesPath(parsePropertiesPathString(getValueFunc));
  }

  return propertiesPath;
}

var ListChangedType;

(function (ListChangedType) {
  ListChangedType[ListChangedType["Removed"] = 0] = "Removed";
  ListChangedType[ListChangedType["Added"] = 1] = "Added";
  ListChangedType[ListChangedType["Set"] = 2] = "Set";
  ListChangedType[ListChangedType["Resorted"] = 3] = "Resorted";
  ListChangedType[ListChangedType["Moved"] = 4] = "Moved";
})(ListChangedType || (ListChangedType = {})); // export interface IObservableList<T> extends IListChanged<T>, IList<T> {
// }

var MapChangedType;

(function (MapChangedType) {
  MapChangedType[MapChangedType["Removed"] = 0] = "Removed";
  MapChangedType[MapChangedType["Added"] = 1] = "Added";
  MapChangedType[MapChangedType["Set"] = 2] = "Set";
})(MapChangedType || (MapChangedType = {}));

var SetChangedType;

(function (SetChangedType) {
  SetChangedType[SetChangedType["Removed"] = 0] = "Removed";
  SetChangedType[SetChangedType["Added"] = 1] = "Added";
})(SetChangedType || (SetChangedType = {}));

function forEachCollection(iterable, changeItem, isSubscribe) {
  for (var _iterator = iterable, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
    var _ref;

    if (_isArray) {
      if (_i >= _iterator.length) break;
      _ref = _iterator[_i++];
    } else {
      _i = _iterator.next();
      if (_i.done) break;
      _ref = _i.value;
    }

    var item = _ref;

    if (isSubscribe) {
      changeItem(null, void 0, item, ValueChangeType.Subscribe, ValueKeyType.CollectionAny);
    } else {
      changeItem(null, item, void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny);
    }
  }
} // region subscribeObjectValue


function getFirstExistProperty(object, propertyNames) {
  for (var i = 0, len = propertyNames.length; i < len; i++) {
    var propertyName = propertyNames[i];

    if ( propertyName in object ) {
      return propertyName;
    }
  }

  return null;
}

function subscribeObjectValue(propertyNames, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!(object instanceof Object)) {
    changeItem(null, void 0, object, ValueChangeType.Subscribe, null);
    return null;
  }

  if (object.constructor === Object || isArray$3(object)) {
    changeItem(null, void 0, object, ValueChangeType.Subscribe, null);
    return function () {
      changeItem(null, object, void 0, ValueChangeType.Unsubscribe, null);
    };
  }

  var subscribePropertyName;

  var getSubscribePropertyName = function getSubscribePropertyName() {
    if ( !(VALUE_PROPERTY_DEFAULT in object) ) {
      return null;
    }

    var propertyName = getFirstExistProperty(object, propertyNames);

    if (propertyName == null) {
      return VALUE_PROPERTY_DEFAULT;
    }

    return propertyName;
  };

  var subscribeProperty = function subscribeProperty(propertyName, isFirst) {
    subscribePropertyName = propertyName;

    if (propertyName == null) {
      changeItem(null, void 0, object, ValueChangeType.Subscribe, null);
    } else {
      var value = object[propertyName];

      if (typeof value !== 'undefined') {
        changeItem(propertyName, void 0, value, ValueChangeType.Subscribe, ValueKeyType.ValueProperty);
      }

      if (isFirst) {
        changeItem(propertyName, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.ValueProperty);
      }
    }
  };

  var unsubscribeProperty = function unsubscribeProperty(isLast) {
    if (subscribePropertyName == null) {
      changeItem(null, object, void 0, ValueChangeType.Unsubscribe, null);
    } else {
      if (isLast) {
        changeItem(subscribePropertyName, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty);
      }

      var value = object[subscribePropertyName];

      if (typeof value !== 'undefined') {
        changeItem(subscribePropertyName, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty);
      }
    }

    subscribePropertyName = null;
  };

  var propertyChanged = object.propertyChanged;
  var unsubscribe;
  var subscribed;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(function (_ref2) {
      var name = _ref2.name,
          oldValue = _ref2.oldValue,
          newValue = _ref2.newValue;

      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      }

      var newSubscribePropertyName = getSubscribePropertyName();

      if (name === subscribePropertyName) {
        if (subscribePropertyName === newSubscribePropertyName && subscribePropertyName != null && unsubscribe != null && typeof oldValue !== 'undefined' && typeof newValue !== 'undefined') {
          changeItem(subscribePropertyName, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.ValueProperty);
          return;
        }

        if (typeof oldValue !== 'undefined') {
          changeItem(subscribePropertyName, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ValueProperty);
        }
      } else if (subscribePropertyName !== newSubscribePropertyName) {
        unsubscribeProperty(false);
      } else {
        return;
      }

      if (unsubscribe != null) {
        subscribeProperty(newSubscribePropertyName, false);
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  if (immediateSubscribe) {
    subscribeProperty(getSubscribePropertyName(), true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    unsubscribeProperty(true);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
function hasDefaultProperty(object) {
  return object instanceof Object && ( VALUE_PROPERTY_DEFAULT in object ) && object.constructor !== Object && !isArray$3(object);
}

function subscribeObject(propertyNames, propertyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!(object instanceof Object)) {
    return null;
  }

  var propertyChanged = object.propertyChanged;
  var unsubscribe;
  var subscribed;

  if (propertyChanged) {
    unsubscribe = checkIsFuncOrNull(propertyChanged.subscribe(function (_ref3) {
      var name = _ref3.name,
          oldValue = _ref3.oldValue,
          newValue = _ref3.newValue;

      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      } // PROF: 623 - 1.3%


      if (!propertyPredicate || propertyPredicate(name, object)) {
        if (unsubscribe && typeof oldValue !== 'undefined' && typeof newValue !== 'undefined') {
          changeItem(name, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.Property);
        } else {
          if (typeof oldValue !== 'undefined') {
            changeItem(name, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
          }

          if (unsubscribe && typeof newValue !== 'undefined') {
            changeItem(name, void 0, newValue, ValueChangeType.Subscribe, ValueKeyType.Property);
          }
        }
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  var forEach = function forEach(isSubscribe) {
    if (propertyNames == null) {
      for (var propertyName in object) {
        if ( (!propertyPredicate || propertyPredicate(propertyName, object))) {
          if (isSubscribe) {
            changeItem(propertyName, void 0, object[propertyName], ValueChangeType.Subscribe, ValueKeyType.Property);
          } else {
            changeItem(propertyName, object[propertyName], void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
          }
        }
      }
    } else {
      if (isArray$3(propertyNames)) {
        for (var i = 0, len = propertyNames.length; i < len; i++) {
          var _propertyName = propertyNames[i];

          if (!isSubscribe) {
            changeItem(_propertyName, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
          }

          if ( _propertyName in object ) {
            var value = object[_propertyName];

            if (typeof value !== 'undefined') {
              if (isSubscribe) {
                changeItem(_propertyName, void 0, value, ValueChangeType.Subscribe, ValueKeyType.Property);
              } else {
                changeItem(_propertyName, value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
              }
            }
          }

          if (isSubscribe) {
            changeItem(_propertyName, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.Property);
          }
        }
      } else {
        if (!isSubscribe) {
          changeItem(propertyNames, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
        }

        if ( propertyNames in object ) {
          var _value = object[propertyNames];

          if (typeof _value !== 'undefined') {
            if (isSubscribe) {
              changeItem(propertyNames, void 0, _value, ValueChangeType.Subscribe, ValueKeyType.Property);
            } else {
              changeItem(propertyNames, _value, void 0, ValueChangeType.Unsubscribe, ValueKeyType.Property);
            }
          }
        }

        if (isSubscribe) {
          changeItem(propertyNames, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.Property);
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEach(false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeIterable


function subscribeIterable(object, immediateSubscribe, changeItem) {
  if (!object || typeof object === 'string' || !isIterable$2(object)) {
    return null;
  }

  if (immediateSubscribe) {
    forEachCollection(object, changeItem, true);
  } else {
    return null;
  }

  return function () {
    forEachCollection(object, changeItem, false);
  };
} // endregion
// region subscribeList


function subscribeList(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[toStringTag$2] !== 'List') {
    return null;
  }

  var listChanged = object.listChanged;
  var unsubscribe;
  var subscribed;

  if (listChanged) {
    unsubscribe = checkIsFuncOrNull(listChanged.subscribe(function (_ref4) {
      var type = _ref4.type,
          oldItems = _ref4.oldItems,
          newItems = _ref4.newItems;

      if (!subscribed) {
        return;
      }

      switch (type) {
        case ListChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              changeItem(null, void 0, newItems[i], ValueChangeType.Subscribe, ValueKeyType.CollectionAny);
            }
          }

          break;

        case ListChangedType.Removed:
          for (var _i2 = 0, _len = oldItems.length; _i2 < _len; _i2++) {
            changeItem(null, oldItems[_i2], void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny);
          }

          break;

        case ListChangedType.Set:
          if (unsubscribe) {
            changeItem(null, oldItems[0], newItems[0], ValueChangeType.Changed, ValueKeyType.CollectionAny);
          } else if (oldItems[0] !== newItems[0]) {
            changeItem(null, oldItems[0], void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny);
          }

          break;
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  if (immediateSubscribe) {
    forEachCollection(object, changeItem, true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEachCollection(object, changeItem, false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeSet


function subscribeSet(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[toStringTag$2] !== 'Set' && !(object instanceof set$4)) {
    return null;
  }

  var setChanged = object.setChanged;
  var unsubscribe;
  var subscribed;

  if (setChanged) {
    unsubscribe = checkIsFuncOrNull(setChanged.subscribe(function (_ref5) {
      var type = _ref5.type,
          oldItems = _ref5.oldItems,
          newItems = _ref5.newItems;

      if (!subscribed) {
        return;
      }

      switch (type) {
        case SetChangedType.Added:
          if (unsubscribe) {
            for (var i = 0, len = newItems.length; i < len; i++) {
              changeItem(null, void 0, newItems[i], ValueChangeType.Subscribe, ValueKeyType.CollectionAny);
            }
          }

          break;

        case SetChangedType.Removed:
          for (var _i3 = 0, _len2 = oldItems.length; _i3 < _len2; _i3++) {
            changeItem(null, oldItems[_i3], void 0, ValueChangeType.Unsubscribe, ValueKeyType.CollectionAny);
          }

          break;
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  if (immediateSubscribe) {
    forEachCollection(object, changeItem, true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEachCollection(object, changeItem, false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeMap


function subscribeMap(keys, keyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object || object[toStringTag$2] !== 'Map' && !(object instanceof map$7)) {
    return null;
  }

  var mapChanged = object.mapChanged;
  var unsubscribe;
  var subscribed;

  if (mapChanged) {
    unsubscribe = checkIsFuncOrNull(mapChanged.subscribe(function (_ref6) {
      var type = _ref6.type,
          key = _ref6.key,
          oldValue = _ref6.oldValue,
          newValue = _ref6.newValue;

      if (!subscribed || !unsubscribe && oldValue === newValue) {
        return;
      }

      if (!keyPredicate || keyPredicate(key, object)) {
        switch (type) {
          case MapChangedType.Added:
            if (unsubscribe) {
              changeItem(key, void 0, newValue, ValueChangeType.Subscribe, ValueKeyType.MapKey);
            }

            break;

          case MapChangedType.Removed:
            changeItem(key, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
            break;

          case MapChangedType.Set:
            if (unsubscribe) {
              changeItem(key, oldValue, newValue, ValueChangeType.Changed, ValueKeyType.MapKey);
            } else {
              changeItem(key, oldValue, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
            }

            break;
        }
      }
    }, {
      propertiesPath: propertiesPath,
      rule: rule
    }));
  }

  var forEach = function forEach(isSubscribe) {
    if (keys) {
      for (var i = 0, len = keys.length; i < len; i++) {
        var key = keys[i];

        if (!isSubscribe) {
          changeItem(key, void 0, void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
        }

        if (object.has(key)) {
          if (isSubscribe) {
            changeItem(key, void 0, object.get(key), ValueChangeType.Subscribe, ValueKeyType.MapKey);
          } else {
            changeItem(key, object.get(key), void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
          }
        }

        if (isSubscribe) {
          changeItem(key, void 0, void 0, ValueChangeType.Subscribe, ValueKeyType.MapKey);
        }
      }
    } else {
      for (var _iterator2 = object, _isArray2 = isArray$3(_iterator2), _i4 = 0, _iterator2 = _isArray2 ? _iterator2 : getIterator$1(_iterator2);;) {
        var _ref7;

        if (_isArray2) {
          if (_i4 >= _iterator2.length) break;
          _ref7 = _iterator2[_i4++];
        } else {
          _i4 = _iterator2.next();
          if (_i4.done) break;
          _ref7 = _i4.value;
        }

        var entry = _ref7;

        if (!keyPredicate || keyPredicate(entry[0], object)) {
          if (isSubscribe) {
            changeItem(entry[0], void 0, entry[1], ValueChangeType.Subscribe, ValueKeyType.MapKey);
          } else {
            changeItem(entry[0], entry[1], void 0, ValueChangeType.Unsubscribe, ValueKeyType.MapKey);
          }
        }
      }
    }
  };

  if (immediateSubscribe) {
    forEach(true);
  } else if (unsubscribe == null) {
    return null;
  }

  subscribed = true;
  return function () {
    var _unsubscribe;

    if (unsubscribe) {
      _unsubscribe = unsubscribe;
      unsubscribe = null;
    }

    forEach(false);

    if (_unsubscribe) {
      _unsubscribe();
    }
  };
} // endregion
// region subscribeCollection


function subscribeCollection(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object) {
    return null;
  }

  var unsubscribeList = subscribeList(object, immediateSubscribe, changeItem, propertiesPath, rule);
  var unsubscribeSet = subscribeSet(object, immediateSubscribe, changeItem, propertiesPath, rule);
  var unsubscribeMap = subscribeMap(null, null, object, immediateSubscribe, changeItem, propertiesPath, rule);
  var unsubscribeIterable;

  if (!unsubscribeList && !unsubscribeSet && !unsubscribeMap) {
    unsubscribeIterable = subscribeIterable(object, immediateSubscribe, changeItem);

    if (!unsubscribeIterable) {
      return null;
    }
  }

  return function () {
    if (unsubscribeList) {
      unsubscribeList();
    }

    if (unsubscribeSet) {
      unsubscribeSet();
    }

    if (unsubscribeMap) {
      unsubscribeMap();
    }

    if (unsubscribeIterable) {
      unsubscribeIterable();
    }
  };
} // endregion
// region subscribeChange


var _changeId = 0;
function getChangeId() {
  return ++_changeId;
}

function subscribeChange(object, immediateSubscribe, changeItem, propertiesPath, rule) {
  if (!object) {
    return null;
  }

  var propertyChanged = object.propertyChanged,
      listChanged = object.listChanged,
      setChanged = object.setChanged,
      mapChanged = object.mapChanged;

  if (!propertyChanged && !listChanged && !setChanged && !mapChanged) {
    return null;
  }

  var changeId;

  var onChange = function onChange() {
    if (changeId != null) {
      var oldValue = changeId;
      changeId = getChangeId();
      changeItem(null, oldValue, changeId, ValueChangeType.Changed, ValueKeyType.ChangeCount);
    }
  };

  var unsubscribeObject = propertyChanged && propertyChanged.subscribe(onChange);
  var unsubscribeList = listChanged && listChanged.subscribe(onChange);
  var unsubscribeSet = setChanged && setChanged.subscribe(onChange);
  var unsubscribeMap = mapChanged && mapChanged.subscribe(onChange);
  changeId = getChangeId();
  changeItem(null, void 0, changeId, ValueChangeType.Subscribe, ValueKeyType.ChangeCount);
  return function () {
    if (unsubscribeObject) {
      unsubscribeObject();
    }

    if (unsubscribeList) {
      unsubscribeList();
    }

    if (unsubscribeSet) {
      unsubscribeSet();
    }

    if (unsubscribeMap) {
      unsubscribeMap();
    }

    changeItem(null, changeId, void 0, ValueChangeType.Unsubscribe, ValueKeyType.ChangeCount);
  };
} // endregion
// endregion
// region RuleSubscribeObject


function createPropertyPredicate(propertyNames) {
  if (!propertyNames || !propertyNames.length) {
    return null;
  }

  if (propertyNames.length === 1) {
    var propertyName = propertyNames[0] + '';

    if (propertyName === ANY) {
      return null;
    }

    return function (propName) {
      // PROF: 226 - 0.5%
      return propName === propertyName;
    };
  } else {
    var propertyNamesMap = {};

    for (var i = 0, len = propertyNames.length; i < len; i++) {
      var _propertyName2 = propertyNames[i] + '';

      if (_propertyName2 === ANY) {
        return null;
      }

      propertyNamesMap[_propertyName2] = true;
    }

    return function (propName) {
      return !!propertyNamesMap[propName];
    };
  }
}

var SubscribeObjectType;

(function (SubscribeObjectType) {
  SubscribeObjectType[SubscribeObjectType["Property"] = 0] = "Property";
  SubscribeObjectType[SubscribeObjectType["ValueProperty"] = 1] = "ValueProperty";
})(SubscribeObjectType || (SubscribeObjectType = {}));

var RuleSubscribe =
/*#__PURE__*/
function (_Rule) {
  _inherits(RuleSubscribe, _Rule);

  function RuleSubscribe(description) {
    _classCallCheck(this, RuleSubscribe);

    return _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribe).call(this, RuleType.Action, description));
  }

  _createClass(RuleSubscribe, [{
    key: "clone",
    value: function clone() {
      var clone = _get(_getPrototypeOf(RuleSubscribe.prototype), "clone", this).call(this);

      var subscribe = this.subscribe;

      if (subscribe != null) {
        clone.subscribe = subscribe;
      }

      if (this.unsubscribers) {
        clone.unsubscribers = [];
      }

      if (this.unsubscribersCount) {
        clone.unsubscribersCount = [];
      }

      return clone;
    }
  }]);

  return RuleSubscribe;
}(Rule);
var RuleSubscribeObject =
/*#__PURE__*/
function (_RuleSubscribe) {
  _inherits(RuleSubscribeObject, _RuleSubscribe);

  function RuleSubscribeObject(type, propertyPredicate, description) {
    var _this;

    for (var _len3 = arguments.length, propertyNames = new Array(_len3 > 3 ? _len3 - 3 : 0), _key = 3; _key < _len3; _key++) {
      propertyNames[_key - 3] = arguments[_key];
    }

    _classCallCheck(this, RuleSubscribeObject);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeObject).call(this, description));

    if (propertyNames && !propertyNames.length) {
      propertyNames = null;
    }

    if (propertyPredicate) {
      if (typeof propertyPredicate !== 'function') {
        throw new Error("propertyPredicate (" + propertyPredicate + ") is not a function");
      }
    } else if (type === SubscribeObjectType.Property) {
      propertyPredicate = createPropertyPredicate(propertyNames);

      if (!propertyPredicate) {
        propertyNames = null;
      }
    }

    switch (type) {
      case SubscribeObjectType.Property:
        // @ts-ignore
        _this.subscribe = bind$6(subscribeObject).call(subscribeObject, null, propertyNames, propertyPredicate);
        break;

      case SubscribeObjectType.ValueProperty:
        _this.subType = type; // @ts-ignore

        _this.subscribe = bind$6(subscribeObjectValue).call(subscribeObjectValue, null, propertyNames);
        break;

      default:
        throw new Error("Unknown SubscribeObjectType: " + type);
    }

    return _this;
  }

  return RuleSubscribeObject;
}(RuleSubscribe); // endregion
// region RuleSubscribeMap

function createKeyPredicate(keys) {
  if (!keys || !keys.length) {
    return null;
  }

  if (keys.length === 1) {
    var key = keys[0]; // @ts-ignore

    if (key === ANY) {
      return null;
    }

    return function (k) {
      return k === key;
    };
  } else {
    for (var i = 0, len = keys.length; i < len; i++) {
      var _key2 = keys[i]; // @ts-ignore

      if (_key2 === ANY) {
        return null;
      }
    }

    return function (k) {
      return indexOf$5(keys).call(keys, k) >= 0;
    };
  }
}

var RuleSubscribeMap =
/*#__PURE__*/
function (_RuleSubscribe2) {
  _inherits(RuleSubscribeMap, _RuleSubscribe2);

  function RuleSubscribeMap(keyPredicate, description) {
    var _this2;

    for (var _len4 = arguments.length, keys = new Array(_len4 > 2 ? _len4 - 2 : 0), _key3 = 2; _key3 < _len4; _key3++) {
      keys[_key3 - 2] = arguments[_key3];
    }

    _classCallCheck(this, RuleSubscribeMap);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeMap).call(this, description));

    if (keys && !keys.length) {
      keys = null;
    }

    if (keyPredicate) {
      if (typeof keyPredicate !== 'function') {
        throw new Error("keyPredicate (" + keyPredicate + ") is not a function");
      }
    } else {
      keyPredicate = createKeyPredicate(keys);

      if (!keyPredicate) {
        keys = null;
      }
    } // @ts-ignore


    _this2.subscribe = bind$6(subscribeMap).call(subscribeMap, null, keys, keyPredicate);
    return _this2;
  }

  return RuleSubscribeMap;
}(RuleSubscribe); // endregion
// region RuleSubscribeCollection

var RuleSubscribeCollection =
/*#__PURE__*/
function (_RuleSubscribe3) {
  _inherits(RuleSubscribeCollection, _RuleSubscribe3);

  function RuleSubscribeCollection(description) {
    var _this3;

    _classCallCheck(this, RuleSubscribeCollection);

    _this3 = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeCollection).call(this, description)); // @ts-ignore

    _this3.subscribe = subscribeCollection;
    return _this3;
  }

  return RuleSubscribeCollection;
}(RuleSubscribe); // endregion
// region RuleSubscribeChange

var RuleSubscribeChange =
/*#__PURE__*/
function (_RuleSubscribe4) {
  _inherits(RuleSubscribeChange, _RuleSubscribe4);

  function RuleSubscribeChange(description) {
    var _this4;

    _classCallCheck(this, RuleSubscribeChange);

    _this4 = _possibleConstructorReturn(this, _getPrototypeOf(RuleSubscribeChange).call(this, description)); // @ts-ignore

    _this4.subscribe = subscribeChange;
    return _this4;
  }

  return RuleSubscribeChange;
}(RuleSubscribe); // endregion

var RuleSubscribeObjectPropertyNames = bind$6(RuleSubscribeObject).call(RuleSubscribeObject, null, SubscribeObjectType.Property, null);

var RuleSubscribeObjectValuePropertyNames = bind$6(RuleSubscribeObject).call(RuleSubscribeObject, null, SubscribeObjectType.ValueProperty, null);

var RuleSubscribeMapKeys = bind$6(RuleSubscribeMap).call(RuleSubscribeMap, null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
// let nextUnsubscribePropertyId = 0


var RuleBuilder =
/*#__PURE__*/
function () {
  function RuleBuilder(_temp) {
    var _ref = _temp === void 0 ? {} : _temp,
        rule = _ref.rule,
        _ref$valuePropertyDef = _ref.valuePropertyDefaultName,
        valuePropertyDefaultName = _ref$valuePropertyDef === void 0 ? VALUE_PROPERTY_DEFAULT : _ref$valuePropertyDef,
        _ref$autoInsertValueP = _ref.autoInsertValuePropertyDefault,
        autoInsertValuePropertyDefault = _ref$autoInsertValueP === void 0 ? true : _ref$autoInsertValueP;

    _classCallCheck(this, RuleBuilder);

    this.valuePropertyDefaultName = valuePropertyDefaultName;
    this.autoInsertValuePropertyDefault = autoInsertValuePropertyDefault;

    if (rule != null) {
      this.ruleFirst = rule;
      var ruleLast;

      do {
        ruleLast = rule;
        rule = rule.next;
      } while (rule != null);

      this.ruleLast = ruleLast;
    }
  }

  _createClass(RuleBuilder, [{
    key: "changeValuePropertyDefault",
    value: function changeValuePropertyDefault(propertyName) {
      this.valuePropertyDefaultName = propertyName;
      return this;
    }
  }, {
    key: "noAutoRules",
    value: function noAutoRules() {
      this.autoInsertValuePropertyDefault = false;
      return this;
    }
  }, {
    key: "result",
    value: function result() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleFirst;
    }
  }, {
    key: "valuePropertyDefault",
    value: function valuePropertyDefault() {
      var _context,
          _this = this;

      return repeat$2(_context = this).call(_context, 0, 10, function (o) {
        return hasDefaultProperty(o) ? RuleRepeatAction.Next : RuleRepeatAction.Fork;
      }, function (b) {
        return b.ruleSubscribe(_this.valuePropertyDefaultName === VALUE_PROPERTY_DEFAULT ? new RuleSubscribeObjectPropertyNames(VALUE_PROPERTY_PREFIX, VALUE_PROPERTY_DEFAULT) : new RuleSubscribeObjectValuePropertyNames(VALUE_PROPERTY_PREFIX + _this.valuePropertyDefaultName, _this.valuePropertyDefaultName));
      });
    }
  }, {
    key: "rule",
    value: function rule(_rule) {
      var ruleLast = this.ruleLast;

      if (ruleLast) {
        ruleLast.next = _rule;
      } else {
        this.ruleFirst = _rule;
      }

      this.ruleLast = _rule;
      return this;
    }
  }, {
    key: "ruleSubscribe",
    value: function ruleSubscribe(_ruleSubscribe) {
      if (_ruleSubscribe.unsubscribers) {
        throw new Error('You should not add duplicate IRuleSubscribe instances. Clone rule before add.');
      }

      _ruleSubscribe.unsubscribers = [];
      _ruleSubscribe.unsubscribersCount = [];
      return this.rule(_ruleSubscribe);
    }
  }, {
    key: "nothing",
    value: function nothing() {
      return this.rule(new RuleNothing());
    }
  }, {
    key: "never",
    value: function never() {
      return this.rule(RuleNever.instance);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "valuePropertyName",
    value: function valuePropertyName(propertyName) {
      return this.if([function (o) {
        return typeof o === 'undefined';
      }, function (b) {
        return b.never();
      }], [function (o) {
        return o instanceof Object && o.constructor !== Object && !isArray$3(o);
      }, function (b) {
        return b.ruleSubscribe(new RuleSubscribeObjectValuePropertyNames(VALUE_PROPERTY_PREFIX + propertyName, propertyName));
      }]);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "valuePropertyNames",
    value: function valuePropertyNames() {
      for (var _len = arguments.length, propertiesNames = new Array(_len), _key = 0; _key < _len; _key++) {
        propertiesNames[_key] = arguments[_key];
      }

      return this.if([function (o) {
        return typeof o === 'undefined';
      }, function (b) {
        return b.never();
      }], [function (o) {
        return o instanceof Object && o.constructor !== Object && !isArray$3(o);
      }, function (b) {
        var _context2;

        return b.ruleSubscribe(_construct(RuleSubscribeObjectValuePropertyNames, concat$2(_context2 = [VALUE_PROPERTY_PREFIX + propertiesNames.join('|')]).call(_context2, propertiesNames)));
      }]);
    }
    /**
     * valuePropertyNames - Object property, Array index
     */

  }, {
    key: "v",
    value: function v() {
      return this.valuePropertyNames.apply(this, arguments);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyName",
    value: function propertyName(_propertyName) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(_propertyName, _propertyName));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyNames",
    value: function propertyNames() {
      var _context3;

      for (var _len2 = arguments.length, propertiesNames = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        propertiesNames[_key2] = arguments[_key2];
      }

      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(_construct(RuleSubscribeObjectPropertyNames, concat$2(_context3 = [propertiesNames.join('|')]).call(_context3, propertiesNames)));
    }
    /**
     * propertyNames
     * @param propertiesNames
     */

  }, {
    key: "p",
    value: function p() {
      return this.propertyNames.apply(this, arguments);
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyAny",
    value: function propertyAny() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObjectPropertyNames(ANY_DISPLAY));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyPredicate",
    value: function propertyPredicate(predicate, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeObject(SubscribeObjectType.Property, predicate, description));
    }
    /**
     * Object property, Array index
     */

  }, {
    key: "propertyRegexp",
    value: function propertyRegexp(regexp) {
      if (!(regexp instanceof RegExp)) {
        throw new Error("regexp (" + regexp + ") is not instance of RegExp");
      }

      return this.propertyPredicate(function (name) {
        return regexp.test(name);
      }, regexp.toString());
    }
    /**
     * IListChanged & Iterable, ISetChanged & Iterable, IMapChanged & Iterable, Iterable
     */

  }, {
    key: "collection",
    value: function collection() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeCollection(COLLECTION_PREFIX));
    }
  }, {
    key: "change",
    value: function change() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeChange(CHANGE_COUNT_PREFIX));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKey",
    value: function mapKey(key) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMapKeys(COLLECTION_PREFIX + key, key));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapKeys",
    value: function mapKeys() {
      var _context4;

      for (var _len3 = arguments.length, keys = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        keys[_key3] = arguments[_key3];
      }

      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(_construct(RuleSubscribeMapKeys, concat$2(_context4 = [COLLECTION_PREFIX + keys.join('|')]).call(_context4, keys)));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapAny",
    value: function mapAny() {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMap(null, COLLECTION_PREFIX));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapPredicate",
    value: function mapPredicate(keyPredicate, description) {
      return (this.autoInsertValuePropertyDefault ? this.valuePropertyDefault() : this).ruleSubscribe(new RuleSubscribeMap(keyPredicate, description));
    }
    /**
     * IMapChanged & Map, Map
     */

  }, {
    key: "mapRegexp",
    value: function mapRegexp(keyRegexp) {
      if (!(keyRegexp instanceof RegExp)) {
        throw new Error("keyRegexp (" + keyRegexp + ") is not instance of RegExp");
      }

      return this.mapPredicate(function (name) {
        return keyRegexp.test(name);
      }, keyRegexp.toString());
    }
    /**
     * @deprecated because babel transform object.map property to unparseable code
     */

  }, {
    key: "path",
    value: function path(getValueFunc) // public path<TValue>(getValueFunc: RuleGetValueFunc<TObject, TValue, TValueKeys>)
    // 	: RuleBuilder<TRulePathObjectValueOf<TValue>, TValueKeys>
    {
      for (var _iterator = getFuncPropertiesPath(getValueFunc), _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        var propertyNames = _ref2;

        if (startsWith$2(propertyNames).call(propertyNames, COLLECTION_PREFIX)) {
          var keys = propertyNames.substring(1);

          if (keys === '') {
            this.collection();
          } else {
            this.mapKeys.apply(this, keys.split('|'));
          }
        } else if (startsWith$2(propertyNames).call(propertyNames, VALUE_PROPERTY_PREFIX)) {
          var valuePropertyNames = propertyNames.substring(1);

          if (valuePropertyNames === '') {
            throw new Error("You should specify at least one value property name; path = " + getValueFunc);
          } else {
            this.valuePropertyNames.apply(this, valuePropertyNames.split('|'));
          }
        } else {
          this.propertyNames.apply(this, propertyNames.split('|'));
        }
      }

      return this;
    }
  }, {
    key: "if",
    value: function _if() {
      var _this2 = this;

      for (var _len4 = arguments.length, exclusiveConditionRules = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        exclusiveConditionRules[_key4] = arguments[_key4];
      }

      if (exclusiveConditionRules.length === 0) {
        throw new Error('if() parameters is empty');
      }

      var rule = new RuleIf(map$2(exclusiveConditionRules).call(exclusiveConditionRules, function (o) {
        if (isArray$3(o)) {
          return [o[0], o[1](_this2.clone(true)).ruleFirst];
        } else {
          return o(_this2.clone(true)).ruleFirst;
        }
      }));
      return this.rule(rule);
    }
  }, {
    key: "any",
    value: function any() {
      var _this3 = this;

      for (var _len5 = arguments.length, getChilds = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        getChilds[_key5] = arguments[_key5];
      }

      if (getChilds.length === 0) {
        throw new Error('any() parameters is empty');
      }

      var rule = new RuleAny(map$2(getChilds).call(getChilds, function (o) {
        var subRule = o(_this3.clone(true)).result();

        if (!subRule) {
          throw new Error("Any subRule=" + rule);
        }

        return subRule;
      }));
      return this.rule(rule);
    }
  }, {
    key: "repeat",
    value: function repeat(countMin, countMax, condition, getChild) {
      var subRule = getChild(this.clone(true)).ruleFirst;

      if (!subRule) {
        throw new Error("getChild(...).rule = " + subRule);
      }

      if (countMax == null) {
        countMax = maxSafeInteger$2;
      }

      if (countMin == null) {
        countMin = 0;
      } // if (countMax < countMin || countMax <= 0) {
      // 	return this as unknown as RuleBuilder<TValue, TValueKeys>
      // }


      var rule;

      if (countMax === countMin && countMax === 1 && !condition) {
        rule = subRule;
      } else {
        rule = new RuleRepeat(countMin, countMax, condition, getChild(this.clone(true)).ruleFirst);
      }

      return this.rule(rule);
    }
  }, {
    key: "clone",
    value: function clone(optionsOnly) {
      return new RuleBuilder({
        rule: optionsOnly || !this.ruleFirst ? null : this.ruleFirst.clone(),
        valuePropertyDefaultName: this.valuePropertyDefaultName,
        autoInsertValuePropertyDefault: this.autoInsertValuePropertyDefault
      });
    }
  }]);

  return RuleBuilder;
}(); // Test:
// interface ITestInterface1 {
// 	y: number
// }
//
// interface ITestInterface2 {
// 	x: ITestInterface1
// }
//
// export const test = new RuleBuilder<ITestInterface2>()
// 	.path(o => o.x)

// let nextUnsubscribePropertyId = 0

function getRuleType(iteration) {
  return iteration && (iteration.done ? null : isArray$3(iteration.value) ? iteration.value.length ? iteration.value[0].type : null : iteration.value.type);
}

function catchHandler(ex, propertiesPath) {
  if (ex.propertiesPath) {
    throw ex;
  }

  var propertiesPathStr = propertiesPath + '';
  ex.propertiesPath = propertiesPathStr;
  ex.message += "\nObject property path: " + propertiesPathStr;
  throw ex;
}

function subscribeNext(object, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent, rule, iteration) {
  if (!iteration && ruleIterator) {
    iteration = ruleIterator.next(); // if (isIterator(iteration.value)) {
    // 	throw new Error('deepSubscribe internal error: iteration.value is iterator')
    // }
  }

  var isLeaf = !iteration || iteration.done;

  if (!isLeaf && iteration.value.type === RuleType.Never) {
    return null;
  } // region resolve value


  {
    // tslint:disable-next-line
    object = resolveAsync(object);

    if (isThenable$1(object)) {
      var unsubscribe;
      resolveAsync(object, function (o) {
        if (!unsubscribe) {
          unsubscribe = checkIsFuncOrNull(subscribeNext(o, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent, rule, iteration));
        }

        return o;
      }, function (err) {
        catchHandler(err, propertiesPath);
      });
      return function () {
        if (typeof unsubscribe === 'function') {
          unsubscribe();
        }

        unsubscribe = true;
      };
    }
  } // endregion

  var unsubscribers;
  var unsubscribersCount;

  if (isLeaf) {
    return valueSubscriber.change(objectKey, void 0, object, parent, ValueChangeType.Subscribe, objectKeyType, propertiesPath, rule);
  }

  function subscribeNode(rule, getNextRuleIterable) {
    var catchHandlerItem = function catchHandlerItem(err, value, key, keyType) {
      catchHandler(err, new PropertiesPath(value, propertiesPath, key, keyType, rule));
    };

    var changeNext = function changeNext(key, oldItem, newItem, changeType, keyType, parent, newPropertiesPath, iterator, iteration) {
      if ((changeType & ValueChangeType.Unsubscribe) !== 0 && oldItem instanceof Object && unsubscribers) {
        var itemUniqueId = getObjectUniqueId(oldItem);
        var unsubscribeCount = unsubscribersCount[itemUniqueId];

        if (unsubscribeCount) {
          if (unsubscribeCount > 1) {
            unsubscribersCount[itemUniqueId] = unsubscribeCount - 1;
          } else {
            var _unsubscribe = unsubscribers[itemUniqueId]; // unsubscribers[itemUniqueId] = null // faster but there is a danger of memory overflow with nulls

            delete unsubscribers[itemUniqueId];
            delete unsubscribersCount[itemUniqueId];

            if (isArray$3(_unsubscribe)) {
              for (var i = 0, len = _unsubscribe.length; i < len; i++) {
                _unsubscribe[i]();
              }
            } else {
              _unsubscribe();
            }
          }
        }
      }

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        var _unsubscribe2;

        var _itemUniqueId;

        if (newItem instanceof Object) {
          if (!unsubscribers) {
            unsubscribers = rule.unsubscribers; // + '_' + (nextUnsubscribePropertyId++)

            unsubscribersCount = rule.unsubscribersCount;
          }

          _itemUniqueId = getObjectUniqueId(newItem);
          _unsubscribe2 = unsubscribers[_itemUniqueId];
        }

        if (_unsubscribe2) {
          unsubscribersCount[_itemUniqueId]++;
        } else {
          _unsubscribe2 = checkIsFuncOrNull(subscribeNext(newItem, valueSubscriber, immediate, iterator, newPropertiesPath, key, keyType, parent, rule, iteration));

          if (_unsubscribe2) {
            if (!(newItem instanceof Object)) {
              _unsubscribe2();

              throw new Error('You should not return unsubscribe function for non Object value.\n' + 'For subscribe value types use their object wrappers: Number, Boolean, String classes.\n' + ("Unsubscribe function: " + _unsubscribe2 + "\nValue: " + newItem + "\n") + ("Value property path: " + new PropertiesPath(newItem, propertiesPath, key, keyType, rule)));
            } else {
              var chainUnsubscribe = unsubscribers[_itemUniqueId];

              if (!chainUnsubscribe) {
                unsubscribers[_itemUniqueId] = _unsubscribe2;
                unsubscribersCount[_itemUniqueId] = 1;
              } else {
                if (isArray$3(chainUnsubscribe)) {
                  chainUnsubscribe.push(_unsubscribe2);
                } else {
                  unsubscribers[_itemUniqueId] = [chainUnsubscribe, _unsubscribe2];
                  unsubscribersCount[_itemUniqueId] = 1;
                }
              }
            }
          }
        }
      }
    };

    var changeLeaf = function changeLeaf(key, oldItem, newItem, changeType, keyType, parent, newPropertiesPath) {
      checkIsFuncOrNull(valueSubscriber.change(key, oldItem, newItem, parent, changeType, keyType, newPropertiesPath, rule));
    };

    var changeItem = function changeItem(key, oldItem, newItem, changeType, keyType) {
      var debugOldIsLeaf;
      var oldIsLeaf;

      if ((changeType & ValueChangeType.Unsubscribe) !== 0) {
        var oldItemIterator = getNextRuleIterable && getIterator$1(getNextRuleIterable(oldItem));

        var oldItemIteration = oldItemIterator && oldItemIterator.next();
        var nextRuleType = getRuleType(oldItemIteration);

        if (nextRuleType == null || nextRuleType !== RuleType.Never && typeof oldItem !== 'undefined') {
          debugOldIsLeaf = nextRuleType == null;
          oldIsLeaf = nextRuleType == null && !(oldItem instanceof Object);
        }
      }

      var debugNewIsLeaf;
      var newIsLeaf;
      var newItemIterator;
      var newItemIteration;

      if ((changeType & ValueChangeType.Subscribe) !== 0) {
        newItemIterator = getNextRuleIterable && getIterator$1(getNextRuleIterable(newItem));
        newItemIteration = newItemIterator && newItemIterator.next();

        var _nextRuleType = getRuleType(newItemIteration);

        if (_nextRuleType == null || _nextRuleType !== RuleType.Never && typeof newItem !== 'undefined') {
          debugNewIsLeaf = _nextRuleType == null;
          newIsLeaf = _nextRuleType == null && !(newItem instanceof Object);
        }
      }

      var itemParent = object;

      if (keyType == null) {
        key = objectKey;
        itemParent = parent;
      }

      var newPropertiesPath = new PropertiesPath(newItem, propertiesPath, key, keyType, rule);
      Debugger.Instance.onDeepSubscribe(key, oldItem, newItem, itemParent, changeType, keyType, newPropertiesPath, rule, debugOldIsLeaf, debugNewIsLeaf, valueSubscriber.debugTarget);

      if (oldIsLeaf === newIsLeaf) {
        if (newIsLeaf != null) {
          if (newIsLeaf) {
            changeLeaf(key, oldItem, newItem, changeType, keyType, itemParent, newPropertiesPath);
          } else {
            changeNext(key, oldItem, newItem, changeType, keyType, itemParent, newPropertiesPath, newItemIterator, newItemIteration);
          }
        }
      } else {
        if (oldIsLeaf != null) {
          if (oldIsLeaf) {
            changeLeaf(key, oldItem, void 0, ValueChangeType.Unsubscribe, keyType, itemParent, newPropertiesPath);
          } else {
            changeNext(key, oldItem, void 0, ValueChangeType.Unsubscribe, keyType, itemParent, newPropertiesPath, newItemIterator, newItemIteration);
          }
        }

        if (newIsLeaf != null) {
          if (newIsLeaf) {
            changeLeaf(key, void 0, newItem, ValueChangeType.Subscribe, keyType, itemParent, newPropertiesPath);
          } else {
            changeNext(key, void 0, newItem, ValueChangeType.Subscribe, keyType, itemParent, newPropertiesPath, newItemIterator, newItemIteration);
          }
        }
      }
    };

    return checkIsFuncOrNull(rule.subscribe(object, immediate, function (key, oldItem, newItem, changeType, keyType) {
      oldItem = resolveAsync(oldItem);
      newItem = resolveAsync(newItem);

      if (!isThenable$1(oldItem) && !isThenable$1(newItem)) {
        try {
          changeItem(key, oldItem, newItem, changeType, keyType);
        } catch (err) {
          catchHandlerItem(err, newItem, key, keyType);
        }

        return;
      }

      resolveAsync(resolveAsync(oldItem, function (o) {
        oldItem = o;
        return newItem;
      }, null, true), function (o) {
        newItem = o;
        changeItem(key, oldItem, newItem, changeType, keyType);
      }, function (err) {
        catchHandlerItem(err, newItem, key, keyType);
      });
    }, propertiesPath, rule));
  }

  return subscribeNextRule(ruleIterator, iteration, function (nextRuleIterator) {
    return deepSubscribeRuleIterator(object, valueSubscriber, immediate, nextRuleIterator, propertiesPath, objectKey, parent);
  }, subscribeNode);
}

function deepSubscribeRuleIterator(object, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent) {
  if (!immediate) {
    throw new Error('immediate == false is deprecated');
  }

  try {
    return subscribeNext(object, valueSubscriber, immediate, ruleIterator, propertiesPath, objectKey, objectKeyType, parent);
  } catch (err) {
    catchHandler(err, propertiesPath);
    return null;
  }
}

function deepSubscribeRule(_ref) {
  var object = _ref.object,
      changeValue = _ref.changeValue,
      lastValue = _ref.lastValue,
      debugTarget = _ref.debugTarget,
      _ref$immediate = _ref.immediate,
      immediate = _ref$immediate === void 0 ? true : _ref$immediate,
      rule = _ref.rule;
  return toSingleCall(deepSubscribeRuleIterator(object, new ObjectSubscriber(changeValue, lastValue, debugTarget), immediate, getIterator$1(iterateRule(object, rule)), // @ts-ignore
  new PropertiesPath(object)));
}
function deepSubscribe(_ref2) {
  var object = _ref2.object,
      changeValue = _ref2.changeValue,
      lastValue = _ref2.lastValue,
      debugTarget = _ref2.debugTarget,
      _ref2$immediate = _ref2.immediate,
      immediate = _ref2$immediate === void 0 ? true : _ref2$immediate,
      ruleBuilder = _ref2.ruleBuilder;
  return toSingleCall(deepSubscribeRule({
    object: object,
    changeValue: changeValue,
    lastValue: lastValue,
    debugTarget: debugTarget,
    immediate: immediate,
    rule: ruleBuilder(new RuleBuilder()).result()
  }));
}

var DependenciesBuilder =
/*#__PURE__*/
function () {
  function DependenciesBuilder(buildSourceRule) {
    _classCallCheck(this, DependenciesBuilder);

    this.dependencies = [];
    this.buildSourceRule = buildSourceRule;
  }

  _createClass(DependenciesBuilder, [{
    key: "actionOn",
    value: function actionOn(buildRule, action, predicate) {
      var buildSourceRule = this.buildSourceRule;
      var ruleBuilder = new RuleBuilder();

      if (buildSourceRule) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result();

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      this.dependencies.push([ruleBase, predicate ? function (target, value, parent, key, keyType, propertiesPath, rule) {
        // prevent circular self dependency
        if (target === parent) {
          return;
        }

        if (predicate(value, parent, key, keyType, propertiesPath, rule)) {
          action(target, value, parent, key, keyType, propertiesPath, rule);
        }
      } : action]);
      return this;
    }
  }]);

  return DependenciesBuilder;
}();
function subscribeDependencies(subscribeObject, actionTarget, dependencies, states) {
  var unsubscribers = [];

  var _loop = function _loop(i, len) {
    var _dependencies$i = dependencies[i],
        _rule = _dependencies$i[0],
        action = _dependencies$i[1];
    var subscribed = void 0;
    var state = states && states[i];
    var subscribeState = state && state[i] && {};
    var unsubscribeState = void 0;
    var unsubscribe = deepSubscribeRule({
      object: subscribeObject,
      changeValue: function changeValue(key, oldValue, newValue, parent, changeType, keyType, propertiesPath, rule) {
        if (!subscribed && state) {
          var newPropertiesPath = new PropertiesPath(newValue, propertiesPath, key, keyType, rule);
          var id = newPropertiesPath.id;

          if (Object.prototype.hasOwnProperty.call(state, id)) {
            if (!subscribeState) {
              var _subscribeState;

              subscribeState = (_subscribeState = {}, _subscribeState[id] = true, _subscribeState);
            } else if (typeof newValue === 'undefined' && subscribeState[id]) {
              return;
            } else {
              subscribeState[id] = true;
            }

            var stateValue = state[id].value;

            if (webrainOptions.equalsFunc(stateValue, newValue)) {
              return;
            } // action(actionTarget, stateValue, parent, key, keyType, propertiesPath, rule)

          }
        }

        if (unsubscribeState) {
          var _newPropertiesPath = new PropertiesPath(oldValue, propertiesPath, key, keyType, rule);

          var _id = _newPropertiesPath.id;
          unsubscribeState[_id] = _newPropertiesPath;
        } else {
          action(actionTarget, newValue, parent, key, keyType, propertiesPath, rule);
        }
      },
      rule: _rule.clone(),
      debugTarget: actionTarget
    });
    unsubscribers.push(unsubscribe && function () {
      unsubscribeState = {};
      unsubscribe();
      return unsubscribeState;
    });

    if (state) {
      for (var id in state) {
        if (Object.prototype.hasOwnProperty.call(state, id) && (!subscribeState || !Object.prototype.hasOwnProperty.call(subscribeState, id))) {
          var propertiesPath = state[id];
          action(actionTarget, void 0, propertiesPath.parent && propertiesPath.parent.value, propertiesPath.key, propertiesPath.keyType, propertiesPath.parent, propertiesPath.rule);
          break;
        }
      }
    } else {
      state = null;
    }

    subscribed = true;
  };

  for (var i = 0, len = dependencies.length; i < len; i++) {
    _loop(i);
  }

  return function () {
    if (unsubscribers) {
      var _unsubscribers = unsubscribers;
      unsubscribers = null;
      return map$2(_unsubscribers).call(_unsubscribers, function (o) {
        return o && o();
      });
    }
  };
}
function dependenciesSubscriber(buildRule, action, predicate) {
  var _actionOn = new DependenciesBuilder().actionOn(buildRule, action, predicate),
      dependencies = _actionOn.dependencies;

  return function (source, target) {
    return subscribeDependencies(source, target, dependencies);
  };
}

var CalcPropertyDependenciesBuilder =
/*#__PURE__*/
function (_DependenciesBuilder) {
  _inherits(CalcPropertyDependenciesBuilder, _DependenciesBuilder);

  function CalcPropertyDependenciesBuilder(buildSourceRule) {
    _classCallCheck(this, CalcPropertyDependenciesBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalcPropertyDependenciesBuilder).call(this, buildSourceRule));
  }

  _createClass(CalcPropertyDependenciesBuilder, [{
    key: "invalidateOn",
    value: function invalidateOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target, value, parent, key, keyType) {
        Debugger.Instance.onDependencyChanged(target, value, parent, key, keyType);
        target.invalidate();
      }, predicate);
      return this;
    }
  }, {
    key: "clearOn",
    value: function clearOn(buildRule, predicate) {
      this.actionOn(buildRule, function (target, value, parent, key, keyType) {
        Debugger.Instance.onDependencyChanged(target, value, parent, key, keyType);
        target.clear();
      }, predicate);
      return this;
    }
  }]);

  return CalcPropertyDependenciesBuilder;
}(DependenciesBuilder);

function calcPropertyFactory(_ref) {
  var buildDependencies = _ref.dependencies,
      calcFunc = _ref.calcFunc,
      name = _ref.name,
      calcOptions = _ref.calcOptions,
      initValue = _ref.initValue;
  var dependencies;

  if (buildDependencies) {
    var dependenciesBuilder = new CalcPropertyDependenciesBuilder(function (b) {
      return b.propertyName('input');
    });
    buildDependencies(dependenciesBuilder);
    dependencies = dependenciesBuilder.dependencies;
  }

  return function () {
    var calcProperty = new CalcProperty({
      calcFunc: calcFunc,
      name: name,
      calcOptions: calcOptions,
      initValue: initValue
    });

    if (dependencies) {
      // subscribeDependencies(calcProperty.state, calcProperty, dependencies)
      var states;
      var unsubscribe;
      calcProperty.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
        if (unsubscribe) {
          states = unsubscribe();
          unsubscribe = null;
        }

        if (hasSubscribers) {
          unsubscribe = subscribeDependencies(calcProperty.state, calcProperty, dependencies, states);
        }
      }, "CalcProperty." + calcProperty.state.name + ".hasSubscribersObservable for subscribeDependencies");
    }

    return calcProperty;
  };
}

function setObjectValue(object, key, keyType, value) {
  switch (keyType) {
    case ValueKeyType.Property:
    case ValueKeyType.ValueProperty:
      object[key] = value;
      break;

    case ValueKeyType.MapKey:
      object.set(key, value);
      break;

    case ValueKeyType.CollectionAny:
      throw new Error('Unsupported set value for ValueKeyType.CollectionAny');

    default:
      throw new Error('Unknown ValueKeyType: ' + keyType);
  }
}

var ConnectorState =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(ConnectorState, _ObservableClass);

  function ConnectorState() {
    _classCallCheck(this, ConnectorState);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectorState).apply(this, arguments));
  }

  return ConnectorState;
}(ObservableClass);
new ObservableObjectBuilder(ConnectorState.prototype).writable('source');
var Connector =
/*#__PURE__*/
function (_ObservableClass2) {
  _inherits(Connector, _ObservableClass2);

  function Connector(source, name) {
    var _this;

    _classCallCheck(this, Connector);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Connector).call(this));
    _this.connectorState.name = name;
    _this.connectorState.source = source;
    return _this;
  }

  return Connector;
}(ObservableClass);
new ObservableObjectBuilder(Connector.prototype).readable('connectorState', {
  hidden: true,
  factory: function factory() {
    return new ConnectorState();
  }
});

var buildSourceRule = function buildSourceRule(b) {
  return b.p('source');
};

var ConnectorBuilder =
/*#__PURE__*/
function (_ObservableObjectBuil) {
  _inherits(ConnectorBuilder, _ObservableObjectBuil);

  function ConnectorBuilder(object) {
    _classCallCheck(this, ConnectorBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(ConnectorBuilder).call(this, object));
  }

  _createClass(ConnectorBuilder, [{
    key: "connect",
    value: function connect(name, buildRule, options, initValue) {
      return this._connect(false, name, buildRule, options, initValue);
    }
  }, {
    key: "connectWritable",
    value: function connectWritable(name, buildRule, options, initValue) {
      return this._connect(true, name, buildRule, options, initValue);
    }
  }, {
    key: "_connect",
    value: function _connect(writable, name, buildRule, options, initValue) {
      var object = this.object;
      var ruleBuilder = new RuleBuilder({
        valuePropertyDefaultName: 'last'
      });

      if (object instanceof Connector) {
        ruleBuilder = buildSourceRule(ruleBuilder);
      }

      ruleBuilder = buildRule(ruleBuilder);
      var ruleBase = ruleBuilder && ruleBuilder.result();

      if (ruleBase == null) {
        throw new Error('buildRule() return null or not initialized RuleBuilder');
      }

      var setOptions = options && options.setOptions; // optimization

      var baseGetValue = options && options.getValue || createFunction(function () {
        return function () {
          return this.__fields[name];
        };
      }, "return this.__fields[\"" + name + "\"]");
      var baseSetValue = options && options.setValue || createFunction(function () {
        return function (v) {
          this.__fields[name] = v;
        };
      }, 'v', "this.__fields[\"" + name + "\"] = v");
      var getValue = !writable ? baseGetValue : function () {
        return baseGetValue.call(this).value;
      };
      var setValue = !writable ? baseSetValue : function (value) {
        var baseValue = baseGetValue.call(this);
        baseValue.value = value;
      };
      var set = setOptions ? bind$6(_setExt).call(_setExt, null, name, getValue, setValue, setOptions) : bind$6(_set).call(_set, null, name, getValue, setValue);
      return this.updatable(name, {
        setOptions: setOptions,
        hidden: options && options.hidden,
        // tslint:disable-next-line:no-shadowed-variable
        factory: function factory(initValue) {
          var _this = this;

          if (writable) {
            baseSetValue.call(this, {
              value: initValue,
              parent: null,
              key: null,
              keyType: null
            });
          }

          var setVal = function setVal(obj, value) {
            if (typeof value !== 'undefined') {
              initValue = value;
            }
          };

          var receiveValue = writable ? function (value, parent, key, keyType) {
            Debugger.Instance.onConnectorChanged(_this, name, value, parent, key, keyType);
            var baseValue = baseGetValue.call(_this);
            baseValue.parent = parent;
            baseValue.key = key;
            baseValue.keyType = keyType;
            setVal(_this, value);
            return null;
          } : function (value, parent, key, keyType) {
            Debugger.Instance.onConnectorChanged(_this, name, value, parent, key, keyType);
            setVal(_this, value);
            return null;
          };
          var rule = this === object ? ruleBase : ruleBase.clone();
          this.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
            _this._setUnsubscriber(name, null);

            if (hasSubscribers) {
              var unsubscribe = deepSubscribeRule({
                object: _this instanceof Connector ? _this.connectorState : _this,
                lastValue: receiveValue,
                debugTarget: _this,
                rule: rule
              });

              if (unsubscribe) {
                _this._setUnsubscriber(name, unsubscribe);
              }
            }
          }, "Connector." + name + ".hasSubscribersObservable for deepSubscribe");
          setVal = set;
          return initValue;
        },
        update: writable && function (value) {
          var baseValue = baseGetValue.call(this);

          if (baseValue.parent != null) {
            setObjectValue(baseValue.parent, baseValue.key, baseValue.keyType, value);
          } // return value

        },
        getValue: getValue,
        setValue: setValue
      }, initValue);
    }
  }]);

  return ConnectorBuilder;
}(ObservableObjectBuilder);
function connectorClass(_ref) {
  var buildRule = _ref.buildRule,
      baseClass = _ref.baseClass;

  // @ts-ignore
  var NewConnector =
  /*#__PURE__*/
  function (_ref2) {
    _inherits(NewConnector, _ref2);

    function NewConnector() {
      _classCallCheck(this, NewConnector);

      return _possibleConstructorReturn(this, _getPrototypeOf(NewConnector).apply(this, arguments));
    }

    return NewConnector;
  }(baseClass || Connector); // @ts-ignore


  buildRule(new ConnectorBuilder(NewConnector.prototype));
  return NewConnector;
}
function connectorFactory(_ref3) {
  var name = _ref3.name,
      buildRule = _ref3.buildRule,
      baseClass = _ref3.baseClass;
  var NewConnector = connectorClass({
    buildRule: buildRule,
    baseClass: baseClass
  });
  return function (source, sourceName) {
    return new NewConnector(source, name || sourceName);
  };
} // const builder = new ConnectorBuilder(true as any)
//
// export function connect<TObject extends ObservableClass, TValue = any>(
// 	options?: IConnectFieldOptions<TObject, TValue>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.connect(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@connect()
// 	public prop: number
// }

var CalcObjectBuilder =
/*#__PURE__*/
function (_ConnectorBuilder) {
  _inherits(CalcObjectBuilder, _ConnectorBuilder);

  function CalcObjectBuilder() {
    _classCallCheck(this, CalcObjectBuilder);

    return _possibleConstructorReturn(this, _getPrototypeOf(CalcObjectBuilder).apply(this, arguments));
  }

  _createClass(CalcObjectBuilder, [{
    key: "writable",
    // @ts-ignore
    value: function writable(name, options, initValue) {
      return _get(_getPrototypeOf(CalcObjectBuilder.prototype), "writable", this).call(this, name, options, initValue);
    } // @ts-ignore

  }, {
    key: "readable",
    value: function readable(name, options, initValue) {
      return _get(_getPrototypeOf(CalcObjectBuilder.prototype), "readable", this).call(this, name, options, initValue);
    }
  }, {
    key: "calc",
    value: function calc(name, inputOrFactory, calcFactory, initValue) {
      return _get(_getPrototypeOf(CalcObjectBuilder.prototype), "readable", this).call(this, name, {
        factory: function factory() {
          var property = calcFactory(initValue);

          if (property.state.name == null) {
            property.state.name = this.constructor.name + "." + name;
          }

          return property;
        },
        init: function init(property) {
          if (typeof inputOrFactory !== 'undefined') {
            property.state.input = typeof inputOrFactory === 'function' ? inputOrFactory(this, this.constructor.name) : inputOrFactory;
          }
        }
      });
    }
  }, {
    key: "calcChanges",
    value: function calcChanges(name, buildRule) {
      return this.calc(name, void 0, calcPropertyFactory({
        dependencies: function dependencies(_dependencies) {
          return _dependencies.invalidateOn(buildRule);
        },
        calcFunc: function calcFunc(state) {
          state.value++;
        },
        initValue: 0
      }));
    }
  }, {
    key: "calcConnect",
    value: function calcConnect(name, _buildRule, options, initValue) {
      return this.calc(name, connectorFactory({
        buildRule: function buildRule(c) {
          return c.connect('value', _buildRule);
        }
      }), calcPropertyFactory({
        dependencies: function dependencies(d) {
          return d.invalidateOn(function (b) {
            return b.p('value');
          });
        },
        calcFunc: function calcFunc(state) {
          state.value = state.input.value;
        }
      }));
    }
  }]);

  return CalcObjectBuilder;
}(ConnectorBuilder); // const builder = new CalcObjectBuilder(true as any)
//
// export function calc<
// 	TObject extends ObservableClass,
// 	TInput extends new (object: TObject) => any | NotFunction<any>,
// 	TValue = any,
// 	TMergeSource = any
// >(
// 	options?: IConnectPropertyOptions<TObject, TInput, TValue, TMergeSource>,
// 	initValue?: TValue,
// ) {
// 	return (target: TObject, propertyKey: string) => {
// 		builder.object = target
// 		builder.calc(propertyKey, options, initValue)
// 	}
// }
// class Class1 extends ObservableClass {
// }
// class Class extends Class1 {
// 	@calc()
// 	public prop: number
// }

var _Symbol$toStringTag;
_Symbol$toStringTag = toStringTag$2;
var Property =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(Property, _ObservableClass);

  function Property(options, initValue) {
    var _this;

    _classCallCheck(this, Property);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Property).call(this));
    _this[_Symbol$toStringTag] = 'Property';

    var _ref = options || {},
        merger = _ref.merger,
        mergeOptions = _ref.mergeOptions;

    if (merger != null) {
      _this.merger = merger;
    }

    if (mergeOptions != null) {
      _this.mergeOptions = mergeOptions;
    }

    if (typeof initValue !== 'undefined') {
      _this.value = initValue;
    }

    return _this;
  } // region set / fill / merge


  _createClass(Property, [{
    key: "set",
    value: function set(value, clone, options) {
      var result = this.mergeValue(void 0, value, value, clone, clone, options);

      if (!result) {
        this.value = void 0;
      }

      return result;
    }
  }, {
    key: "fill",
    value: function fill(value, preferClone, options) {
      return this.mergeValue(this.value, value, value, preferClone, preferClone, options);
    }
  }, {
    key: "merge",
    value: function merge(older, newer, preferCloneOlder, preferCloneNewer, options) {
      return this.mergeValue(this.value, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region merge helpers

  }, {
    key: "mergeValue",
    value: function mergeValue(base, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return this._mergeValue((this.merger || ObjectMerger.default).merge, base, older, newer, preferCloneOlder, preferCloneNewer, options);
    }
  }, {
    key: "_mergeValue",
    value: function _mergeValue(merge, base, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this2 = this;

      if (older instanceof Property) {
        older = older.value;
      } else {
        options = _extends({}, options, {
          selfAsValueOlder: true
        });
      }

      if (newer instanceof Property) {
        newer = newer.value;
      } else {
        if (!options) {
          options = {};
        }

        options.selfAsValueNewer = true;
      }

      return merge(base, older, newer, function (o) {
        _this2.value = o;
      }, preferCloneOlder, preferCloneNewer, _extends({}, this.mergeOptions, {}, options, {
        selfAsValueOlder: !(older instanceof Property),
        selfAsValueNewer: !(newer instanceof Property)
      }));
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (webrainOptions.equalsFunc ? source.constructor === Property && webrainOptions.equalsFunc.call(this, this.value, source.value) || webrainOptions.equalsFunc.call(this, this.value, source) : source.constructor === Property && this.value === source.value || this.value === source) {
        return null;
      }

      return true;
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer) {
      return this._mergeValue(merge, this.value, older, newer, preferCloneOlder, preferCloneNewer);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        value: _serialize(this.value)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {
      var _this3 = this;

      _deSerialize(serializedValue.value, function (o) {
        return _this3.value = o;
      });
    } // endregion

  }]);

  return Property;
}(ObservableClass);
Property.uuid = '6f2c51ccd8654baa9a93226e3374ccaf';
new ObservableObjectBuilder(Property.prototype).writable('value');
registerMergeable(Property);
registerSerializable(Property);

var iterator$3 = iterator;

var iterator$4 = iterator$3;

var _Symbol$toStringTag$1, _Symbol$iterator;
_Symbol$toStringTag$1 = toStringTag$2;
_Symbol$iterator = iterator$4;
var ArraySet =
/*#__PURE__*/
function () {
  function ArraySet(array, size) {
    _classCallCheck(this, ArraySet);

    this[_Symbol$toStringTag$1] = 'Set';
    this._array = array || [];
    this._size = size || keys$3(this._array).length;
  }

  _createClass(ArraySet, [{
    key: "add",
    value: function add(value) {
      var _array = this._array;
      var id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

      if (typeof _array[id] !== 'undefined') {
        return this;
      }

      this._array[id] = value;
      this._size++;
      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _array = this._array;
      var id = getObjectUniqueId(value); // if (Object.prototype.hasOwnProperty.call(_array, id)) {

      if (typeof _array[id] === 'undefined') {
        return false;
      } // tslint:disable-next-line:no-array-delete


      delete _array[id];
      this._size--;
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _array = this._array;

      for (var id in _array) {
        if (Object.prototype.hasOwnProperty.call(_array, id)) {
          // tslint:disable-next-line:no-array-delete
          delete _array[id];
        }
      }

      this._size = 0;
      return this;
    }
  }, {
    key: _Symbol$iterator,
    value:
    /*#__PURE__*/
    regenerator.mark(function value() {
      var _array, id;

      return regenerator.wrap(function value$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _array = this._array;
              _context.t0 = keys$6(regenerator).call(regenerator, _array);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 9;
                break;
              }

              id = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return _array[id];

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, value, this);
    })
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    regenerator.mark(function entries() {
      var _array, id, _value;

      return regenerator.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _array = this._array;
              _context2.t0 = keys$6(regenerator).call(regenerator, _array);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 10;
                break;
              }

              id = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context2.next = 8;
                break;
              }

              _value = _array[id];
              _context2.next = 8;
              return [_value, _value];

            case 8:
              _context2.next = 2;
              break;

            case 10:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _array = this._array;

      for (var id in _array) {
        if (Object.prototype.hasOwnProperty.call(_array, id)) {
          var _value2 = _array[id];
          callbackfn.call(thisArg, _value2, _value2, this);
        }
      }
    }
  }, {
    key: "has",
    value: function has(value) {
      return Object.prototype.hasOwnProperty.call(this._array, getObjectUniqueId(value));
    }
  }, {
    key: "keys",
    value: function keys() {
      return getIterator$1(this);
    }
  }, {
    key: "values",
    value: function values() {
      return getIterator$1(this);
    }
  }, {
    key: "_canMerge",
    // region IMergeable
    value: function _canMerge(source) {
      if (source.constructor === ArraySet && this._array === source._array) {
        return null;
      }

      return source[toStringTag$2] === 'Set' || isArray$3(source) || isIterable$2(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
          return ArraySet.from(arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        array: _serialize(this._array, {
          arrayAsObject: true,
          objectKeepUndefined: true
        })
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._size;
    }
  }], [{
    key: "from",
    value: function from(arrayOrIterable) {
      return fillSet(new ArraySet(), arrayOrIterable);
    }
  }]);

  return ArraySet;
}();
ArraySet.uuid = '0e8c7f09ea9e46318af8a635c214a01c';
registerMergeable(ArraySet);
registerSerializable(ArraySet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerSet, value;
      return regenerator.wrap(function deSerialize$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _deSerialize(serializedValue.array, null, {
                arrayAsObject: true
              });

            case 2:
              innerSet = _context3.sent;
              value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

              return _context3.abrupt("return", value);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var entries = entryVirtual('Array').entries;

var entries$1 = entries;

var ArrayPrototype$c = Array.prototype;

var DOMIterables$2 = {
  DOMTokenList: true,
  NodeList: true
};

var entries_1 = function (it) {
  var own = it.entries;
  return it === ArrayPrototype$c || (it instanceof Array && own === ArrayPrototype$c.entries)
    // eslint-disable-next-line no-prototype-builtins
    || DOMIterables$2.hasOwnProperty(classof(it)) ? entries$1 : own;
};

var entries$2 = entries_1;

var _Symbol$toStringTag$2, _Symbol$iterator$1;
_Symbol$toStringTag$2 = toStringTag$2;
_Symbol$iterator$1 = iterator$4;
var ArrayMap =
/*#__PURE__*/
function () {
  function ArrayMap(array) {
    _classCallCheck(this, ArrayMap);

    this[_Symbol$toStringTag$2] = 'Map';
    this._array = array || [];
  }

  _createClass(ArrayMap, [{
    key: "set",
    value: function set(key, value) {
      var id = getObjectUniqueId(key);
      this._array[id] = [key, value];
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _array = this._array;

      for (var id in _array) {
        if (Object.prototype.hasOwnProperty.call(_array, id)) {
          // tslint:disable-next-line:no-array-delete
          delete _array[id];
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _array = this._array;
      var id = getObjectUniqueId(key);

      if (!Object.prototype.hasOwnProperty.call(_array, id)) {
        return false;
      } // tslint:disable-next-line:no-array-delete


      delete _array[id];
      return true;
    }
  }, {
    key: _Symbol$iterator$1,
    value: function value() {
      var _context;

      return entries$2(_context = this).call(_context);
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    regenerator.mark(function entries() {
      var _array, id;

      return regenerator.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _array = this._array;
              _context2.t0 = keys$6(regenerator).call(regenerator, _array);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 9;
                break;
              }

              id = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return _array[id];

            case 7:
              _context2.next = 2;
              break;

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _array = this._array;

      for (var id in _array) {
        if (Object.prototype.hasOwnProperty.call(_array, id)) {
          var entry = _array[id];
          callbackfn.call(thisArg, entry[1], entry[0], this);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      var id = getObjectUniqueId(key);

      if (!Object.prototype.hasOwnProperty.call(this._array, id)) {
        return void 0;
      }

      return this._array[id][1];
    }
  }, {
    key: "has",
    value: function has(key) {
      var id = getObjectUniqueId(key);
      return Object.prototype.hasOwnProperty.call(this._array, id);
    }
  }, {
    key: "keys",
    value:
    /*#__PURE__*/
    regenerator.mark(function keys() {
      var _array, id, entry;

      return regenerator.wrap(function keys$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _array = this._array;
              _context3.t0 = keys$6(regenerator).call(regenerator, _array);

            case 2:
              if ((_context3.t1 = _context3.t0()).done) {
                _context3.next = 10;
                break;
              }

              id = _context3.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context3.next = 8;
                break;
              }

              entry = _array[id];
              _context3.next = 8;
              return entry[0];

            case 8:
              _context3.next = 2;
              break;

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, keys, this);
    }) // tslint:disable-next-line:no-identical-functions

  }, {
    key: "values",
    value:
    /*#__PURE__*/
    regenerator.mark(function values() {
      var _array, id, entry;

      return regenerator.wrap(function values$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _array = this._array;
              _context4.t0 = keys$6(regenerator).call(regenerator, _array);

            case 2:
              if ((_context4.t1 = _context4.t0()).done) {
                _context4.next = 10;
                break;
              }

              id = _context4.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_array, id)) {
                _context4.next = 8;
                break;
              }

              entry = _array[id];
              _context4.next = 8;
              return entry[1];

            case 8:
              _context4.next = 2;
              break;

            case 10:
            case "end":
              return _context4.stop();
          }
        }
      }, values, this);
    }) // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === ArrayMap && this._array === source._array) {
        return null;
      }

      return source[toStringTag$2] === 'Map' || isArray$3(source) || isIterable$2(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new ArrayMap(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        array: _serialize(this._array, {
          arrayAsObject: true,
          objectKeepUndefined: true
        })
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return keys$3(this._array).length;
    }
  }]);

  return ArrayMap;
}();
ArrayMap.uuid = 'ef0ced8a58f74381b8503b09c0a42eed';
registerMergeable(ArrayMap);
registerSerializable(ArrayMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return regenerator.wrap(function deSerialize$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _deSerialize(serializedValue.array, null, {
                arrayAsObject: true
              });

            case 2:
              innerMap = _context5.sent;
              value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

              return _context5.abrupt("return", value);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var values = entryVirtual('Array').values;

var values$1 = values;

var ArrayPrototype$d = Array.prototype;

var DOMIterables$3 = {
  DOMTokenList: true,
  NodeList: true
};

var values_1 = function (it) {
  var own = it.values;
  return it === ArrayPrototype$d || (it instanceof Array && own === ArrayPrototype$d.values)
    // eslint-disable-next-line no-prototype-builtins
    || DOMIterables$3.hasOwnProperty(classof(it)) ? values$1 : own;
};

var values$2 = values_1;

var SetChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(SetChangedObject, _PropertyChangedObjec);

  function SetChangedObject() {
    _classCallCheck(this, SetChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(SetChangedObject).apply(this, arguments));
  }

  _createClass(SetChangedObject, [{
    key: "onSetChanged",
    value: function onSetChanged(event) {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _setChanged = this._setChanged;

      if (propertyChangedDisabled || !_setChanged || !_setChanged.hasSubscribers) {
        return this;
      }

      _setChanged.emit(event);

      return this;
    }
  }, {
    key: "setChanged",
    get: function get() {
      var _setChanged = this._setChanged;

      if (!_setChanged) {
        this._setChanged = _setChanged = new HasSubscribersSubject();
      }

      return _setChanged;
    }
  }, {
    key: "_setChangedIfCanEmit",
    get: function get() {
      var propertyChangedDisabled = this.__meta.propertyChangedDisabled;
      var _setChanged = this._setChanged;
      return !propertyChangedDisabled && _setChanged && _setChanged.hasSubscribers ? _setChanged : null;
    }
  }]);

  return SetChangedObject;
}(PropertyChangedObject);

var _Symbol$toStringTag$3, _Symbol$iterator$2;
_Symbol$toStringTag$3 = toStringTag$2;
_Symbol$iterator$2 = iterator$4;
var ObservableSet =
/*#__PURE__*/
function (_SetChangedObject) {
  _inherits(ObservableSet, _SetChangedObject);

  function ObservableSet(set) {
    var _this;

    _classCallCheck(this, ObservableSet);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableSet).call(this));
    _this[_Symbol$toStringTag$3] = 'Set';
    _this._set = set || new set$4();
    return _this;
  }

  _createClass(ObservableSet, [{
    key: "add",
    value: function add(value) {
      var _set = this._set;
      var oldSize = _set.size;

      this._set.add(value);

      var size = _set.size;

      if (size > oldSize) {
        var _setChangedIfCanEmit = this._setChangedIfCanEmit;

        if (_setChangedIfCanEmit) {
          _setChangedIfCanEmit.emit({
            type: SetChangedType.Added,
            newItems: [value]
          });
        }

        var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name: 'size',
            oldValue: oldSize,
            newValue: size
          });
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _set = this._set;
      var oldSize = _set.size;

      this._set.delete(value);

      var size = _set.size;

      if (size < oldSize) {
        var _setChangedIfCanEmit = this._setChangedIfCanEmit;

        if (_setChangedIfCanEmit) {
          _setChangedIfCanEmit.emit({
            type: SetChangedType.Removed,
            oldItems: [value]
          });
        }

        var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name: 'size',
            oldValue: oldSize,
            newValue: size
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this.size;

      if (size === 0) {
        return;
      }

      var _setChangedIfCanEmit = this._setChangedIfCanEmit;

      if (_setChangedIfCanEmit) {
        var oldItems = from_1$2(this);

        this._set.clear();

        _setChangedIfCanEmit.emit({
          type: SetChangedType.Removed,
          oldItems: oldItems
        });
      } else {
        this._set.clear();
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: 0
        });
      }
    } // region Unchanged Set methods

  }, {
    key: _Symbol$iterator$2,
    value: function value() {
      return getIterator$1(this._set);
    }
  }, {
    key: "entries",
    value: function entries() {
      var _context;

      return entries$2(_context = this._set).call(_context);
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _context2,
          _this2 = this;

      forEach$2(_context2 = this._set).call(_context2, function (k, v) {
        return callbackfn.call(thisArg, k, v, _this2);
      });
    }
  }, {
    key: "has",
    value: function has(value) {
      return this._set.has(value);
    }
  }, {
    key: "keys",
    value: function keys() {
      var _context3;

      return keys$6(_context3 = this._set).call(_context3);
    }
  }, {
    key: "values",
    value: function values() {
      var _context4;

      return values$2(_context4 = this._set).call(_context4);
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      var _set = this._set;

      if (_set.canMerge) {
        return _set.canMerge(source);
      }

      if (source.constructor === ObservableSet && this._set === source._set) {
        return null;
      }

      return source.constructor === Object || source[toStringTag$2] === 'Set' || isArray$3(source) || isIterable$2(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this3 = this;

      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
          return fillSet(new _this3._set.constructor(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        set: _serialize(this._set)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._set.size;
    }
  }]);

  return ObservableSet;
}(SetChangedObject);
ObservableSet.uuid = '91539dfb55f44bfb9dbfbff7f6ab800d';
registerMergeable(ObservableSet);
registerSerializable(ObservableSet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerSet, value;
      return regenerator.wrap(function deSerialize$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _deSerialize(serializedValue.set);

            case 2:
              innerSet = _context5.sent;
              value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

              return _context5.abrupt("return", value);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var MapChangedObject =
/*#__PURE__*/
function (_PropertyChangedObjec) {
  _inherits(MapChangedObject, _PropertyChangedObjec);

  function MapChangedObject() {
    _classCallCheck(this, MapChangedObject);

    return _possibleConstructorReturn(this, _getPrototypeOf(MapChangedObject).apply(this, arguments));
  }

  _createClass(MapChangedObject, [{
    key: "onMapChanged",
    value: function onMapChanged(event) {
      var _mapChanged = this._mapChanged;

      if (!_mapChanged || !_mapChanged.hasSubscribers) {
        return this;
      }

      _mapChanged.emit(event);

      return this;
    }
  }, {
    key: "mapChanged",
    get: function get() {
      var _mapChanged = this._mapChanged;

      if (!_mapChanged) {
        this._mapChanged = _mapChanged = new HasSubscribersSubject();
      }

      return _mapChanged;
    }
  }, {
    key: "_mapChangedIfCanEmit",
    get: function get() {
      var __meta = this.__meta;
      var propertyChangedDisabled = __meta ? __meta.propertyChangedDisabled : null;
      var _mapChanged = this._mapChanged;
      return !propertyChangedDisabled && _mapChanged && _mapChanged.hasSubscribers ? _mapChanged : null;
    }
  }]);

  return MapChangedObject;
}(PropertyChangedObject);

var _Symbol$toStringTag$4, _Symbol$iterator$3;
_Symbol$toStringTag$4 = toStringTag$2;
_Symbol$iterator$3 = iterator$4;
var ObservableMap =
/*#__PURE__*/
function (_MapChangedObject) {
  _inherits(ObservableMap, _MapChangedObject);

  function ObservableMap(map) {
    var _this;

    _classCallCheck(this, ObservableMap);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObservableMap).call(this));
    _this[_Symbol$toStringTag$4] = 'Map';
    _this._map = map || new map$7();
    return _this;
  }

  _createClass(ObservableMap, [{
    key: "set",
    value: function set(key, value) {
      var _map = this._map;
      var oldSize = _map.size;

      var oldValue = _map.get(key);

      _map.set(key, value);

      var size = _map.size;

      if (size > oldSize) {
        var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

        if (_mapChangedIfCanEmit) {
          _mapChangedIfCanEmit.emit({
            type: MapChangedType.Added,
            key: key,
            newValue: value
          });
        }

        var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name: 'size',
            oldValue: oldSize,
            newValue: size
          });
        }
      } else {
        var _mapChangedIfCanEmit2 = this._mapChangedIfCanEmit;

        if (_mapChangedIfCanEmit2) {
          _mapChangedIfCanEmit2.emit({
            type: MapChangedType.Set,
            key: key,
            oldValue: oldValue,
            newValue: value
          });
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _map = this._map;
      var oldSize = _map.size;

      var oldValue = _map.get(key);

      this._map.delete(key);

      var size = _map.size;

      if (size < oldSize) {
        var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

        if (_mapChangedIfCanEmit) {
          _mapChangedIfCanEmit.emit({
            type: MapChangedType.Removed,
            key: key,
            oldValue: oldValue
          });
        }

        var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

        if (propertyChangedIfCanEmit) {
          propertyChangedIfCanEmit.onPropertyChanged({
            name: 'size',
            oldValue: oldSize,
            newValue: size
          });
        }

        return true;
      }

      return false;
    }
  }, {
    key: "clear",
    value: function clear() {
      var size = this.size;

      if (size === 0) {
        return;
      }

      var _mapChangedIfCanEmit = this._mapChangedIfCanEmit;

      if (_mapChangedIfCanEmit) {
        var _context;

        var oldItems = from_1$2(entries$2(_context = this).call(_context));

        this._map.clear();

        for (var i = 0, len = oldItems.length; i < len; i++) {
          var oldItem = oldItems[i];

          _mapChangedIfCanEmit.emit({
            type: MapChangedType.Removed,
            key: oldItem[0],
            oldValue: oldItem[1]
          });
        }
      } else {
        this._map.clear();
      }

      var propertyChangedIfCanEmit = this.propertyChangedIfCanEmit;

      if (propertyChangedIfCanEmit) {
        propertyChangedIfCanEmit.onPropertyChanged({
          name: 'size',
          oldValue: size,
          newValue: 0
        });
      }
    } // region Unchanged Map methods

  }, {
    key: _Symbol$iterator$3,
    value: function value() {
      return getIterator$1(this._map);
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._map.get(key);
    }
  }, {
    key: "entries",
    value: function entries() {
      var _context2;

      return entries$2(_context2 = this._map).call(_context2);
    }
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _context3,
          _this2 = this;

      forEach$2(_context3 = this._map).call(_context3, function (k, v) {
        return callbackfn.call(thisArg, k, v, _this2);
      });
    }
  }, {
    key: "has",
    value: function has(key) {
      return this._map.has(key);
    }
  }, {
    key: "keys",
    value: function keys() {
      var _context4;

      return keys$6(_context4 = this._map).call(_context4);
    }
  }, {
    key: "values",
    value: function values() {
      var _context5;

      return values$2(_context5 = this._map).call(_context5);
    } // endregion
    // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      var _map = this._map;

      if (_map.canMerge) {
        return _map.canMerge(source);
      }

      if (source.constructor === ObservableMap && this._map === source._map) {
        return null;
      }

      return source.constructor === Object || source[toStringTag$2] === 'Map' || isArray$3(source) || isIterable$2(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      var _this3 = this;

      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new _this3._map.constructor(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        map: _serialize(this._map)
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return this._map.size;
    }
  }]);

  return ObservableMap;
}(MapChangedObject);
ObservableMap.uuid = 'e162178d51234beaab6eb96d5b8f130b';
registerMergeable(ObservableMap);
registerSerializable(ObservableMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return regenerator.wrap(function deSerialize$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _deSerialize(map$2(serializedValue));

            case 2:
              innerMap = _context6.sent;
              value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

              return _context6.abrupt("return", value);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, deSerialize);
    })
  }
});

function resolveValueProperty(value, getValue) {
  if (value != null && typeof value === 'object') {
    if (VALUE_PROPERTY_DEFAULT in value) {
      if (getValue) {
        var newValue = getValue(value);

        if (typeof newValue !== 'undefined') {
          return newValue;
        }
      }

      return value[VALUE_PROPERTY_DEFAULT];
    }

    if (value instanceof CalcPropertyValue) {
      return value.get();
    }
  }

  return value;
}

function resolvePath(value) {
  var get = function get(getValue, isValueProperty) {
    var _getValue = getValue && function (val) {
      return val != null && typeof val === 'object' || typeof val === 'string' ? getValue(val) : void 0;
    };

    var customResolveValue = _getValue && isValueProperty ? function (val) {
      return resolveValueProperty(val, _getValue);
    } : resolveValueProperty;
    value = resolveAsync(value, null, null, null, customResolveValue);

    if (!_getValue) {
      return value;
    }

    if (!isValueProperty) {
      if (value instanceof ThenableSync) {
        value = value.then(_getValue, null, false);
      } else if (isThenable$1(value)) {
        value = value.then(_getValue);
      } else {
        value = resolveAsync(_getValue(value));
      }
    }

    return get;
  };

  return get;
} // Test
// const x: TGetPropertyValue<ICalcProperty<Date>>
// const r = x(o => o, true)()

var propertyIsEnumerable = objectPropertyIsEnumerable.f;

// `Object.{ entries, values }` methods implementation
var createMethod$5 = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!descriptors || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

var objectToArray = {
  // `Object.entries` method
  // https://tc39.github.io/ecma262/#sec-object.entries
  entries: createMethod$5(true),
  // `Object.values` method
  // https://tc39.github.io/ecma262/#sec-object.values
  values: createMethod$5(false)
};

var $values = objectToArray.values;

// `Object.values` method
// https://tc39.github.io/ecma262/#sec-object.values
_export({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

var values$3 = path.Object.values;

var values$4 = values$3;

var values$5 = values$4;

var _Symbol$toStringTag$5, _Symbol$iterator$4;
_Symbol$toStringTag$5 = toStringTag$2;
_Symbol$iterator$4 = iterator$4;
var ObjectMap =
/*#__PURE__*/
function () {
  function ObjectMap(object) {
    _classCallCheck(this, ObjectMap);

    this[_Symbol$toStringTag$5] = 'Map';
    this._object = object || {};
  }

  _createClass(ObjectMap, [{
    key: "set",
    value: function set(key, value) {
      this._object[key] = value;
      return this;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var key in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, key)) {
          delete _object[key];
        }
      }

      return this;
    }
  }, {
    key: "delete",
    value: function _delete(key) {
      var _object = this._object;

      if (!Object.prototype.hasOwnProperty.call(_object, key)) {
        return false;
      }

      delete _object[key];
      return true;
    }
  }, {
    key: _Symbol$iterator$4,
    value: function value() {
      var _context;

      return entries$2(_context = this).call(_context);
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    regenerator.mark(function entries() {
      var _object, key;

      return regenerator.wrap(function entries$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _object = this._object;
              _context2.t0 = keys$6(regenerator).call(regenerator, _object);

            case 2:
              if ((_context2.t1 = _context2.t0()).done) {
                _context2.next = 9;
                break;
              }

              key = _context2.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, key)) {
                _context2.next = 7;
                break;
              }

              _context2.next = 7;
              return [key, _object[key]];

            case 7:
              _context2.next = 2;
              break;

            case 9:
            case "end":
              return _context2.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _object = this._object;

      for (var key in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, key)) {
          callbackfn.call(thisArg, _object[key], key, this);
        }
      }
    }
  }, {
    key: "get",
    value: function get(key) {
      return this._object[key];
    }
  }, {
    key: "has",
    value: function has(key) {
      return Object.prototype.hasOwnProperty.call(this._object, key);
    }
  }, {
    key: "keys",
    value: function keys() {
      return getIterator$1(keys$3(this._object));
    }
  }, {
    key: "values",
    value: function values() {
      return getIterator$1(values$5(this._object));
    } // region IMergeable

  }, {
    key: "_canMerge",
    value: function _canMerge(source) {
      if (source.constructor === ObjectMap && this._object === source._object) {
        return null;
      }

      return source.constructor === Object || source[toStringTag$2] === 'Map' || isArray$3(source) || isIterable$2(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeMapWrapper(target, source, function (arrayOrIterable) {
          return fillMap(new ObjectMap(), arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable
    // noinspection SpellCheckingInspection

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        object: _serialize(this._object, {
          objectKeepUndefined: true
        })
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return keys$3(this._object).length;
    }
  }]);

  return ObjectMap;
}();
ObjectMap.uuid = '62388f07b21a47788b3858f225cdbd42';
registerMergeable(ObjectMap);
registerSerializable(ObjectMap, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerMap, value;
      return regenerator.wrap(function deSerialize$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _deSerialize(serializedValue.object);

            case 2:
              innerMap = _context3.sent;
              value = valueFactory(innerMap); // value.deSerialize(deSerialize, serializedValue)

              return _context3.abrupt("return", value);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var _Symbol$toStringTag$6, _Symbol$iterator$5;
_Symbol$toStringTag$6 = toStringTag$2;
_Symbol$iterator$5 = iterator$4;
var ObjectSet =
/*#__PURE__*/
function () {
  function ObjectSet(object) {
    _classCallCheck(this, ObjectSet);

    this[_Symbol$toStringTag$6] = 'Set';
    this._object = object || {};
  }

  _createClass(ObjectSet, [{
    key: "add",
    value: function add(value) {
      this._object[value] = true;
      return this;
    }
  }, {
    key: "delete",
    value: function _delete(value) {
      var _object = this._object;

      if (!Object.prototype.hasOwnProperty.call(_object, value)) {
        return false;
      }

      delete _object[value];
      return true;
    }
  }, {
    key: "clear",
    value: function clear() {
      var _object = this._object;

      for (var value in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, value)) {
          delete _object[value];
        }
      }

      return this;
    }
  }, {
    key: _Symbol$iterator$5,
    value: function value() {
      return getIterator$1(keys$3(this._object));
    }
  }, {
    key: "entries",
    value:
    /*#__PURE__*/
    regenerator.mark(function entries() {
      var _object, value;

      return regenerator.wrap(function entries$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _object = this._object;
              _context.t0 = keys$6(regenerator).call(regenerator, _object);

            case 2:
              if ((_context.t1 = _context.t0()).done) {
                _context.next = 9;
                break;
              }

              value = _context.t1.value;

              if (!Object.prototype.hasOwnProperty.call(_object, value)) {
                _context.next = 7;
                break;
              }

              _context.next = 7;
              return [value, value];

            case 7:
              _context.next = 2;
              break;

            case 9:
            case "end":
              return _context.stop();
          }
        }
      }, entries, this);
    })
  }, {
    key: "forEach",
    value: function forEach(callbackfn, thisArg) {
      var _object = this._object;

      for (var value in _object) {
        if (Object.prototype.hasOwnProperty.call(_object, value)) {
          callbackfn.call(thisArg, value, value, this);
        }
      }
    }
  }, {
    key: "has",
    value: function has(value) {
      return Object.prototype.hasOwnProperty.call(this._object, value);
    }
  }, {
    key: "keys",
    value: function keys() {
      return getIterator$1(this);
    }
  }, {
    key: "values",
    value: function values() {
      return getIterator$1(this);
    }
  }, {
    key: "_canMerge",
    // region IMergeable
    value: function _canMerge(source) {
      if (source.constructor === ObjectSet && this._object === source._object) {
        return null;
      }

      return source.constructor === Object || source[toStringTag$2] === 'Set' || isArray$3(source) || isIterable$2(source);
    }
  }, {
    key: "_merge",
    value: function _merge(merge, older, newer, preferCloneOlder, preferCloneNewer, options) {
      return mergeMaps(function (target, source) {
        return createMergeSetWrapper(target, source, function (arrayOrIterable) {
          return ObjectSet.from(arrayOrIterable);
        });
      }, merge, this, older, newer, preferCloneOlder, preferCloneNewer, options);
    } // endregion
    // region ISerializable

  }, {
    key: "serialize",
    value: function serialize(_serialize) {
      return {
        object: _serialize(this._object, {
          objectKeepUndefined: true
        })
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize() {} // endregion

  }, {
    key: "size",
    get: function get() {
      return keys$3(this._object).length;
    }
  }], [{
    key: "from",
    value: function from(arrayOrIterable) {
      return new ObjectSet(fillObjectKeys({}, arrayOrIterable));
    }
  }]);

  return ObjectSet;
}();
ObjectSet.uuid = '6988ebc9cd064a9b97a98415b8cf1dc4';
registerMergeable(ObjectSet);
registerSerializable(ObjectSet, {
  serializer: {
    deSerialize:
    /*#__PURE__*/
    regenerator.mark(function deSerialize(_deSerialize, serializedValue, valueFactory) {
      var innerSet, value;
      return regenerator.wrap(function deSerialize$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _deSerialize(serializedValue.object);

            case 2:
              innerSet = _context2.sent;
              value = valueFactory(innerSet); // value.deSerialize(deSerialize, serializedValue)

              return _context2.abrupt("return", value);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, deSerialize);
    })
  }
});

var test$2 = [];
var nativeSort = test$2.sort;

// IE8-
var FAILS_ON_UNDEFINED = fails(function () {
  test$2.sort(undefined);
});
// V8 bug
var FAILS_ON_NULL = fails(function () {
  test$2.sort(null);
});
// Old WebKit
var STRICT_METHOD$4 = arrayMethodIsStrict('sort');

var FORCED$6 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$4;

// `Array.prototype.sort` method
// https://tc39.github.io/ecma262/#sec-array.prototype.sort
_export({ target: 'Array', proto: true, forced: FORCED$6 }, {
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? nativeSort.call(toObject(this))
      : nativeSort.call(toObject(this), aFunction(comparefn));
  }
});

var sort = entryVirtual('Array').sort;

var ArrayPrototype$e = Array.prototype;

var sort_1 = function (it) {
  var own = it.sort;
  return it === ArrayPrototype$e || (it instanceof Array && own === ArrayPrototype$e.sort) ? sort : own;
};

var sort$1 = sort_1;

var sort$2 = sort$1;

var nativeImul = Math.imul;

var FORCED$7 = fails(function () {
  return nativeImul(0xFFFFFFFF, 5) != -5 || nativeImul.length != 2;
});

// `Math.imul` method
// https://tc39.github.io/ecma262/#sec-math.imul
// some WebKit versions fails with big numbers, some has wrong arity
_export({ target: 'Math', stat: true, forced: FORCED$7 }, {
  imul: function imul(x, y) {
    var UINT16 = 0xFFFF;
    var xn = +x;
    var yn = +y;
    var xl = UINT16 & xn;
    var yl = UINT16 & yn;
    return 0 | xl * yl + ((UINT16 & xn >>> 16) * yl + xl * (UINT16 & yn >>> 16) << 16 >>> 0);
  }
});

var imul = path.Math.imul;

var lut = [];

for (var i = 0; i < 256; i++) {
  lut[i] = (i < 16 ? '0' : '') + i.toString(16);
}

var _context$2;

var randomWithoutSeed = bind$6(_context$2 = Math.random).call(_context$2, Math);

function filter$3(obj) {
  if (typeof EventTarget !== 'undefined' && obj instanceof EventTarget) {
    return false;
  }

  return true;
}

function objectToString$1(object) {
  if (object == null) {
    return object + '';
  }

  var buffer = [];

  var append = function append(obj, tabs, parents) {
    if (typeof obj === 'undefined') {
      buffer.push('undefined');
      return;
    }

    if (obj === null) {
      buffer.push('null');
      return;
    }

    if (typeof obj === 'number' || typeof obj === 'boolean') {
      buffer.push(obj.toString());
      return;
    }

    if (typeof obj === 'string') {
      buffer.push('"');
      buffer.push(obj);
      buffer.push('"');
      return;
    }

    if (obj instanceof Date) {
      buffer.push('<Date> ');
      buffer.push(isNan$2(obj.getTime()) ? 'NaN' : obj.toISOString());
      return;
    }

    if (obj instanceof Error) {
      obj._stack = obj.stack || obj.toString();
    }

    if (obj.valueOf) {
      var value = obj.valueOf();

      if (value !== obj) {
        if (obj.constructor) {
          buffer.push('<');
          buffer.push(obj.constructor.name);
          var id = getObjectUniqueId(obj);

          if (id) {
            buffer.push('-');
            buffer.push(id.toString());
          }

          buffer.push('> ');
        }

        append(value, tabs, parents);
        return;
      }
    }

    if (typeof obj === 'object') {
      var _context;

      if (parents && indexOf$5(parents).call(parents, obj) >= 0) {
        buffer.push('...');
        return;
      }

      parents = parents ? concat$2(_context = [obj]).call(_context, parents) : [obj];

      if (!filter$3(obj)) {
        buffer.push('<');
        buffer.push(obj.constructor.name);
        buffer.push('> {...}');
        return;
      }

      if (isArray$3(obj)) {
        buffer.push('[');
      } else if (obj.constructor) {
        buffer.push('<');
        buffer.push(obj.constructor.name);

        var _id = getObjectUniqueId(obj);

        if (_id) {
          buffer.push('-');
          buffer.push(_id.toString());
        }

        buffer.push('> {');
      } else {
        buffer.push('{');
      }

      var newTabs = tabs + '\t';
      var first = true; // tslint:disable-next-line:forin

      for (var key in obj) {
        if (!first) {
          buffer.push(',\r\n');
        } else {
          buffer.push('\r\n');
          first = false;
        }

        buffer.push(newTabs);
        buffer.push(key);
        buffer.push(': ');
        append(obj[key], newTabs, parents);
      }

      if (!first) {
        buffer.push(',\r\n');
        buffer.push(tabs);
      }

      if (isArray$3(obj)) {
        buffer.push(']');
      } else {
        buffer.push('}');
      }

      if (!isArray$3(obj) && isIterable$1(obj)) {
        buffer.push('[');
        var index = 0;

        for (var _iterator = obj, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
          var _ref;

          if (_isArray) {
            if (_i >= _iterator.length) break;
            _ref = _iterator[_i++];
          } else {
            _i = _iterator.next();
            if (_i.done) break;
            _ref = _i.value;
          }

          var item = _ref;

          if (index > 0) {
            buffer.push(',\r\n');
          } else {
            buffer.push('\r\n');
            first = false;
          }

          buffer.push(tabs);
          buffer.push(index.toString());
          buffer.push(': ');
          append(item, newTabs, parents);
        }

        if (index > 0) {
          buffer.push(',\r\n');
          buffer.push(tabs);
        }

        buffer.push(']');
      }

      return;
    }

    buffer.push(obj.toString());
  };

  append(object, '', null);
  return buffer.join('');
}

function getStackTraceCountFrames(level) {
  switch (level) {
    case LogLevel.Error:
      return 50;

    case LogLevel.Fatal:
      return 100;

    case LogLevel.UserError:
      return 10;

    case LogLevel.UserWarning:
      return 10;

    case LogLevel.Warning:
      return 5;
  }

  return 0;
}

var LogEvent =
/*#__PURE__*/
function () {
  // region constructor
  function LogEvent(_ref) {
    var level = _ref.level,
        messagesOrErrors = _ref.messagesOrErrors,
        handlersModes = _ref.handlersModes,
        time = _ref.time,
        stack = _ref.stack,
        additionalHashString = _ref.additionalHashString,
        appState = _ref.appState;

    _classCallCheck(this, LogEvent);

    this.level = level || LogLevel.Error;
    this.messagesOrErrors = messagesOrErrors;
    this.handlersModes = handlersModes;
    this.time = time || new Date(); // TODO - need UTC

    this.stack = stack;
    this.additionalHashString = additionalHashString;
    this.appState = appState;

    if (!this.stack) {
      var stackTraceCountFrames = getStackTraceCountFrames(this.level);

      if (stackTraceCountFrames > 0) {
        this.stack = new Error('StackTrace').stack;
      }
    }
  } // endregion
  // region calculable
  // region messages


  _createClass(LogEvent, [{
    key: "messages",
    get: function get() {
      if (this._messages == null) {
        var _context, _context2;

        this._messages = this.messagesOrErrors ? map$2(_context = filter$2(_context2 = isArray$3(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).call(_context2, function (o) {
          return !(o instanceof Error);
        })).call(_context, function (o) {
          return o ? typeof o === 'object' ? objectToString$1(o) : o.toString() : o + '';
        }) : [];
      }

      return this._messages;
    }
  }, {
    key: "messagesString",
    get: function get() {
      if (this._messagesString == null) {
        this._messagesString = this.messages.join('\r\n\r\n');
      }

      return this._messagesString;
    } // endregion
    // region errors

  }, {
    key: "errors",
    get: function get() {
      if (this._errors == null) {
        var _context3;

        this._errors = this.messagesOrErrors ? filter$2(_context3 = isArray$3(this.messagesOrErrors) ? this.messagesOrErrors : [this.messagesOrErrors]).call(_context3, function (o) {
          return o instanceof Error;
        }) : [];
      }

      return this._errors;
    }
  }, {
    key: "errorsString",
    get: function get() {
      if (this._errorsString == null) {
        var _context4;

        this._errorsString = map$2(_context4 = this.errors).call(_context4, objectToString$1).join('\r\n\r\n');
      }

      return this._errorsString;
    } // endregion
    // region console

  }, {
    key: "consoleLevel",
    get: function get() {
      switch (this.level) {
        case LogLevel.None:
        case LogLevel.Trace:
        case LogLevel.Debug:
          return 'debug';

        case LogLevel.Info:
          return 'info';

        case LogLevel.UserAction:
        case LogLevel.Action:
          return 'log';

        case LogLevel.UserWarning:
        case LogLevel.UserError:
        case LogLevel.Warning:
          return 'warn';

        case LogLevel.Error:
        case LogLevel.Fatal:
        default:
          return 'error';
      }
    }
  }, {
    key: "consoleString",
    get: function get() {
      if (this._consoleString == null) {
        this._consoleString = "\r\n[" + this.dateString + "][" + LogLevel[this.level] + "]: " + this.bodyString;
      }

      return this._consoleString;
    } // endregion
    // region time

  }, {
    key: "dateString",
    get: function get() {
      if (this._timeString == null) {
        this._timeString = this.time.toISOString().replace('T', ' ').replace('Z', '');
      }

      return this._timeString;
    } // endregion
    // region stack

  }, {
    key: "stackString",
    get: function get() {
      if (this._stackString == null) {
        this._stackString = this.stack || '';
      }

      return this._stackString;
    } // endregion
    // region appInfo

  }, {
    key: "appInfo",
    get: function get() {
      if (this._appInfo == null) {
        var appState = this.appState;
        this._appInfo = appState ? stringify$2(appState, null, 4) : '';
      }

      return this._appInfo;
    } // endregion
    // region md5Hash

  }, {
    key: "md5Hash",
    get: function get() {
      if (!this._md5Hash) {
        var buffer = [];

        if (this.additionalHashString) {
          buffer.push(this.additionalHashString);
        }

        if (this.errorsString) {
          buffer.push(this.errorsString.toString());
        }

        if (this.stack) {
          buffer.push(this.stack);
        }

        if (this.appInfo) {
          buffer.push(this.appInfo);
        } // if (!buffer.length && this.messagesString) {
        // 	buffer.push(this.messagesString)
        // }


        var hashString = buffer.join('\r\n');
        this._md5Hash = md5(hashString);
      }

      return this._md5Hash;
    } // endregion
    // region bodyString

  }, {
    key: "bodyString",
    get: function get() {
      if (!this._bodyString) {
        var buffer = [];

        if (this.messagesString) {
          buffer.push(this.messagesString);
        }

        if (this.errorsString) {
          buffer.push(this.errorsString);
        }

        if (this.stackString) {
          buffer.push(this.stackString);
        }

        this._bodyString = buffer.join('\r\n\r\n');
      }

      return this._bodyString;
    } // endregion
    // endregion

  }]);

  return LogEvent;
}();

var Logger =
/*#__PURE__*/
function () {
  function Logger() {
    _classCallCheck(this, Logger);

    this.minTimeBetweenEqualEvents = 120000;
    this._logEventsTime = {};
    this._subscribers = [];
  }

  _createClass(Logger, [{
    key: "_init",
    value: function _init(_ref) {
      var appName = _ref.appName,
          appVersion = _ref.appVersion,
          handlers = _ref.handlers,
          filter = filter$2(_ref),
          appState = _ref.appState;

      if (this._initialized) {
        this.error('Logger already initialized');
        return;
      }

      this._initialized = true;
      this.appName = appName;
      this.appVersion = appVersion;
      this.handlers = handlers;
      this.filter = filter;
      this.appState = appState;
      this.interceptEval();
      var logEvent = {
        level: LogLevel.Info,
        messagesOrErrors: "Start App: " + appName + " v" + appVersion,
        handlersModes: {}
      };

      if (this.handlers) {
        for (var i = 0; i < this.handlers.length; i++) {
          var handler = handlers[i];

          if (handler) {
            logEvent.handlersModes[handler.name] = ActionMode.Always;
            handler.init();
          }
        }
      }

      this.log(logEvent);
    }
  }, {
    key: "interceptEval",
    value: function interceptEval() {
      var _this = this;

      var oldEval = globalScope.eval;
      delete globalScope.eval;

      globalScope.eval = function (str) {
        if (indexOf$5(str).call(str, 'async function') >= 0) {
          return oldEval.call(globalScope, str);
        }

        try {
          return oldEval.call(globalScope, str);
        } catch (ex) {
          _this.error('eval error', ex, str);

          throw ex;
        }
      };
    } // endregion
    // region log interface

  }, {
    key: "debug",
    value: function debug() {
      for (var _len = arguments.length, messagesOrErrors = new Array(_len), _key = 0; _key < _len; _key++) {
        messagesOrErrors[_key] = arguments[_key];
      }

      this.log({
        level: LogLevel.Debug,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len2 = arguments.length, messagesOrErrors = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        messagesOrErrors[_key2] = arguments[_key2];
      }

      this.log({
        level: LogLevel.Info,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "action",
    value: function action() {
      for (var _len3 = arguments.length, messagesOrErrors = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        messagesOrErrors[_key3] = arguments[_key3];
      }

      this.log({
        level: LogLevel.Action,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len4 = arguments.length, messagesOrErrors = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        messagesOrErrors[_key4] = arguments[_key4];
      }

      this.log({
        level: LogLevel.Warning,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "error",
    value: function error() {
      for (var _len5 = arguments.length, messagesOrErrors = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        messagesOrErrors[_key5] = arguments[_key5];
      }

      this.log({
        level: LogLevel.Error,
        messagesOrErrors: messagesOrErrors
      });
    }
  }, {
    key: "log",
    value: function log(logEventOrLevel) {
      if (logEventOrLevel != null && typeof logEventOrLevel === 'object') {
        this._log(logEventOrLevel instanceof LogEvent ? logEventOrLevel : this.createLogEvent(logEventOrLevel));
      } else {
        for (var _len6 = arguments.length, messagesOrErrors = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          messagesOrErrors[_key6 - 1] = arguments[_key6];
        }

        this._log(this.createLogEvent({
          level: logEventOrLevel,
          messagesOrErrors: messagesOrErrors
        }));
      }
    } // endregion
    // region log handlers

  }, {
    key: "createLogEvent",
    value: function createLogEvent(params) {
      params.appState = _extends({
        appName: this.appName,
        appVersion: this.appVersion
      }, this.appState);
      return new LogEvent(params);
    }
  }, {
    key: "_log",
    value: function _log(logEvent) {
      var filter = filter$2(this);

      if (filter && !filter(logEvent)) {
        return;
      }

      var _logEventsTime = this._logEventsTime;
      var time = _logEventsTime[logEvent.bodyString];

      if (time != null && time + this.minTimeBetweenEqualEvents > logEvent.time.getTime()) {
        return;
      }

      _logEventsTime[logEvent.bodyString] = logEvent.time.getTime();
      var handlers = this.handlers;

      for (var i = 0; i < handlers.length; i++) {
        var handler = handlers[i];

        if (handler) {
          handler.enqueueLog(logEvent);
        }
      }
    } // endregion
    // region log event

  }, {
    key: "subscribe",
    value: function subscribe(subscriber) {
      var _this2 = this;

      this._subscribers.push(subscriber);

      return function () {
        var _context;

        var index = indexOf$5(_context = _this2._subscribers).call(_context, subscriber);

        if (index >= 0) {
          var _context2;

          splice$2(_context2 = _this2._subscribers).call(_context2, index, 1);
        }
      };
    }
  }, {
    key: "onLog",
    value: function () {
      var _onLog = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(logEvent) {
        var i;
        return regenerator.wrap(function _callee$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!this._subscribers.length) {
                  _context3.next = 8;
                  break;
                }

                i = 0;

              case 2:
                if (!(i < this._subscribers.length)) {
                  _context3.next = 8;
                  break;
                }

                _context3.next = 5;
                return this._subscribers[i](logEvent);

              case 5:
                i++;
                _context3.next = 2;
                break;

              case 8:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee, this);
      }));

      function onLog(_x) {
        return _onLog.apply(this, arguments);
      }

      return onLog;
    }() // endregion

  }]);

  return Logger;
}(); // endregion

var _context$3, _context2, _context3, _context4, _context5;
var consoleOrig = {
  debug: bind$6(_context$3 = console.debug).call(_context$3, console),
  info: bind$6(_context2 = console.info).call(_context2, console),
  log: bind$6(_context3 = console.log).call(_context3, console),
  warn: bind$6(_context4 = console.warn).call(_context4, console),
  error: bind$6(_context5 = console.error).call(_context5, console)
};
var WriteToConsoleHandler =
/*#__PURE__*/
function (_LogHandler) {
  _inherits(WriteToConsoleHandler, _LogHandler);

  function WriteToConsoleHandler(logger, allowLogLevels) {
    _classCallCheck(this, WriteToConsoleHandler);

    return _possibleConstructorReturn(this, _getPrototypeOf(WriteToConsoleHandler).call(this, {
      name: 'writeToConsole',
      logger: logger,
      allowLogLevels: allowLogLevels
    }));
  }

  _createClass(WriteToConsoleHandler, [{
    key: "init",
    value: function init() {
      this.interceptConsole();
    }
  }, {
    key: "interceptConsole",
    value: function interceptConsole() {
      var self = this;

      var createInterceptFunc = function createInterceptFunc(level, consoleFunc) {
        return function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          self._logger.log({
            level: level,
            messagesOrErrors: args,
            handlersModes: {
              writeToConsole: consoleFunc ? ActionMode.Never : ActionMode.Default
            }
          });

          if (consoleFunc) {
            consoleFunc.apply(void 0, args);
          }
        };
      };

      console.debug = createInterceptFunc(LogLevel.Debug, consoleOrig.debug);
      console.info = createInterceptFunc(LogLevel.Info, consoleOrig.info);
      console.log = createInterceptFunc(LogLevel.Info, consoleOrig.log);
      console.warn = createInterceptFunc(LogLevel.Warning, null);
      console.error = createInterceptFunc(LogLevel.Error, null);
    }
  }, {
    key: "handleLog",
    value: function handleLog(logEvents) {
      for (var i = 0, len = logEvents.length; i < len; i++) {
        var logEvent = logEvents[i]; // let messagesOrErrors = logEvent.messagesOrErrors
        // if (!Array.isArray(messagesOrErrors)) {
        // 	messagesOrErrors = [messagesOrErrors]
        // }

        switch (logEvent.level) {
          case LogLevel.None:
          case LogLevel.Trace:
          case LogLevel.Debug:
            consoleOrig.debug(logEvent.consoleString);
            break;

          case LogLevel.Info:
            consoleOrig.info(logEvent.consoleString);
            break;

          case LogLevel.UserAction:
          case LogLevel.Action:
            consoleOrig.log(logEvent.consoleString);
            break;

          case LogLevel.UserWarning:
          case LogLevel.UserError:
          case LogLevel.Warning:
            consoleOrig.warn(logEvent.consoleString);
            break;

          case LogLevel.Error:
          case LogLevel.Fatal:
          default:
            consoleOrig.error(logEvent.consoleString);
            break;
        }
      }
    }
  }]);

  return WriteToConsoleHandler;
}(LogHandler);

var SendLogHandler =
/*#__PURE__*/
function (_LogHandler) {
  _inherits(SendLogHandler, _LogHandler);

  function SendLogHandler(logger, allowLogLevels, logUrl) {
    var _this;

    _classCallCheck(this, SendLogHandler);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SendLogHandler).call(this, {
      name: 'sendLog',
      logger: logger,
      allowLogLevels: allowLogLevels,
      throttleTime: 1000
    }));
    _this.logUrl = logUrl;
    return _this;
  }

  _createClass(SendLogHandler, [{
    key: "handleLog",
    value: function () {
      var _handleLog = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(logEvents) {
        var _this2 = this,
            _context;

        var logUrl, lastLogEvent, selfError, errorWasWrite, body, token, message, delayTime, maxDelayTime, _ref, statusCode;

        return regenerator.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                logUrl = this.logUrl;

                if (logUrl) {
                  _context2.next = 3;
                  break;
                }

                return _context2.abrupt("return");

              case 3:
                lastLogEvent = logEvents[logEvents.length - 1];

                selfError = function selfError() {
                  var _extends2;

                  for (var _len = arguments.length, messagesOrErrors = new Array(_len), _key = 0; _key < _len; _key++) {
                    messagesOrErrors[_key] = arguments[_key];
                  }

                  _this2._logger.log({
                    level: LogLevel.Error,
                    messagesOrErrors: messagesOrErrors,
                    handlersModes: _extends({}, lastLogEvent.handlersModes, (_extends2 = {}, _extends2[_this2.name] = ActionMode.Never, _extends2))
                  });
                };

                errorWasWrite = false;
                body = map$2(_context = reverse$2(logEvents).call(logEvents)).call(_context, function (logEvent, index) {
                  return escapeHtml("[" + logEvent.dateString + "][" + _this2._logger.appName + "][" + logEvent.level + "][" + index + "]: " + logEvent.bodyString + "\r\n\r\nAppInfo: " + logEvent.appInfo);
                }).join('\r\n<hr>\r\n');
                body = lastLogEvent.md5Hash + '\r\n' + '\r\n' + body;
                token = md5(lastLogEvent.md5Hash + '607bf405-a5a8-4b8c-aa61-41e8c1208dba');
                message = {
                  Token: token,
                  Hash: lastLogEvent.md5Hash,
                  AppName: this._logger.appName,
                  AppVersion: this._logger.appVersion,
                  Type: LogLevel[lastLogEvent.level],
                  Time: lastLogEvent.time.toISOString(),
                  MessageFull: body,
                  MessageShort: removeExcessSpaces(lastLogEvent.messagesString.substring(0, 200))
                };
                delayTime = 10000;
                maxDelayTime = 300000;

              case 12:

                _context2.prev = 13;
                _context2.next = 16;
                return this.sendLog(logUrl, message, selfError);

              case 16:
                _ref = _context2.sent;
                statusCode = _ref.statusCode;

                if (!(statusCode === 200)) {
                  _context2.next = 20;
                  break;
                }

                return _context2.abrupt("return");

              case 20:
                selfError('Send log status code == ' + statusCode);
                _context2.next = 26;
                break;

              case 23:
                _context2.prev = 23;
                _context2.t0 = _context2["catch"](13);

                if (!errorWasWrite) {
                  errorWasWrite = true;
                  selfError('Send log error', _context2.t0);
                }

              case 26:
                _context2.next = 28;
                return delay(delayTime);

              case 28:
                delayTime = delayTime * 2;

                if (delayTime > maxDelayTime) {
                  delayTime = maxDelayTime;
                }

                _context2.next = 12;
                break;

              case 32:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this, [[13, 23]]);
      }));

      function handleLog(_x) {
        return _handleLog.apply(this, arguments);
      }

      return handleLog;
    }()
  }]);

  return SendLogHandler;
}(LogHandler);

function sendFetch(logUrl, message) {
  return fetch(logUrl, {
    method: 'POST',
    mode: 'cors',
    // no-cors, cors, *same-origin
    cache: 'no-cache',
    // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin',
    // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-HASH': message.Hash,
      'X-TOKEN': message.Token
    },
    redirect: 'follow',
    // manual, *follow, error
    referrer: 'no-referrer',
    // no-referrer, *client
    body: stringify$2(message) // body data type must match "Content-Type" header

  }).then(function (response) {
    return {
      statusCode: response.status
    };
  });
}

var SendLogHandlerBrowser =
/*#__PURE__*/
function (_SendLogHandler) {
  _inherits(SendLogHandlerBrowser, _SendLogHandler);

  function SendLogHandlerBrowser() {
    _classCallCheck(this, SendLogHandlerBrowser);

    return _possibleConstructorReturn(this, _getPrototypeOf(SendLogHandlerBrowser).apply(this, arguments));
  }

  _createClass(SendLogHandlerBrowser, [{
    key: "sendLog",
    value: function sendLog() {
      return typeof XMLHttpRequest !== 'undefined' ? sendFetch.apply(void 0, arguments) : sendFetch.apply(void 0, arguments);
    }
  }]);

  return SendLogHandlerBrowser;
}(SendLogHandler);

var LoggerBrowser =
/*#__PURE__*/
function (_Logger) {
  _inherits(LoggerBrowser, _Logger);

  function LoggerBrowser() {
    _classCallCheck(this, LoggerBrowser);

    return _possibleConstructorReturn(this, _getPrototypeOf(LoggerBrowser).apply(this, arguments));
  }

  _createClass(LoggerBrowser, [{
    key: "init",
    value: function init(_ref) {
      var appName = _ref.appName,
          appVersion = _ref.appVersion,
          logUrl = _ref.logUrl,
          _ref$writeToConsoleLe = _ref.writeToConsoleLevels,
          writeToConsoleLevels = _ref$writeToConsoleLe === void 0 ? LogLevel.Any : _ref$writeToConsoleLe,
          _ref$sendLogLevels = _ref.sendLogLevels,
          sendLogLevels = _ref$sendLogLevels === void 0 ? LogLevel.Fatal | LogLevel.Error | LogLevel.Warning | LogLevel.UserError | LogLevel.UserWarning : _ref$sendLogLevels,
          _ref$emitEventLevels = _ref.emitEventLevels,
          emitEventLevels = _ref$emitEventLevels === void 0 ? LogLevel.Any : _ref$emitEventLevels,
          filter = filter$2(_ref),
          appState = _ref.appState;

      if (typeof window !== 'undefined') {
        // @ts-ignore
        var _window = window,
            unsubscribeUnhandledErrors = _window.unsubscribeUnhandledErrors;

        if (unsubscribeUnhandledErrors) {
          // @ts-ignore
          window.unsubscribeUnhandledErrors = null;
          unsubscribeUnhandledErrors();
        }
      }

      this.logUnhandledErrors();

      _get(_getPrototypeOf(LoggerBrowser.prototype), "_init", this).call(this, {
        appName: appName,
        appVersion: appVersion,
        handlers: [new WriteToConsoleHandler(this, writeToConsoleLevels), new SendLogHandlerBrowser(this, sendLogLevels, logUrl), new EmitEventHandler(this, emitEventLevels)],
        filter: filter,
        appState: appState
      });
    }
  }, {
    key: "logUnhandledErrors",
    value: function logUnhandledErrors() {
      var _this = this;

      var errorHandler = function errorHandler() {
        var _context;

        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        _this.error.apply(_this, concat$2(_context = ['unhandledrejection']).call(_context, map$2(args).call(args, function (arg) {
          return (typeof PromiseRejectionEvent !== 'undefined' ? arg instanceof PromiseRejectionEvent && arg.reason : arg.reason) || arg;
        })));
      };

      if (typeof globalScope !== 'undefined') {
        globalScope.addEventListener('unhandledrejection', errorHandler);
        globalScope.onunhandledrejection = errorHandler;

        globalScope.onerror = function () {
          var _context2;

          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          _this.error.apply(_this, concat$2(_context2 = ['unhandled error']).call(_context2, args));
        };
      }
    }
  }]);

  return LoggerBrowser;
}(Logger);
var logger = new LoggerBrowser();

logger.init({
  appName: dev.appName,
  appVersion: dev.appVersion,
  logUrl: dev.logUrl,
  appState: _extends({}, dev),
  filter: function filter(logEvent) {
    if (logEvent.messagesOrErrors && logEvent.messagesOrErrors.length) {
      var first = logEvent.messagesOrErrors[0];

      if (first) {
        var _context;

        if (first.target && typeof first.target.url === 'string' && indexOf$5(_context = first.target.url).call(_context, '__sapper__') >= 0) {
          return false;
        }
      }
    }

    return true;
  }
});

var localStorageWrapper = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local && {
  getItem: function getItem(key) {
    return new promise$3(function (resolve) {
      chrome.storage.local.get([key], function (result) {
        return resolve(result[key]);
      });
    });
  },
  setItem: function setItem(key, value) {
    return new promise$3(function (resolve) {
      var _chrome$storage$local;

      chrome.storage.local.set((_chrome$storage$local = {}, _chrome$storage$local[key] = value, _chrome$storage$local), resolve);
    });
  }
} || typeof localStorage !== 'undefined' && localStorage || null;
function storeWindowState(_x, _x2) {
  return _storeWindowState.apply(this, arguments);
}

function _storeWindowState() {
  _storeWindowState = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2(name, win) {
    var storageKey, stateStr, state, saveState;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            storageKey = "window-state-" + name;
            _context2.next = 3;
            return localStorageWrapper.getItem(storageKey);

          case 3:
            stateStr = _context2.sent;
            state = stateStr && JSON.parse(stateStr);

            if (state) {
              win.moveTo(state.x, state.y);
              win.resizeTo(state.width, state.height);
            }

            saveState =
            /*#__PURE__*/
            function () {
              var _ref = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee() {
                return regenerator.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return localStorageWrapper.setItem(storageKey, stringify$2({
                          x: win.screenLeft,
                          y: win.screenTop,
                          width: win.outerWidth,
                          height: win.outerHeight
                        }));

                      case 2:
                      case "end":
                        return _context.stop();
                    }
                  }
                }, _callee);
              }));

              return function saveState() {
                return _ref.apply(this, arguments);
              };
            }();

            win.addEventListener('resize', saveState, false);

          case 8:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _storeWindowState.apply(this, arguments);
}

var trim$4 = stringTrim.trim;


var $parseFloat = global_1.parseFloat;
var FORCED$8 = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
var numberParseFloat = FORCED$8 ? function parseFloat(string) {
  var trimmedString = trim$4(String(string));
  var result = $parseFloat(trimmedString);
  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
} : $parseFloat;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
_export({ global: true, forced: parseFloat != numberParseFloat }, {
  parseFloat: numberParseFloat
});

var _parseFloat = path.parseFloat;

var _parseFloat$1 = _parseFloat;

var _parseFloat$2 = _parseFloat$1;

var colorName = {
  "aliceblue": [240, 248, 255],
  "antiquewhite": [250, 235, 215],
  "aqua": [0, 255, 255],
  "aquamarine": [127, 255, 212],
  "azure": [240, 255, 255],
  "beige": [245, 245, 220],
  "bisque": [255, 228, 196],
  "black": [0, 0, 0],
  "blanchedalmond": [255, 235, 205],
  "blue": [0, 0, 255],
  "blueviolet": [138, 43, 226],
  "brown": [165, 42, 42],
  "burlywood": [222, 184, 135],
  "cadetblue": [95, 158, 160],
  "chartreuse": [127, 255, 0],
  "chocolate": [210, 105, 30],
  "coral": [255, 127, 80],
  "cornflowerblue": [100, 149, 237],
  "cornsilk": [255, 248, 220],
  "crimson": [220, 20, 60],
  "cyan": [0, 255, 255],
  "darkblue": [0, 0, 139],
  "darkcyan": [0, 139, 139],
  "darkgoldenrod": [184, 134, 11],
  "darkgray": [169, 169, 169],
  "darkgreen": [0, 100, 0],
  "darkgrey": [169, 169, 169],
  "darkkhaki": [189, 183, 107],
  "darkmagenta": [139, 0, 139],
  "darkolivegreen": [85, 107, 47],
  "darkorange": [255, 140, 0],
  "darkorchid": [153, 50, 204],
  "darkred": [139, 0, 0],
  "darksalmon": [233, 150, 122],
  "darkseagreen": [143, 188, 143],
  "darkslateblue": [72, 61, 139],
  "darkslategray": [47, 79, 79],
  "darkslategrey": [47, 79, 79],
  "darkturquoise": [0, 206, 209],
  "darkviolet": [148, 0, 211],
  "deeppink": [255, 20, 147],
  "deepskyblue": [0, 191, 255],
  "dimgray": [105, 105, 105],
  "dimgrey": [105, 105, 105],
  "dodgerblue": [30, 144, 255],
  "firebrick": [178, 34, 34],
  "floralwhite": [255, 250, 240],
  "forestgreen": [34, 139, 34],
  "fuchsia": [255, 0, 255],
  "gainsboro": [220, 220, 220],
  "ghostwhite": [248, 248, 255],
  "gold": [255, 215, 0],
  "goldenrod": [218, 165, 32],
  "gray": [128, 128, 128],
  "green": [0, 128, 0],
  "greenyellow": [173, 255, 47],
  "grey": [128, 128, 128],
  "honeydew": [240, 255, 240],
  "hotpink": [255, 105, 180],
  "indianred": [205, 92, 92],
  "indigo": [75, 0, 130],
  "ivory": [255, 255, 240],
  "khaki": [240, 230, 140],
  "lavender": [230, 230, 250],
  "lavenderblush": [255, 240, 245],
  "lawngreen": [124, 252, 0],
  "lemonchiffon": [255, 250, 205],
  "lightblue": [173, 216, 230],
  "lightcoral": [240, 128, 128],
  "lightcyan": [224, 255, 255],
  "lightgoldenrodyellow": [250, 250, 210],
  "lightgray": [211, 211, 211],
  "lightgreen": [144, 238, 144],
  "lightgrey": [211, 211, 211],
  "lightpink": [255, 182, 193],
  "lightsalmon": [255, 160, 122],
  "lightseagreen": [32, 178, 170],
  "lightskyblue": [135, 206, 250],
  "lightslategray": [119, 136, 153],
  "lightslategrey": [119, 136, 153],
  "lightsteelblue": [176, 196, 222],
  "lightyellow": [255, 255, 224],
  "lime": [0, 255, 0],
  "limegreen": [50, 205, 50],
  "linen": [250, 240, 230],
  "magenta": [255, 0, 255],
  "maroon": [128, 0, 0],
  "mediumaquamarine": [102, 205, 170],
  "mediumblue": [0, 0, 205],
  "mediumorchid": [186, 85, 211],
  "mediumpurple": [147, 112, 219],
  "mediumseagreen": [60, 179, 113],
  "mediumslateblue": [123, 104, 238],
  "mediumspringgreen": [0, 250, 154],
  "mediumturquoise": [72, 209, 204],
  "mediumvioletred": [199, 21, 133],
  "midnightblue": [25, 25, 112],
  "mintcream": [245, 255, 250],
  "mistyrose": [255, 228, 225],
  "moccasin": [255, 228, 181],
  "navajowhite": [255, 222, 173],
  "navy": [0, 0, 128],
  "oldlace": [253, 245, 230],
  "olive": [128, 128, 0],
  "olivedrab": [107, 142, 35],
  "orange": [255, 165, 0],
  "orangered": [255, 69, 0],
  "orchid": [218, 112, 214],
  "palegoldenrod": [238, 232, 170],
  "palegreen": [152, 251, 152],
  "paleturquoise": [175, 238, 238],
  "palevioletred": [219, 112, 147],
  "papayawhip": [255, 239, 213],
  "peachpuff": [255, 218, 185],
  "peru": [205, 133, 63],
  "pink": [255, 192, 203],
  "plum": [221, 160, 221],
  "powderblue": [176, 224, 230],
  "purple": [128, 0, 128],
  "rebeccapurple": [102, 51, 153],
  "red": [255, 0, 0],
  "rosybrown": [188, 143, 143],
  "royalblue": [65, 105, 225],
  "saddlebrown": [139, 69, 19],
  "salmon": [250, 128, 114],
  "sandybrown": [244, 164, 96],
  "seagreen": [46, 139, 87],
  "seashell": [255, 245, 238],
  "sienna": [160, 82, 45],
  "silver": [192, 192, 192],
  "skyblue": [135, 206, 235],
  "slateblue": [106, 90, 205],
  "slategray": [112, 128, 144],
  "slategrey": [112, 128, 144],
  "snow": [255, 250, 250],
  "springgreen": [0, 255, 127],
  "steelblue": [70, 130, 180],
  "tan": [210, 180, 140],
  "teal": [0, 128, 128],
  "thistle": [216, 191, 216],
  "tomato": [255, 99, 71],
  "turquoise": [64, 224, 208],
  "violet": [238, 130, 238],
  "wheat": [245, 222, 179],
  "white": [255, 255, 255],
  "whitesmoke": [245, 245, 245],
  "yellow": [255, 255, 0],
  "yellowgreen": [154, 205, 50]
};

var isArrayish = function isArrayish(obj) {
  if (!obj || typeof obj === 'string') {
    return false;
  }

  return obj instanceof Array || isArray$3(obj) || obj.length >= 0 && (splice$2(obj) instanceof Function || getOwnPropertyDescriptor$6(obj, obj.length - 1) && obj.constructor.name !== 'String');
};

var simpleSwizzle = createCommonjsModule(function (module) {

  var concat = concat$2(Array.prototype);

  var slice = slice$3(Array.prototype);

  var swizzle = module.exports = function swizzle(args) {
    var results = [];

    for (var i = 0, len = args.length; i < len; i++) {
      var arg = args[i];

      if (isArrayish(arg)) {
        // http://jsperf.com/javascript-array-concat-vs-push/98
        results = concat.call(results, slice.call(arg));
      } else {
        results.push(arg);
      }
    }

    return results;
  };

  swizzle.wrap = function (fn) {
    return function () {
      return fn(swizzle(arguments));
    };
  };
});

var colorString = createCommonjsModule(function (module) {
  /* MIT license */
  var reverseNames = {}; // create a list of reverse color names

  for (var name in colorName) {
    if (colorName.hasOwnProperty(name)) {
      reverseNames[colorName[name]] = name;
    }
  }

  var cs = module.exports = {
    to: {},
    get: {}
  };

  cs.get = function (string) {
    var prefix = string.substring(0, 3).toLowerCase();
    var val;
    var model;

    switch (prefix) {
      case 'hsl':
        val = cs.get.hsl(string);
        model = 'hsl';
        break;

      case 'hwb':
        val = cs.get.hwb(string);
        model = 'hwb';
        break;

      default:
        val = cs.get.rgb(string);
        model = 'rgb';
        break;
    }

    if (!val) {
      return null;
    }

    return {
      model: model,
      value: val
    };
  };

  cs.get.rgb = function (string) {
    if (!string) {
      return null;
    }

    var abbr = /^#([a-f0-9]{3,4})$/i;
    var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
    var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var keyword = /(\D+)/;
    var rgb = [0, 0, 0, 1];
    var match;
    var i;
    var hexAlpha;

    if (match = string.match(hex)) {
      hexAlpha = match[2];
      match = match[1];

      for (i = 0; i < 3; i++) {
        // https://jsperf.com/slice-vs-substr-vs-substring-methods-long-string/19
        var i2 = i * 2;
        rgb[i] = _parseInt$2(slice$3(match).call(match, i2, i2 + 2), 16);
      }

      if (hexAlpha) {
        rgb[3] = Math.round(_parseInt$2(hexAlpha, 16) / 255 * 100) / 100;
      }
    } else if (match = string.match(abbr)) {
      match = match[1];
      hexAlpha = match[3];

      for (i = 0; i < 3; i++) {
        rgb[i] = _parseInt$2(match[i] + match[i], 16);
      }

      if (hexAlpha) {
        rgb[3] = Math.round(_parseInt$2(hexAlpha + hexAlpha, 16) / 255 * 100) / 100;
      }
    } else if (match = string.match(rgba)) {
      for (i = 0; i < 3; i++) {
        rgb[i] = _parseInt$2(match[i + 1], 0);
      }

      if (match[4]) {
        rgb[3] = _parseFloat$2(match[4]);
      }
    } else if (match = string.match(per)) {
      for (i = 0; i < 3; i++) {
        rgb[i] = Math.round(_parseFloat$2(match[i + 1]) * 2.55);
      }

      if (match[4]) {
        rgb[3] = _parseFloat$2(match[4]);
      }
    } else if (match = string.match(keyword)) {
      if (match[1] === 'transparent') {
        return [0, 0, 0, 0];
      }

      rgb = colorName[match[1]];

      if (!rgb) {
        return null;
      }

      rgb[3] = 1;
      return rgb;
    } else {
      return null;
    }

    for (i = 0; i < 3; i++) {
      rgb[i] = clamp(rgb[i], 0, 255);
    }

    rgb[3] = clamp(rgb[3], 0, 1);
    return rgb;
  };

  cs.get.hsl = function (string) {
    if (!string) {
      return null;
    }

    var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var match = string.match(hsl);

    if (match) {
      var alpha = _parseFloat$2(match[4]);

      var h = (_parseFloat$2(match[1]) + 360) % 360;
      var s = clamp(_parseFloat$2(match[2]), 0, 100);
      var l = clamp(_parseFloat$2(match[3]), 0, 100);
      var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, s, l, a];
    }

    return null;
  };

  cs.get.hwb = function (string) {
    if (!string) {
      return null;
    }

    var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
    var match = string.match(hwb);

    if (match) {
      var alpha = _parseFloat$2(match[4]);

      var h = (_parseFloat$2(match[1]) % 360 + 360) % 360;
      var w = clamp(_parseFloat$2(match[2]), 0, 100);
      var b = clamp(_parseFloat$2(match[3]), 0, 100);
      var a = clamp(isNaN(alpha) ? 1 : alpha, 0, 1);
      return [h, w, b, a];
    }

    return null;
  };

  cs.to.hex = function () {
    var rgba = simpleSwizzle(arguments);
    return '#' + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : '');
  };

  cs.to.rgb = function () {
    var rgba = simpleSwizzle(arguments);
    return rgba.length < 4 || rgba[3] === 1 ? 'rgb(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ')' : 'rgba(' + Math.round(rgba[0]) + ', ' + Math.round(rgba[1]) + ', ' + Math.round(rgba[2]) + ', ' + rgba[3] + ')';
  };

  cs.to.rgb.percent = function () {
    var rgba = simpleSwizzle(arguments);
    var r = Math.round(rgba[0] / 255 * 100);
    var g = Math.round(rgba[1] / 255 * 100);
    var b = Math.round(rgba[2] / 255 * 100);
    return rgba.length < 4 || rgba[3] === 1 ? 'rgb(' + r + '%, ' + g + '%, ' + b + '%)' : 'rgba(' + r + '%, ' + g + '%, ' + b + '%, ' + rgba[3] + ')';
  };

  cs.to.hsl = function () {
    var hsla = simpleSwizzle(arguments);
    return hsla.length < 4 || hsla[3] === 1 ? 'hsl(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%)' : 'hsla(' + hsla[0] + ', ' + hsla[1] + '%, ' + hsla[2] + '%, ' + hsla[3] + ')';
  }; // hwb is a bit different than rgb(a) & hsl(a) since there is no alpha specific syntax
  // (hwb have alpha optional & 1 is default value)


  cs.to.hwb = function () {
    var hwba = simpleSwizzle(arguments);
    var a = '';

    if (hwba.length >= 4 && hwba[3] !== 1) {
      a = ', ' + hwba[3];
    }

    return 'hwb(' + hwba[0] + ', ' + hwba[1] + '%, ' + hwba[2] + '%' + a + ')';
  };

  cs.to.keyword = function (rgb) {
    return reverseNames[slice$3(rgb).call(rgb, 0, 3)];
  }; // helpers


  function clamp(num, min, max) {
    return Math.min(Math.max(min, num), max);
  }

  function hexDouble(num) {
    var str = num.toString(16).toUpperCase();
    return str.length < 2 ? '0' + str : str;
  }
});
var colorString_1 = colorString.to;
var colorString_2 = colorString.get;

var conversions = createCommonjsModule(function (module) {
  /* MIT license */
  // NOTE: conversions should only return primitive values (i.e. arrays, or
  //       values that give correct `typeof` results).
  //       do not use box values types (i.e. Number(), String(), etc.)
  var reverseKeywords = {};

  for (var key in colorName) {
    if (colorName.hasOwnProperty(key)) {
      reverseKeywords[colorName[key]] = key;
    }
  }

  var convert = module.exports = {
    rgb: {
      channels: 3,
      labels: 'rgb'
    },
    hsl: {
      channels: 3,
      labels: 'hsl'
    },
    hsv: {
      channels: 3,
      labels: 'hsv'
    },
    hwb: {
      channels: 3,
      labels: 'hwb'
    },
    cmyk: {
      channels: 4,
      labels: 'cmyk'
    },
    xyz: {
      channels: 3,
      labels: 'xyz'
    },
    lab: {
      channels: 3,
      labels: 'lab'
    },
    lch: {
      channels: 3,
      labels: 'lch'
    },
    hex: {
      channels: 1,
      labels: ['hex']
    },
    keyword: {
      channels: 1,
      labels: ['keyword']
    },
    ansi16: {
      channels: 1,
      labels: ['ansi16']
    },
    ansi256: {
      channels: 1,
      labels: ['ansi256']
    },
    hcg: {
      channels: 3,
      labels: ['h', 'c', 'g']
    },
    apple: {
      channels: 3,
      labels: ['r16', 'g16', 'b16']
    },
    gray: {
      channels: 1,
      labels: ['gray']
    }
  }; // hide .channels and .labels properties

  for (var model in convert) {
    if (convert.hasOwnProperty(model)) {
      if (!('channels' in convert[model])) {
        throw new Error('missing channels property: ' + model);
      }

      if (!('labels' in convert[model])) {
        throw new Error('missing channel labels property: ' + model);
      }

      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error('channel and label counts mismatch: ' + model);
      }

      var channels = convert[model].channels;
      var labels = convert[model].labels;
      delete convert[model].channels;
      delete convert[model].labels;

      defineProperty$9(convert[model], 'channels', {
        value: channels
      });

      defineProperty$9(convert[model], 'labels', {
        value: labels
      });
    }
  }

  convert.rgb.hsl = function (rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h;
    var s;
    var l;

    if (max === min) {
      h = 0;
    } else if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else if (b === max) {
      h = 4 + (r - g) / delta;
    }

    h = Math.min(h * 60, 360);

    if (h < 0) {
      h += 360;
    }

    l = (min + max) / 2;

    if (max === min) {
      s = 0;
    } else if (l <= 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    return [h, s * 100, l * 100];
  };

  convert.rgb.hsv = function (rgb) {
    var rdif;
    var gdif;
    var bdif;
    var h;
    var s;
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var v = Math.max(r, g, b);
    var diff = v - Math.min(r, g, b);

    var diffc = function diffc(c) {
      return (v - c) / 6 / diff + 1 / 2;
    };

    if (diff === 0) {
      h = s = 0;
    } else {
      s = diff / v;
      rdif = diffc(r);
      gdif = diffc(g);
      bdif = diffc(b);

      if (r === v) {
        h = bdif - gdif;
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif;
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif;
      }

      if (h < 0) {
        h += 1;
      } else if (h > 1) {
        h -= 1;
      }
    }

    return [h * 360, s * 100, v * 100];
  };

  convert.rgb.hwb = function (rgb) {
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
    var h = convert.rgb.hsl(rgb)[0];
    var w = 1 / 255 * Math.min(r, Math.min(g, b));
    b = 1 - 1 / 255 * Math.max(r, Math.max(g, b));
    return [h, w * 100, b * 100];
  };

  convert.rgb.cmyk = function (rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var c;
    var m;
    var y;
    var k;
    k = Math.min(1 - r, 1 - g, 1 - b);
    c = (1 - r - k) / (1 - k) || 0;
    m = (1 - g - k) / (1 - k) || 0;
    y = (1 - b - k) / (1 - k) || 0;
    return [c * 100, m * 100, y * 100, k * 100];
  };
  /**
   * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
   * */


  function comparativeDistance(x, y) {
    return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
  }

  convert.rgb.keyword = function (rgb) {
    var reversed = reverseKeywords[rgb];

    if (reversed) {
      return reversed;
    }

    var currentClosestDistance = Infinity;
    var currentClosestKeyword;

    for (var keyword in colorName) {
      if (colorName.hasOwnProperty(keyword)) {
        var value = colorName[keyword]; // Compute comparative distance

        var distance = comparativeDistance(rgb, value); // Check if its less, if so set as closest

        if (distance < currentClosestDistance) {
          currentClosestDistance = distance;
          currentClosestKeyword = keyword;
        }
      }
    }

    return currentClosestKeyword;
  };

  convert.keyword.rgb = function (keyword) {
    return colorName[keyword];
  };

  convert.rgb.xyz = function (rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255; // assume sRGB

    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
    var x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    var y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    var z = r * 0.0193 + g * 0.1192 + b * 0.9505;
    return [x * 100, y * 100, z * 100];
  };

  convert.rgb.lab = function (rgb) {
    var xyz = convert.rgb.xyz(rgb);
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];
    var l;
    var a;
    var b;
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    l = 116 * y - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);
    return [l, a, b];
  };

  convert.hsl.rgb = function (hsl) {
    var h = hsl[0] / 360;
    var s = hsl[1] / 100;
    var l = hsl[2] / 100;
    var t1;
    var t2;
    var t3;
    var rgb;
    var val;

    if (s === 0) {
      val = l * 255;
      return [val, val, val];
    }

    if (l < 0.5) {
      t2 = l * (1 + s);
    } else {
      t2 = l + s - l * s;
    }

    t1 = 2 * l - t2;
    rgb = [0, 0, 0];

    for (var i = 0; i < 3; i++) {
      t3 = h + 1 / 3 * -(i - 1);

      if (t3 < 0) {
        t3++;
      }

      if (t3 > 1) {
        t3--;
      }

      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3;
      } else if (2 * t3 < 1) {
        val = t2;
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      } else {
        val = t1;
      }

      rgb[i] = val * 255;
    }

    return rgb;
  };

  convert.hsl.hsv = function (hsl) {
    var h = hsl[0];
    var s = hsl[1] / 100;
    var l = hsl[2] / 100;
    var smin = s;
    var lmin = Math.max(l, 0.01);
    var sv;
    var v;
    l *= 2;
    s *= l <= 1 ? l : 2 - l;
    smin *= lmin <= 1 ? lmin : 2 - lmin;
    v = (l + s) / 2;
    sv = l === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l + s);
    return [h, sv * 100, v * 100];
  };

  convert.hsv.rgb = function (hsv) {
    var h = hsv[0] / 60;
    var s = hsv[1] / 100;
    var v = hsv[2] / 100;
    var hi = Math.floor(h) % 6;
    var f = h - Math.floor(h);
    var p = 255 * v * (1 - s);
    var q = 255 * v * (1 - s * f);
    var t = 255 * v * (1 - s * (1 - f));
    v *= 255;

    switch (hi) {
      case 0:
        return [v, t, p];

      case 1:
        return [q, v, p];

      case 2:
        return [p, v, t];

      case 3:
        return [p, q, v];

      case 4:
        return [t, p, v];

      case 5:
        return [v, p, q];
    }
  };

  convert.hsv.hsl = function (hsv) {
    var h = hsv[0];
    var s = hsv[1] / 100;
    var v = hsv[2] / 100;
    var vmin = Math.max(v, 0.01);
    var lmin;
    var sl;
    var l;
    l = (2 - s) * v;
    lmin = (2 - s) * vmin;
    sl = s * vmin;
    sl /= lmin <= 1 ? lmin : 2 - lmin;
    sl = sl || 0;
    l /= 2;
    return [h, sl * 100, l * 100];
  }; // http://dev.w3.org/csswg/css-color/#hwb-to-rgb


  convert.hwb.rgb = function (hwb) {
    var h = hwb[0] / 360;
    var wh = hwb[1] / 100;
    var bl = hwb[2] / 100;
    var ratio = wh + bl;
    var i;
    var v;
    var f;
    var n; // wh + bl cant be > 1

    if (ratio > 1) {
      wh /= ratio;
      bl /= ratio;
    }

    i = Math.floor(6 * h);
    v = 1 - bl;
    f = 6 * h - i;

    if ((i & 0x01) !== 0) {
      f = 1 - f;
    }

    n = wh + f * (v - wh); // linear interpolation

    var r;
    var g;
    var b;

    switch (i) {
      default:
      case 6:
      case 0:
        r = v;
        g = n;
        b = wh;
        break;

      case 1:
        r = n;
        g = v;
        b = wh;
        break;

      case 2:
        r = wh;
        g = v;
        b = n;
        break;

      case 3:
        r = wh;
        g = n;
        b = v;
        break;

      case 4:
        r = n;
        g = wh;
        b = v;
        break;

      case 5:
        r = v;
        g = wh;
        b = n;
        break;
    }

    return [r * 255, g * 255, b * 255];
  };

  convert.cmyk.rgb = function (cmyk) {
    var c = cmyk[0] / 100;
    var m = cmyk[1] / 100;
    var y = cmyk[2] / 100;
    var k = cmyk[3] / 100;
    var r;
    var g;
    var b;
    r = 1 - Math.min(1, c * (1 - k) + k);
    g = 1 - Math.min(1, m * (1 - k) + k);
    b = 1 - Math.min(1, y * (1 - k) + k);
    return [r * 255, g * 255, b * 255];
  };

  convert.xyz.rgb = function (xyz) {
    var x = xyz[0] / 100;
    var y = xyz[1] / 100;
    var z = xyz[2] / 100;
    var r;
    var g;
    var b;
    r = x * 3.2406 + y * -1.5372 + z * -0.4986;
    g = x * -0.9689 + y * 1.8758 + z * 0.0415;
    b = x * 0.0557 + y * -0.2040 + z * 1.0570; // assume sRGB

    r = r > 0.0031308 ? 1.055 * Math.pow(r, 1.0 / 2.4) - 0.055 : r * 12.92;
    g = g > 0.0031308 ? 1.055 * Math.pow(g, 1.0 / 2.4) - 0.055 : g * 12.92;
    b = b > 0.0031308 ? 1.055 * Math.pow(b, 1.0 / 2.4) - 0.055 : b * 12.92;
    r = Math.min(Math.max(0, r), 1);
    g = Math.min(Math.max(0, g), 1);
    b = Math.min(Math.max(0, b), 1);
    return [r * 255, g * 255, b * 255];
  };

  convert.xyz.lab = function (xyz) {
    var x = xyz[0];
    var y = xyz[1];
    var z = xyz[2];
    var l;
    var a;
    var b;
    x /= 95.047;
    y /= 100;
    z /= 108.883;
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
    l = 116 * y - 16;
    a = 500 * (x - y);
    b = 200 * (y - z);
    return [l, a, b];
  };

  convert.lab.xyz = function (lab) {
    var l = lab[0];
    var a = lab[1];
    var b = lab[2];
    var x;
    var y;
    var z;
    y = (l + 16) / 116;
    x = a / 500 + y;
    z = y - b / 200;
    var y2 = Math.pow(y, 3);
    var x2 = Math.pow(x, 3);
    var z2 = Math.pow(z, 3);
    y = y2 > 0.008856 ? y2 : (y - 16 / 116) / 7.787;
    x = x2 > 0.008856 ? x2 : (x - 16 / 116) / 7.787;
    z = z2 > 0.008856 ? z2 : (z - 16 / 116) / 7.787;
    x *= 95.047;
    y *= 100;
    z *= 108.883;
    return [x, y, z];
  };

  convert.lab.lch = function (lab) {
    var l = lab[0];
    var a = lab[1];
    var b = lab[2];
    var hr;
    var h;
    var c;
    hr = Math.atan2(b, a);
    h = hr * 360 / 2 / Math.PI;

    if (h < 0) {
      h += 360;
    }

    c = Math.sqrt(a * a + b * b);
    return [l, c, h];
  };

  convert.lch.lab = function (lch) {
    var l = lch[0];
    var c = lch[1];
    var h = lch[2];
    var a;
    var b;
    var hr;
    hr = h / 360 * 2 * Math.PI;
    a = c * Math.cos(hr);
    b = c * Math.sin(hr);
    return [l, a, b];
  };

  convert.rgb.ansi16 = function (args) {
    var r = args[0];
    var g = args[1];
    var b = args[2];
    var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]; // hsv -> ansi16 optimization

    value = Math.round(value / 50);

    if (value === 0) {
      return 30;
    }

    var ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r / 255));

    if (value === 2) {
      ansi += 60;
    }

    return ansi;
  };

  convert.hsv.ansi16 = function (args) {
    // optimization here; we already know the value and don't need to get
    // it converted for us.
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
  };

  convert.rgb.ansi256 = function (args) {
    var r = args[0];
    var g = args[1];
    var b = args[2]; // we use the extended greyscale palette here, with the exception of
    // black and white. normal palette only has 4 greyscale shades.

    if (r === g && g === b) {
      if (r < 8) {
        return 16;
      }

      if (r > 248) {
        return 231;
      }

      return Math.round((r - 8) / 247 * 24) + 232;
    }

    var ansi = 16 + 36 * Math.round(r / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
    return ansi;
  };

  convert.ansi16.rgb = function (args) {
    var color = args % 10; // handle greyscale

    if (color === 0 || color === 7) {
      if (args > 50) {
        color += 3.5;
      }

      color = color / 10.5 * 255;
      return [color, color, color];
    }

    var mult = (~~(args > 50) + 1) * 0.5;
    var r = (color & 1) * mult * 255;
    var g = (color >> 1 & 1) * mult * 255;
    var b = (color >> 2 & 1) * mult * 255;
    return [r, g, b];
  };

  convert.ansi256.rgb = function (args) {
    // handle greyscale
    if (args >= 232) {
      var c = (args - 232) * 10 + 8;
      return [c, c, c];
    }

    args -= 16;
    var rem;
    var r = Math.floor(args / 36) / 5 * 255;
    var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
    var b = rem % 6 / 5 * 255;
    return [r, g, b];
  };

  convert.rgb.hex = function (args) {
    var integer = ((Math.round(args[0]) & 0xFF) << 16) + ((Math.round(args[1]) & 0xFF) << 8) + (Math.round(args[2]) & 0xFF);
    var string = integer.toString(16).toUpperCase();
    return '000000'.substring(string.length) + string;
  };

  convert.hex.rgb = function (args) {
    var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);

    if (!match) {
      return [0, 0, 0];
    }

    var colorString = match[0];

    if (match[0].length === 3) {
      var _context;

      colorString = map$2(_context = colorString.split('')).call(_context, function (char) {
        return char + char;
      }).join('');
    }

    var integer = _parseInt$2(colorString, 16);

    var r = integer >> 16 & 0xFF;
    var g = integer >> 8 & 0xFF;
    var b = integer & 0xFF;
    return [r, g, b];
  };

  convert.rgb.hcg = function (rgb) {
    var r = rgb[0] / 255;
    var g = rgb[1] / 255;
    var b = rgb[2] / 255;
    var max = Math.max(Math.max(r, g), b);
    var min = Math.min(Math.min(r, g), b);
    var chroma = max - min;
    var grayscale;
    var hue;

    if (chroma < 1) {
      grayscale = min / (1 - chroma);
    } else {
      grayscale = 0;
    }

    if (chroma <= 0) {
      hue = 0;
    } else if (max === r) {
      hue = (g - b) / chroma % 6;
    } else if (max === g) {
      hue = 2 + (b - r) / chroma;
    } else {
      hue = 4 + (r - g) / chroma + 4;
    }

    hue /= 6;
    hue %= 1;
    return [hue * 360, chroma * 100, grayscale * 100];
  };

  convert.hsl.hcg = function (hsl) {
    var s = hsl[1] / 100;
    var l = hsl[2] / 100;
    var c = 1;
    var f = 0;

    if (l < 0.5) {
      c = 2.0 * s * l;
    } else {
      c = 2.0 * s * (1.0 - l);
    }

    if (c < 1.0) {
      f = (l - 0.5 * c) / (1.0 - c);
    }

    return [hsl[0], c * 100, f * 100];
  };

  convert.hsv.hcg = function (hsv) {
    var s = hsv[1] / 100;
    var v = hsv[2] / 100;
    var c = s * v;
    var f = 0;

    if (c < 1.0) {
      f = (v - c) / (1 - c);
    }

    return [hsv[0], c * 100, f * 100];
  };

  convert.hcg.rgb = function (hcg) {
    var h = hcg[0] / 360;
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;

    if (c === 0.0) {
      return [g * 255, g * 255, g * 255];
    }

    var pure = [0, 0, 0];
    var hi = h % 1 * 6;
    var v = hi % 1;
    var w = 1 - v;
    var mg = 0;

    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1;
        pure[1] = v;
        pure[2] = 0;
        break;

      case 1:
        pure[0] = w;
        pure[1] = 1;
        pure[2] = 0;
        break;

      case 2:
        pure[0] = 0;
        pure[1] = 1;
        pure[2] = v;
        break;

      case 3:
        pure[0] = 0;
        pure[1] = w;
        pure[2] = 1;
        break;

      case 4:
        pure[0] = v;
        pure[1] = 0;
        pure[2] = 1;
        break;

      default:
        pure[0] = 1;
        pure[1] = 0;
        pure[2] = w;
    }

    mg = (1.0 - c) * g;
    return [(c * pure[0] + mg) * 255, (c * pure[1] + mg) * 255, (c * pure[2] + mg) * 255];
  };

  convert.hcg.hsv = function (hcg) {
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    var v = c + g * (1.0 - c);
    var f = 0;

    if (v > 0.0) {
      f = c / v;
    }

    return [hcg[0], f * 100, v * 100];
  };

  convert.hcg.hsl = function (hcg) {
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    var l = g * (1.0 - c) + 0.5 * c;
    var s = 0;

    if (l > 0.0 && l < 0.5) {
      s = c / (2 * l);
    } else if (l >= 0.5 && l < 1.0) {
      s = c / (2 * (1 - l));
    }

    return [hcg[0], s * 100, l * 100];
  };

  convert.hcg.hwb = function (hcg) {
    var c = hcg[1] / 100;
    var g = hcg[2] / 100;
    var v = c + g * (1.0 - c);
    return [hcg[0], (v - c) * 100, (1 - v) * 100];
  };

  convert.hwb.hcg = function (hwb) {
    var w = hwb[1] / 100;
    var b = hwb[2] / 100;
    var v = 1 - b;
    var c = v - w;
    var g = 0;

    if (c < 1) {
      g = (v - c) / (1 - c);
    }

    return [hwb[0], c * 100, g * 100];
  };

  convert.apple.rgb = function (apple) {
    return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
  };

  convert.rgb.apple = function (rgb) {
    return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
  };

  convert.gray.rgb = function (args) {
    return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
  };

  convert.gray.hsl = convert.gray.hsv = function (args) {
    return [0, 0, args[0]];
  };

  convert.gray.hwb = function (gray) {
    return [0, 100, gray[0]];
  };

  convert.gray.cmyk = function (gray) {
    return [0, 0, 0, gray[0]];
  };

  convert.gray.lab = function (gray) {
    return [gray[0], 0, 0];
  };

  convert.gray.hex = function (gray) {
    var val = Math.round(gray[0] / 100 * 255) & 0xFF;
    var integer = (val << 16) + (val << 8) + val;
    var string = integer.toString(16).toUpperCase();
    return '000000'.substring(string.length) + string;
  };

  convert.rgb.gray = function (rgb) {
    var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
    return [val / 255 * 100];
  };
});
var conversions_1 = conversions.rgb;
var conversions_2 = conversions.hsl;
var conversions_3 = conversions.hsv;
var conversions_4 = conversions.hwb;
var conversions_5 = conversions.cmyk;
var conversions_6 = conversions.xyz;
var conversions_7 = conversions.lab;
var conversions_8 = conversions.lch;
var conversions_9 = conversions.hex;
var conversions_10 = conversions.keyword;
var conversions_11 = conversions.ansi16;
var conversions_12 = conversions.ansi256;
var conversions_13 = conversions.hcg;
var conversions_14 = conversions.apple;
var conversions_15 = conversions.gray;

/*
	this function routes a model to all other models.

	all functions that are routed have a property `.conversion` attached
	to the returned synthetic function. This property is an array
	of strings, each with the steps in between the 'from' and 'to'
	color models (inclusive).

	conversions that are not possible simply are not included.
*/

function buildGraph() {
  var graph = {}; // https://jsperf.com/object-keys-vs-for-in-with-closure/3

  var models = keys$3(conversions);

  for (var len = models.length, i = 0; i < len; i++) {
    graph[models[i]] = {
      // http://jsperf.com/1-vs-infinity
      // micro-opt, but this is simple.
      distance: -1,
      parent: null
    };
  }

  return graph;
} // https://en.wikipedia.org/wiki/Breadth-first_search


function deriveBFS(fromModel) {
  var graph = buildGraph();
  var queue = [fromModel]; // unshift -> queue -> pop

  graph[fromModel].distance = 0;

  while (queue.length) {
    var current = queue.pop();

    var adjacents = keys$3(conversions[current]);

    for (var len = adjacents.length, i = 0; i < len; i++) {
      var adjacent = adjacents[i];
      var node = graph[adjacent];

      if (node.distance === -1) {
        node.distance = graph[current].distance + 1;
        node.parent = current;
        queue.unshift(adjacent);
      }
    }
  }

  return graph;
}

function link(from, to) {
  return function (args) {
    return to(from(args));
  };
}

function wrapConversion(toModel, graph) {
  var path = [graph[toModel].parent, toModel];
  var fn = conversions[graph[toModel].parent][toModel];
  var cur = graph[toModel].parent;

  while (graph[cur].parent) {
    path.unshift(graph[cur].parent);
    fn = link(conversions[graph[cur].parent][cur], fn);
    cur = graph[cur].parent;
  }

  fn.conversion = path;
  return fn;
}

var route = function route(fromModel) {
  var graph = deriveBFS(fromModel);
  var conversion = {};

  var models = keys$3(graph);

  for (var len = models.length, i = 0; i < len; i++) {
    var toModel = models[i];
    var node = graph[toModel];

    if (node.parent === null) {
      // no possible conversion, or this node is the source model.
      continue;
    }

    conversion[toModel] = wrapConversion(toModel, graph);
  }

  return conversion;
};

var convert = {};

var models = keys$3(conversions);

function wrapRaw(fn) {
  var wrappedFn = function wrappedFn(args) {
    if (args === undefined || args === null) {
      return args;
    }

    if (arguments.length > 1) {
      args = slice$3(Array.prototype).call(arguments);
    }

    return fn(args);
  }; // preserve .conversion property if there is one


  if ('conversion' in fn) {
    wrappedFn.conversion = fn.conversion;
  }

  return wrappedFn;
}

function wrapRounded(fn) {
  var wrappedFn = function wrappedFn(args) {
    if (args === undefined || args === null) {
      return args;
    }

    if (arguments.length > 1) {
      args = slice$3(Array.prototype).call(arguments);
    }

    var result = fn(args); // we're assuming the result is an array here.
    // see notice in conversions.js; don't use box types
    // in conversion functions.

    if (typeof result === 'object') {
      for (var len = result.length, i = 0; i < len; i++) {
        result[i] = Math.round(result[i]);
      }
    }

    return result;
  }; // preserve .conversion property if there is one


  if ('conversion' in fn) {
    wrappedFn.conversion = fn.conversion;
  }

  return wrappedFn;
}

forEach$2(models).call(models, function (fromModel) {
  convert[fromModel] = {};

  defineProperty$9(convert[fromModel], 'channels', {
    value: conversions[fromModel].channels
  });

  defineProperty$9(convert[fromModel], 'labels', {
    value: conversions[fromModel].labels
  });

  var routes = route(fromModel);

  var routeModels = keys$3(routes);

  forEach$2(routeModels).call(routeModels, function (toModel) {
    var fn = routes[toModel];
    convert[fromModel][toModel] = wrapRounded(fn);
    convert[fromModel][toModel].raw = wrapRaw(fn);
  });
});

var colorConvert = convert;

var _context$4, _context12;

var _slice = slice$3([]);

var skippedModels = [// to be honest, I don't really feel like keyword belongs in color convert, but eh.
'keyword', // gray conflicts with some method names, and has its own method defined.
'gray', // shouldn't really be in color-convert either...
'hex'];
var hashedModelKeys = {};

forEach$2(_context$4 = keys$3(colorConvert)).call(_context$4, function (model) {
  var _context2;

  hashedModelKeys[sort$2(_context2 = _slice.call(colorConvert[model].labels)).call(_context2).join('')] = model;
});

var limiters = {};

function Color(obj, model) {
  if (!(this instanceof Color)) {
    return new Color(obj, model);
  }

  if (model && model in skippedModels) {
    model = null;
  }

  if (model && !(model in colorConvert)) {
    throw new Error('Unknown model: ' + model);
  }

  var i;
  var channels;

  if (obj == null) {
    // eslint-disable-line no-eq-null,eqeqeq
    this.model = 'rgb';
    this.color = [0, 0, 0];
    this.valpha = 1;
  } else if (obj instanceof Color) {
    var _context3;

    this.model = obj.model;
    this.color = slice$3(_context3 = obj.color).call(_context3);
    this.valpha = obj.valpha;
  } else if (typeof obj === 'string') {
    var _context4;

    var result = colorString.get(obj);

    if (result === null) {
      throw new Error('Unable to parse color from string: ' + obj);
    }

    this.model = result.model;
    channels = colorConvert[this.model].channels;
    this.color = slice$3(_context4 = result.value).call(_context4, 0, channels);
    this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1;
  } else if (obj.length) {
    this.model = model || 'rgb';
    channels = colorConvert[this.model].channels;

    var newArr = _slice.call(obj, 0, channels);

    this.color = zeroArray(newArr, channels);
    this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1;
  } else if (typeof obj === 'number') {
    // this is always RGB - can be converted later on.
    obj &= 0xFFFFFF;
    this.model = 'rgb';
    this.color = [obj >> 16 & 0xFF, obj >> 8 & 0xFF, obj & 0xFF];
    this.valpha = 1;
  } else {
    this.valpha = 1;

    var keys = keys$3(obj);

    if ('alpha' in obj) {
      splice$2(keys).call(keys, indexOf$5(keys).call(keys, 'alpha'), 1);

      this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0;
    }

    var hashedKeys = sort$2(keys).call(keys).join('');

    if (!(hashedKeys in hashedModelKeys)) {
      throw new Error('Unable to parse color from object: ' + stringify$2(obj));
    }

    this.model = hashedModelKeys[hashedKeys];
    var labels = colorConvert[this.model].labels;
    var color = [];

    for (i = 0; i < labels.length; i++) {
      color.push(obj[labels[i]]);
    }

    this.color = zeroArray(color);
  } // perform limitations (clamping, etc.)


  if (limiters[this.model]) {
    channels = colorConvert[this.model].channels;

    for (i = 0; i < channels; i++) {
      var limit = limiters[this.model][i];

      if (limit) {
        this.color[i] = limit(this.color[i]);
      }
    }
  }

  this.valpha = Math.max(0, Math.min(1, this.valpha));

  if (freeze$2) {
    freeze$2(this);
  }
}

Color.prototype = {
  toString: function toString() {
    return this.string();
  },
  toJSON: function toJSON() {
    return this[this.model]();
  },
  string: function string(places) {
    var _context5;

    var self = this.model in colorString.to ? this : this.rgb();
    self = self.round(typeof places === 'number' ? places : 1);
    var args = self.valpha === 1 ? self.color : concat$2(_context5 = self.color).call(_context5, this.valpha);
    return colorString.to[self.model](args);
  },
  percentString: function percentString(places) {
    var _context6;

    var self = this.rgb().round(typeof places === 'number' ? places : 1);
    var args = self.valpha === 1 ? self.color : concat$2(_context6 = self.color).call(_context6, this.valpha);
    return colorString.to.rgb.percent(args);
  },
  array: function array() {
    var _context7, _context8;

    return this.valpha === 1 ? slice$3(_context7 = this.color).call(_context7) : concat$2(_context8 = this.color).call(_context8, this.valpha);
  },
  object: function object() {
    var result = {};
    var channels = colorConvert[this.model].channels;
    var labels = colorConvert[this.model].labels;

    for (var i = 0; i < channels; i++) {
      result[labels[i]] = this.color[i];
    }

    if (this.valpha !== 1) {
      result.alpha = this.valpha;
    }

    return result;
  },
  unitArray: function unitArray() {
    var rgb = this.rgb().color;
    rgb[0] /= 255;
    rgb[1] /= 255;
    rgb[2] /= 255;

    if (this.valpha !== 1) {
      rgb.push(this.valpha);
    }

    return rgb;
  },
  unitObject: function unitObject() {
    var rgb = this.rgb().object();
    rgb.r /= 255;
    rgb.g /= 255;
    rgb.b /= 255;

    if (this.valpha !== 1) {
      rgb.alpha = this.valpha;
    }

    return rgb;
  },
  round: function round(places) {
    var _context9, _context10;

    places = Math.max(places || 0, 0);
    return new Color(concat$2(_context9 = map$2(_context10 = this.color).call(_context10, roundToPlace(places))).call(_context9, this.valpha), this.model);
  },
  alpha: function alpha(val) {
    if (arguments.length) {
      var _context11;

      return new Color(concat$2(_context11 = this.color).call(_context11, Math.max(0, Math.min(1, val))), this.model);
    }

    return this.valpha;
  },
  // rgb
  red: getset('rgb', 0, maxfn(255)),
  green: getset('rgb', 1, maxfn(255)),
  blue: getset('rgb', 2, maxfn(255)),
  hue: getset(['hsl', 'hsv', 'hsl', 'hwb', 'hcg'], 0, function (val) {
    return (val % 360 + 360) % 360;
  }),
  // eslint-disable-line brace-style
  saturationl: getset('hsl', 1, maxfn(100)),
  lightness: getset('hsl', 2, maxfn(100)),
  saturationv: getset('hsv', 1, maxfn(100)),
  value: getset('hsv', 2, maxfn(100)),
  chroma: getset('hcg', 1, maxfn(100)),
  gray: getset('hcg', 2, maxfn(100)),
  white: getset('hwb', 1, maxfn(100)),
  wblack: getset('hwb', 2, maxfn(100)),
  cyan: getset('cmyk', 0, maxfn(100)),
  magenta: getset('cmyk', 1, maxfn(100)),
  yellow: getset('cmyk', 2, maxfn(100)),
  black: getset('cmyk', 3, maxfn(100)),
  x: getset('xyz', 0, maxfn(100)),
  y: getset('xyz', 1, maxfn(100)),
  z: getset('xyz', 2, maxfn(100)),
  l: getset('lab', 0, maxfn(100)),
  a: getset('lab', 1),
  b: getset('lab', 2),
  keyword: function keyword(val) {
    if (arguments.length) {
      return new Color(val);
    }

    return colorConvert[this.model].keyword(this.color);
  },
  hex: function hex(val) {
    if (arguments.length) {
      return new Color(val);
    }

    return colorString.to.hex(this.rgb().round().color);
  },
  rgbNumber: function rgbNumber() {
    var rgb = this.rgb().color;
    return (rgb[0] & 0xFF) << 16 | (rgb[1] & 0xFF) << 8 | rgb[2] & 0xFF;
  },
  luminosity: function luminosity() {
    // http://www.w3.org/TR/WCAG20/#relativeluminancedef
    var rgb = this.rgb().color;
    var lum = [];

    for (var i = 0; i < rgb.length; i++) {
      var chan = rgb[i] / 255;
      lum[i] = chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
    }

    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  },
  contrast: function contrast(color2) {
    // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
    var lum1 = this.luminosity();
    var lum2 = color2.luminosity();

    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05);
    }

    return (lum2 + 0.05) / (lum1 + 0.05);
  },
  level: function level(color2) {
    var contrastRatio = this.contrast(color2);

    if (contrastRatio >= 7.1) {
      return 'AAA';
    }

    return contrastRatio >= 4.5 ? 'AA' : '';
  },
  isDark: function isDark() {
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var rgb = this.rgb().color;
    var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    return yiq < 128;
  },
  isLight: function isLight() {
    return !this.isDark();
  },
  negate: function negate() {
    var rgb = this.rgb();

    for (var i = 0; i < 3; i++) {
      rgb.color[i] = 255 - rgb.color[i];
    }

    return rgb;
  },
  lighten: function lighten(ratio) {
    var hsl = this.hsl();
    hsl.color[2] += hsl.color[2] * ratio;
    return hsl;
  },
  darken: function darken(ratio) {
    var hsl = this.hsl();
    hsl.color[2] -= hsl.color[2] * ratio;
    return hsl;
  },
  saturate: function saturate(ratio) {
    var hsl = this.hsl();
    hsl.color[1] += hsl.color[1] * ratio;
    return hsl;
  },
  desaturate: function desaturate(ratio) {
    var hsl = this.hsl();
    hsl.color[1] -= hsl.color[1] * ratio;
    return hsl;
  },
  whiten: function whiten(ratio) {
    var hwb = this.hwb();
    hwb.color[1] += hwb.color[1] * ratio;
    return hwb;
  },
  blacken: function blacken(ratio) {
    var hwb = this.hwb();
    hwb.color[2] += hwb.color[2] * ratio;
    return hwb;
  },
  grayscale: function grayscale() {
    // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    var rgb = this.rgb().color;
    var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
    return Color.rgb(val, val, val);
  },
  fade: function fade(ratio) {
    return this.alpha(this.valpha - this.valpha * ratio);
  },
  opaquer: function opaquer(ratio) {
    return this.alpha(this.valpha + this.valpha * ratio);
  },
  rotate: function rotate(degrees) {
    var hsl = this.hsl();
    var hue = hsl.color[0];
    hue = (hue + degrees) % 360;
    hue = hue < 0 ? 360 + hue : hue;
    hsl.color[0] = hue;
    return hsl;
  },
  mix: function mix(mixinColor, weight) {
    // ported from sass implementation in C
    // https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
    if (!mixinColor || !mixinColor.rgb) {
      throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
    }

    var color1 = mixinColor.rgb();
    var color2 = this.rgb();
    var p = weight === undefined ? 0.5 : weight;
    var w = 2 * p - 1;
    var a = color1.alpha() - color2.alpha();
    var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0;
    var w2 = 1 - w1;
    return Color.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue(), color1.alpha() * p + color2.alpha() * (1 - p));
  }
}; // model conversion methods and static constructors

forEach$2(_context12 = keys$3(colorConvert)).call(_context12, function (model) {
  if (indexOf$5(skippedModels).call(skippedModels, model) !== -1) {
    return;
  }

  var channels = colorConvert[model].channels; // conversion methods

  Color.prototype[model] = function () {
    var _context13;

    if (this.model === model) {
      return new Color(this);
    }

    if (arguments.length) {
      return new Color(arguments, model);
    }

    var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha;
    return new Color(concat$2(_context13 = assertArray(colorConvert[this.model][model].raw(this.color))).call(_context13, newAlpha), model);
  }; // 'static' construction methods


  Color[model] = function (color) {
    if (typeof color === 'number') {
      color = zeroArray(_slice.call(arguments), channels);
    }

    return new Color(color, model);
  };
});

function roundTo(num, places) {
  return Number(num.toFixed(places));
}

function roundToPlace(places) {
  return function (num) {
    return roundTo(num, places);
  };
}

function getset(model, channel, modifier) {
  model = isArray$3(model) ? model : [model];

  forEach$2(model).call(model, function (m) {
    (limiters[m] || (limiters[m] = []))[channel] = modifier;
  });

  model = model[0];
  return function (val) {
    var result;

    if (arguments.length) {
      if (modifier) {
        val = modifier(val);
      }

      result = this[model]();
      result.color[channel] = val;
      return result;
    }

    result = this[model]().color[channel];

    if (modifier) {
      result = modifier(result);
    }

    return result;
  };
}

function maxfn(max) {
  return function (v) {
    return Math.max(0, Math.min(max, v));
  };
}

function assertArray(val) {
  return isArray$3(val) ? val : [val];
}

function zeroArray(arr, length) {
  for (var i = 0; i < length; i++) {
    if (typeof arr[i] !== 'number') {
      arr[i] = 0;
    }
  }

  return arr;
}

var color = Color;

var WebrainGraphObjectsId = '-4ff4f3a6-b8a8-4085-bd85-bb255c9f24a7'; // noinspection JSPrimitiveTypeWrapperUsage

var NoValue = new String('NoValue');
var VALUE_HISTORY_MAX_SIZE = 10;
function getDisplayName(value) {
  if (typeof value === 'undefined') {
    return 'undefined';
  }

  if (value === null) {
    return 'null';
  }

  if (typeof value === 'string') {
    return "\"" + value + "\"";
  }

  if (value instanceof Date) {
    return isNan$2(value.getTime()) ? 'NaN' : value.toISOString().replace('T', ' ');
  }

  if (value instanceof CalcStat) {
    return value.toString();
  }

  if (isIterable$2(value)) {
    var iterator = getIterator$1(value);

    var iteration = iterator.next();
    var size = value.length;

    if (size == null) {
      size = value.size;
    }

    var item;

    if (!iteration.done) {
      item = iteration.value;

      if (value[toStringTag$2] === 'Map') {
        item = item[1];
      }
    }

    return iteration.done ? value.constructor.name + "-" + getObjectUniqueId(value) + "[" + (size || 0) + "]" : value.constructor.name + "-" + getObjectUniqueId(value) + "<" + getDisplayName(item) + ">[" + size + "]";
  }

  if (typeof value === 'object') {
    var name = value instanceof CalcProperty && value.state.name || value instanceof Connector && value.connectorState.name;

    if (value instanceof Connector) {
      return 'Connector.' + (name || '');
    }

    return (name || value.constructor.name) + "-" + getObjectUniqueId(value);
  }

  if (typeof value === 'function') {
    return value.name ? value.name + "()-" + getObjectUniqueId(value) : "() => {...} - " + getObjectUniqueId(value);
  }

  return value.toString();
}
function deepMerge(options, base) {
  for (var i = 0, len = arguments.length <= 2 ? 0 : arguments.length - 2; i < len; i++) {
    base = _deepMerge(options, base, i + 2 < 2 || arguments.length <= i + 2 ? undefined : arguments[i + 2]);
  }

  return base;
}

function _deepMerge(options, base, other) {
  if (!(other instanceof Object)) {
    if (fill$2(options) && typeof other === 'undefined') {
      return base;
    } else {
      return other;
    }
  }

  if (!(base instanceof Object)) {
    base = {};
  }

  for (var key in base) {
    if (Object.prototype.hasOwnProperty.call(base, key)) {
      var v1 = base[key];
      var v2 = Object.prototype.hasOwnProperty.call(other, key) ? other[key] : void 0;
      base[key] = _deepMerge(options, v1, v2);
    }
  }

  for (var _key in other) {
    if (Object.prototype.hasOwnProperty.call(other, _key)) {
      var _v = Object.prototype.hasOwnProperty.call(base, _key) ? base[_key] : void 0;

      var _v2 = other[_key];
      base[_key] = _deepMerge(options, _v, _v2);
    }
  }

  return base;
}

function colorOpacity(color$1, opacity) {
  return color(color$1).mix(color('white'), 1.0 - opacity).string();
}
var updateId = [0];
var WebrainObservableMap =
/*#__PURE__*/
function (_ObservableMap) {
  _inherits(WebrainObservableMap, _ObservableMap);

  function WebrainObservableMap() {
    _classCallCheck(this, WebrainObservableMap);

    return _possibleConstructorReturn(this, _getPrototypeOf(WebrainObservableMap).apply(this, arguments));
  }

  return WebrainObservableMap;
}(ObservableMap);
var WebrainMap =
/*#__PURE__*/
function (_Map) {
  _inherits(WebrainMap, _Map);

  function WebrainMap() {
    _classCallCheck(this, WebrainMap);

    return _possibleConstructorReturn(this, _getPrototypeOf(WebrainMap).apply(this, arguments));
  }

  return WebrainMap;
}(_wrapNativeSuper(map$7));
var WebrainObject = function WebrainObject() {
  _classCallCheck(this, WebrainObject);
};

var _edgeStyles;
var EdgeType;

(function (EdgeType) {
  EdgeType["ObjectPart"] = "ObjectPart";
  EdgeType["Connect"] = "Connect";
  EdgeType["Dependency"] = "Dependency";
  EdgeType["DeepSubscribe"] = "DeepSubscribe";
})(EdgeType || (EdgeType = {}));

var edgeStyles = (_edgeStyles = {
  common: function common(_ref) {
    var opacity = _ref.opacity;
    return {
      dashes: false,
      ifNull: {// dashes: true,
      },
      font: {
        color: colorOpacity('#000000', opacity)
      }
    };
  }
}, _edgeStyles[EdgeType.ObjectPart] = function (_ref2) {
  var opacity = _ref2.opacity;
  return {
    color: colorOpacity('#000000', opacity)
  };
}, _edgeStyles[EdgeType.Connect] = function (_ref3) {
  var opacity = _ref3.opacity;
  return {
    color: colorOpacity('#0000ff', opacity)
  };
}, _edgeStyles[EdgeType.Dependency] = function (_ref4) {
  var opacity = _ref4.opacity;
  return {
    color: colorOpacity('#df0000', opacity)
  };
}, _edgeStyles[EdgeType.DeepSubscribe] = function (_ref5) {
  var opacity = _ref5.opacity;
  return {
    dashes: true,
    color: colorOpacity('#000000', opacity)
  };
}, _edgeStyles);
var Edge =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(Edge, _ObservableClass);

  function Edge(_ref6) {
    var _this;

    var id = _ref6.id,
        type = _ref6.type,
        fromId = _ref6.fromId,
        toId = _ref6.toId,
        key = _ref6.key,
        keyType = _ref6.keyType;

    _classCallCheck(this, Edge);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Edge).call(this));
    _this.valueHistory = [];
    _this.id = id;
    _this.type = type;
    _this.fromId = fromId;
    _this.toId = toId;
    _this.key = key;
    _this.keyType = keyType;
    return _this;
  }

  _createClass(Edge, [{
    key: "getVisData",
    value: function getVisData(_ref7) {
      var opacity = _ref7.opacity,
          age = _ref7.age;
      var value = this._visData;

      if (!value) {
        this._visData = value = new WebrainObject();
        value.name = 'Edge.WebrainObject' + WebrainGraphObjectsId, value.id = this.id;
        value.from = this.fromId;
        value.to = this.toId;
        value.arrows = {
          to: {
            enabled: true
          }
        };
      }

      var keyStr = this.key;
      var valueStr = this.value && getDisplayName(this.value);
      var label = this.key || ''; // if (valueStr) {

      label += ' = ' + valueStr; // }

      value.label = label;

      if (this.type != null) {
        var common = edgeStyles.common({
          opacity: opacity
        });
        var specific = edgeStyles[this.type]({
          opacity: opacity
        });
        var style = deepMerge({
          fill: true
        }, {}, common, specific, this.value == null ? common.ifNull : void 0, this.value == null ? specific.ifNull : void 0);

        for (var key in style) {
          if (Object.prototype.hasOwnProperty.call(style, key)) {
            value[key] = deepMerge({
              fill: false
            }, value[key], style[key]);
          }
        }
      }

      return value;
    }
  }]);

  return Edge;
}(ObservableClass);
new CalcObjectBuilder(Edge.prototype).writable('count').writable('value', {
  setOptions: {
    equalsFunc: function equalsFunc() {
      return false;
    },
    afterChange: function afterChange(value) {
      this.valueHistory.push(value);

      if (this.valueHistory.length > VALUE_HISTORY_MAX_SIZE) {
        delete this.valueHistory[this.valueHistory.length - VALUE_HISTORY_MAX_SIZE - 1];
      }
    }
  }
}).calc('updateId', function (o) {
  return o;
}, // connect to self
calcPropertyFactory({
  name: 'Edge.updateId' + WebrainGraphObjectsId,
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.noAutoRules().propertyPredicate(function (p) {
        return p !== 'visData' && p !== 'updateId';
      }, '!visData && !updateId');
    });
  },
  calcFunc:
  /*#__PURE__*/
  regenerator.mark(function calcFunc(state) {
    return regenerator.wrap(function calcFunc$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            state.value = updateId[0]++;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, calcFunc);
  })
}));

var _nodeStyles;
var NodeType;

(function (NodeType) {
  NodeType["Unknown"] = "Unknown";
  NodeType["Object"] = "Object";
  NodeType["ObservableClass"] = "ObservableClass";
  NodeType["Connector"] = "Connector";
  NodeType["CalcProperty"] = "CalcProperty";
})(NodeType || (NodeType = {}));

var nodeStyles = (_nodeStyles = {
  common: function common(_ref) {
    var opacity = _ref.opacity;
    return {
      borderWidth: 1,
      borderWidthSelected: 2,
      shape: 'box',
      color: {},
      font: {
        color: colorOpacity('#000000', opacity)
      },
      value: 1,
      scaling: {
        min: 10,
        max: 10,
        label: {
          enabled: true,
          min: 10,
          max: 10,
          maxVisible: 80,
          drawThreshold: 5
        }
      },
      error: {
        scale: 5,
        borderWidth: 1,
        borderWidthSelected: 2,
        color: {
          background: '#ff5555',
          border: '#ff0000',
          text: '#ffffff'
        },
        scaling: {
          max: 30,
          label: {
            max: 30
          }
        }
      }
    };
  }
}, _nodeStyles[NodeType.Unknown] = function (_ref2) {
  var opacity = _ref2.opacity;
  return {
    color: {
      background: colorOpacity('#cccccc', opacity),
      border: colorOpacity('#777777', opacity),
      highlight: {
        background: colorOpacity('#cccccc', opacity),
        border: colorOpacity('#777777', opacity)
      }
    },
    font: {
      color: colorOpacity('#555555', opacity)
    }
  };
}, _nodeStyles[NodeType.Object] = function (_ref3) {
  var opacity = _ref3.opacity;
  return {
    color: {
      background: colorOpacity('#ffffff', opacity),
      border: colorOpacity('#000000', opacity),
      highlight: {
        background: colorOpacity('#ffffff', opacity),
        border: colorOpacity('#000000', opacity)
      }
    },
    font: {
      color: colorOpacity('#000000', opacity)
    }
  };
}, _nodeStyles[NodeType.ObservableClass] = function (_ref4) {
  var opacity = _ref4.opacity;
  return {
    color: {
      background: colorOpacity('#ccccff', opacity),
      border: colorOpacity('#0000ff', opacity),
      highlight: {
        background: colorOpacity('#ccccff', opacity),
        border: colorOpacity('#0000ff', opacity)
      }
    },
    font: {
      color: colorOpacity('#000000', opacity)
    }
  };
}, _nodeStyles[NodeType.Connector] = function (_ref5) {
  var opacity = _ref5.opacity;
  return {
    color: {
      background: colorOpacity('#7777ff', opacity),
      border: colorOpacity('#0000ff', opacity),
      highlight: {
        background: colorOpacity('#7777ff', opacity),
        border: colorOpacity('#0000ff', opacity)
      }
    },
    font: {
      color: colorOpacity('#ffffff', opacity)
    }
  };
}, _nodeStyles[NodeType.CalcProperty] = function (_ref6) {
  var opacity = _ref6.opacity;
  return {
    color: {
      background: colorOpacity('#ffff00', opacity),
      border: colorOpacity('#000000', opacity),
      highlight: {
        background: colorOpacity('#ffff00', opacity),
        border: colorOpacity('#000000', opacity)
      }
    },
    font: {
      color: colorOpacity('#000000', opacity)
    }
  };
}, _nodeStyles);
var Node =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(Node, _ObservableClass);

  _createClass(Node, [{
    key: "edgesCount",
    get: function get() {
      return this.edgesCountIn + this.edgesCountOut;
    }
  }]);

  function Node(_ref7) {
    var _this;

    var id = _ref7.id,
        object = _ref7.object,
        key = _ref7.key,
        keyType = _ref7.keyType;

    _classCallCheck(this, Node);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Node).call(this));
    _this.valueHistory = [];
    _this.edgesCountIn = 0;
    _this.edgesCountOut = 0;
    _this.id = id;
    _this.object = object;
    _this.key = key;
    _this.keyType = keyType;

    if (object instanceof PropertyChangedObject) {
      _this.type = NodeType.ObservableClass;
    } else if (object && object.constructor === Object) {
      _this.type = NodeType.Object;
    } else {
      _this.type = NodeType.Unknown;
    }

    return _this;
  }

  _createClass(Node, [{
    key: "getVisData",
    value: function getVisData(_ref8) {
      var opacity = _ref8.opacity,
          age = _ref8.age;
      var value = this._visData;

      if (!value) {
        this._visData = value = new WebrainObject();
        value.name = 'Node.WebrainObject' + WebrainGraphObjectsId;
        value.id = this.id;
        value.title = this.id;
      }

      var label = this.name;

      if (this.key != null) {
        label += '.' + this.key;
      }

      value.label = label + '\r\n' + age;

      if (this.type != null) {
        var common = nodeStyles.common({
          opacity: opacity
        });
        var specific = nodeStyles[this.type]({
          opacity: opacity
        });
        var style = deepMerge({
          fill: true
        }, {}, common, specific, this.error ? common.error : void 0, this.error ? specific.error : void 0);

        for (var key in style) {
          if (Object.prototype.hasOwnProperty.call(style, key)) {
            value[key] = deepMerge({
              fill: false
            }, value[key], style[key]);
          }
        }
      }

      return value;
    }
  }]);

  return Node;
}(ObservableClass);
new CalcObjectBuilder(Node.prototype).writable('name').writable('type').writable('value', {
  setOptions: {
    equalsFunc: function equalsFunc() {
      return false;
    },
    afterChange: function afterChange(value) {
      this.valueHistory.push(value);

      if (this.valueHistory.length > VALUE_HISTORY_MAX_SIZE) {
        delete this.valueHistory[this.valueHistory.length - VALUE_HISTORY_MAX_SIZE - 1];
      }
    }
  }
}).writable('error').calc('updateId', function (o) {
  return o;
}, // connect to self
calcPropertyFactory({
  name: 'Node.updateId' + WebrainGraphObjectsId,
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.noAutoRules().propertyPredicate(function (p) {
        return p !== 'visData' && p !== 'updateId';
      }, '!visData && !updateId');
    });
  },
  calcFunc:
  /*#__PURE__*/
  regenerator.mark(function calcFunc(state) {
    return regenerator.wrap(function calcFunc$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            state.value = updateId[0]++;

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, calcFunc);
  })
}));

var HighlightMode; // region helpers

(function (HighlightMode) {
  HighlightMode["All"] = "All";
  HighlightMode["LastActive"] = "LastActive";
  HighlightMode["CalcTimeSum"] = "CalcTimeSum";
  HighlightMode["CalcTimeAverage"] = "CalcTimeAverage";
  HighlightMode["Subscribers"] = "Subscribers";
  HighlightMode["SearchResults"] = "SearchResults";
})(HighlightMode || (HighlightMode = {}));

var calcNodeId = function calcNodeId(object, key, keyType) {
  if (object == null) {
    return null;
  }

  var objectId = getObjectUniqueId(object);

  if (objectId == null) {
    return null; // throw new Error(`getObjectUniqueId(${object}) == null`)
  }

  var keyId = getObjectUniqueId(key);

  if (keyId) {
    key = "{" + keyId + "}";
  }

  return "" + objectId; // TODO add keyType after finish webrain refactoring
};

var calcEdgeId = function calcEdgeId(fromId, toId, type, key, keyType) {
  var keyId = getObjectUniqueId(key);

  if (keyId) {
    key = "{" + keyId + "}";
  }

  return fromId + "-" + toId + "-" + type + "-" + key; // TODO add keyType after finish webrain refactoring
}; // endregion
// region class WebrainGraph


var WebrainGraph =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(WebrainGraph, _ObservableClass);

  function WebrainGraph() {
    var _getPrototypeOf2, _context;

    var _this;

    _classCallCheck(this, WebrainGraph);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WebrainGraph)).call.apply(_getPrototypeOf2, concat$2(_context = [this]).call(_context, args)));
    _this.objects = new WebrainMap();
    _this.isEnabled = false;
    return _this;
  }

  _createClass(WebrainGraph, [{
    key: "getObjectInfo",
    value: function getObjectInfo(object) {
      var objectInfo = this.objects.get(object);

      if (!objectInfo) {
        objectInfo = {
          nodes: [],
          edges: []
        };
        this.objects.set(object, objectInfo);
      }

      return objectInfo;
    }
  }, {
    key: "addObjectInfo",
    value: function addObjectInfo(object, node, edge) {
      var objectInfo = this.getObjectInfo(object);

      if (node) {
        objectInfo.nodes.push(node);
      }

      if (edge) {
        objectInfo.edges.push(edge);
      }

      return objectInfo;
    }
  }, {
    key: "removeObjectInfo",
    value: function removeObjectInfo(object, node, edge) {
      var _context2, _context4;

      if (!this.objects.has(object)) {
        return;
      }

      var objectInfo = this.objects.get(object);

      var index = indexOf$5(_context2 = objectInfo.nodes).call(_context2, node);

      if (index >= 0) {
        var _context3;

        splice$2(_context3 = objectInfo.nodes).call(_context3, index, 1);
      }

      index = indexOf$5(_context4 = objectInfo.edges).call(_context4, edge);

      if (index >= 0) {
        var _context5;

        splice$2(_context5 = objectInfo.edges).call(_context5, index, 1);
      }

      if (!objectInfo.nodes.length && !objectInfo.edges.length) {
        this.objects.delete(object);
      }
    }
  }, {
    key: "getNodeId",
    value: function getNodeId(_ref) {
      var object = _ref.object,
          type = _ref.type,
          key = _ref.key,
          keyType = _ref.keyType,
          value = _ref.value,
          valueChanged = _ref.valueChanged,
          error = _ref.error;

      if (object == null || object instanceof Date || isWebrainInternalObject(object)) {
        return null;
      }

      key = null;
      keyType = null;
      var nodeId = calcNodeId(object, key);

      if (nodeId == null) {
        return;
      }

      return nodeId;
    }
  }, {
    key: "setNode",
    value: function setNode(_ref2) {
      var object = _ref2.object,
          type = _ref2.type,
          key = _ref2.key,
          keyType = _ref2.keyType,
          value = _ref2.value,
          valueChanged = _ref2.valueChanged,
          error = _ref2.error;
      var nodeId = this.getNodeId({
        object: object,
        type: type,
        key: key,
        keyType: keyType,
        value: value,
        valueChanged: valueChanged,
        error: error
      });

      if (nodeId == null) {
        return;
      }

      var name = getDisplayName(object);
      var node = this.nodes.get(nodeId);

      if (!node) {
        node = new Node({
          id: nodeId,
          object: object,
          key: key,
          keyType: keyType
        });
        node.name = name;
        this.nodes.set(nodeId, node); // this.addObjectInfo(object, node, null)

        if (object && object.propertyChanged) {
          var unsubscribed;
          var unsubscribe = object.propertyChanged.hasSubscribersObservable.subscribe(function (hasSubscribers) {
            if (!hasSubscribers) {
              // this.nodes.delete(nodeId)
              // this.removeEdges({nodeId})
              // this.removeObjectInfo(object, node, null)
              if (unsubscribe) {
                unsubscribed = true;
                unsubscribe();
              }
            }
          }, 'Node object.hasSubscribersObservable');

          if (unsubscribed) {
            unsubscribe();
            return null;
          }
        }
      }

      node.name = name;

      if (type != null) {
        node.type = type;
      }

      if (error != null) {
        node.error = error;
      }

      if (value !== NoValue) {
        // const oldObjectInfo = getObjectUniqueId(node.value) && this.objects.get(node.value)
        // const newObjectInfo = getObjectUniqueId(value) && this.objects.get(value)
        if (node.value !== value || valueChanged) {
          node.value = value;
        } // if (oldObjectInfo) {
        // 	for (let i = 0, len = oldObjectInfo.nodes.length; i < len; i++) {
        // 		this.removeEdges({
        // 			type: EdgeType.ObjectPart,
        // 			fromId: node.id,
        // 			toId: oldObjectInfo.nodes[i].id,
        // 		})
        // 	}
        // }
        // if (newObjectInfo) {
        // 	for (let i = 0, len = newObjectInfo.nodes.length; i < len; i++) {
        // 		this.setEdge({
        // 			type: EdgeType.ObjectPart,
        // 			value: node.value,
        // 			from: node,
        // 			to: newObjectInfo.nodes[i],
        // 		})
        // 	}
        // }

      }

      return node;
    }
  }, {
    key: "setEdge",
    value: function setEdge(_ref3) {
      var type = _ref3.type,
          key = _ref3.key,
          keyType = _ref3.keyType,
          value = _ref3.value,
          from = _ref3.from,
          to = _ref3.to;

      // TODO: remove this after webrain refactoring will finish
      if (!(from instanceof Node) && keyType == null) {
        from.keyType = 0;
      }

      if (!(to instanceof Node) && to.keyType == null) {
        to.keyType = 0;
      }

      if (keyType == null) {
        keyType = 0;
      }

      if (from.object instanceof CalcProperty) {
        from.key = null;
        from.keyType = null;
      }

      var fromId = from instanceof Node ? from.id : this.getNodeId(from);
      var toId = to instanceof Node ? to.id : this.getNodeId(to); // if (!fromId && toId) {
      // 	this.removeEdges({type, fromId, toId})
      // 	return
      // }

      if (fromId && toId) {
        if (!(from instanceof Node)) {
          from = this.setNode(from);
        }

        if (!(to instanceof Node)) {
          to = this.setNode(to);
        }

        var edgeId = calcEdgeId(fromId, toId, type, key);
        var edge = this.edges.get(edgeId);

        if (!edge) {
          edge = new Edge({
            id: edgeId,
            type: type,
            fromId: fromId,
            toId: toId,
            key: key,
            keyType: keyType
          });
          this.edges.set(edgeId, edge);
          from.edgesCountOut++;
          to.edgesCountIn++;
        }

        edge.count = (edge.count || 0) + 1;

        if (value !== NoValue) {
          // tslint:disable-next-line:no-collapsible-if
          if (edge.value !== value || !(to instanceof Node) && to.valueChanged) {
            edge.value = value;
          }
        }
      }
    }
  }, {
    key: "removeEdges",
    value: function removeEdges(_ref4) {
      var type = _ref4.type,
          key = _ref4.key,
          keyType = _ref4.keyType,
          fromId = _ref4.fromId,
          toId = _ref4.toId,
          nodeId = _ref4.nodeId;

      // TODO: remove this after webrain refactoring will finish
      if (keyType == null) {
        keyType = 0;
      } // remove edge


      var removeEntries = [];

      for (var _iterator = this.edges, _isArray = isArray$3(_iterator), _i = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
        var _ref5;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref5 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref5 = _i.value;
        }

        var entry = _ref5;
        var _id = entry[0],
            _edge = entry[1];

        if (type != null && _edge.type !== type) {
          continue;
        }

        if (key != null && keyType != null && (_edge.key !== key || _edge.keyType !== keyType)) {
          continue;
        }

        if (nodeId == null || _edge.fromId !== nodeId && _edge.toId !== nodeId) {
          if (fromId == null || toId == null) {
            if ((fromId == null || _edge.fromId !== fromId) && (toId == null || _edge.toId !== toId)) {
              continue;
            }
          } else if (_edge.fromId !== fromId || _edge.toId !== toId) {
            continue;
          }
        }

        if (_edge.count == null || --_edge.count <= 0) {
          removeEntries.push(entry);
        }
      }

      for (var i = 0, len = removeEntries.length; i < len; i++) {
        var _removeEntries$i = removeEntries[i],
            id = _removeEntries$i[0],
            edge = _removeEntries$i[1];
        this.edges.delete(id);
        var from = this.nodes.get(edge.fromId);
        var to = this.nodes.get(edge.toId);
        from.edgesCountOut--;
        to.edgesCountIn--;

        if (from.edgesCount <= 0) {
          this.nodes.delete(from.id);
        }

        if (to.edgesCount <= 0) {
          this.nodes.delete(to.id);
        }
      }
    }
  }, {
    key: "init",
    value: function init() {
      var _this2 = this;

      if (this._initialized) {
        return;
      }

      this._initialized = true;

      if (typeof window === 'undefined') {
        return;
      }

      if (!this.isEnabled) {
        return;
      }

      Debugger.Instance.calculatedObservable.subscribe(function (e) {
        // console.log('calculatedObservable', e)
        setTimeout$2(function () {
          _this2.setNode({
            object: e.target,
            type: NodeType.CalcProperty,
            key: null,
            keyType: null,
            value: e.newValue,
            valueChanged: true
          });
        });
      }, 'WebrainGraph calculatedObservable');
      Debugger.Instance.errorObservable.subscribe(function (e) {
        setTimeout$2(function () {
          _this2.setNode({
            object: e.target,
            type: NodeType.CalcProperty,
            key: null,
            keyType: null,
            value: NoValue,
            error: e.error
          });
        });

        console.error('Debugger Error', e);
      }, 'WebrainGraph errorObservable'); // Debugger.Instance.connectorObservable.subscribe(e => {
      // 	return
      // 	setTimeout(() => {
      // 		this.setEdge({
      // 			type: EdgeType.Connect,
      // 			key: e.key,
      // 			keyType: e.keyType,
      // 			value: e.value,
      // 			from: {
      // 				object: e.parent,
      // 				type: null,
      // 				key: e.key,
      // 				keyType: e.keyType,
      // 				value: NoValue,
      // 			},
      // 			to: {
      // 				object: e.target,
      // 				type: NodeType.Connector,
      // 				key: e.targetKey,
      // 				keyType: ValueKeyType.Property,
      // 				value: e.value,
      // 				valueChanged: true,
      // 			},
      // 		})
      // 		// console.log('connectorObservable', e)
      // 	})
      // }, 'WebrainGraph connectorObservable')
      //
      // Debugger.Instance.dependencyObservable.subscribe(e => {
      // 	return
      // 	if (!(e.parent instanceof Connector) && isWebrainInternalObject(e.parent)) {
      // 		return
      // 	}
      //
      // 	setTimeout(() => {
      // 		let from
      // 		// = this.setNode({
      // 		// 	object: e.value,
      // 		// 	type: null,
      // 		// 	key: null,
      // 		// 	keyType: null,
      // 		// 	value: NoValue,
      // 		// })
      // 		let fromId
      // 		if (from) {
      // 			fromId = this.getNodeId({
      // 				object: e.parent,
      // 				type: null,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      // 		} else {
      // 			from = this.setNode({
      // 				object: e.parent,
      // 				type: null,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      // 		}
      //
      // 		if (from) {
      // 			const to = this.setNode({
      // 				object: e.target,
      // 				type: NodeType.CalcProperty,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      // 			if (to) {
      // 				this.setEdge({
      // 					type: EdgeType.Dependency,
      // 					key: e.key,
      // 					keyType: e.keyType,
      // 					value: e.value,
      // 					from,
      // 					to,
      // 				})
      // 				if (fromId) {
      // 					this.removeEdges({
      // 						type: EdgeType.Dependency,
      // 						key: e.key,
      // 						keyType: e.keyType,
      // 						fromId,
      // 						toId: to.id,
      // 					})
      // 				}
      // 			}
      // 		}
      // 		// console.log('dependencyObservable', e)
      // 	})
      // }, 'WebrainGraph dependencyObservable')

      Debugger.Instance.deepSubscribeObservable.subscribe(function (e) {
        setTimeout$2(function () {
          var fromId;
          var toId;

          if (typeof e.target === 'function' && e.target.name === 'updateView') {
            e.oldIsLeaf = false;
            e.newIsLeaf = false;
          }

          var nodeType;
          var edgeType;

          if (e.target instanceof CalcProperty) {
            edgeType = EdgeType.Dependency; // nodeType = NodeType.CalcProperty
          } else if (e.target instanceof Connector) {
            edgeType = EdgeType.Connect;
            nodeType = NodeType.Connector;
          } else {
            edgeType = EdgeType.DeepSubscribe;
          }

          if ((!e.oldIsLeaf || nodeType !== NodeType.Connector || typeof e.oldValue !== 'undefined') && (e.changeType & ValueChangeType.Unsubscribe) !== 0) {
            fromId = _this2.getNodeId({
              object: e.parent,
              type: null,
              key: null,
              keyType: null,
              value: NoValue
            });
            toId = _this2.getNodeId({
              object: e.oldIsLeaf ? e.target : e.oldValue,
              type: null,
              key: null,
              keyType: null,
              value: NoValue
            });
          }

          if ((!e.newIsLeaf || nodeType !== NodeType.Connector || typeof e.newValue !== 'undefined') && (e.changeType & ValueChangeType.Subscribe) !== 0) {
            _this2.setEdge({
              type: e.newIsLeaf ? edgeType : EdgeType.DeepSubscribe,
              key: e.key,
              keyType: e.keyType,
              value: e.newValue,
              from: {
                object: e.parent,
                type: null,
                key: null,
                keyType: null,
                value: NoValue
              },
              to: {
                object: e.newIsLeaf ? e.target : e.newValue,
                type: e.newIsLeaf ? nodeType : null,
                key: null,
                keyType: null,
                value: NoValue
              }
            });
          }

          if (fromId && toId) {
            _this2.removeEdges({
              type: e.oldIsLeaf ? edgeType : EdgeType.DeepSubscribe,
              key: e.key,
              keyType: e.keyType,
              fromId: fromId,
              toId: toId
            });
          } // console.log('deepSubscribeObservable', e)

        });
      }, 'WebrainGraph deepSubscribeObservable'); // Debugger.Instance.deepSubscribeLastValueObservable.subscribe(e => {
      // 	setTimeout(() => {
      // 		let fromId
      // 		let toId
      //
      // 		let nodeType: NodeType
      // 		let edgeType: EdgeType
      // 		if (e.target instanceof CalcProperty) {
      // 			edgeType = EdgeType.Dependency
      // 			// nodeType = NodeType.CalcProperty
      // 		} else if (e.target instanceof Connector) {
      // 			edgeType = EdgeType.Connect
      // 			nodeType = NodeType.Connector
      // 		} else {
      // 			edgeType = EdgeType.DeepSubscribe
      // 		}
      //
      // 		if (e.unsubscribedValue) {
      // 			fromId = this.getNodeId({
      // 				object: e.unsubscribedValue.parent,
      // 				type: null,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      //
      // 			toId = this.getNodeId({
      // 				object: e.target,
      // 				type: null,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      // 		}
      //
      // 		if (e.subscribedValue) {
      // 			const from = this.setNode({
      // 				object: e.subscribedValue.parent,
      // 				type: null,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      //
      // 			const to = this.setNode({
      // 				object: e.target,
      // 				type: nodeType,
      // 				key: null,
      // 				keyType: null,
      // 				value: NoValue,
      // 			})
      //
      // 			if (from && to) {
      // 				this.setEdge({
      // 					type: edgeType,
      // 					key: e.subscribedValue.key,
      // 					keyType: e.subscribedValue.keyType,
      // 					value: e.subscribedValue.value,
      // 					from,
      // 					to,
      // 				})
      // 			}
      // 		}
      //
      // 		if (e.unsubscribedValue) {
      // 			if (fromId && toId) {
      // 				// this.removeEdges({
      // 				// 	type: edgeType,
      // 				// 	key: e.unsubscribedValue.key,
      // 				// 	keyType: e.unsubscribedValue.keyType,
      // 				// 	fromId,
      // 				// 	toId,
      // 				// })
      // 			}
      // 		}
      // 		// console.log('deepSubscribeLastValueObservable', e)
      // 	})
      // }, 'WebrainGraph deepSubscribeLastValueObservable')
      // Debugger.Instance.invalidatedObservable.subscribe(e => {
      // 	console.log('invalidatedObservable', e)
      // }, 'WebrainGraph invalidatedObservable')
    }
  }]);

  return WebrainGraph;
}(ObservableClass); // see graphic: https://www.desmos.com/calculator/cdxbsjigvu

var opacityMin = 0.15;

function calcOpacityLastActive(itemUpdateId, currentUpdateId) {
  var delta = currentUpdateId - itemUpdateId;
  return Math.exp(-delta / 30) * (1 - opacityMin) + opacityMin;
}

var ln2 = Math.log(2);

function calcOpacityCalcTime(calcTime, halfOpacityForCalcTime) {
  return (1 - Math.exp(-calcTime * ln2 / halfOpacityForCalcTime)) * (1 - opacityMin) + opacityMin;
}

new CalcObjectBuilder(WebrainGraph.prototype).writable('isEnabled').writable('highlightMode').writable('searchPattern', {
  setOptions: {
    afterChange: function afterChange(value) {
      if (value) {
        this.highlightMode = HighlightMode.SearchResults;
      }
    }
  }
}).readable('nodes', {
  factory: function factory() {
    return new WebrainObservableMap(new ObjectMap());
  }
}).readable('edges', {
  factory: function factory() {
    return new WebrainObservableMap(new ObjectMap());
  }
}).calc('visData', connectorFactory({
  name: 'WebrainGraph.Connector.visData' + WebrainGraphObjectsId,
  buildRule: function buildRule(c) {
    return c.connect('nodes', function (b) {
      return b.p('nodes');
    }).connect('edges', function (b) {
      return b.p('edges');
    }).connect('highlightMode', function (b) {
      return b.p('highlightMode');
    }).connect('searchPattern', function (b) {
      return b.p('searchPattern');
    });
  }
}), calcPropertyFactory({
  name: 'WebrainGraph.visData' + WebrainGraphObjectsId,
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.any(function (b2) {
        return b2.p('highlightMode', 'searchPattern');
      }, function (b2) {
        return b2.p('nodes', 'edges').collection().p('updateId');
      });
    });
  },
  // invalidate on change self
  calcFunc:
  /*#__PURE__*/
  regenerator.mark(function calcFunc(state) {
    var input, value, currentUpdateId, searchRegexp, _calcOpacity, nodeIdToGroupId, edgeIdToGroupId, calcNodeGroupId, _iterator2, _isArray2, _i2, _context6, _context7, _ref6, _item2, _groupId2, _group2, _iterator3, _isArray3, _i3, _context8, _context9, _ref7, _item3, groupIdFrom, groupIdTo, _groupId3, _group3, i, groupId, group, item, itemUpdateId, age, opacity, visData, _groupId, _group, _item, _itemUpdateId, _age, _opacity, _visData;

    return regenerator.wrap(function calcFunc$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            input = state.input;
            value = state.value;

            if (!value) {
              value = {
                nodes: [],
                edges: []
              };
            } // let minUpdateId = (state as any).minUpdateId || 0
            // let maxUpdateId = minUpdateId


            currentUpdateId = updateId[0];

            try {
              searchRegexp = state.input.searchPattern && new RegExp(state.input.searchPattern, 'ig');
            } catch (ex) {
              console.log(ex);
            }

            _calcOpacity = function _calcOpacity(name, val, itemUpdateId, calcStat) {
              switch (input.highlightMode) {
                case HighlightMode.CalcTimeSum:
                  return calcStat == null ? opacityMin : calcOpacityCalcTime(calcStat.sum, 1000);

                case HighlightMode.CalcTimeAverage:
                  return calcStat == null ? opacityMin : calcOpacityCalcTime(calcStat.average, 20);

                case HighlightMode.Subscribers:
                  return val != null && val.propertyChanged && val.propertyChanged._subscribers && val.propertyChanged._subscribers.length ? calcOpacityCalcTime(val.propertyChanged._subscribers.length, 2) : opacityMin;

                case HighlightMode.LastActive:
                  return calcOpacityLastActive(itemUpdateId, currentUpdateId);

                case HighlightMode.SearchResults:
                  if (searchRegexp) {
                    if (searchRegexp.test(name + '') || searchRegexp.test(getDisplayName(val))) {
                      return 1;
                    } else {
                      return opacityMin;
                    }
                  }

                  break;

                default:
                  return 1;
              }
            }; // region groups


            value.groups = {
              nodes: {},
              edges: {}
            };
            nodeIdToGroupId = {};
            edgeIdToGroupId = {};

            calcNodeGroupId = function calcNodeGroupId(node) {
              return node.object.constructor.name;
            };

            _iterator2 = sort$2(_context6 = from_1$2(values$2(_context7 = input.nodes).call(_context7))).call(_context6, function (o1, o2) {
              return o1.updateId - o2.updateId;
            }), _isArray2 = isArray$3(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : getIterator$1(_iterator2);

          case 11:
            if (!_isArray2) {
              _context10.next = 17;
              break;
            }

            if (!(_i2 >= _iterator2.length)) {
              _context10.next = 14;
              break;
            }

            return _context10.abrupt("break", 28);

          case 14:
            _ref6 = _iterator2[_i2++];
            _context10.next = 21;
            break;

          case 17:
            _i2 = _iterator2.next();

            if (!_i2.done) {
              _context10.next = 20;
              break;
            }

            return _context10.abrupt("break", 28);

          case 20:
            _ref6 = _i2.value;

          case 21:
            _item2 = _ref6;
            _groupId2 = calcNodeGroupId(_item2);
            nodeIdToGroupId[_item2.id] = _groupId2;
            _group2 = value.groups.nodes[_groupId2];

            if (!_group2) {
              value.groups.nodes[_groupId2] = _group2 = [_item2];
            } else {
              _group2.push(_item2);
            }

          case 26:
            _context10.next = 11;
            break;

          case 28:
            _iterator3 = sort$2(_context8 = from_1$2(values$2(_context9 = input.edges).call(_context9))).call(_context8, function (o1, o2) {
              return o1.updateId - o2.updateId;
            }), _isArray3 = isArray$3(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : getIterator$1(_iterator3);

          case 29:
            if (!_isArray3) {
              _context10.next = 35;
              break;
            }

            if (!(_i3 >= _iterator3.length)) {
              _context10.next = 32;
              break;
            }

            return _context10.abrupt("break", 48);

          case 32:
            _ref7 = _iterator3[_i3++];
            _context10.next = 39;
            break;

          case 35:
            _i3 = _iterator3.next();

            if (!_i3.done) {
              _context10.next = 38;
              break;
            }

            return _context10.abrupt("break", 48);

          case 38:
            _ref7 = _i3.value;

          case 39:
            _item3 = _ref7;
            groupIdFrom = nodeIdToGroupId[_item3.fromId];
            groupIdTo = nodeIdToGroupId[_item3.toId];
            _groupId3 = groupIdFrom + "-" + groupIdTo;
            edgeIdToGroupId[_item3.id] = _groupId3;
            _group3 = value.groups.edges[_groupId3];

            if (!_group3) {
              value.groups.edges[_groupId3] = _group3 = [_item3];
            } else {
              _group3.push(_item3);
            }

          case 46:
            _context10.next = 29;
            break;

          case 48:
            // endregion
            // region nodes
            i = 0;
            _context10.t0 = keys$6(regenerator).call(regenerator, value.groups.nodes);

          case 50:
            if ((_context10.t1 = _context10.t0()).done) {
              _context10.next = 64;
              break;
            }

            groupId = _context10.t1.value;

            if (!Object.prototype.hasOwnProperty.call(value.groups.nodes, groupId)) {
              _context10.next = 62;
              break;
            }

            group = value.groups.nodes[groupId];
            item = group[0];
            _context10.next = 57;
            return resolvePath(item)(function (o) {
              return o.updateId;
            })();

          case 57:
            itemUpdateId = _context10.sent;
            age = currentUpdateId - itemUpdateId;
            opacity = _calcOpacity(item.name, item.object, itemUpdateId, item.object instanceof CalcProperty ? item.object.timeTotalStat : null);
            visData = item.getVisData({
              opacity: opacity,
              age: age
            });
            value.nodes[i++] = _extends({}, visData, {
              id: groupId
            }); // if (node.updateId > minUpdateId) {
            // 	if (node.updateId > maxUpdateId) {
            // 		maxUpdateId = node.updateId
            // 	}
            // 	value.nodes[i++] = node
            // }

          case 62:
            _context10.next = 50;
            break;

          case 64:
            value.nodes.length = i; // endregion
            // region edges

            i = 0;
            _context10.t2 = keys$6(regenerator).call(regenerator, value.groups.edges);

          case 67:
            if ((_context10.t3 = _context10.t2()).done) {
              _context10.next = 81;
              break;
            }

            _groupId = _context10.t3.value;

            if (!Object.prototype.hasOwnProperty.call(value.groups.edges, _groupId)) {
              _context10.next = 79;
              break;
            }

            _group = value.groups.edges[_groupId];
            _item = _group[0];
            _context10.next = 74;
            return resolvePath(_item)(function (o) {
              return o.updateId;
            })();

          case 74:
            _itemUpdateId = _context10.sent;
            _age = currentUpdateId - _itemUpdateId;
            _opacity = _calcOpacity(_item.key, _item.value, _itemUpdateId, null);
            _visData = _item.getVisData({
              opacity: _opacity,
              age: _age
            });
            value.edges[i++] = _extends({}, _visData, {
              id: _groupId,
              from: nodeIdToGroupId[_item.fromId],
              to: nodeIdToGroupId[_item.toId]
            });

          case 79:
            _context10.next = 67;
            break;

          case 81:
            value.edges.length = i; // endregion
            // (state as any).minUpdateId = maxUpdateId + 1
            // console.log('webrain update count = ' + (value.nodes.length + value.edges.length))
            // console.log('webrain update: ', value)

            state.value = value;
            return _context10.abrupt("return", true);

          case 84:
          case "end":
            return _context10.stop();
        }
      }
    }, calcFunc);
  }),
  calcOptions: {
    throttleTime: 500,
    maxThrottleTime: 2000,
    minTimeBetweenCalc: 1000
  }
})); // endregion

var webrainGraph = new WebrainGraph();

if (typeof window !== 'undefined') {
  storeWebrainGraph(webrainGraph);
} // region helpers


function storeWebrainGraph(_x) {
  return _storeWebrainGraph.apply(this, arguments);
}

function _storeWebrainGraph() {
  _storeWebrainGraph = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee2(object) {
    var storageKey, stateStr, state, saveState;
    return regenerator.wrap(function _callee2$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            storageKey = 'webrainGraph';
            _context12.next = 3;
            return localStorageWrapper.getItem(storageKey);

          case 3:
            stateStr = _context12.sent;
            state = stateStr && JSON.parse(stateStr);

            if (state) {
              // object.isEnabled = state.isEnabled
              object.highlightMode = state.highlightMode;
              object.searchPattern = state.searchPattern;
            }

            saveState =
            /*#__PURE__*/
            function () {
              var _ref8 = _asyncToGenerator(
              /*#__PURE__*/
              regenerator.mark(function _callee() {
                return regenerator.wrap(function _callee$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return localStorageWrapper.setItem(storageKey, stringify$2({
                          // isEnabled: object.isEnabled,
                          highlightMode: object.highlightMode,
                          searchPattern: object.searchPattern
                        }));

                      case 2:
                      case "end":
                        return _context11.stop();
                    }
                  }
                }, _callee);
              }));

              return function saveState() {
                return _ref8.apply(this, arguments);
              };
            }();

            object.propertyChanged.subscribe(saveState, 'storeWebrainGraph');

          case 8:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee2);
  }));
  return _storeWebrainGraph.apply(this, arguments);
}

var webrainGraphClasses = [Edge, Node, WebrainGraph];
function isWebrainInternalObject(object) {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (object instanceof Node || object instanceof Edge || object instanceof WebrainGraph || object instanceof WebrainMap || object instanceof WebrainObservableMap || object instanceof ConnectorState || object instanceof CalcPropertyState // || object instanceof Connector
  ) {
      return true;
    }

  var name = object instanceof CalcProperty && object.state.name || object instanceof Connector && object.connectorState.name;

  if (name && indexOf$5(name).call(name, WebrainGraphObjectsId) >= 0) {
    return true;
  }

  if (indexOf$5(webrainGraphClasses).call(webrainGraphClasses, object.constructor) >= 0) {
    return true;
  }

  return false;
} // endregion

function windowIsDestroyed(win) {
  try {
    return !win || win.closed || !win.document;
  } catch (ex) {
    return true;
  }
} // from: https://stackoverflow.com/a/1060034/5221762

function bindVisibleChange(window, handler) {
  /* tslint:disable:no-conditional-assignment */
  var hidden = 'hidden';
  var unsubscribe; // Standards:

  if (hidden in window.document) {
    window.document.addEventListener('visibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('visibilitychange', onchange);
    };
  } else if ((hidden = 'mozHidden') in window.document) {
    window.document.addEventListener('mozvisibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('mozvisibilitychange', onchange);
    };
  } else if ((hidden = 'webkitHidden') in window.document) {
    window.document.addEventListener('webkitvisibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('webkitvisibilitychange', onchange);
    };
  } else if ((hidden = 'msHidden') in window.document) {
    window.document.addEventListener('msvisibilitychange', onchange);

    unsubscribe = function unsubscribe() {
      window.document.removeEventListener('msvisibilitychange', onchange);
    };
  } else if ('onfocusin' in window.document) {
    // IE 9 and lower:
    window.document.onfocusin = window.document.onfocusout = onchange;

    unsubscribe = function unsubscribe() {
      window.document.onfocusin = window.document.onfocusout = null;
    };
  } else {
    // All others:
    window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange;

    unsubscribe = function unsubscribe() {
      window.onpageshow = window.onpagehide = window.onfocus = window.onblur = null;
    };
  }

  function onchange(evt) {
    var v = 'visible';
    var h = 'hidden';
    var evtMap = {
      focus: v,
      focusin: v,
      pageshow: v,
      blur: h,
      focusout: h,
      pagehide: h
    };
    evt = evt || window.event;

    if (evt.type in evtMap) {
      handler(evtMap[evt.type] === 'visible');
    } else {
      handler(!this[hidden]);
    }
  } // set the initial state (but only if browser supports the Page Visibility API)


  if (window.document[hidden] !== undefined) {
    onchange({
      type: window.document[hidden] ? 'blur' : 'focus'
    });
  }

  return unsubscribe;
}

function bindFocusChange(window, handler) {
  var onFocus = function onFocus() {
    handler(true);
  };

  var onBlur = function onBlur() {
    handler(false);
  };

  window.addEventListener('focus', onFocus);
  window.addEventListener('blur', onBlur);
  return function () {
    window.removeEventListener('focus', onFocus);
    window.removeEventListener('blur', onBlur);
  };
}

var WindowSizeController =
/*#__PURE__*/
function () {
  function WindowSizeController(winController) {
    _classCallCheck(this, WindowSizeController);

    this.winController = winController;
  }

  _createClass(WindowSizeController, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee() {
        var _context;

        return regenerator.wrap(function _callee$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.winController.waitLoad();

              case 2:
                if (this.winController.isOpened) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return");

              case 4:
                bind$6(_context = this).call(_context);

                if (typeof this.width === 'undefined') {
                  this.width = this.winController.win.outerWidth;
                }

                if (typeof this.height === 'undefined') {
                  this.height = this.winController.win.outerHeight;
                }

                this.borderWidth = this.winController.win.outerWidth - this.winController.win.innerWidth;
                this.borderHeight = this.winController.win.outerHeight - this.winController.win.innerHeight;
                console.log("Window border size: " + this.borderWidth + ", " + this.borderHeight);

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _init.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "bind",
    value: function bind() {
      var _this = this;

      if (!this.winController.isOpened) {
        return;
      }

      this.winController.resizeObservable.subscribe(function () {
        if (!_this.winController.isOpened) {
          return;
        } // fix unwanted auto resize, eg. after window.moveTo()


        if (_this.lastResizeTime && now$2() - _this.lastResizeTime < 1000) {
          if (_this.winController.win.outerWidth !== _this.width || _this.winController.win.outerHeight !== _this.height) {
            _this.winController.win.resizeTo(_this.width, _this.height);
          }
        } else {
          _this.width = _this.winController.win.outerWidth;
          _this.height = _this.winController.win.outerHeight;
          _this.lastResizeTime = now$2();
        }
      });
    } // region methods

  }, {
    key: "resizeToInner",
    value: function resizeToInner(width, height) {
      if (!this.winController.isOpened) {
        return;
      }

      return this.resizeToOuter(width + this.borderWidth, height + this.borderHeight);
    }
  }, {
    key: "resizeToOuter",
    value: function resizeToOuter(width, height) {
      if (!this.winController.isOpened) {
        return;
      } // chrome has window width/height limitation = 211/103px
      // see also: https://developer.mozilla.org/en-US/docs/Web/API/Window/open


      width = Math.max(211, width);
      height = Math.max(103, height);
      this.width = width;
      this.height = height;
      this.lastResizeTime = now$2();
      return this.winController.win.resizeTo(width, height);
    } // endregion

  }]);

  return WindowSizeController;
}();
var WindowController =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(WindowController, _ObservableClass);

  function WindowController(_ref) {
    var _this2;

    var windowName = _ref.windowName,
        win = _ref.win,
        _ref$storeWindowState = _ref.storeWindowState,
        _storeWindowState = _ref$storeWindowState === void 0 ? true : _ref$storeWindowState;

    _classCallCheck(this, WindowController);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(WindowController).call(this));
    _this2.windowName = windowName;
    _this2.win = win;
    _this2._storeWindowState = _storeWindowState;
    _this2.sizeController = new WindowSizeController(_assertThisInitialized(_this2));

    _this2.init();

    return _this2;
  } // region State


  _createClass(WindowController, [{
    key: "_waitLoad",
    // endregion
    // region waitLoad
    value: function () {
      var _waitLoad2 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee2() {
        var _this3 = this;

        return regenerator.wrap(function _callee2$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return new promise$3(function (resolve) {
                  if (!_this3.win) {
                    resolve();
                    return;
                  }

                  _this3.win.document.body.onload = resolve; // this.win.addEventListener('load', resolve, false)
                  // this.win.addEventListener('DOMContentLoaded', resolve, false)

                  if (_this3.win.document.readyState === 'complete') {
                    resolve();
                  }
                });

              case 2:
                _context3.next = 4;
                return new promise$3(function (resolve) {
                  if (!_this3.win) {
                    resolve();
                    return;
                  }

                  _this3.win.addEventListener('resize', resolve, false);

                  if (_this3.win.innerWidth !== 0 && _this3.win.innerHeight !== 0 && _this3.win.outerWidth !== 0 && _this3.win.outerHeight !== 0) {
                    resolve();
                  }
                });

              case 4:
                this._waitLoadTask = null;

              case 5:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee2, this);
      }));

      function _waitLoad() {
        return _waitLoad2.apply(this, arguments);
      }

      return _waitLoad;
    }()
  }, {
    key: "waitLoad",
    value: function () {
      var _waitLoad3 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee3() {
        return regenerator.wrap(function _callee3$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!this._waitLoadTask) {
                  this._waitLoadTask = this._waitLoad();
                }

                return _context4.abrupt("return", this._waitLoadTask);

              case 2:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee3, this);
      }));

      function waitLoad() {
        return _waitLoad3.apply(this, arguments);
      }

      return waitLoad;
    }() // endregion
    // region init

  }, {
    key: "init",
    value: function () {
      var _init2 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee4() {
        return regenerator.wrap(function _callee4$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return this.waitLoad();

              case 2:
                _context5.next = 4;
                return this._init();

              case 4:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee4, this);
      }));

      function init() {
        return _init2.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: "_init",
    value: function () {
      var _init3 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee5() {
        var _context6;

        return regenerator.wrap(function _callee5$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (this.win) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return");

              case 2:
                if (!this._storeWindowState) {
                  _context7.next = 5;
                  break;
                }

                _context7.next = 5;
                return storeWindowState(this.windowName, this.win);

              case 5:
                bind$6(_context6 = this).call(_context6);

                _context7.next = 8;
                return this.sizeController.init();

              case 8:
                this.onLoad();

              case 9:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee5, this);
      }));

      function _init() {
        return _init3.apply(this, arguments);
      }

      return _init;
    }() // endregion
    // region onLoad

  }, {
    key: "onLoad",
    value: function onLoad() {
      if (this.isLoaded || !this.isOpened) {
        return;
      }

      this.isLoaded = true;
      console.log('Window loaded');
      var _loadSubject = this._loadSubject;

      if (_loadSubject) {
        _loadSubject.emit(null);
      }
    } // endregion
    // region onClose

  }, {
    key: "onClose",
    value: function onClose() {
      if (!this.isOpened) {
        return;
      }

      this.isClosing = true;
      this.unbind();
      console.log('Window closing');
      var _closeSubject = this._closeSubject;

      if (_closeSubject) {
        _closeSubject.emit(null);
      }

      console.log('Window closed');
    } // endregion
    // region onResize

  }, {
    key: "onResize",
    value: function onResize(e) {
      if (!this.isOpened) {
        return;
      }

      var _resizeSubject = this._resizeSubject;

      if (_resizeSubject) {
        _resizeSubject.emit(e);
      }
    } // endregion
    // region bind / unbind events

  }, {
    key: "bind",
    value: function bind() {
      var _this4 = this;

      if (!this.isOpened) {
        return;
      }

      this.win.addEventListener('beforeunload', function () {
        _this4.onClose();

        return false;
      });
      this.win.addEventListener('resize', function (e) {
        _this4.onResize(e);
      });

      this._setUnsubscriber('isVisible', bindVisibleChange(this.win, function (value) {
        _this4.isVisible = value;
      }));

      this._setUnsubscriber('isFocused', bindFocusChange(this.win, function (value) {
        _this4.isFocused = value;
      }));
    }
  }, {
    key: "unbind",
    value: function unbind() {
      if (this.isDestroyed) {
        return;
      }

      this.win.removeEventListener('beforeunload', this.onClose);
      this.win.removeEventListener('resize', this.onClose);

      this._setUnsubscriber('isVisible', null);

      this._setUnsubscriber('isFocused', null);
    } // endregion
    // region methods

  }, {
    key: "show",
    value: function show() {
      if (!this.isOpened) {
        return;
      }

      if (this.win.restore) {
        this.win.restore();
      }

      this.win.focus();
    }
  }, {
    key: "minimize",
    value: function minimize() {
      if (!this.isOpened) {
        return;
      }

      if (this.win.minimize) {
        this.win.minimize();
      }
    }
  }, {
    key: "close",
    value: function close() {
      if (!this.isOpened) {
        return;
      }

      var win = this.win;

      try {
        this.onClose();
      } finally {
        win.close();
      }
    } // endregion

  }, {
    key: "isDestroyed",
    get: function get() {
      var win = this.win;

      if (!windowIsDestroyed(win)) {
        return false;
      } else {
        if (win && win.close) {
          win.close();
        }

        return true;
      }
    }
  }, {
    key: "isOpened",
    get: function get() {
      return !this.isDestroyed && !this.isClosing;
    }
  }, {
    key: "loadObservable",
    get: function get() {
      var _loadSubject = this._loadSubject;

      if (!_loadSubject) {
        this._loadSubject = _loadSubject = new BehaviorSubject();
      }

      return _loadSubject;
    }
  }, {
    key: "closeObservable",
    get: function get() {
      var _closeSubject = this._closeSubject;

      if (!_closeSubject) {
        this._closeSubject = _closeSubject = new BehaviorSubject();
      }

      return _closeSubject;
    }
  }, {
    key: "resizeObservable",
    get: function get() {
      var _resizeSubject = this._resizeSubject;

      if (!_resizeSubject) {
        this._resizeSubject = _resizeSubject = new Subject();
      }

      return _resizeSubject;
    }
  }]);

  return WindowController;
}(ObservableClass);
new CalcObjectBuilder(WindowController.prototype).writable('isVisible').writable('isFocused');
var WINDOW_STATE_PROPERTY_NAME = '13883806ede0481c92c41c2cda3d99c3';
function createWindowController(options) {
  if (windowIsDestroyed(options.win)) {
    return null;
  }

  var controller = options.win[WINDOW_STATE_PROPERTY_NAME];

  if (controller) {
    throw new Error('Window controller already created');
  }

  defineProperty$9(options.win, WINDOW_STATE_PROPERTY_NAME, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: controller = new WindowController(options)
  });

  return controller;
}
function getWindowController(win) {
  if (windowIsDestroyed(win)) {
    return null;
  }

  return win[WINDOW_STATE_PROPERTY_NAME];
}
var WindowControllerFactory =
/*#__PURE__*/
function () {
  // resizable=no is not worked in browsers because: https://stackoverflow.com/a/15481333/5221762
  function WindowControllerFactory(_ref2) {
    var windowName = _ref2.windowName,
        _ref2$windowFeatures = _ref2.windowFeatures,
        windowFeatures = _ref2$windowFeatures === void 0 ? 'width=600,height=400,' + 'titlebar=no,resizable=yes,movable=yes,alwaysOnTop=yes,fullscreenable=yes,' + 'location=no,toolbar=no,scrollbars=no,menubar=no,status=no,directories=no,' + 'dialog=yes,modal=yes,dependent=yes' : _ref2$windowFeatures,
        _ref2$storeWindowStat = _ref2.storeWindowState,
        storeWindowState = _ref2$storeWindowStat === void 0 ? true : _ref2$storeWindowStat,
        _ref2$replace = _ref2.replace,
        replace = _ref2$replace === void 0 ? true : _ref2$replace;

    _classCallCheck(this, WindowControllerFactory);

    this._windowName = windowName;
    this._windowOptions = ['about:blank', windowName, windowFeatures, replace];
    this._storeWindowState = storeWindowState;
  } // region get or create windowController


  _createClass(WindowControllerFactory, [{
    key: "appendCss",
    value: function appendCss(win) {
      var parentStyleElements = from_1$2(window.document.querySelectorAll('link[rel="stylesheet"][href^="client/"], style'));

      for (var i = 0; i < parentStyleElements.length; i++) {
        var parentStyleElement = parentStyleElements[i];
        var styleElement = void 0;

        switch (parentStyleElement.tagName) {
          case 'LINK':
            styleElement = win.document.createElement('link');
            styleElement.rel = 'stylesheet';
            styleElement.href = parentStyleElement.href;
            break;

          case 'STYLE':
            styleElement = win.document.createElement('style');
            styleElement.id = parentStyleElement.id;
            styleElement.innerHTML = parentStyleElement.innerHTML;
            break;

          default:
            throw new Error('Unexpected style element: ' + styleElement.tagName);
        }

        win.document.head.appendChild(styleElement);
      }
    }
  }, {
    key: "appendContainer",
    value: function appendContainer(win) {
      win.container = win.document.createElement('div');
      win.document.body.appendChild(win.container);
    } // endregion
    // region onLoad
    // tslint:disable-next-line:no-identical-functions

  }, {
    key: "onLoad",
    value: function onLoad(windowController) {
      var _loadSubject = this._loadSubject;

      if (_loadSubject) {
        _loadSubject.emit(windowController);
      }
    } // endregion
    // // region onClose
    //
    // private _closeSubject: ISubject<WindowController>
    //
    // // tslint:disable-next-line:no-identical-functions
    // public get closeObservable(): IObservable<WindowController> {
    // 	let {_closeSubject} = this
    // 	if (!_closeSubject) {
    // 		this._closeSubject = _closeSubject = new Subject()
    // 	}
    // 	return _closeSubject
    // }
    //
    // private onClose(windowController: WindowController) {
    // 	const {_closeSubject} = this
    // 	if (_closeSubject) {
    // 		_closeSubject.emit(windowController)
    // 	}
    // }
    //
    // // endregion

  }, {
    key: "close",
    value: function close() {
      if (this._windowController) {
        this._windowController.close();
      }
    }
  }, {
    key: "windowController",
    get: function get() {
      var _this5 = this;

      if (windowIsDestroyed(window)) {
        return null;
      }

      if (!this._windowController || !this._windowController.isOpened) {
        var _window;

        console.log('Window open');

        var win = (_window = window).open.apply(_window, this._windowOptions);

        if (!win) {
          console.error('Cannot create popup window');
          return null;
        }

        if (getWindowController(win)) {
          var _window2;

          win.close();
          win = (_window2 = window).open.apply(_window2, this._windowOptions);

          if (getWindowController(win)) {
            throw new Error('Cannot recreate window with name: ' + this._windowName);
          }
        }

        var onParentWindowUnload = function onParentWindowUnload() {
          window.removeEventListener('beforeunload', onParentWindowUnload);
          win.close();
        };

        window.addEventListener('beforeunload', onParentWindowUnload);
        this.appendCss(win);
        this.appendContainer(win);
        var windowController = createWindowController({
          windowName: this._windowName,
          win: win,
          storeWindowState: this._storeWindowState
        });
        this._windowController = windowController;
        windowController.loadObservable.subscribe(function () {
          if (!windowController.isOpened) {
            return;
          }

          _this5.onLoad(windowController);
        });
      }

      return this._windowController;
    }
  }, {
    key: "loadObservable",
    get: function get() {
      var _loadSubject = this._loadSubject;

      if (!_loadSubject) {
        this._loadSubject = _loadSubject = new Subject();
      }

      return _loadSubject;
    }
  }]);

  return WindowControllerFactory;
}();

var ComponentWindow =
/*#__PURE__*/
function () {
  // resizable=no is not worked in browsers because: https://stackoverflow.com/a/15481333/5221762
  function ComponentWindow(_ref) {
    var _this = this;

    var windowControllerFactory = _ref.windowControllerFactory,
        componentClass = _ref.componentClass,
        options = _ref.options,
        props = _ref.props;

    _classCallCheck(this, ComponentWindow);

    this._windowControllerFactory = windowControllerFactory;
    this._componentClass = componentClass;
    this._options = options;
    this._props = props;

    this._windowControllerFactory.loadObservable.subscribe(
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee(windowController) {
        var destroy;
        return regenerator.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return _this.attachComponent({
                  windowController: windowController,
                  componentClass: _this._componentClass,
                  options: _extends({}, _this._options, {
                    props: _this._props
                  })
                });

              case 2:
                destroy = _context.sent;

                if (destroy) {
                  windowController.closeObservable.subscribe(destroy);
                }

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  }

  _createClass(ComponentWindow, [{
    key: "attachComponent",
    // async needed for bypass slows down performance on electron
    value: function () {
      var _attachComponent = _asyncToGenerator(
      /*#__PURE__*/
      regenerator.mark(function _callee2(_ref3) {
        var _this2 = this;

        var windowController, componentClass, options, component;
        return regenerator.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                windowController = _ref3.windowController, componentClass = _ref3.componentClass, options = _ref3.options;
                component = new componentClass(_extends({}, options, {
                  target: windowController.win.container,
                  props: _extends({
                    win: windowController.win
                  }, options && options.props)
                }));
                this._component = component;
                return _context2.abrupt("return", function () {
                  if (_this2._component === component) {
                    _this2._component = null;
                  }

                  if (windowController.isDestroyed) {
                    return;
                  }

                  component.$destroy();
                });

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function attachComponent(_x2) {
        return _attachComponent.apply(this, arguments);
      }

      return attachComponent;
    }()
  }, {
    key: "setProps",
    value: function setProps(props) {
      this._props = props;

      if (this._component) {
        this._component.$set(this._props);
      }
    }
  }, {
    key: "close",
    value: function close() {
      this._windowControllerFactory.close();
    }
  }, {
    key: "windowController",
    get: function get() {
      return this._windowControllerFactory.windowController;
    }
  }]);

  return ComponentWindow;
}();

var TestObject =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(TestObject, _ObservableClass);

  function TestObject() {
    var _getPrototypeOf2, _context;

    var _this;

    _classCallCheck(this, TestObject);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(TestObject)).call.apply(_getPrototypeOf2, concat$2(_context = [this]).call(_context, args)));
    _this.value1 = 1;
    _this.value2 = 2;
    return _this;
  }

  return TestObject;
}(ObservableClass);
new CalcObjectBuilder(TestObject.prototype).writable('value1').writable('value2').calc('sum', connectorFactory({
  buildRule: function buildRule(c) {
    return c.connect('val1', function (b) {
      return b.p('value1');
    }).connect('val2', function (b) {
      return b.p('value2');
    });
  }
}), calcPropertyFactory({
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.propertyAny();
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = state.input.val1 + state.input.val2;
  }
})).calc('time', null, calcPropertyFactory({
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.propertyAny();
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = new Date();
  },
  calcOptions: {
    autoInvalidateInterval: 1000
  }
}));

var file$1 = "src\\components\\dev\\webrain\\TestView.svelte";

function create_fragment$3(ctx) {
  var button0;
  var t0;
  var t1;
  var button1;
  var t2;
  var t3;
  var pre;
  var t4;
  var t5_value =
  /*connector*/
  ctx[0].value1 + "";
  var t5;
  var t6;
  var t7_value =
  /*connector*/
  ctx[0].value2 + "";
  var t7;
  var t8;
  var t9_value =
  /*connector*/
  ctx[0].sum + "";
  var t9;
  var t10;
  var t11_value =
  /*connector*/
  ctx[0].time + "";
  var t11;
  var dispose;
  var block = {
    c: function create() {
      button0 = element("button");
      t0 = text("change value1");
      t1 = space();
      button1 = element("button");
      t2 = text("change value2");
      t3 = space();
      pre = element("pre");
      t4 = text("value1: ");
      t5 = text(t5_value);
      t6 = text("\nvalue2: ");
      t7 = text(t7_value);
      t8 = text("\nsum: ");
      t9 = text(t9_value);
      t10 = text("\ntime: ");
      t11 = text(t11_value);
      this.h();
    },
    l: function claim(nodes) {
      button0 = claim_element(nodes, "BUTTON", {});
      var button0_nodes = children(button0);
      t0 = claim_text(button0_nodes, "change value1");

      forEach$2(button0_nodes).call(button0_nodes, detach_dev);

      t1 = claim_space(nodes);
      button1 = claim_element(nodes, "BUTTON", {});
      var button1_nodes = children(button1);
      t2 = claim_text(button1_nodes, "change value2");

      forEach$2(button1_nodes).call(button1_nodes, detach_dev);

      t3 = claim_space(nodes);
      pre = claim_element(nodes, "PRE", {});
      var pre_nodes = children(pre);
      t4 = claim_text(pre_nodes, "value1: ");
      t5 = claim_text(pre_nodes, t5_value);
      t6 = claim_text(pre_nodes, "\nvalue2: ");
      t7 = claim_text(pre_nodes, t7_value);
      t8 = claim_text(pre_nodes, "\nsum: ");
      t9 = claim_text(pre_nodes, t9_value);
      t10 = claim_text(pre_nodes, "\ntime: ");
      t11 = claim_text(pre_nodes, t11_value);

      forEach$2(pre_nodes).call(pre_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      add_location(button0, file$1, 26, 0, 674);
      add_location(button1, file$1, 29, 0, 793);
      add_location(pre, file$1, 32, 0, 865);
    },
    m: function mount(target, anchor) {
      insert_dev(target, button0, anchor);
      append_dev(button0, t0);
      insert_dev(target, t1, anchor);
      insert_dev(target, button1, anchor);
      append_dev(button1, t2);
      insert_dev(target, t3, anchor);
      insert_dev(target, pre, anchor);
      append_dev(pre, t4);
      append_dev(pre, t5);
      append_dev(pre, t6);
      append_dev(pre, t7);
      append_dev(pre, t8);
      append_dev(pre, t9);
      append_dev(pre, t10);
      append_dev(pre, t11);
      dispose = [listen_dev(button0, "click",
      /*click_handler*/
      ctx[2], false, false, false), listen_dev(button1, "click",
      /*click_handler_1*/
      ctx[3], false, false, false)];
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];
      if (dirty &
      /*connector*/
      1 && t5_value !== (t5_value =
      /*connector*/
      ctx[0].value1 + "")) set_data_dev(t5, t5_value);
      if (dirty &
      /*connector*/
      1 && t7_value !== (t7_value =
      /*connector*/
      ctx[0].value2 + "")) set_data_dev(t7, t7_value);
      if (dirty &
      /*connector*/
      1 && t9_value !== (t9_value =
      /*connector*/
      ctx[0].sum + "")) set_data_dev(t9, t9_value);
      if (dirty &
      /*connector*/
      1 && t11_value !== (t11_value =
      /*connector*/
      ctx[0].time + "")) set_data_dev(t11, t11_value);
    },
    i: noop,
    o: noop,
    d: function destroy(detaching) {
      if (detaching) detach_dev(button0);
      if (detaching) detach_dev(t1);
      if (detaching) detach_dev(button1);
      if (detaching) detach_dev(t3);
      if (detaching) detach_dev(pre);
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$3.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

var createConnector = connectorFactory({
  name: "TestView",
  buildRule: function buildRule(c) {
    return c.connectWritable("value1", function (b) {
      return b.p("value1");
    }).connectWritable("value2", function (b) {
      return b.p("value2");
    }).connect("sum", function (b) {
      return b.p("sum");
    }).connect("time", function (b) {
      return b.p("time");
    });
  }
});
var source = new TestObject();

function instance$3($$self, $$props, $$invalidate) {
  var connector = createConnector(source);
  var unsubscribe = connector.propertyChanged.subscribe(function () {
    $$invalidate(0, connector.connectorState.source = source, connector);
  });

  var click_handler = function click_handler() {
    $$invalidate(0, connector.value1++, connector);
    $$invalidate(0, connector.connectorState.source = source, connector);
  };

  var click_handler_1 = function click_handler_1() {
    return $$invalidate(0, connector.value2++, connector);
  };

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {};

   $$invalidate(0, connector.connectorState.source = source, connector);

  return [connector, unsubscribe, click_handler, click_handler_1];
}

var TestView =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(TestView, _SvelteComponentDev);

  function TestView(options) {
    var _this;

    _classCallCheck(this, TestView);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(TestView).call(this, options));
    init(_assertThisInitialized(_this), options, instance$3, create_fragment$3, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "TestView",
      options: options,
      id: create_fragment$3.name
    });
    return _this;
  }

  return TestView;
}(SvelteComponentDev);

var $entries = objectToArray.entries;

// `Object.entries` method
// https://tc39.github.io/ecma262/#sec-object.entries
_export({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

var entries$3 = path.Object.entries;

var entries$4 = entries$3;

var entries$5 = entries$4;

var Object_1 = globals.Object;
var file$2 = "src\\components\\dev\\webrain\\ObjectTree.svelte";

function get_each_context_3(ctx, list, i) {
  var child_ctx = slice$3(ctx).call(ctx);

  child_ctx[3] = list[i];
  return child_ctx;
}

function get_each_context_2(ctx, list, i) {
  var child_ctx = slice$3(ctx).call(ctx);

  child_ctx[8] = list[i];
  child_ctx[3] = i;
  return child_ctx;
}

function get_each_context_1(ctx, list, i) {
  var child_ctx = slice$3(ctx).call(ctx);

  child_ctx[3] = list[i][0];
  child_ctx[8] = list[i][1];
  return child_ctx;
}

function get_each_context(ctx, list, i) {
  var child_ctx = slice$3(ctx).call(ctx);

  child_ctx[3] = list[i][0];
  child_ctx[8] = list[i][1];
  return child_ctx;
} // (60:2) {#if expanded && canExpand}


function create_if_block$2(ctx) {
  var show_if;
  var show_if_1;
  var current_block_type_index;
  var if_block;
  var if_block_anchor;
  var current;
  var if_block_creators = [create_if_block_1$1, create_if_block_2$1, create_if_block_3, create_else_block$1];
  var if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (typeof
    /*object*/
    ctx[2] === "function") return 0;
    if (dirty &
    /*object*/
    4) show_if = !!isMap(
    /*object*/
    ctx[2]);
    if (show_if) return 1;
    if (dirty &
    /*object*/
    4) show_if_1 = !!(isIterable$3(
    /*object*/
    ctx[2]) && !isArray$3(
    /*object*/
    ctx[2]));
    if (show_if_1) return 2;
    return 3;
  }

  current_block_type_index = select_block_type(ctx, -1);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  var block = {
    c: function create() {
      if_block.c();
      if_block_anchor = empty();
    },
    l: function claim(nodes) {
      if_block.l(nodes);
      if_block_anchor = empty();
    },
    m: function mount(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx, dirty);

      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, function () {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block = if_blocks[current_block_type_index];

        if (!if_block) {
          if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
          if_block.c();
        }

        transition_in(if_block, 1);
        if_block.m(if_block_anchor.parentNode, if_block_anchor);
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block$2.name,
    type: "if",
    source: "(60:2) {#if expanded && canExpand}",
    ctx: ctx
  });
  return block;
} // (73:3) {:else}


function create_else_block$1(ctx) {
  var each_1_anchor;
  var current;
  var each_value_3 =
  /*objectKeys*/
  ctx[5](
  /*object*/
  ctx[2]);
  var each_blocks = [];

  for (var i = 0; i < each_value_3.length; i += 1) {
    each_blocks[i] = create_each_block_3(get_each_context_3(ctx, each_value_3, i));
  }

  var out = function out(i) {
    return transition_out(each_blocks[i], 1, 1, function () {
      each_blocks[i] = null;
    });
  };

  var block = {
    c: function create() {
      for (var _i = 0; _i < each_blocks.length; _i += 1) {
        each_blocks[_i].c();
      }

      each_1_anchor = empty();
    },
    l: function claim(nodes) {
      for (var _i2 = 0; _i2 < each_blocks.length; _i2 += 1) {
        each_blocks[_i2].l(nodes);
      }

      each_1_anchor = empty();
    },
    m: function mount(target, anchor) {
      for (var _i3 = 0; _i3 < each_blocks.length; _i3 += 1) {
        each_blocks[_i3].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*object, objectKeys*/
      36) {
        each_value_3 =
        /*objectKeys*/
        ctx[5](
        /*object*/
        ctx[2]);

        var _i4;

        for (_i4 = 0; _i4 < each_value_3.length; _i4 += 1) {
          var child_ctx = get_each_context_3(ctx, each_value_3, _i4);

          if (each_blocks[_i4]) {
            each_blocks[_i4].p(child_ctx, dirty);

            transition_in(each_blocks[_i4], 1);
          } else {
            each_blocks[_i4] = create_each_block_3(child_ctx);

            each_blocks[_i4].c();

            transition_in(each_blocks[_i4], 1);

            each_blocks[_i4].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        group_outros();

        for (_i4 = each_value_3.length; _i4 < each_blocks.length; _i4 += 1) {
          out(_i4);
        }

        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;

      for (var _i5 = 0; _i5 < each_value_3.length; _i5 += 1) {
        transition_in(each_blocks[_i5]);
      }

      current = true;
    },
    o: function outro(local) {
      each_blocks = filter$2(each_blocks).call(each_blocks, Boolean);

      for (var _i6 = 0; _i6 < each_blocks.length; _i6 += 1) {
        transition_out(each_blocks[_i6]);
      }

      current = false;
    },
    d: function destroy(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_else_block$1.name,
    type: "else",
    source: "(73:3) {:else}",
    ctx: ctx
  });
  return block;
} // (69:58) 


function create_if_block_3(ctx) {
  var each_1_anchor;
  var current;

  var each_value_2 = from_1$2(
  /*object*/
  ctx[2]);

  var each_blocks = [];

  for (var i = 0; i < each_value_2.length; i += 1) {
    each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
  }

  var out = function out(i) {
    return transition_out(each_blocks[i], 1, 1, function () {
      each_blocks[i] = null;
    });
  };

  var block = {
    c: function create() {
      for (var _i7 = 0; _i7 < each_blocks.length; _i7 += 1) {
        each_blocks[_i7].c();
      }

      each_1_anchor = empty();
    },
    l: function claim(nodes) {
      for (var _i8 = 0; _i8 < each_blocks.length; _i8 += 1) {
        each_blocks[_i8].l(nodes);
      }

      each_1_anchor = empty();
    },
    m: function mount(target, anchor) {
      for (var _i9 = 0; _i9 < each_blocks.length; _i9 += 1) {
        each_blocks[_i9].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*Array, object*/
      4) {
        each_value_2 = from_1$2(
        /*object*/
        ctx[2]);

        var _i10;

        for (_i10 = 0; _i10 < each_value_2.length; _i10 += 1) {
          var child_ctx = get_each_context_2(ctx, each_value_2, _i10);

          if (each_blocks[_i10]) {
            each_blocks[_i10].p(child_ctx, dirty);

            transition_in(each_blocks[_i10], 1);
          } else {
            each_blocks[_i10] = create_each_block_2(child_ctx);

            each_blocks[_i10].c();

            transition_in(each_blocks[_i10], 1);

            each_blocks[_i10].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        group_outros();

        for (_i10 = each_value_2.length; _i10 < each_blocks.length; _i10 += 1) {
          out(_i10);
        }

        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;

      for (var _i11 = 0; _i11 < each_value_2.length; _i11 += 1) {
        transition_in(each_blocks[_i11]);
      }

      current = true;
    },
    o: function outro(local) {
      each_blocks = filter$2(each_blocks).call(each_blocks, Boolean);

      for (var _i12 = 0; _i12 < each_blocks.length; _i12 += 1) {
        transition_out(each_blocks[_i12]);
      }

      current = false;
    },
    d: function destroy(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_3.name,
    type: "if",
    source: "(69:58) ",
    ctx: ctx
  });
  return block;
} // (65:27) 


function create_if_block_2$1(ctx) {
  var each_1_anchor;
  var current;

  var each_value_1 = from_1$2(
  /*object*/
  ctx[2]);

  var each_blocks = [];

  for (var i = 0; i < each_value_1.length; i += 1) {
    each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
  }

  var out = function out(i) {
    return transition_out(each_blocks[i], 1, 1, function () {
      each_blocks[i] = null;
    });
  };

  var block = {
    c: function create() {
      for (var _i13 = 0; _i13 < each_blocks.length; _i13 += 1) {
        each_blocks[_i13].c();
      }

      each_1_anchor = empty();
    },
    l: function claim(nodes) {
      for (var _i14 = 0; _i14 < each_blocks.length; _i14 += 1) {
        each_blocks[_i14].l(nodes);
      }

      each_1_anchor = empty();
    },
    m: function mount(target, anchor) {
      for (var _i15 = 0; _i15 < each_blocks.length; _i15 += 1) {
        each_blocks[_i15].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*Array, object*/
      4) {
        each_value_1 = from_1$2(
        /*object*/
        ctx[2]);

        var _i16;

        for (_i16 = 0; _i16 < each_value_1.length; _i16 += 1) {
          var child_ctx = get_each_context_1(ctx, each_value_1, _i16);

          if (each_blocks[_i16]) {
            each_blocks[_i16].p(child_ctx, dirty);

            transition_in(each_blocks[_i16], 1);
          } else {
            each_blocks[_i16] = create_each_block_1(child_ctx);

            each_blocks[_i16].c();

            transition_in(each_blocks[_i16], 1);

            each_blocks[_i16].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        group_outros();

        for (_i16 = each_value_1.length; _i16 < each_blocks.length; _i16 += 1) {
          out(_i16);
        }

        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;

      for (var _i17 = 0; _i17 < each_value_1.length; _i17 += 1) {
        transition_in(each_blocks[_i17]);
      }

      current = true;
    },
    o: function outro(local) {
      each_blocks = filter$2(each_blocks).call(each_blocks, Boolean);

      for (var _i18 = 0; _i18 < each_blocks.length; _i18 += 1) {
        transition_out(each_blocks[_i18]);
      }

      current = false;
    },
    d: function destroy(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_2$1.name,
    type: "if",
    source: "(65:27) ",
    ctx: ctx
  });
  return block;
} // (61:3) {#if typeof object === 'function'}


function create_if_block_1$1(ctx) {
  var each_1_anchor;
  var current;
  var each_value = funcEntries(
  /*object*/
  ctx[2]);
  var each_blocks = [];

  for (var i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
  }

  var out = function out(i) {
    return transition_out(each_blocks[i], 1, 1, function () {
      each_blocks[i] = null;
    });
  };

  var block = {
    c: function create() {
      for (var _i19 = 0; _i19 < each_blocks.length; _i19 += 1) {
        each_blocks[_i19].c();
      }

      each_1_anchor = empty();
    },
    l: function claim(nodes) {
      for (var _i20 = 0; _i20 < each_blocks.length; _i20 += 1) {
        each_blocks[_i20].l(nodes);
      }

      each_1_anchor = empty();
    },
    m: function mount(target, anchor) {
      for (var _i21 = 0; _i21 < each_blocks.length; _i21 += 1) {
        each_blocks[_i21].m(target, anchor);
      }

      insert_dev(target, each_1_anchor, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*funcEntries, object*/
      4) {
        each_value = funcEntries(
        /*object*/
        ctx[2]);

        var _i22;

        for (_i22 = 0; _i22 < each_value.length; _i22 += 1) {
          var child_ctx = get_each_context(ctx, each_value, _i22);

          if (each_blocks[_i22]) {
            each_blocks[_i22].p(child_ctx, dirty);

            transition_in(each_blocks[_i22], 1);
          } else {
            each_blocks[_i22] = create_each_block(child_ctx);

            each_blocks[_i22].c();

            transition_in(each_blocks[_i22], 1);

            each_blocks[_i22].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        group_outros();

        for (_i22 = each_value.length; _i22 < each_blocks.length; _i22 += 1) {
          out(_i22);
        }

        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;

      for (var _i23 = 0; _i23 < each_value.length; _i23 += 1) {
        transition_in(each_blocks[_i23]);
      }

      current = true;
    },
    o: function outro(local) {
      each_blocks = filter$2(each_blocks).call(each_blocks, Boolean);

      for (var _i24 = 0; _i24 < each_blocks.length; _i24 += 1) {
        transition_out(each_blocks[_i24]);
      }

      current = false;
    },
    d: function destroy(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach_dev(each_1_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block_1$1.name,
    type: "if",
    source: "(61:3) {#if typeof object === 'function'}",
    ctx: ctx
  });
  return block;
} // (74:4) {#each objectKeys(object) as key}


function create_each_block_3(ctx) {
  var current;
  var objecttree = new ObjectTree({
    props: {
      object:
      /*object*/
      ctx[2][
      /*key*/
      ctx[3]],
      key:
      /*key*/
      ctx[3]
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(objecttree.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(objecttree.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(objecttree, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var objecttree_changes = {};
      if (dirty &
      /*object*/
      4) objecttree_changes.object =
      /*object*/
      ctx[2][
      /*key*/
      ctx[3]];
      if (dirty &
      /*object*/
      4) objecttree_changes.key =
      /*key*/
      ctx[3];
      objecttree.$set(objecttree_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(objecttree.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(objecttree.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(objecttree, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_3.name,
    type: "each",
    source: "(74:4) {#each objectKeys(object) as key}",
    ctx: ctx
  });
  return block;
} // (70:4) {#each Array.from(object) as value, key}


function create_each_block_2(ctx) {
  var current;
  var objecttree = new ObjectTree({
    props: {
      object:
      /*value*/
      ctx[8],
      key:
      /*key*/
      ctx[3]
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(objecttree.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(objecttree.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(objecttree, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var objecttree_changes = {};
      if (dirty &
      /*object*/
      4) objecttree_changes.object =
      /*value*/
      ctx[8];
      objecttree.$set(objecttree_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(objecttree.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(objecttree.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(objecttree, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_2.name,
    type: "each",
    source: "(70:4) {#each Array.from(object) as value, key}",
    ctx: ctx
  });
  return block;
} // (66:4) {#each Array.from(object) as [key, value]}


function create_each_block_1(ctx) {
  var current;
  var objecttree = new ObjectTree({
    props: {
      object:
      /*value*/
      ctx[8],
      key:
      /*key*/
      ctx[3]
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(objecttree.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(objecttree.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(objecttree, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var objecttree_changes = {};
      if (dirty &
      /*object*/
      4) objecttree_changes.object =
      /*value*/
      ctx[8];
      if (dirty &
      /*object*/
      4) objecttree_changes.key =
      /*key*/
      ctx[3];
      objecttree.$set(objecttree_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(objecttree.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(objecttree.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(objecttree, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block_1.name,
    type: "each",
    source: "(66:4) {#each Array.from(object) as [key, value]}",
    ctx: ctx
  });
  return block;
} // (62:4) {#each funcEntries(object) as [key, value]}


function create_each_block(ctx) {
  var current;
  var objecttree = new ObjectTree({
    props: {
      object:
      /*value*/
      ctx[8],
      key:
      /*key*/
      ctx[3]
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(objecttree.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(objecttree.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(objecttree, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var objecttree_changes = {};
      if (dirty &
      /*object*/
      4) objecttree_changes.object =
      /*value*/
      ctx[8];
      if (dirty &
      /*object*/
      4) objecttree_changes.key =
      /*key*/
      ctx[3];
      objecttree.$set(objecttree_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(objecttree.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(objecttree.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(objecttree, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_each_block.name,
    type: "each",
    source: "(62:4) {#each funcEntries(object) as [key, value]}",
    ctx: ctx
  });
  return block;
}

function create_fragment$4(ctx) {
  var div2;
  var div0;
  var input;
  var input_disabled_value;
  var t0;
  var b;
  var t1;
  var t2;
  var t3;
  var t4;
  var div1;
  var current;
  var dispose;
  var if_block =
  /*expanded*/
  ctx[1] &&
  /*canExpand*/
  ctx[4] && create_if_block$2(ctx);
  var block = {
    c: function create() {
      div2 = element("div");
      div0 = element("div");
      input = element("input");
      t0 = space();
      b = element("b");
      t1 = text(
      /*key*/
      ctx[3]);
      t2 = text(": ");
      t3 = text(
      /*name*/
      ctx[0]);
      t4 = space();
      div1 = element("div");
      if (if_block) if_block.c();
      this.h();
    },
    l: function claim(nodes) {
      div2 = claim_element(nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      input = claim_element(div0_nodes, "INPUT", {
        type: true,
        disabled: true
      });
      t0 = claim_space(div0_nodes);
      b = claim_element(div0_nodes, "B", {});
      var b_nodes = children(b);
      t1 = claim_text(b_nodes,
      /*key*/
      ctx[3]);

      forEach$2(b_nodes).call(b_nodes, detach_dev);

      t2 = claim_text(div0_nodes, ": ");
      t3 = claim_text(div0_nodes,
      /*name*/
      ctx[0]);

      forEach$2(div0_nodes).call(div0_nodes, detach_dev);

      t4 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      if (if_block) if_block.l(div1_nodes);

      forEach$2(div1_nodes).call(div1_nodes, detach_dev);

      forEach$2(div2_nodes).call(div2_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(input, "type", "checkbox");
      input.disabled = input_disabled_value = !
      /*canExpand*/
      ctx[4];
      add_location(input, file$2, 56, 2, 1258);
      add_location(b, file$2, 56, 76, 1332);
      attr_dev(div0, "class", "object-tree__header svelte-17v47vf");
      add_location(div0, file$2, 55, 1, 1222);
      attr_dev(div1, "class", "object-tree__content flex flex--vertical svelte-17v47vf");
      add_location(div1, file$2, 58, 1, 1362);
      attr_dev(div2, "class", "object-tree flex flex--vertical");
      add_location(div2, file$2, 54, 0, 1175);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div2, anchor);
      append_dev(div2, div0);
      append_dev(div0, input);
      input.checked =
      /*expanded*/
      ctx[1];
      append_dev(div0, t0);
      append_dev(div0, b);
      append_dev(b, t1);
      append_dev(div0, t2);
      append_dev(div0, t3);
      append_dev(div2, t4);
      append_dev(div2, div1);
      if (if_block) if_block.m(div1, null);
      current = true;
      dispose = listen_dev(input, "change",
      /*input_change_handler*/
      ctx[7]);
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (!current || dirty &
      /*canExpand*/
      16 && input_disabled_value !== (input_disabled_value = !
      /*canExpand*/
      ctx[4])) {
        prop_dev(input, "disabled", input_disabled_value);
      }

      if (dirty &
      /*expanded*/
      2) {
        input.checked =
        /*expanded*/
        ctx[1];
      }

      if (!current || dirty &
      /*key*/
      8) set_data_dev(t1,
      /*key*/
      ctx[3]);
      if (!current || dirty &
      /*name*/
      1) set_data_dev(t3,
      /*name*/
      ctx[0]);

      if (
      /*expanded*/
      ctx[1] &&
      /*canExpand*/
      ctx[4]) {
        if (if_block) {
          if_block.p(ctx, dirty);
          transition_in(if_block, 1);
        } else {
          if_block = create_if_block$2(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, null);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div2);
      if (if_block) if_block.d();
      dispose();
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$4.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function isMap(object) {
  return object[toStringTag$2] === "Map";
}

function isIterable$3(object) {
  return typeof getIteratorMethod$1(object) === "function";
}

function funcEntries(func) {
  var object = {};

  for (var key in func) {
    object[key] = func[key];
  }

  var description = object.description;

  if (typeof description === "object") {
    delete object.description;

    assign$2(object, description);
  }

  if (typeof object.propertiesPath === "function") {
    object.propertiesPath = object.propertiesPath();
  }

  return entries$5(object);
}

function instance$4($$self, $$props, $$invalidate) {
  var _context;

  var _$$props$key = $$props.key,
      key = _$$props$key === void 0 ? null : _$$props$key;
  var _$$props$name = $$props.name,
      name = _$$props$name === void 0 ? null : _$$props$name;
  var _$$props$object = $$props.object,
      object = _$$props$object === void 0 ? void 0 : _$$props$object;
  var _$$props$expanded = $$props.expanded,
      expanded = _$$props$expanded === void 0 ? false : _$$props$expanded;
  var canExpand;
  var hiddenKeys = ["__meta", "__fields"];

  function objectKeys(object) {
    var keys = [];

    for (var _key in object) {
      keys.push(_key);
    }

    for (var i = 0, len = hiddenKeys.length; i < len; i++) {
      var _key2 = hiddenKeys[i];

      if (_key2 in object) {
        keys.push(_key2);
      }
    }

    return keys;
  }

  var writable_props = ["key", "name", "object", "expanded"];

  forEach$2(_context = keys$6(Object_1).call(Object_1, $$props)).call(_context, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<ObjectTree> was created with unknown prop '" + key + "'");
  });

  function input_change_handler() {
    expanded = this.checked;
    $$invalidate(1, expanded);
  }

  $$self.$set = function ($$props) {
    if ("key" in $$props) $$invalidate(3, key = $$props.key);
    if ("name" in $$props) $$invalidate(0, name = $$props.name);
    if ("object" in $$props) $$invalidate(2, object = $$props.object);
    if ("expanded" in $$props) $$invalidate(1, expanded = $$props.expanded);
  };

  $$self.$capture_state = function () {
    return {
      key: key,
      name: name,
      object: object,
      expanded: expanded,
      canExpand: canExpand,
      hiddenKeys: hiddenKeys
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("key" in $$props) $$invalidate(3, key = $$props.key);
    if ("name" in $$props) $$invalidate(0, name = $$props.name);
    if ("object" in $$props) $$invalidate(2, object = $$props.object);
    if ("expanded" in $$props) $$invalidate(1, expanded = $$props.expanded);
    if ("canExpand" in $$props) $$invalidate(4, canExpand = $$props.canExpand);
    if ("hiddenKeys" in $$props) hiddenKeys = $$props.hiddenKeys;
  };

  $$self.$$.update = function () {
    if ($$self.$$.dirty &
    /*object*/
    4) {
       $$invalidate(4, canExpand = object && (typeof object === "object" || typeof object === "function"));
    }

    if ($$self.$$.dirty &
    /*object*/
    4) {
       $$invalidate(0, name = getDisplayName(object));
    }
  };

  return [name, expanded, object, key, canExpand, objectKeys, hiddenKeys, input_change_handler];
}

var ObjectTree =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(ObjectTree, _SvelteComponentDev);

  function ObjectTree(options) {
    var _this;

    _classCallCheck(this, ObjectTree);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ObjectTree).call(this, options));
    init(_assertThisInitialized(_this), options, instance$4, create_fragment$4, safe_not_equal, {
      key: 3,
      name: 0,
      object: 2,
      expanded: 1
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "ObjectTree",
      options: options,
      id: create_fragment$4.name
    });
    return _this;
  }

  _createClass(ObjectTree, [{
    key: "key",
    get: function get() {
      throw new Error("<ObjectTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<ObjectTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "name",
    get: function get() {
      throw new Error("<ObjectTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<ObjectTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "object",
    get: function get() {
      throw new Error("<ObjectTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<ObjectTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "expanded",
    get: function get() {
      throw new Error("<ObjectTree>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<ObjectTree>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return ObjectTree;
}(SvelteComponentDev);

var file$3 = "src\\components\\dev\\webrain\\Webrain.svelte"; // (257:4) {#if selected.error}

function create_if_block$3(ctx) {
  var current;
  var objecttree = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].error,
      key: "error",
      expanded: true
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(objecttree.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(objecttree.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(objecttree, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var objecttree_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree_changes.object =
      /*selected*/
      ctx[4].error;
      objecttree.$set(objecttree_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(objecttree.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(objecttree.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(objecttree, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block$3.name,
    type: "if",
    source: "(257:4) {#if selected.error}",
    ctx: ctx
  });
  return block;
}

function create_fragment$5(ctx) {
  var div7;
  var div1;
  var div0;
  var div1_resize_listener;
  var t0;
  var div6;
  var label0;
  var input0;
  var t1;
  var t2;
  var label1;
  var input1;
  var t3;
  var t4;
  var p;
  var t5;
  var t6;
  var label2;
  var input2;
  var input2_value_value;
  var t7;
  var t8;
  var label3;
  var input3;
  var input3_value_value;
  var t9;
  var t10;
  var label4;
  var input4;
  var input4_value_value;
  var t11;
  var t12;
  var label5;
  var input5;
  var input5_value_value;
  var t13;
  var t14;
  var label6;
  var input6;
  var input6_value_value;
  var t15;
  var t16;
  var label7;
  var input7;
  var input7_value_value;
  var t17;
  var t18;
  var div2;
  var input8;
  var t19;
  var button0;
  var t20;
  var t21;
  var button1;
  var t22;
  var t23;
  var button2;
  var t24;
  var t25;
  var div5;
  var div4;
  var div3;
  var t26_value =
  /*selected*/
  ctx[4].class + "";
  var t26;
  var t27;
  var t28_value =
  /*selected*/
  ctx[4].type + "";
  var t28;
  var t29;
  var t30;
  var t31;
  var t32;
  var t33;
  var t34;
  var t35;
  var t36;
  var current;
  var dispose;
  var if_block =
  /*selected*/
  ctx[4].error && create_if_block$3(ctx);
  var objecttree0 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].subscribers,
      key: "subscribers",
      expanded: false
    },
    $$inline: true
  });
  var objecttree1 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].id,
      key: "id",
      expanded: false
    },
    $$inline: true
  });
  var objecttree2 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].count,
      key: "count",
      expanded: false
    },
    $$inline: true
  });
  var objecttree3 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].object,
      key: "object",
      expanded: false
    },
    $$inline: true
  });
  var objecttree4 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].key,
      key: "key",
      expanded: true
    },
    $$inline: true
  });
  var objecttree5 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].valueHistory,
      key: "valueHistory",
      expanded: true
    },
    $$inline: true
  });
  var objecttree6 = new ObjectTree({
    props: {
      object:
      /*selected*/
      ctx[4].value,
      key: "value",
      expanded: true
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      div7 = element("div");
      div1 = element("div");
      div0 = element("div");
      t0 = space();
      div6 = element("div");
      label0 = element("label");
      input0 = element("input");
      t1 = text("Enabled");
      t2 = space();
      label1 = element("label");
      input1 = element("input");
      t3 = text("Physics");
      t4 = space();
      p = element("p");
      t5 = text("Highlight:");
      t6 = space();
      label2 = element("label");
      input2 = element("input");
      t7 = text("All");
      t8 = space();
      label3 = element("label");
      input3 = element("input");
      t9 = text("Last active");
      t10 = space();
      label4 = element("label");
      input4 = element("input");
      t11 = text("Calc time sum");
      t12 = space();
      label5 = element("label");
      input5 = element("input");
      t13 = text("Calc time average");
      t14 = space();
      label6 = element("label");
      input6 = element("input");
      t15 = text("Subscribers");
      t16 = space();
      label7 = element("label");
      input7 = element("input");
      t17 = text("Search");
      t18 = space();
      div2 = element("div");
      input8 = element("input");
      t19 = space();
      button0 = element("button");
      t20 = text("x");
      t21 = space();
      button1 = element("button");
      t22 = text("Pause simulation");
      t23 = space();
      button2 = element("button");
      t24 = text("Stabilize");
      t25 = space();
      div5 = element("div");
      div4 = element("div");
      div3 = element("div");
      t26 = text(t26_value);
      t27 = text(".");
      t28 = text(t28_value);
      t29 = space();
      if (if_block) if_block.c();
      t30 = space();
      create_component(objecttree0.$$.fragment);
      t31 = space();
      create_component(objecttree1.$$.fragment);
      t32 = space();
      create_component(objecttree2.$$.fragment);
      t33 = space();
      create_component(objecttree3.$$.fragment);
      t34 = space();
      create_component(objecttree4.$$.fragment);
      t35 = space();
      create_component(objecttree5.$$.fragment);
      t36 = space();
      create_component(objecttree6.$$.fragment);
      this.h();
    },
    l: function claim(nodes) {
      div7 = claim_element(nodes, "DIV", {
        class: true
      });
      var div7_nodes = children(div7);
      div1 = claim_element(div7_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      div0 = claim_element(div1_nodes, "DIV", {
        class: true,
        style: true
      });
      var div0_nodes = children(div0);

      forEach$2(div0_nodes).call(div0_nodes, detach_dev);

      forEach$2(div1_nodes).call(div1_nodes, detach_dev);

      t0 = claim_space(div7_nodes);
      div6 = claim_element(div7_nodes, "DIV", {
        class: true
      });
      var div6_nodes = children(div6);
      label0 = claim_element(div6_nodes, "LABEL", {});
      var label0_nodes = children(label0);
      input0 = claim_element(label0_nodes, "INPUT", {
        type: true
      });
      t1 = claim_text(label0_nodes, "Enabled");

      forEach$2(label0_nodes).call(label0_nodes, detach_dev);

      t2 = claim_space(div6_nodes);
      label1 = claim_element(div6_nodes, "LABEL", {});
      var label1_nodes = children(label1);
      input1 = claim_element(label1_nodes, "INPUT", {
        type: true
      });
      t3 = claim_text(label1_nodes, "Physics");

      forEach$2(label1_nodes).call(label1_nodes, detach_dev);

      t4 = claim_space(div6_nodes);
      p = claim_element(div6_nodes, "P", {});
      var p_nodes = children(p);
      t5 = claim_text(p_nodes, "Highlight:");

      forEach$2(p_nodes).call(p_nodes, detach_dev);

      t6 = claim_space(div6_nodes);
      label2 = claim_element(div6_nodes, "LABEL", {});
      var label2_nodes = children(label2);
      input2 = claim_element(label2_nodes, "INPUT", {
        type: true,
        value: true
      });
      t7 = claim_text(label2_nodes, "All");

      forEach$2(label2_nodes).call(label2_nodes, detach_dev);

      t8 = claim_space(div6_nodes);
      label3 = claim_element(div6_nodes, "LABEL", {});
      var label3_nodes = children(label3);
      input3 = claim_element(label3_nodes, "INPUT", {
        type: true,
        value: true
      });
      t9 = claim_text(label3_nodes, "Last active");

      forEach$2(label3_nodes).call(label3_nodes, detach_dev);

      t10 = claim_space(div6_nodes);
      label4 = claim_element(div6_nodes, "LABEL", {});
      var label4_nodes = children(label4);
      input4 = claim_element(label4_nodes, "INPUT", {
        type: true,
        value: true
      });
      t11 = claim_text(label4_nodes, "Calc time sum");

      forEach$2(label4_nodes).call(label4_nodes, detach_dev);

      t12 = claim_space(div6_nodes);
      label5 = claim_element(div6_nodes, "LABEL", {});
      var label5_nodes = children(label5);
      input5 = claim_element(label5_nodes, "INPUT", {
        type: true,
        value: true
      });
      t13 = claim_text(label5_nodes, "Calc time average");

      forEach$2(label5_nodes).call(label5_nodes, detach_dev);

      t14 = claim_space(div6_nodes);
      label6 = claim_element(div6_nodes, "LABEL", {});
      var label6_nodes = children(label6);
      input6 = claim_element(label6_nodes, "INPUT", {
        type: true,
        value: true
      });
      t15 = claim_text(label6_nodes, "Subscribers");

      forEach$2(label6_nodes).call(label6_nodes, detach_dev);

      t16 = claim_space(div6_nodes);
      label7 = claim_element(div6_nodes, "LABEL", {});
      var label7_nodes = children(label7);
      input7 = claim_element(label7_nodes, "INPUT", {
        type: true,
        value: true
      });
      t17 = claim_text(label7_nodes, "Search");

      forEach$2(label7_nodes).call(label7_nodes, detach_dev);

      t18 = claim_space(div6_nodes);
      div2 = claim_element(div6_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      input8 = claim_element(div2_nodes, "INPUT", {
        class: true,
        type: true
      });
      t19 = claim_space(div2_nodes);
      button0 = claim_element(div2_nodes, "BUTTON", {
        class: true
      });
      var button0_nodes = children(button0);
      t20 = claim_text(button0_nodes, "x");

      forEach$2(button0_nodes).call(button0_nodes, detach_dev);

      forEach$2(div2_nodes).call(div2_nodes, detach_dev);

      t21 = claim_space(div6_nodes);
      button1 = claim_element(div6_nodes, "BUTTON", {});
      var button1_nodes = children(button1);
      t22 = claim_text(button1_nodes, "Pause simulation");

      forEach$2(button1_nodes).call(button1_nodes, detach_dev);

      t23 = claim_space(div6_nodes);
      button2 = claim_element(div6_nodes, "BUTTON", {});
      var button2_nodes = children(button2);
      t24 = claim_text(button2_nodes, "Stabilize");

      forEach$2(button2_nodes).call(button2_nodes, detach_dev);

      t25 = claim_space(div6_nodes);
      div5 = claim_element(div6_nodes, "DIV", {
        class: true
      });
      var div5_nodes = children(div5);
      div4 = claim_element(div5_nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      div3 = claim_element(div4_nodes, "DIV", {});
      var div3_nodes = children(div3);
      t26 = claim_text(div3_nodes, t26_value);
      t27 = claim_text(div3_nodes, ".");
      t28 = claim_text(div3_nodes, t28_value);

      forEach$2(div3_nodes).call(div3_nodes, detach_dev);

      t29 = claim_space(div4_nodes);
      if (if_block) if_block.l(div4_nodes);
      t30 = claim_space(div4_nodes);
      claim_component(objecttree0.$$.fragment, div4_nodes);
      t31 = claim_space(div4_nodes);
      claim_component(objecttree1.$$.fragment, div4_nodes);
      t32 = claim_space(div4_nodes);
      claim_component(objecttree2.$$.fragment, div4_nodes);
      t33 = claim_space(div4_nodes);
      claim_component(objecttree3.$$.fragment, div4_nodes);
      t34 = claim_space(div4_nodes);
      claim_component(objecttree4.$$.fragment, div4_nodes);
      t35 = claim_space(div4_nodes);
      claim_component(objecttree5.$$.fragment, div4_nodes);
      t36 = claim_space(div4_nodes);
      claim_component(objecttree6.$$.fragment, div4_nodes);

      forEach$2(div4_nodes).call(div4_nodes, detach_dev);

      forEach$2(div5_nodes).call(div5_nodes, detach_dev);

      forEach$2(div6_nodes).call(div6_nodes, detach_dev);

      forEach$2(div7_nodes).call(div7_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(div0, "class", "fill");
      set_style(div0, "height",
      /*containerHeight*/
      ctx[2] + "px");
      set_style(div0, "width",
      /*containerWidth*/
      ctx[3] + "px");
      add_location(div0, file$3, 230, 2, 6179);
      attr_dev(div1, "class", "graph__view flex svelte-2ub8ee");
      add_render_callback(function () {
        return (
          /*div1_elementresize_handler*/
          ctx[13].call(div1)
        );
      });
      add_location(div1, file$3, 224, 1, 6032);
      attr_dev(input0, "type", "checkbox");
      add_location(input0, file$3, 236, 9, 6368);
      add_location(label0, file$3, 236, 2, 6361);
      attr_dev(input1, "type", "checkbox");
      add_location(input1, file$3, 237, 9, 6453);
      add_location(label1, file$3, 237, 2, 6446);
      add_location(p, file$3, 238, 2, 6535);
      attr_dev(input2, "type", "radio");
      input2.__value = input2_value_value = HighlightMode.All;
      input2.value = input2.__value;
      /*$$binding_groups*/

      ctx[17][0].push(input2);
      add_location(input2, file$3, 239, 9, 6563);
      add_location(label2, file$3, 239, 2, 6556);
      attr_dev(input3, "type", "radio");
      input3.__value = input3_value_value = HighlightMode.LastActive;
      input3.value = input3.__value;
      /*$$binding_groups*/

      ctx[17][0].push(input3);
      add_location(input3, file$3, 240, 9, 6671);
      add_location(label3, file$3, 240, 2, 6664);
      attr_dev(input4, "type", "radio");
      input4.__value = input4_value_value = HighlightMode.CalcTimeSum;
      input4.value = input4.__value;
      /*$$binding_groups*/

      ctx[17][0].push(input4);
      add_location(input4, file$3, 241, 9, 6794);
      add_location(label4, file$3, 241, 2, 6787);
      attr_dev(input5, "type", "radio");
      input5.__value = input5_value_value = HighlightMode.CalcTimeAverage;
      input5.value = input5.__value;
      /*$$binding_groups*/

      ctx[17][0].push(input5);
      add_location(input5, file$3, 242, 9, 6920);
      add_location(label5, file$3, 242, 2, 6913);
      attr_dev(input6, "type", "radio");
      input6.__value = input6_value_value = HighlightMode.Subscribers;
      input6.value = input6.__value;
      /*$$binding_groups*/

      ctx[17][0].push(input6);
      add_location(input6, file$3, 243, 9, 7054);
      add_location(label6, file$3, 243, 2, 7047);
      attr_dev(input7, "type", "radio");
      input7.__value = input7_value_value = HighlightMode.SearchResults;
      input7.value = input7.__value;
      /*$$binding_groups*/

      ctx[17][0].push(input7);
      add_location(input7, file$3, 244, 9, 7178);
      add_location(label7, file$3, 244, 2, 7171);
      attr_dev(input8, "class", "graph__search-pattern svelte-2ub8ee");
      attr_dev(input8, "type", "text");
      add_location(input8, file$3, 246, 3, 7323);
      attr_dev(button0, "class", "graph__search-clear svelte-2ub8ee");
      add_location(button0, file$3, 247, 3, 7416);
      attr_dev(div2, "class", "graph__search svelte-2ub8ee");
      add_location(div2, file$3, 245, 2, 7292);
      add_location(button1, file$3, 249, 2, 7526);
      add_location(button2, file$3, 250, 2, 7591);
      add_location(div3, file$3, 253, 4, 7765);
      attr_dev(div4, "class", "graph__controls-info-content flex flex--vertical svelte-2ub8ee");
      add_location(div4, file$3, 252, 3, 7698);
      attr_dev(div5, "class", "graph__controls-info flex__item--fill svelte-2ub8ee");
      add_location(div5, file$3, 251, 2, 7643);
      attr_dev(div6, "class", "graph__controls flex flex--vertical svelte-2ub8ee");
      add_location(div6, file$3, 235, 1, 6309);
      attr_dev(div7, "class", "graph fill flex");
      add_location(div7, file$3, 223, 0, 6001);
    },
    m: function mount(target, anchor) {
      var _context;

      insert_dev(target, div7, anchor);
      append_dev(div7, div1);
      append_dev(div1, div0);
      /*div0_binding*/

      ctx[11](div0);
      /*div1_binding*/

      ctx[12](div1);
      div1_resize_listener = add_resize_listener(div1,
      /*div1_elementresize_handler*/
      bind$6(_context = ctx[13]).call(_context, div1));
      append_dev(div7, t0);
      append_dev(div7, div6);
      append_dev(div6, label0);
      append_dev(label0, input0);
      input0.checked =
      /*connector*/
      ctx[5].isEnabled;
      append_dev(label0, t1);
      append_dev(div6, t2);
      append_dev(div6, label1);
      append_dev(label1, input1);
      input1.checked =
      /*options*/
      ctx[6].physics.enabled;
      append_dev(label1, t3);
      append_dev(div6, t4);
      append_dev(div6, p);
      append_dev(p, t5);
      append_dev(div6, t6);
      append_dev(div6, label2);
      append_dev(label2, input2);
      input2.checked = input2.__value ===
      /*connector*/
      ctx[5].highlightMode;
      append_dev(label2, t7);
      append_dev(div6, t8);
      append_dev(div6, label3);
      append_dev(label3, input3);
      input3.checked = input3.__value ===
      /*connector*/
      ctx[5].highlightMode;
      append_dev(label3, t9);
      append_dev(div6, t10);
      append_dev(div6, label4);
      append_dev(label4, input4);
      input4.checked = input4.__value ===
      /*connector*/
      ctx[5].highlightMode;
      append_dev(label4, t11);
      append_dev(div6, t12);
      append_dev(div6, label5);
      append_dev(label5, input5);
      input5.checked = input5.__value ===
      /*connector*/
      ctx[5].highlightMode;
      append_dev(label5, t13);
      append_dev(div6, t14);
      append_dev(div6, label6);
      append_dev(label6, input6);
      input6.checked = input6.__value ===
      /*connector*/
      ctx[5].highlightMode;
      append_dev(label6, t15);
      append_dev(div6, t16);
      append_dev(div6, label7);
      append_dev(label7, input7);
      input7.checked = input7.__value ===
      /*connector*/
      ctx[5].highlightMode;
      append_dev(label7, t17);
      append_dev(div6, t18);
      append_dev(div6, div2);
      append_dev(div2, input8);
      set_input_value(input8,
      /*connector*/
      ctx[5].searchPattern);
      append_dev(div2, t19);
      append_dev(div2, button0);
      append_dev(button0, t20);
      append_dev(div6, t21);
      append_dev(div6, button1);
      append_dev(button1, t22);
      append_dev(div6, t23);
      append_dev(div6, button2);
      append_dev(button2, t24);
      append_dev(div6, t25);
      append_dev(div6, div5);
      append_dev(div5, div4);
      append_dev(div4, div3);
      append_dev(div3, t26);
      append_dev(div3, t27);
      append_dev(div3, t28);
      append_dev(div4, t29);
      if (if_block) if_block.m(div4, null);
      append_dev(div4, t30);
      mount_component(objecttree0, div4, null);
      append_dev(div4, t31);
      mount_component(objecttree1, div4, null);
      append_dev(div4, t32);
      mount_component(objecttree2, div4, null);
      append_dev(div4, t33);
      mount_component(objecttree3, div4, null);
      append_dev(div4, t34);
      mount_component(objecttree4, div4, null);
      append_dev(div4, t35);
      mount_component(objecttree5, div4, null);
      append_dev(div4, t36);
      mount_component(objecttree6, div4, null);
      current = true;
      dispose = [listen_dev(input0, "change",
      /*input0_change_handler*/
      ctx[14]), listen_dev(input1, "change",
      /*input1_change_handler*/
      ctx[15]), listen_dev(input2, "change",
      /*input2_change_handler*/
      ctx[16]), listen_dev(input3, "change",
      /*input3_change_handler*/
      ctx[18]), listen_dev(input4, "change",
      /*input4_change_handler*/
      ctx[19]), listen_dev(input5, "change",
      /*input5_change_handler*/
      ctx[20]), listen_dev(input6, "change",
      /*input6_change_handler*/
      ctx[21]), listen_dev(input7, "change",
      /*input7_change_handler*/
      ctx[22]), listen_dev(input8, "input",
      /*input8_input_handler*/
      ctx[23]), listen_dev(button0, "click",
      /*click_handler*/
      ctx[24], false, false, false), listen_dev(button1, "click",
      /*simulationPause*/
      ctx[7], false, false, false), listen_dev(button2, "click",
      /*stabilize*/
      ctx[8], false, false, false)];
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (!current || dirty &
      /*containerHeight*/
      4) {
        set_style(div0, "height",
        /*containerHeight*/
        ctx[2] + "px");
      }

      if (!current || dirty &
      /*containerWidth*/
      8) {
        set_style(div0, "width",
        /*containerWidth*/
        ctx[3] + "px");
      }

      if (dirty &
      /*connector*/
      32) {
        input0.checked =
        /*connector*/
        ctx[5].isEnabled;
      }

      if (dirty &
      /*options*/
      64) {
        input1.checked =
        /*options*/
        ctx[6].physics.enabled;
      }

      if (dirty &
      /*connector*/
      32) {
        input2.checked = input2.__value ===
        /*connector*/
        ctx[5].highlightMode;
      }

      if (dirty &
      /*connector*/
      32) {
        input3.checked = input3.__value ===
        /*connector*/
        ctx[5].highlightMode;
      }

      if (dirty &
      /*connector*/
      32) {
        input4.checked = input4.__value ===
        /*connector*/
        ctx[5].highlightMode;
      }

      if (dirty &
      /*connector*/
      32) {
        input5.checked = input5.__value ===
        /*connector*/
        ctx[5].highlightMode;
      }

      if (dirty &
      /*connector*/
      32) {
        input6.checked = input6.__value ===
        /*connector*/
        ctx[5].highlightMode;
      }

      if (dirty &
      /*connector*/
      32) {
        input7.checked = input7.__value ===
        /*connector*/
        ctx[5].highlightMode;
      }

      if (dirty &
      /*connector*/
      32 && input8.value !==
      /*connector*/
      ctx[5].searchPattern) {
        set_input_value(input8,
        /*connector*/
        ctx[5].searchPattern);
      }

      if ((!current || dirty &
      /*selected*/
      16) && t26_value !== (t26_value =
      /*selected*/
      ctx[4].class + "")) set_data_dev(t26, t26_value);
      if ((!current || dirty &
      /*selected*/
      16) && t28_value !== (t28_value =
      /*selected*/
      ctx[4].type + "")) set_data_dev(t28, t28_value);

      if (
      /*selected*/
      ctx[4].error) {
        if (if_block) {
          if_block.p(ctx, dirty);
          transition_in(if_block, 1);
        } else {
          if_block = create_if_block$3(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div4, t30);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }

      var objecttree0_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree0_changes.object =
      /*selected*/
      ctx[4].subscribers;
      objecttree0.$set(objecttree0_changes);
      var objecttree1_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree1_changes.object =
      /*selected*/
      ctx[4].id;
      objecttree1.$set(objecttree1_changes);
      var objecttree2_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree2_changes.object =
      /*selected*/
      ctx[4].count;
      objecttree2.$set(objecttree2_changes);
      var objecttree3_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree3_changes.object =
      /*selected*/
      ctx[4].object;
      objecttree3.$set(objecttree3_changes);
      var objecttree4_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree4_changes.object =
      /*selected*/
      ctx[4].key;
      objecttree4.$set(objecttree4_changes);
      var objecttree5_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree5_changes.object =
      /*selected*/
      ctx[4].valueHistory;
      objecttree5.$set(objecttree5_changes);
      var objecttree6_changes = {};
      if (dirty &
      /*selected*/
      16) objecttree6_changes.object =
      /*selected*/
      ctx[4].value;
      objecttree6.$set(objecttree6_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(objecttree0.$$.fragment, local);
      transition_in(objecttree1.$$.fragment, local);
      transition_in(objecttree2.$$.fragment, local);
      transition_in(objecttree3.$$.fragment, local);
      transition_in(objecttree4.$$.fragment, local);
      transition_in(objecttree5.$$.fragment, local);
      transition_in(objecttree6.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(objecttree0.$$.fragment, local);
      transition_out(objecttree1.$$.fragment, local);
      transition_out(objecttree2.$$.fragment, local);
      transition_out(objecttree3.$$.fragment, local);
      transition_out(objecttree4.$$.fragment, local);
      transition_out(objecttree5.$$.fragment, local);
      transition_out(objecttree6.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      var _context2, _context3, _context4, _context5, _context6, _context7, _context8, _context9, _context10, _context11, _context12, _context13;

      if (detaching) detach_dev(div7);
      /*div0_binding*/

      ctx[11](null);
      /*div1_binding*/

      ctx[12](null);
      div1_resize_listener.cancel();
      /*$$binding_groups*/

      splice$2(_context2 = ctx[17][0]).call(_context2,
      /*$$binding_groups*/
      indexOf$5(_context3 = ctx[17][0]).call(_context3, input2), 1);
      /*$$binding_groups*/


      splice$2(_context4 = ctx[17][0]).call(_context4,
      /*$$binding_groups*/
      indexOf$5(_context5 = ctx[17][0]).call(_context5, input3), 1);
      /*$$binding_groups*/


      splice$2(_context6 = ctx[17][0]).call(_context6,
      /*$$binding_groups*/
      indexOf$5(_context7 = ctx[17][0]).call(_context7, input4), 1);
      /*$$binding_groups*/


      splice$2(_context8 = ctx[17][0]).call(_context8,
      /*$$binding_groups*/
      indexOf$5(_context9 = ctx[17][0]).call(_context9, input5), 1);
      /*$$binding_groups*/


      splice$2(_context10 = ctx[17][0]).call(_context10,
      /*$$binding_groups*/
      indexOf$5(_context11 = ctx[17][0]).call(_context11, input6), 1);
      /*$$binding_groups*/


      splice$2(_context12 = ctx[17][0]).call(_context12,
      /*$$binding_groups*/
      indexOf$5(_context13 = ctx[17][0]).call(_context13, input7), 1);

      if (if_block) if_block.d();
      destroy_component(objecttree0);
      destroy_component(objecttree1);
      destroy_component(objecttree2);
      destroy_component(objecttree3);
      destroy_component(objecttree4);
      destroy_component(objecttree5);
      destroy_component(objecttree6);
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$5.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

var data$1;

if (typeof window !== "undefined") {
  // region init vis network
  data$1 = {
    nodes: [],
    edges: []
  };
  data$1.nodes = new vis.DataSet([]); // {id: 1, label: 'Node 1'},
  // {id: 2, label: 'Node 2'},
  // {id: 3, label: 'Node 3'},
  // {id: 4, label: 'Node 4'},
  // {id: 5, label: 'Node 5'}
  // create an array with edges

  data$1.edges = new vis.DataSet([]); // {from: 1, to: 3},
  // {from: 1, to: 2},
  // {from: 2, to: 4},
  // {from: 2, to: 5},
  // {from: 3, to: 3}
  // endregion
  // region bind webrain graph to vis
  // docs: https://visjs.github.io/vis-network/docs/network/manipulation.html
  // deepSubscribe({
  // 	object: webrainGraph,
  // 	ruleBuilder: b => b.p('nodes').collection().p('visData'),
  // 	changeValue: (key, oldValue, newValue) => {
  // 		if (oldValue) {
  // 			data.nodes.remove(oldValue)
  // 		}
  //
  // 		if (!newValue) {
  // 			return
  // 		}
  //
  // 		data.nodes.add(newValue)
  // 		return newValue.propertyChanged.subscribe(() => {
  // 			data.nodes.update(newValue)
  // 		})
  // 	},
  // })
  //
  // deepSubscribe({
  // 	object: webrainGraph,
  // 	ruleBuilder: b => b.p('edges').collection().p('visData'),
  // 	changeValue: (key, oldValue, newValue) => {
  // 		if (oldValue) {
  // 			data.edges.remove(oldValue)
  // 		}
  //
  // 		if (!newValue) {
  // 			return
  // 		}
  //
  // 		data.edges.add(newValue)
  // 		return newValue.propertyChanged.subscribe(() => {
  // 			data.edges.update(newValue)
  // 		})
  // 	},
  // })

  deepSubscribe({
    object: webrainGraph,
    ruleBuilder: function ruleBuilder(b) {
      return b.p("visData");
    },
    changeValue: function changeValue(key, oldValue, newValue) {
      var nodes = newValue && newValue.nodes;

      if (nodes) {
        data$1.nodes.update(newValue.nodes);
        var ids = data$1.nodes.getIds();

        for (var i = 0, len = ids.length; i < len; i++) {
          if (!newValue.groups.nodes[ids[i]]) {
            data$1.nodes.remove(ids[i]);
          }
        }
      }

      var edges = newValue && newValue.edges;

      if (edges) {
        data$1.edges.update(edges);

        var _ids = data$1.edges.getIds();

        for (var _i = 0, _len = _ids.length; _i < _len; _i++) {
          if (!newValue.groups.edges[_ids[_i]]) {
            data$1.edges.remove(_ids[_i]);
          }
        }
      }
    }
  });
} // endregion


var createConnector$1 = connectorFactory({
  name: "WebrainView" + WebrainGraphObjectsId,
  buildRule: function buildRule(c) {
    return c.connect("visData", function (b) {
      return b.p("visData");
    }).connectWritable("isEnabled", function (b) {
      return b.p("isEnabled");
    }).connectWritable("highlightMode", function (b) {
      return b.p("highlightMode");
    }).connectWritable("searchPattern", function (b) {
      return b.p("searchPattern");
    });
  }
});
var subscribe$1 = dependenciesSubscriber(function (b) {
  return b.propertyAny();
}, function (update) {
  update();
});

function instance$5($$self, $$props, $$invalidate) {
  var network;
  var container;
  var containerWrapper;
  var containerHeight;
  var containerWidth;
  var selected = {};
  var connector = createConnector$1(webrainGraph); // $: connector.connectorState.source = webrainGraph

  onDestroy(subscribe$1(connector, function updateView() {
    $$invalidate(5, connector.connectorState.source = webrainGraph, connector);
  }));
  var options = {
    // https://visjs.github.io/vis-network/docs/network/physics.html
    physics: {
      enabled: true,
      forceAtlas2Based: {
        gravitationalConstant: -50,
        centralGravity: 0.01,
        springLength: 100,
        avoidOverlap: 0.5
      },
      barnesHut: {
        avoidOverlap: 0.5
      },
      solver: "barnesHut"
    }
  };

  function updateOptions(options) {
    if (network) {
      network.setOptions(options);
    }
  }

  function simulationPause() {
    if (network) {
      network.stopSimulation();
    }
  }

  function stabilize() {
    if (network) {
      network.stabilize(1000);
    }
  }

  onMount(function () {
    setTimeout$2(function () {
      $$invalidate(3, containerWidth = containerWrapper.offsetWidth);
      $$invalidate(2, containerHeight = containerWrapper.offsetHeight);
      network = new vis.Network(container, data$1, options); // stabilize()
      // options.physics.enabled = false

      network.on("select", function (params) {
        var nodeId = params && params.nodes && params.nodes.length && params.nodes[0];
        var edgeId = params && params.edges && params.edges.length && params.edges[0];
        $$invalidate(4, selected.groupNodeId = nodeId, selected);
        $$invalidate(4, selected.groupEdgeId = edgeId, selected);
      }); // selected.node = nodeId != null && webrainGraph.nodes.get(nodeId)
      // selected.edge = edgeId != null && webrainGraph.edges.get(edgeId)
    }, 100);
  });
  var $$binding_groups = [[]];

  function div0_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(0, container = $$value);
    });
  }

  function div1_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(1, containerWrapper = $$value);
    });
  }

  function div1_elementresize_handler() {
    containerHeight = this.offsetHeight;
    containerWidth = this.offsetWidth;
    $$invalidate(2, containerHeight);
    $$invalidate(3, containerWidth);
  }

  function input0_change_handler() {
    connector.isEnabled = this.checked;
    $$invalidate(5, connector);
  }

  function input1_change_handler() {
    options.physics.enabled = this.checked;
    $$invalidate(6, options);
  }

  function input2_change_handler() {
    connector.highlightMode = this.__value;
    $$invalidate(5, connector);
  }

  function input3_change_handler() {
    connector.highlightMode = this.__value;
    $$invalidate(5, connector);
  }

  function input4_change_handler() {
    connector.highlightMode = this.__value;
    $$invalidate(5, connector);
  }

  function input5_change_handler() {
    connector.highlightMode = this.__value;
    $$invalidate(5, connector);
  }

  function input6_change_handler() {
    connector.highlightMode = this.__value;
    $$invalidate(5, connector);
  }

  function input7_change_handler() {
    connector.highlightMode = this.__value;
    $$invalidate(5, connector);
  }

  function input8_input_handler() {
    connector.searchPattern = this.value;
    $$invalidate(5, connector);
  }

  var click_handler = function click_handler() {
    $$invalidate(5, connector.searchPattern = "", connector);
  };

  $$self.$capture_state = function () {
    return {};
  };

  $$self.$inject_state = function ($$props) {
    if ("network" in $$props) network = $$props.network;
    if ("container" in $$props) $$invalidate(0, container = $$props.container);
    if ("containerWrapper" in $$props) $$invalidate(1, containerWrapper = $$props.containerWrapper);
    if ("containerHeight" in $$props) $$invalidate(2, containerHeight = $$props.containerHeight);
    if ("containerWidth" in $$props) $$invalidate(3, containerWidth = $$props.containerWidth);
    if ("selected" in $$props) $$invalidate(4, selected = $$props.selected);
    if ("options" in $$props) $$invalidate(6, options = $$props.options);
  };

  $$self.$$.update = function () {
    if ($$self.$$.dirty &
    /*selected, connector*/
    48) {
       $$invalidate(4, selected.node = selected.groupNodeId != null && connector.visData && connector.visData.groups.nodes[selected.groupNodeId] && connector.visData.groups.nodes[selected.groupNodeId][0], selected);
    }

    if ($$self.$$.dirty &
    /*selected, connector*/
    48) {
       $$invalidate(4, selected.edge = selected.groupEdgeId != null && connector.visData && connector.visData.groups.edges[selected.groupEdgeId] && connector.visData.groups.edges[selected.groupEdgeId][0], selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.class = selected.node ? "Node" : selected.edge && "Edge", selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.count = selected.edge && selected.edge.count, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.element = selected.node || selected.edge, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.id = selected.element && selected.element.id, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.type = selected.element && selected.element.type, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.value = selected.element && selected.element.value, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.valueHistory = selected.element && selected.element.valueHistory, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.key = selected.element && selected.element.key, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.object = selected.node && selected.node.object, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.error = selected.node && selected.node.error, selected);
    }

    if ($$self.$$.dirty &
    /*selected*/
    16) {
       $$invalidate(4, selected.subscribers = selected.object && selected.object.propertyChanged ? selected.object.propertyChanged._subscribers : null, selected);
    }

    if ($$self.$$.dirty &
    /*options*/
    64) {
       updateOptions(options);
    }
  };

  return [container, containerWrapper, containerHeight, containerWidth, selected, connector, options, simulationPause, stabilize, network, updateOptions, div0_binding, div1_binding, div1_elementresize_handler, input0_change_handler, input1_change_handler, input2_change_handler, $$binding_groups, input3_change_handler, input4_change_handler, input5_change_handler, input6_change_handler, input7_change_handler, input8_input_handler, click_handler];
}

var Webrain =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Webrain, _SvelteComponentDev);

  function Webrain(options) {
    var _this;

    _classCallCheck(this, Webrain);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Webrain).call(this, options));
    init(_assertThisInitialized(_this), options, instance$5, create_fragment$5, safe_not_equal, {});
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Webrain",
      options: options,
      id: create_fragment$5.name
    });
    return _this;
  }

  return Webrain;
}(SvelteComponentDev);

function isFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return null;
  }

  var document = elem.getRootNode();
  var currentElem = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
  return currentElem === document.documentElement ? true : currentElem ? null : false;
}

function enterFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return;
  }

  var document = elem.getRootNode();

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    /* Firefox */
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
  } else if (document.documentElement.msRequestFullscreen) {
    /* IE/Edge */
    document.documentElement.msRequestFullscreen();
  }
}

function exitFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return;
  }

  var document = elem.getRootNode();

  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function canFullscreen(elem) {
  if (!elem || !elem.getRootNode) {
    return false;
  }

  var document = elem.getRootNode();
  return !!(document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen);
}

function fullscreenStore(elem) {
  var _context, _context2;

  if (!canFullscreen(elem)) {
    return null;
  }

  var document = elem.getRootNode();
  var store = writable(isFullscreen(elem));

  var set = bind$6(_context = store.set).call(_context, store);

  store.set = function (value) {
    if (!value) {
      if (isFullscreen(elem) !== false) {
        exitFullscreen(elem);
      }
    } else {
      if (isFullscreen(elem) !== true) {
        enterFullscreen(elem);
      }
    }
  };

  store.toggle = function () {
    if (isFullscreen(elem) === true) {
      exitFullscreen(elem);
    } else {
      enterFullscreen(elem);
    }
  };

  var eventHandler = function eventHandler() {
    set(isFullscreen(elem));
  };

  forEach$2(_context2 = ['', 'webkit', 'moz', 'ms']).call(_context2, function (prefix) {
    return document.addEventListener(prefix + 'fullscreenchange', eventHandler, false);
  });

  store.destroy = function () {
    var _context3;

    forEach$2(_context3 = ['', 'webkit', 'moz', 'ms']).call(_context3, function (prefix) {
      return document.removeEventListener(prefix + 'fullscreenchange', eventHandler, false);
    });
  };

  return store;
}

var file$4 = "src\\components\\common\\Toggle.svelte";

var get_default_slot_changes = function get_default_slot_changes(dirty) {
  return {
    checked: dirty &
    /*checked*/
    1
  };
};

var get_default_slot_context = function get_default_slot_context(ctx) {
  return {
    checked:
    /*checked*/
    ctx[0]
  };
}; // (46:1) {:else}


function create_else_block$2(ctx) {
  var input;
  var dispose;
  var block = {
    c: function create() {
      input = element("input");
      this.h();
    },
    l: function claim(nodes) {
      input = claim_element(nodes, "INPUT", {
        type: true,
        class: true,
        value: true
      });
      this.h();
    },
    h: function hydrate() {
      attr_dev(input, "type", "checkbox");
      attr_dev(input, "class", "collapsed svelte-1rwtmz7");
      input.__value =
      /*value*/
      ctx[3];
      input.value = input.__value;
      add_location(input, file$4, 46, 2, 869);
    },
    m: function mount(target, anchor) {
      insert_dev(target, input, anchor);
      input.checked =
      /*checked*/
      ctx[0];
      dispose = [listen_dev(input, "click",
      /*click_handler_1*/
      ctx[11], false, false, false), listen_dev(input, "change",
      /*change_handler_1*/
      ctx[12], false, false, false), listen_dev(input, "change",
      /*input_change_handler_1*/
      ctx[15])];
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*value*/
      8) {
        prop_dev(input, "__value",
        /*value*/
        ctx[3]);
      }

      input.value = input.__value;

      if (dirty &
      /*checked*/
      1) {
        input.checked =
        /*checked*/
        ctx[0];
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(input);
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_else_block$2.name,
    type: "else",
    source: "(46:1) {:else}",
    ctx: ctx
  });
  return block;
} // (37:1) {#if type === 'radio'}


function create_if_block$4(ctx) {
  var input;
  var dispose;
  var block = {
    c: function create() {
      input = element("input");
      this.h();
    },
    l: function claim(nodes) {
      input = claim_element(nodes, "INPUT", {
        type: true,
        class: true,
        value: true
      });
      this.h();
    },
    h: function hydrate() {
      attr_dev(input, "type", "radio");
      attr_dev(input, "class", "collapsed svelte-1rwtmz7");
      input.__value =
      /*value*/
      ctx[3];
      input.value = input.__value;
      /*$$binding_groups*/

      ctx[14][0].push(input);
      add_location(input, file$4, 37, 2, 745);
    },
    m: function mount(target, anchor) {
      insert_dev(target, input, anchor);
      input.checked = input.__value ===
      /*group*/
      ctx[1];
      dispose = [listen_dev(input, "click",
      /*click_handler*/
      ctx[9], false, false, false), listen_dev(input, "change",
      /*change_handler*/
      ctx[10], false, false, false), listen_dev(input, "change",
      /*input_change_handler*/
      ctx[13])];
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*value*/
      8) {
        prop_dev(input, "__value",
        /*value*/
        ctx[3]);
      }

      input.value = input.__value;

      if (dirty &
      /*group*/
      2) {
        input.checked = input.__value ===
        /*group*/
        ctx[1];
      }
    },
    d: function destroy(detaching) {
      var _context, _context2;

      if (detaching) detach_dev(input);
      /*$$binding_groups*/

      splice$2(_context = ctx[14][0]).call(_context,
      /*$$binding_groups*/
      indexOf$5(_context2 = ctx[14][0]).call(_context2, input), 1);

      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block$4.name,
    type: "if",
    source: "(37:1) {#if type === 'radio'}",
    ctx: ctx
  });
  return block;
}

function create_fragment$6(ctx) {
  var label;
  var t;
  var current;

  function select_block_type(ctx, dirty) {
    if (
    /*type*/
    ctx[2] === "radio") return create_if_block$4;
    return create_else_block$2;
  }

  var current_block_type = select_block_type(ctx);
  var if_block = current_block_type(ctx);
  var default_slot_template =
  /*$$slots*/
  ctx[8].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[7], get_default_slot_context);
  var block = {
    c: function create() {
      label = element("label");
      if_block.c();
      t = space();
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      label = claim_element(nodes, "LABEL", {
        class: true
      });
      var label_nodes = children(label);
      if_block.l(label_nodes);
      t = claim_space(label_nodes);
      if (default_slot) default_slot.l(label_nodes);

      forEach$2(label_nodes).call(label_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(label, "class", "svelte-1rwtmz7");
      add_location(label, file$4, 35, 0, 711);
    },
    m: function mount(target, anchor) {
      insert_dev(target, label, anchor);
      if_block.m(label, null);
      append_dev(label, t);

      if (default_slot) {
        default_slot.m(label, null);
      }

      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
        if_block.p(ctx, dirty);
      } else {
        if_block.d(1);
        if_block = current_block_type(ctx);

        if (if_block) {
          if_block.c();
          if_block.m(label, t);
        }
      }

      if (default_slot && default_slot.p && dirty &
      /*$$scope, checked*/
      129) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[7], get_default_slot_context), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[7], dirty, get_default_slot_changes));
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(label);
      if_block.d();
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$6.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$6($$self, $$props, $$invalidate) {
  var _context3;

  var _$$props$type = $$props.type,
      type = _$$props$type === void 0 ? "checkbox" : _$$props$type;
  var _$$props$checked = $$props.checked,
      checked = _$$props$checked === void 0 ? false : _$$props$checked;
  var _$$props$group = $$props.group,
      group = _$$props$group === void 0 ? "" : _$$props$group;
  var _$$props$value = $$props.value,
      value = _$$props$value === void 0 ? void 0 : _$$props$value;

  function updateRadio(group, value) {
    $$invalidate(0, checked = group === value);
  }

  function updateCheckbox(group, value) {
    $$invalidate(0, checked = indexOf$5(group).call(group, value) >= 0);
  }

  function updateGroup(checked, value) {
    var index = indexOf$5(group).call(group, value);

    if (checked) {
      if (index < 0) {
        group.push(value);
        $$invalidate(1, group);
      }
    } else {
      if (index >= 0) {
        splice$2(group).call(group, index, 1);

        $$invalidate(1, group);
      }
    }
  }

  var writable_props = ["type", "checked", "group", "value"];

  forEach$2(_context3 = keys$3($$props)).call(_context3, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<Toggle> was created with unknown prop '" + key + "'");
  });

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;
  var $$binding_groups = [[]];

  function click_handler(event) {
    bubble($$self, event);
  }

  function change_handler(event) {
    bubble($$self, event);
  }

  function click_handler_1(event) {
    bubble($$self, event);
  }

  function change_handler_1(event) {
    bubble($$self, event);
  }

  function input_change_handler() {
    group = this.__value;
    $$invalidate(1, group);
  }

  function input_change_handler_1() {
    checked = this.checked;
    $$invalidate(0, checked);
  }

  $$self.$set = function ($$props) {
    if ("type" in $$props) $$invalidate(2, type = $$props.type);
    if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    if ("group" in $$props) $$invalidate(1, group = $$props.group);
    if ("value" in $$props) $$invalidate(3, value = $$props.value);
    if ("$$scope" in $$props) $$invalidate(7, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {
      type: type,
      checked: checked,
      group: group,
      value: value
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("type" in $$props) $$invalidate(2, type = $$props.type);
    if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    if ("group" in $$props) $$invalidate(1, group = $$props.group);
    if ("value" in $$props) $$invalidate(3, value = $$props.value);
  };

  $$self.$$.update = function () {
    if ($$self.$$.dirty &
    /*type, group, value*/
    14) {
       type === "radio" && updateRadio(group, value);
    }

    if ($$self.$$.dirty &
    /*type, group, value*/
    14) {
       type === "checkbox" && group && updateCheckbox(group, value);
    }

    if ($$self.$$.dirty &
    /*type, group, checked, value*/
    15) {
       type === "checkbox" && group && updateGroup(checked, value);
    }
  };

  return [checked, group, type, value, updateRadio, updateCheckbox, updateGroup, $$scope, $$slots, click_handler, change_handler, click_handler_1, change_handler_1, input_change_handler, $$binding_groups, input_change_handler_1];
}

var Toggle =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Toggle, _SvelteComponentDev);

  function Toggle(options) {
    var _this;

    _classCallCheck(this, Toggle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Toggle).call(this, options));
    init(_assertThisInitialized(_this), options, instance$6, create_fragment$6, safe_not_equal, {
      type: 2,
      checked: 0,
      group: 1,
      value: 3
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Toggle",
      options: options,
      id: create_fragment$6.name
    });
    return _this;
  }

  _createClass(Toggle, [{
    key: "type",
    get: function get() {
      throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "checked",
    get: function get() {
      throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "group",
    get: function get() {
      throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "value",
    get: function get() {
      throw new Error("<Toggle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Toggle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return Toggle;
}(SvelteComponentDev);

var file$5 = "src\\components\\common\\ToggleFullscreen.svelte";

var get_default_slot_changes$1 = function get_default_slot_changes(dirty) {
  return {
    fullscreen: dirty &
    /*checked*/
    1
  };
};

var get_default_slot_context$1 = function get_default_slot_context(ctx) {
  return {
    fullscreen:
    /*checked*/
    ctx[0]
  };
}; // (25:0) {#if fullscreen}


function create_if_block$5(ctx) {
  var current;
  var toggle = new Toggle({
    props: {
      checked:
      /*checked*/
      ctx[0],
      $$slots: {
        default: [create_default_slot$1]
      },
      $$scope: {
        ctx: ctx
      }
    },
    $$inline: true
  });
  toggle.$on("click",
  /*onclick*/
  ctx[3]);
  var block = {
    c: function create() {
      create_component(toggle.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(toggle.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(toggle, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var toggle_changes = {};
      if (dirty &
      /*checked*/
      1) toggle_changes.checked =
      /*checked*/
      ctx[0];

      if (dirty &
      /*$$scope, checked*/
      65) {
        toggle_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      toggle.$set(toggle_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(toggle.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(toggle.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(toggle, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block$5.name,
    type: "if",
    source: "(25:0) {#if fullscreen}",
    ctx: ctx
  });
  return block;
} // (26:1) <Toggle checked="{checked}" on:click="{onclick}">


function create_default_slot$1(ctx) {
  var current;
  var default_slot_template =
  /*$$slots*/
  ctx[4].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[6], get_default_slot_context$1);
  var block = {
    c: function create() {
      if (default_slot) default_slot.c();
    },
    l: function claim(nodes) {
      if (default_slot) default_slot.l(nodes);
    },
    m: function mount(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },
    p: function update(ctx, dirty) {
      if (default_slot && default_slot.p && dirty &
      /*$$scope, checked*/
      65) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[6], get_default_slot_context$1), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[6], dirty, get_default_slot_changes$1));
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (default_slot) default_slot.d(detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot$1.name,
    type: "slot",
    source: "(26:1) <Toggle checked=\\\"{checked}\\\" on:click=\\\"{onclick}\\\">",
    ctx: ctx
  });
  return block;
}

function create_fragment$7(ctx) {
  var span;
  var t;
  var if_block_anchor;
  var current;
  var if_block =
  /*fullscreen*/
  ctx[1] && create_if_block$5(ctx);
  var block = {
    c: function create() {
      span = element("span");
      t = space();
      if (if_block) if_block.c();
      if_block_anchor = empty();
      this.h();
    },
    l: function claim(nodes) {
      var _context;

      span = claim_element(nodes, "SPAN", {
        style: true
      });

      forEach$2(_context = children(span)).call(_context, detach_dev);

      t = claim_space(nodes);
      if (if_block) if_block.l(nodes);
      if_block_anchor = empty();
      this.h();
    },
    h: function hydrate() {
      set_style(span, "display", "none");
      add_location(span, file$5, 23, 0, 488);
    },
    m: function mount(target, anchor) {
      insert_dev(target, span, anchor);
      /*span_binding*/

      ctx[5](span);
      insert_dev(target, t, anchor);
      if (if_block) if_block.m(target, anchor);
      insert_dev(target, if_block_anchor, anchor);
      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];

      if (
      /*fullscreen*/
      ctx[1]) {
        if (if_block) {
          if_block.p(ctx, dirty);
          transition_in(if_block, 1);
        } else {
          if_block = create_if_block$5(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(span);
      /*span_binding*/

      ctx[5](null);
      if (detaching) detach_dev(t);
      if (if_block) if_block.d(detaching);
      if (detaching) detach_dev(if_block_anchor);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$7.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$7($$self, $$props, $$invalidate) {
  var _context2;

  var _$$props$checked = $$props.checked,
      checked = _$$props$checked === void 0 ? false : _$$props$checked;
  var fullscreen;

  function onclick() {
    fullscreen && fullscreen.toggle();
  }

  var elem;
  onMount(function () {
    $$invalidate(1, fullscreen = fullscreenStore(elem));
    fullscreen && fullscreen.subscribe(function (o) {
      $$invalidate(0, checked = o);
    });
  });
  onDestroy(function () {
    return fullscreen && fullscreen.destroy();
  });
  var writable_props = ["checked"];

  forEach$2(_context2 = keys$3($$props)).call(_context2, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<ToggleFullscreen> was created with unknown prop '" + key + "'");
  });

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function span_binding($$value) {
    binding_callbacks[$$value ? "unshift" : "push"](function () {
      $$invalidate(2, elem = $$value);
    });
  }

  $$self.$set = function ($$props) {
    if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {
      checked: checked,
      fullscreen: fullscreen,
      elem: elem
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("checked" in $$props) $$invalidate(0, checked = $$props.checked);
    if ("fullscreen" in $$props) $$invalidate(1, fullscreen = $$props.fullscreen);
    if ("elem" in $$props) $$invalidate(2, elem = $$props.elem);
  };

  return [checked, fullscreen, elem, onclick, $$slots, span_binding, $$scope];
}

var ToggleFullscreen =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(ToggleFullscreen, _SvelteComponentDev);

  function ToggleFullscreen(options) {
    var _this;

    _classCallCheck(this, ToggleFullscreen);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ToggleFullscreen).call(this, options));
    init(_assertThisInitialized(_this), options, instance$7, create_fragment$7, safe_not_equal, {
      checked: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "ToggleFullscreen",
      options: options,
      id: create_fragment$7.name
    });
    return _this;
  }

  _createClass(ToggleFullscreen, [{
    key: "checked",
    get: function get() {
      throw new Error("<ToggleFullscreen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<ToggleFullscreen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return ToggleFullscreen;
}(SvelteComponentDev);

var file$6 = "src\\components\\app\\Window.svelte"; // (97:12) {#if canFullscreen}

function create_if_block$6(ctx) {
  var updating_checked;
  var current;

  function togglefullscreen_checked_binding(value) {
    /*togglefullscreen_checked_binding*/
    ctx[24].call(null, value);
  }

  var togglefullscreen_props = {
    $$slots: {
      default: [create_default_slot$2, function (_ref) {
        var fullscreen = _ref.fullscreen;
        return {
          7: fullscreen
        };
      }, function (_ref2) {
        var fullscreen = _ref2.fullscreen;
        return fullscreen ? 128 : 0;
      }]
    },
    $$scope: {
      ctx: ctx
    }
  };

  if (
  /*fullscreen*/
  ctx[7] !== void 0) {
    togglefullscreen_props.checked =
    /*fullscreen*/
    ctx[7];
  }

  var togglefullscreen = new ToggleFullscreen({
    props: togglefullscreen_props,
    $$inline: true
  });
  binding_callbacks.push(function () {
    return bind$4(togglefullscreen, "checked", togglefullscreen_checked_binding);
  });
  var block = {
    c: function create() {
      create_component(togglefullscreen.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(togglefullscreen.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(togglefullscreen, target, anchor);
      current = true;
    },
    p: function update(ctx, dirty) {
      var togglefullscreen_changes = {};

      if (dirty &
      /*$$scope, fullscreen*/
      33554560) {
        togglefullscreen_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      if (!updating_checked && dirty &
      /*fullscreen*/
      128) {
        updating_checked = true;
        togglefullscreen_changes.checked =
        /*fullscreen*/
        ctx[7];
        add_flush_callback(function () {
          return updating_checked = false;
        });
      }

      togglefullscreen.$set(togglefullscreen_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(togglefullscreen.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(togglefullscreen.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(togglefullscreen, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_if_block$6.name,
    type: "if",
    source: "(97:12) {#if canFullscreen}",
    ctx: ctx
  });
  return block;
} // (98:4) <ToggleFullscreen bind:checked={fullscreen} let:fullscreen={fullscreen}>


function create_default_slot$2(ctx) {
  var div;
  var span;
  var t;
  var span_class_value;
  var div_title_value;
  var block = {
    c: function create() {
      div = element("div");
      span = element("span");
      t = text(" ");
      this.h();
    },
    l: function claim(nodes) {
      div = claim_element(nodes, "DIV", {
        class: true,
        title: true
      });
      var div_nodes = children(div);
      span = claim_element(div_nodes, "SPAN", {
        class: true
      });
      var span_nodes = children(span);
      t = claim_text(span_nodes, " ");

      forEach$2(span_nodes).call(span_nodes, detach_dev);

      forEach$2(div_nodes).call(div_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(span, "class", span_class_value = "titlebar__button__icon ghost icon-inline icon-window-fullscreen-" + (
      /*fullscreen*/
      ctx[7] ? "exit" : "enter") + " svelte-1phbjsm");
      add_location(span, file$6, 99, 6, 2479);
      attr_dev(div, "class", "titlebar__button flex svelte-1phbjsm");
      attr_dev(div, "title", div_title_value = "" + ((
      /*fullscreen*/
      ctx[7] ? "Exit" : "Enter") + " full screen (F11)"));
      add_location(div, file$6, 98, 5, 2379);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div, anchor);
      append_dev(div, span);
      append_dev(span, t);
    },
    p: function update(ctx, dirty) {
      if (dirty &
      /*fullscreen*/
      128 && span_class_value !== (span_class_value = "titlebar__button__icon ghost icon-inline icon-window-fullscreen-" + (
      /*fullscreen*/
      ctx[7] ? "exit" : "enter") + " svelte-1phbjsm")) {
        attr_dev(span, "class", span_class_value);
      }

      if (dirty &
      /*fullscreen*/
      128 && div_title_value !== (div_title_value = "" + ((
      /*fullscreen*/
      ctx[7] ? "Exit" : "Enter") + " full screen (F11)"))) {
        attr_dev(div, "title", div_title_value);
      }
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot$2.name,
    type: "slot",
    source: "(98:4) <ToggleFullscreen bind:checked={fullscreen} let:fullscreen={fullscreen}>",
    ctx: ctx
  });
  return block;
}

function create_fragment$8(ctx) {
  var div4;
  var div2;
  var div0;
  var span0;
  var t0;
  var t1;
  var div1;
  var a;
  var span1;
  var t2;
  var t3;
  var t4;
  var button0;
  var span2;
  var t5;
  var t6;
  var button1;
  var span3;
  var t7;
  var t8;
  var button2;
  var span4;
  var t9;
  var t10;
  var button3;
  var span5;
  var t11;
  var t12;
  var div3;
  var current;
  var dispose;
  var if_block =
  /*canFullscreen*/
  ctx[1] && create_if_block$6(ctx);
  var default_slot_template =
  /*$$slots*/
  ctx[23].default;
  var default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[25], null);
  var block = {
    c: function create() {
      div4 = element("div");
      div2 = element("div");
      div0 = element("div");
      span0 = element("span");
      t0 = text(
      /*title*/
      ctx[0]);
      t1 = space();
      div1 = element("div");
      a = element("a");
      span1 = element("span");
      t2 = text("</>");
      t3 = space();
      if (if_block) if_block.c();
      t4 = space();
      button0 = element("button");
      span2 = element("span");
      t5 = text(" ");
      t6 = space();
      button1 = element("button");
      span3 = element("span");
      t7 = text(" ");
      t8 = space();
      button2 = element("button");
      span4 = element("span");
      t9 = text(" ");
      t10 = space();
      button3 = element("button");
      span5 = element("span");
      t11 = text(" ");
      t12 = space();
      div3 = element("div");
      if (default_slot) default_slot.c();
      this.h();
    },
    l: function claim(nodes) {
      div4 = claim_element(nodes, "DIV", {
        class: true
      });
      var div4_nodes = children(div4);
      div2 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div2_nodes = children(div2);
      div0 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div0_nodes = children(div0);
      span0 = claim_element(div0_nodes, "SPAN", {
        class: true
      });
      var span0_nodes = children(span0);
      t0 = claim_text(span0_nodes,
      /*title*/
      ctx[0]);

      forEach$2(span0_nodes).call(span0_nodes, detach_dev);

      forEach$2(div0_nodes).call(div0_nodes, detach_dev);

      t1 = claim_space(div2_nodes);
      div1 = claim_element(div2_nodes, "DIV", {
        class: true
      });
      var div1_nodes = children(div1);
      a = claim_element(div1_nodes, "A", {
        href: true,
        class: true
      });
      var a_nodes = children(a);
      span1 = claim_element(a_nodes, "SPAN", {
        class: true
      });
      var span1_nodes = children(span1);
      t2 = claim_text(span1_nodes, "</>");

      forEach$2(span1_nodes).call(span1_nodes, detach_dev);

      forEach$2(a_nodes).call(a_nodes, detach_dev);

      t3 = claim_space(div1_nodes);
      if (if_block) if_block.l(div1_nodes);
      t4 = claim_space(div1_nodes);
      button0 = claim_element(div1_nodes, "BUTTON", {
        class: true
      });
      var button0_nodes = children(button0);
      span2 = claim_element(button0_nodes, "SPAN", {
        class: true
      });
      var span2_nodes = children(span2);
      t5 = claim_text(span2_nodes, " ");

      forEach$2(span2_nodes).call(span2_nodes, detach_dev);

      forEach$2(button0_nodes).call(button0_nodes, detach_dev);

      t6 = claim_space(div1_nodes);
      button1 = claim_element(div1_nodes, "BUTTON", {
        class: true
      });
      var button1_nodes = children(button1);
      span3 = claim_element(button1_nodes, "SPAN", {
        class: true
      });
      var span3_nodes = children(span3);
      t7 = claim_text(span3_nodes, " ");

      forEach$2(span3_nodes).call(span3_nodes, detach_dev);

      forEach$2(button1_nodes).call(button1_nodes, detach_dev);

      t8 = claim_space(div1_nodes);
      button2 = claim_element(div1_nodes, "BUTTON", {
        class: true
      });
      var button2_nodes = children(button2);
      span4 = claim_element(button2_nodes, "SPAN", {
        class: true
      });
      var span4_nodes = children(span4);
      t9 = claim_text(span4_nodes, " ");

      forEach$2(span4_nodes).call(span4_nodes, detach_dev);

      forEach$2(button2_nodes).call(button2_nodes, detach_dev);

      t10 = claim_space(div1_nodes);
      button3 = claim_element(div1_nodes, "BUTTON", {
        class: true
      });
      var button3_nodes = children(button3);
      span5 = claim_element(button3_nodes, "SPAN", {
        class: true
      });
      var span5_nodes = children(span5);
      t11 = claim_text(span5_nodes, " ");

      forEach$2(span5_nodes).call(span5_nodes, detach_dev);

      forEach$2(button3_nodes).call(button3_nodes, detach_dev);

      forEach$2(div1_nodes).call(div1_nodes, detach_dev);

      forEach$2(div2_nodes).call(div2_nodes, detach_dev);

      t12 = claim_space(div4_nodes);
      div3 = claim_element(div4_nodes, "DIV", {
        class: true
      });
      var div3_nodes = children(div3);
      if (default_slot) default_slot.l(div3_nodes);

      forEach$2(div3_nodes).call(div3_nodes, detach_dev);

      forEach$2(div4_nodes).call(div4_nodes, detach_dev);

      this.h();
    },
    h: function hydrate() {
      attr_dev(span0, "class", "text svelte-1phbjsm");
      add_location(span0, file$6, 87, 3, 1888);
      attr_dev(div0, "class", "titlebar__title flex__item--fill flex flex--align-center svelte-1phbjsm");
      add_location(div0, file$6, 86, 8, 1814);
      attr_dev(span1, "class", "text svelte-1phbjsm");
      add_location(span1, file$6, 94, 4, 2212);
      attr_dev(a, "href", "dev");
      attr_dev(a, "class", "titlebar__button button-dev flex svelte-1phbjsm");
      toggle_class(a, "collapsed", !
      /*_canDev*/
      ctx[6]);
      add_location(a, file$6, 91, 12, 2061);
      attr_dev(span2, "class", "titlebar__button__icon ghost icon-inline icon-window-minimize svelte-1phbjsm");
      add_location(span2, file$6, 104, 16, 2780);
      attr_dev(button0, "class", "titlebar__button flex svelte-1phbjsm");
      toggle_class(button0, "collapsed", !
      /*_canMinimize*/
      ctx[3]);
      add_location(button0, file$6, 103, 12, 2669);
      attr_dev(span3, "class", "titlebar__button__icon ghost icon-inline icon-window-maximize svelte-1phbjsm");
      add_location(span3, file$6, 107, 16, 3042);
      attr_dev(button1, "class", "titlebar__button flex svelte-1phbjsm");
      toggle_class(button1, "collapsed",
      /*fullscreen*/
      ctx[7] || !
      /*_canMaximize*/
      ctx[4] ||
      /*maximized*/
      ctx[2]);
      add_location(button1, file$6, 106, 12, 2904);
      attr_dev(span4, "class", "titlebar__button__icon ghost icon-inline icon-window-restore svelte-1phbjsm");
      add_location(span4, file$6, 110, 16, 3304);
      attr_dev(button2, "class", "titlebar__button flex svelte-1phbjsm");
      toggle_class(button2, "collapsed",
      /*fullscreen*/
      ctx[7] || !
      /*_canMaximize*/
      ctx[4] || !
      /*maximized*/
      ctx[2]);
      add_location(button2, file$6, 109, 12, 3166);
      attr_dev(span5, "class", "titlebar__button__icon ghost icon-inline icon-window-close svelte-1phbjsm");
      add_location(span5, file$6, 113, 16, 3532);
      attr_dev(button3, "class", "titlebar__button flex svelte-1phbjsm");
      toggle_class(button3, "collapsed", !
      /*_canClose*/
      ctx[5]);
      add_location(button3, file$6, 112, 12, 3427);
      attr_dev(div1, "class", "titlebar__buttons flex__item--fit flex svelte-1phbjsm");
      add_location(div1, file$6, 89, 8, 1945);
      attr_dev(div2, "class", "window__titlebar titlebar flex svelte-1phbjsm");
      add_location(div2, file$6, 85, 4, 1761);
      attr_dev(div3, "class", "window__content flex__item--fill flex svelte-1phbjsm");
      add_location(div3, file$6, 117, 4, 3671);
      attr_dev(div4, "class", "window flex__item--fit flex flex--vertical fill svelte-1phbjsm");
      add_location(div4, file$6, 84, 0, 1695);
    },
    m: function mount(target, anchor) {
      insert_dev(target, div4, anchor);
      append_dev(div4, div2);
      append_dev(div2, div0);
      append_dev(div0, span0);
      append_dev(span0, t0);
      append_dev(div2, t1);
      append_dev(div2, div1);
      append_dev(div1, a);
      append_dev(a, span1);
      append_dev(span1, t2);
      append_dev(div1, t3);
      if (if_block) if_block.m(div1, null);
      append_dev(div1, t4);
      append_dev(div1, button0);
      append_dev(button0, span2);
      append_dev(span2, t5);
      append_dev(div1, t6);
      append_dev(div1, button1);
      append_dev(button1, span3);
      append_dev(span3, t7);
      append_dev(div1, t8);
      append_dev(div1, button2);
      append_dev(button2, span4);
      append_dev(span4, t9);
      append_dev(div1, t10);
      append_dev(div1, button3);
      append_dev(button3, span5);
      append_dev(span5, t11);
      append_dev(div4, t12);
      append_dev(div4, div3);

      if (default_slot) {
        default_slot.m(div3, null);
      }

      current = true;
      dispose = [listen_dev(a, "click", prevent_default(
      /*showDev*/
      ctx[8]), false, true, false), listen_dev(button0, "click",
      /*minimize*/
      ctx[9], false, false, false), listen_dev(button1, "click",
      /*maximize*/
      ctx[10], false, false, false), listen_dev(button2, "click",
      /*restore*/
      ctx[11], false, false, false), listen_dev(button3, "click",
      /*close*/
      ctx[12], false, false, false)];
    },
    p: function update(ctx, _ref3) {
      var dirty = _ref3[0];
      if (!current || dirty &
      /*title*/
      1) set_data_dev(t0,
      /*title*/
      ctx[0]);

      if (dirty &
      /*_canDev*/
      64) {
        toggle_class(a, "collapsed", !
        /*_canDev*/
        ctx[6]);
      }

      if (
      /*canFullscreen*/
      ctx[1]) {
        if (if_block) {
          if_block.p(ctx, dirty);
          transition_in(if_block, 1);
        } else {
          if_block = create_if_block$6(ctx);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(div1, t4);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, function () {
          if_block = null;
        });
        check_outros();
      }

      if (dirty &
      /*_canMinimize*/
      8) {
        toggle_class(button0, "collapsed", !
        /*_canMinimize*/
        ctx[3]);
      }

      if (dirty &
      /*fullscreen, _canMaximize, maximized*/
      148) {
        toggle_class(button1, "collapsed",
        /*fullscreen*/
        ctx[7] || !
        /*_canMaximize*/
        ctx[4] ||
        /*maximized*/
        ctx[2]);
      }

      if (dirty &
      /*fullscreen, _canMaximize, maximized*/
      148) {
        toggle_class(button2, "collapsed",
        /*fullscreen*/
        ctx[7] || !
        /*_canMaximize*/
        ctx[4] || !
        /*maximized*/
        ctx[2]);
      }

      if (dirty &
      /*_canClose*/
      32) {
        toggle_class(button3, "collapsed", !
        /*_canClose*/
        ctx[5]);
      }

      if (default_slot && default_slot.p && dirty &
      /*$$scope*/
      33554432) {
        default_slot.p(get_slot_context(default_slot_template, ctx,
        /*$$scope*/
        ctx[25], null), get_slot_changes(default_slot_template,
        /*$$scope*/
        ctx[25], dirty, null));
      }
    },
    i: function intro(local) {
      if (current) return;
      transition_in(if_block);
      transition_in(default_slot, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(if_block);
      transition_out(default_slot, local);
      current = false;
    },
    d: function destroy(detaching) {
      if (detaching) detach_dev(div4);
      if (if_block) if_block.d();
      if (default_slot) default_slot.d(detaching);
      run_all(dispose);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$8.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$8($$self, $$props, $$invalidate) {
  var _context;

  var pageStore = stores$1();
  var page = pageStore && pageStore.page;
  var _$$props$win = $$props.win,
      win = _$$props$win === void 0 ? null : _$$props$win;
  var _$$props$title = $$props.title,
      title = _$$props$title === void 0 ? "App" : _$$props$title;
  var _$$props$canMinimize = $$props.canMinimize,
      canMinimize = _$$props$canMinimize === void 0 ? true : _$$props$canMinimize;
  var _$$props$canMaximize = $$props.canMaximize,
      canMaximize = _$$props$canMaximize === void 0 ? true : _$$props$canMaximize;
  var _$$props$canFullscree = $$props.canFullscreen,
      canFullscreen = _$$props$canFullscree === void 0 ? true : _$$props$canFullscree;
  var _$$props$canClose = $$props.canClose,
      canClose = _$$props$canClose === void 0 ? true : _$$props$canClose;
  var _$$props$canDev = $$props.canDev,
      canDev = _$$props$canDev === void 0 ? !!page : _$$props$canDev;
  var _$$props$minimizeInst = $$props.minimizeInsteadClose,
      minimizeInsteadClose = _$$props$minimizeInst === void 0 ? false : _$$props$minimizeInst;
  var _$$props$openWebrainW = $$props.openWebrainWindow,
      openWebrainWindow = _$$props$openWebrainW === void 0 ? null : _$$props$openWebrainW;
  var maximized = false;
  var fullscreen = false;

  var _canMinimize;

  var _canMaximize;

  var _canClose;

  var _canDev;

  onMount(function () {
    if (!win) {
      $$invalidate(13, win = window);
    }
  });

  function showDev() {
    if (_canDev) {
      var path = get_store_value(page).path;

      if (startsWith$2(path).call(path, "/dev/")) {
        goto("");
      } else {
        //console.log('path = ', path)
        goto("dev");
      }
    }
  }

  function _showWebrain() {
    if (_canDev && openWebrainWindow) {
      openWebrainWindow();
    }
  } //see: https://stackoverflow.com/a/31174463/5221762


  function minimize() {
    win.minimize();
  }

  function maximize() {
    win.maximize();
    $$invalidate(2, maximized = true);
  }

  function restore() {
    win.restore();
    $$invalidate(2, maximized = false);
  }

  function close() {
    if (minimizeInsteadClose) {
      minimize();
    } else {
      win.close();
    }
  }

  var writable_props = ["win", "title", "canMinimize", "canMaximize", "canFullscreen", "canClose", "canDev", "minimizeInsteadClose", "openWebrainWindow"];

  forEach$2(_context = keys$3($$props)).call(_context, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<Window> was created with unknown prop '" + key + "'");
  });

  var _$$props$$$slots = $$props.$$slots,
      $$slots = _$$props$$$slots === void 0 ? {} : _$$props$$$slots,
      $$scope = $$props.$$scope;

  function togglefullscreen_checked_binding(value) {
    fullscreen = value;
    $$invalidate(7, fullscreen);
  }

  $$self.$set = function ($$props) {
    if ("win" in $$props) $$invalidate(13, win = $$props.win);
    if ("title" in $$props) $$invalidate(0, title = $$props.title);
    if ("canMinimize" in $$props) $$invalidate(14, canMinimize = $$props.canMinimize);
    if ("canMaximize" in $$props) $$invalidate(15, canMaximize = $$props.canMaximize);
    if ("canFullscreen" in $$props) $$invalidate(1, canFullscreen = $$props.canFullscreen);
    if ("canClose" in $$props) $$invalidate(16, canClose = $$props.canClose);
    if ("canDev" in $$props) $$invalidate(17, canDev = $$props.canDev);
    if ("minimizeInsteadClose" in $$props) $$invalidate(18, minimizeInsteadClose = $$props.minimizeInsteadClose);
    if ("openWebrainWindow" in $$props) $$invalidate(19, openWebrainWindow = $$props.openWebrainWindow);
    if ("$$scope" in $$props) $$invalidate(25, $$scope = $$props.$$scope);
  };

  $$self.$capture_state = function () {
    return {
      win: win,
      title: title,
      canMinimize: canMinimize,
      canMaximize: canMaximize,
      canFullscreen: canFullscreen,
      canClose: canClose,
      canDev: canDev,
      minimizeInsteadClose: minimizeInsteadClose,
      openWebrainWindow: openWebrainWindow,
      maximized: maximized,
      fullscreen: fullscreen,
      _canMinimize: _canMinimize,
      _canMaximize: _canMaximize,
      _canClose: _canClose,
      _canDev: _canDev
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("win" in $$props) $$invalidate(13, win = $$props.win);
    if ("title" in $$props) $$invalidate(0, title = $$props.title);
    if ("canMinimize" in $$props) $$invalidate(14, canMinimize = $$props.canMinimize);
    if ("canMaximize" in $$props) $$invalidate(15, canMaximize = $$props.canMaximize);
    if ("canFullscreen" in $$props) $$invalidate(1, canFullscreen = $$props.canFullscreen);
    if ("canClose" in $$props) $$invalidate(16, canClose = $$props.canClose);
    if ("canDev" in $$props) $$invalidate(17, canDev = $$props.canDev);
    if ("minimizeInsteadClose" in $$props) $$invalidate(18, minimizeInsteadClose = $$props.minimizeInsteadClose);
    if ("openWebrainWindow" in $$props) $$invalidate(19, openWebrainWindow = $$props.openWebrainWindow);
    if ("maximized" in $$props) $$invalidate(2, maximized = $$props.maximized);
    if ("fullscreen" in $$props) $$invalidate(7, fullscreen = $$props.fullscreen);
    if ("_canMinimize" in $$props) $$invalidate(3, _canMinimize = $$props._canMinimize);
    if ("_canMaximize" in $$props) $$invalidate(4, _canMaximize = $$props._canMaximize);
    if ("_canClose" in $$props) $$invalidate(5, _canClose = $$props._canClose);
    if ("_canDev" in $$props) $$invalidate(6, _canDev = $$props._canDev);
  };

  $$self.$$.update = function () {
    if ($$self.$$.dirty &
    /*canMinimize, win*/
    24576) {
       $$invalidate(3, _canMinimize = canMinimize && win && !!win.minimize);
    }

    if ($$self.$$.dirty &
    /*canMaximize, win*/
    40960) {
       $$invalidate(4, _canMaximize = canMaximize && win && !!win.maximize && !!win.restore);
    }

    if ($$self.$$.dirty &
    /*canClose, win*/
    73728) {
       $$invalidate(5, _canClose = canClose && win && !!win.close);
    }

    if ($$self.$$.dirty &
    /*canMinimize, win*/
    24576) {
       $$invalidate(3, _canMinimize = canMinimize && win && !!win.minimize);
    }

    if ($$self.$$.dirty &
    /*canDev*/
    131072) {
       $$invalidate(6, _canDev = canDev && dev.dev);
    }
  };

  return [title, canFullscreen, maximized, _canMinimize, _canMaximize, _canClose, _canDev, fullscreen, showDev, minimize, maximize, restore, close, win, canMinimize, canMaximize, canClose, canDev, minimizeInsteadClose, openWebrainWindow, pageStore, page, _showWebrain, $$slots, togglefullscreen_checked_binding, $$scope];
}

var Window =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(Window, _SvelteComponentDev);

  function Window(options) {
    var _this;

    _classCallCheck(this, Window);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Window).call(this, options));
    init(_assertThisInitialized(_this), options, instance$8, create_fragment$8, safe_not_equal, {
      win: 13,
      title: 0,
      canMinimize: 14,
      canMaximize: 15,
      canFullscreen: 1,
      canClose: 16,
      canDev: 17,
      minimizeInsteadClose: 18,
      openWebrainWindow: 19
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "Window",
      options: options,
      id: create_fragment$8.name
    });
    return _this;
  }

  _createClass(Window, [{
    key: "win",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "title",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "canMinimize",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "canMaximize",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "canFullscreen",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "canClose",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "canDev",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "minimizeInsteadClose",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }, {
    key: "openWebrainWindow",
    get: function get() {
      throw new Error("<Window>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<Window>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return Window;
}(SvelteComponentDev);

function create_default_slot$3(ctx) {
  var current;
  var webrain = new Webrain({
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(webrain.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(webrain.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(webrain, target, anchor);
      current = true;
    },
    i: function intro(local) {
      if (current) return;
      transition_in(webrain.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(webrain.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(webrain, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_default_slot$3.name,
    type: "slot",
    source: "(8:0) <Window title=\\\"Webrain\\\" canDev={false} {win}>",
    ctx: ctx
  });
  return block;
}

function create_fragment$9(ctx) {
  var current;
  var window = new Window({
    props: {
      title: "Webrain",
      canDev: false,
      win:
      /*win*/
      ctx[0],
      $$slots: {
        default: [create_default_slot$3]
      },
      $$scope: {
        ctx: ctx
      }
    },
    $$inline: true
  });
  var block = {
    c: function create() {
      create_component(window.$$.fragment);
    },
    l: function claim(nodes) {
      claim_component(window.$$.fragment, nodes);
    },
    m: function mount(target, anchor) {
      mount_component(window, target, anchor);
      current = true;
    },
    p: function update(ctx, _ref) {
      var dirty = _ref[0];
      var window_changes = {};
      if (dirty &
      /*win*/
      1) window_changes.win =
      /*win*/
      ctx[0];

      if (dirty &
      /*$$scope*/
      2) {
        window_changes.$$scope = {
          dirty: dirty,
          ctx: ctx
        };
      }

      window.$set(window_changes);
    },
    i: function intro(local) {
      if (current) return;
      transition_in(window.$$.fragment, local);
      current = true;
    },
    o: function outro(local) {
      transition_out(window.$$.fragment, local);
      current = false;
    },
    d: function destroy(detaching) {
      destroy_component(window, detaching);
    }
  };
  dispatch_dev("SvelteRegisterBlock", {
    block: block,
    id: create_fragment$9.name,
    type: "component",
    source: "",
    ctx: ctx
  });
  return block;
}

function instance$9($$self, $$props, $$invalidate) {
  var _context;

  var win = $$props.win;
  var writable_props = ["win"];

  forEach$2(_context = keys$3($$props)).call(_context, function (key) {
    if (!~indexOf$5(writable_props).call(writable_props, key) && slice$3(key).call(key, 0, 2) !== "$$") console.warn("<WebrainWindow> was created with unknown prop '" + key + "'");
  });

  $$self.$set = function ($$props) {
    if ("win" in $$props) $$invalidate(0, win = $$props.win);
  };

  $$self.$capture_state = function () {
    return {
      win: win
    };
  };

  $$self.$inject_state = function ($$props) {
    if ("win" in $$props) $$invalidate(0, win = $$props.win);
  };

  return [win];
}

var WebrainWindow =
/*#__PURE__*/
function (_SvelteComponentDev) {
  _inherits(WebrainWindow, _SvelteComponentDev);

  function WebrainWindow(options) {
    var _this;

    _classCallCheck(this, WebrainWindow);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(WebrainWindow).call(this, options));
    init(_assertThisInitialized(_this), options, instance$9, create_fragment$9, safe_not_equal, {
      win: 0
    });
    dispatch_dev("SvelteRegisterComponent", {
      component: _assertThisInitialized(_this),
      tagName: "WebrainWindow",
      options: options,
      id: create_fragment$9.name
    });
    var ctx = _this.$$.ctx;
    var props = options.props || {};

    if (
    /*win*/
    ctx[0] === undefined && !("win" in props)) {
      console.warn("<WebrainWindow> was created without expected prop 'win'");
    }

    return _this;
  }

  _createClass(WebrainWindow, [{
    key: "win",
    get: function get() {
      throw new Error("<WebrainWindow>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    },
    set: function set(value) {
      throw new Error("<WebrainWindow>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    }
  }]);

  return WebrainWindow;
}(SvelteComponentDev);

var webrainWindow = new ComponentWindow({
  windowControllerFactory: new WindowControllerFactory({
    windowName: 'Webrain'
  }),
  componentClass: WebrainWindow
});
function openWebrainWindow() {
  return _openWebrainWindow.apply(this, arguments);
}

function _openWebrainWindow() {
  _openWebrainWindow = _asyncToGenerator(
  /*#__PURE__*/
  regenerator.mark(function _callee() {
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            webrainWindow.windowController.show();

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _openWebrainWindow.apply(this, arguments);
}

var MainWindow =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(MainWindow, _ObservableClass);

  function MainWindow() {
    _classCallCheck(this, MainWindow);

    return _possibleConstructorReturn(this, _getPrototypeOf(MainWindow).apply(this, arguments));
  }

  _createClass(MainWindow, [{
    key: "show",
    // public readonly brain: IBrain
    //
    // constructor(brain: IBrain) {
    // 	super()
    // 	this.brain = brain
    // }
    // region methods
    value: function show() {
      var windowController = resolvePath(this)(function (o) {
        return o.windowController;
      })();

      if (windowController) {
        windowController.show();
      }
    }
  }, {
    key: "minimize",
    value: function minimize() {
      var windowController = resolvePath(this)(function (o) {
        return o.windowController;
      })();

      if (windowController) {
        windowController.minimize();
      }
    } // endregion
    // region writable
    // endregion

  }]);

  return MainWindow;
}(ObservableClass);
new CalcObjectBuilder(MainWindow.prototype).writable('win').calc('windowController', connectorFactory({
  buildRule: function buildRule(c) {
    return c.connect('win', function (b) {
      return b.p('win');
    });
  }
}), calcPropertyFactory({
  dependencies: function dependencies(d) {
    return d.invalidateOn(function (b) {
      return b.propertyAny();
    });
  },
  calcFunc: function calcFunc(state) {
    state.value = getWindowController(state.input.win);
  }
})).calcConnect('isVisible', function (b) {
  return b.p('windowController').p('isVisible');
}).calcConnect('isFocused', function (b) {
  return b.p('windowController').p('isFocused');
}); // .calc('lostFocusDate',
// 	connectorFactory({
// 		buildRule: c => c
// 			.connect('isFocused', b => b.p('isFocused')),
// 	}),
// 	calcPropertyFactory({
// 		dependencies: d => d.invalidateOn(b => b.propertyAny()),
// 		calcFunc(state) {
// 			if (state.input.isFocused) {
// 				state.value = null
// 			} else {
// 				if (!state.value) {
// 					state.value = new Date()
// 				}
// 			}
// 		},
// 	}),
// )

var Brain =
/*#__PURE__*/
function (_ObservableClass) {
  _inherits(Brain, _ObservableClass);

  function Brain() {
    _classCallCheck(this, Brain);

    return _possibleConstructorReturn(this, _getPrototypeOf(Brain).apply(this, arguments));
  }

  _createClass(Brain, [{
    key: "serialize",
    // region readable
    // endregion
    // region writable
    // endregion
    // region calculable
    // endregion
    // region ISerializable
    value: function serialize(_serialize) {
      return {// auth: serialize(this.auth, { objectKeepUndefined: false }),
      };
    }
  }, {
    key: "deSerialize",
    value: function deSerialize(_deSerialize, serializedValue) {} // deSerialize(serializedValue.auth, null, {
    // 	valueFactory: () => this.auth,
    // })
    // endregion

  }]);

  return Brain;
}(ObservableClass);
Brain.uuid = '17a06236d0804f5eaf55dcad8e9a0628';
registerSerializable(Brain);
new CalcObjectBuilder(Brain.prototype).readable('mainWindow', {
  factory: function factory() {
    return new MainWindow();
  }
});

var brain = new Brain();

_asyncToGenerator(
/*#__PURE__*/
regenerator.mark(function _callee() {
  return regenerator.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // await storeObject(
          // 	`Brain-${appConfig.type}-84495d93da914ecc8f9de2bffa9f3df5`,
          // 	brain,
          // 	b => b.p('auth').p('currentCredentials'),
          // )
          console.log('config type: ', dev.type); // if (typeof window !== 'undefined') {
          // 	await brain.auth.login()
          // }

        case 1:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();

/* eslint-env browser */
var appWindow;
var appOrigin;
window.addEventListener('message', function (e) {
  if (e.data === 'init') {
    appWindow = e.source;
    appOrigin = e.origin;
    console.log("appWindow subscribed: " + appOrigin);
  }
});
webrainGraph.init();
start({
  target: document.querySelector('#sapper')
});
createWindowController({
  windowName: 'Main',
  storeWindowState: true,
  win: window
});
brain.mainWindow.win = window;

if (window.tray) {
  window.tray.subscribe('click', function (e) {
    if (e.id === 'icon') {
      brain.mainWindow.show();
    }
  });
}

if (dev.dev) {
  window.addEventListener('keydown', function (e) {
    if (e.key === 'F10') {
      openWebrainWindow();
    }
  });
}

if (!window.minimize) {
  window.minimize = function () {
    if (appWindow) {
      appWindow.postMessage('minimize', appOrigin);
      return true;
    }

    return false;
  };
} // Prevent to close window:
// if (window.minimize) {
// 	window.onbeforeunload = function () {
// 		return window.minimize() !== false || void 0
// 	}
// }

export { destroy_each as $, transition_in as A, transition_out as B, destroy_component as C, text as D, space as E, claim_text as F, claim_space as G, append_dev as H, get_slot_context as I, get_slot_changes as J, null_to_empty as K, some$2 as L, bind$6 as M, onMount as N, onDestroy as O, binding_callbacks as P, set_style as Q, query_selector_all as R, SvelteComponentDev as S, entries$5 as T, stores$1 as U, toggle_class as V, Window as W, set_data_dev as X, group_outros as Y, check_outros as Z, _inherits as _, _classCallCheck as a, isArray$3 as a0, getIterator$1 as a1, sort$2 as a2, listen_dev as a3, stringify$2 as a4, filter$2 as a5, map$2 as a6, from_1$2 as a7, trim$2 as a8, promise$3 as a9, _asyncToGenerator as aa, regenerator as ab, concat$2 as ac, url$2 as ad, empty as ae, Webrain as af, TestView as ag, path as ah, global_1 as ai, _export as aj, svg_element as ak, _possibleConstructorReturn as b, _getPrototypeOf as c, _assertThisInitialized as d, dispatch_dev as e, _createClass as f, dev as g, forEach$2 as h, init as i, keys$3 as j, indexOf$5 as k, slice$3 as l, create_slot as m, noop as n, openWebrainWindow as o, element as p, create_component as q, claim_element as r, safe_not_equal as s, children as t, claim_component as u, detach_dev as v, attr_dev as w, add_location as x, insert_dev as y, mount_component as z };
