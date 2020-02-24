(function () {
  'use strict';

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToInteger` abstract operation
  // https://tc39.github.io/ecma262/#sec-tointeger
  var toInteger = function (argument) {
    return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
  };

  // `RequireObjectCoercible` abstract operation
  // https://tc39.github.io/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // `String.prototype.{ codePointAt, at }` methods implementation
  var createMethod = function (CONVERT_TO_STRING) {
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
    codeAt: createMethod(false),
    // `String.prototype.at` method
    // https://github.com/mathiasbynens/String.prototype.at
    charAt: createMethod(true)
  };

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function getCjsExportFromNamespace (n) {
  	return n && n['default'] || n;
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

  var isObject = function (it) {
    return typeof it === 'object' ? it !== null : typeof it === 'function';
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

  var anObject = function (it) {
    if (!isObject(it)) {
      throw TypeError(String(it) + ' is not an object');
    } return it;
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

  var nativeDefineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
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

  var createNonEnumerableProperty = descriptors ? function (object, key, value) {
    return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

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

  var hasOwnProperty = {}.hasOwnProperty;

  var has = function (it, key) {
    return hasOwnProperty.call(it, key);
  };

  var isPure = true;

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

  var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
  var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
  var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor(this, V);
    return !!descriptor && descriptor.enumerable;
  } : nativePropertyIsEnumerable;

  var objectPropertyIsEnumerable = {
  	f: f$1
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

  // toObject with fallback for non-array-like ES3 strings



  var toIndexedObject = function (it) {
    return indexedObject(requireObjectCoercible(it));
  };

  var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
  var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject(O);
    P = toPrimitive(P, true);
    if (ie8DomDefine) try {
      return nativeGetOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
  };

  var objectGetOwnPropertyDescriptor = {
  	f: f$2
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

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.github.io/ecma262/#sec-tolength
  var toLength = function (argument) {
    return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex = function (index, length) {
    var integer = toInteger(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod$1 = function (IS_INCLUDES) {
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
    includes: createMethod$1(true),
    // `Array.prototype.indexOf` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod$1(false)
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

  var aFunction$1 = function (variable) {
    return typeof variable == 'function' ? variable : undefined;
  };

  var getBuiltIn = function (namespace, method) {
    return arguments.length < 2 ? aFunction$1(path[namespace]) || aFunction$1(global_1[namespace])
      : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
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

  var defineProperty = objectDefineProperty.f;





  var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');

  var setToStringTag = function (it, TAG, STATIC, SET_METHOD) {
    if (it) {
      var target = STATIC ? it : it.prototype;
      if (!has(target, TO_STRING_TAG$2)) {
        defineProperty(target, TO_STRING_TAG$2, { configurable: true, value: TAG });
      }
      if (SET_METHOD && !toStringTagSupport) {
        createNonEnumerableProperty(target, 'toString', objectToString);
      }
    }
  };

  var iterators = {};

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

  var charAt = stringMultibyte.charAt;



  var STRING_ITERATOR = 'String Iterator';
  var setInternalState = internalState.set;
  var getInternalState = internalState.getterFor(STRING_ITERATOR);

  // `String.prototype[@@iterator]` method
  // https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
  defineIterator(String, 'String', function (iterated) {
    setInternalState(this, {
      type: STRING_ITERATOR,
      string: String(iterated),
      index: 0
    });
  // `%StringIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
  }, function next() {
    var state = getInternalState(this);
    var string = state.string;
    var index = state.index;
    var point;
    if (index >= string.length) return { value: undefined, done: true };
    point = charAt(string, index);
    state.index += point.length;
    return { value: point, done: false };
  });

  var ITERATOR$2 = wellKnownSymbol('iterator');

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
      || !searchParams[ITERATOR$2]
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

  var anInstance = function (it, Constructor, name) {
    if (!(it instanceof Constructor)) {
      throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
    } return it;
  };

  var f$3 = Object.getOwnPropertySymbols;

  var objectGetOwnPropertySymbols = {
  	f: f$3
  };

  var nativeAssign = Object.assign;
  var defineProperty$1 = Object.defineProperty;

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  var objectAssign = !nativeAssign || fails(function () {
    // should have correct order of operations (Edge bug)
    if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$1({}, 'a', {
      enumerable: true,
      get: function () {
        defineProperty$1(this, 'b', {
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

  var ITERATOR$3 = wellKnownSymbol('iterator');
  var ArrayPrototype = Array.prototype;

  // check on default Array iterator
  var isArrayIteratorMethod = function (it) {
    return it !== undefined && (iterators.Array === it || ArrayPrototype[ITERATOR$3] === it);
  };

  var createProperty = function (object, key, value) {
    var propertyKey = toPrimitive(key);
    if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
    else object[propertyKey] = value;
  };

  var ITERATOR$4 = wellKnownSymbol('iterator');

  var getIteratorMethod = function (it) {
    if (it != undefined) return it[ITERATOR$4]
      || it['@@iterator']
      || iterators[classof(it)];
  };

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

  var ARRAY_ITERATOR = 'Array Iterator';
  var setInternalState$1 = internalState.set;
  var getInternalState$1 = internalState.getterFor(ARRAY_ITERATOR);

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
    setInternalState$1(this, {
      type: ARRAY_ITERATOR,
      target: toIndexedObject(iterated), // target
      index: 0,                          // next index
      kind: kind                         // kind
    });
  // `%ArrayIteratorPrototype%.next` method
  // https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
  }, function () {
    var state = getInternalState$1(this);
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

  var redefineAll = function (target, src, options) {
    for (var key in src) {
      if (options && options.unsafe && target[key]) target[key] = src[key];
      else redefine(target, key, src[key], options);
    } return target;
  };

  var getIterator = function (it) {
    var iteratorMethod = getIteratorMethod(it);
    if (typeof iteratorMethod != 'function') {
      throw TypeError(String(it) + ' is not iterable');
    } return anObject(iteratorMethod.call(it));
  };

  // TODO: in core-js@4, move /modules/ dependencies to public entries for better optimization by tools like `preset-env`





















  var $fetch = getBuiltIn('fetch');
  var Headers = getBuiltIn('Headers');
  var ITERATOR$5 = wellKnownSymbol('iterator');
  var URL_SEARCH_PARAMS = 'URLSearchParams';
  var URL_SEARCH_PARAMS_ITERATOR = URL_SEARCH_PARAMS + 'Iterator';
  var setInternalState$2 = internalState.set;
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
    setInternalState$2(this, {
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

    setInternalState$2(that, {
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
  redefine(URLSearchParamsPrototype, ITERATOR$5, URLSearchParamsPrototype.entries);

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
  if (!nativeUrl && typeof $fetch == 'function' && typeof Headers == 'function') {
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
        } return $fetch.apply(this, args);
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
  var setInternalState$3 = internalState.set;
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
    var state = setInternalState$3(that, { type: 'URL' });
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

  // empty

  var web_url_toJson = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

  getCjsExportFromNamespace(web_url_toJson);

  // `IsArray` abstract operation
  // https://tc39.github.io/ecma262/#sec-isarray
  var isArray = Array.isArray || function isArray(arg) {
    return classofRaw(arg) == 'Array';
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

  var SPECIES = wellKnownSymbol('species');

  var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
    // We can't use this feature detection in V8 since it causes
    // deoptimization and serious performance degradation
    // https://github.com/zloirock/core-js/issues/677
    return engineV8Version >= 51 || !fails(function () {
      var array = [];
      var constructor = array.constructor = {};
      constructor[SPECIES] = function () {
        return { foo: 1 };
      };
      return array[METHOD_NAME](Boolean).foo !== 1;
    });
  };

  var defineProperty$2 = Object.defineProperty;
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

      if (ACCESSORS) defineProperty$2(O, 1, { enumerable: true, get: thrower });
      else O[1] = 1;

      method.call(O, argument0, argument1);
    });
  };

  var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');
  var USES_TO_LENGTH = arrayMethodUsesToLength('slice', { ACCESSORS: true, 0: 0, 1: 2 });

  var SPECIES$1 = wellKnownSymbol('species');
  var nativeSlice = [].slice;
  var max$1 = Math.max;

  // `Array.prototype.slice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.slice
  // fallback for not array-like ES3 strings and DOM objects
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
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
          Constructor = Constructor[SPECIES$1];
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

  var entryVirtual = function (CONSTRUCTOR) {
    return path[CONSTRUCTOR + 'Prototype'];
  };

  var slice = entryVirtual('Array').slice;

  var ArrayPrototype$1 = Array.prototype;

  var slice_1 = function (it) {
    var own = it.slice;
    return it === ArrayPrototype$1 || (it instanceof Array && own === ArrayPrototype$1.slice) ? slice : own;
  };

  var slice$1 = slice_1;

  var slice$2 = slice$1;

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

  var ArrayPrototype$2 = Array.prototype;

  var reverse_1 = function (it) {
    var own = it.reverse;
    return it === ArrayPrototype$2 || (it instanceof Array && own === ArrayPrototype$2.reverse) ? reverse : own;
  };

  var reverse$1 = reverse_1;

  var reverse$2 = reverse$1;

  // empty

  var es_object_toString = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

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

  var nativePromiseConstructor = global_1.Promise;

  var SPECIES$2 = wellKnownSymbol('species');

  var setSpecies = function (CONSTRUCTOR_NAME) {
    var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
    var defineProperty = objectDefineProperty.f;

    if (descriptors && Constructor && !Constructor[SPECIES$2]) {
      defineProperty(Constructor, SPECIES$2, {
        configurable: true,
        get: function () { return this; }
      });
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

  var ITERATOR$6 = wellKnownSymbol('iterator');
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
    iteratorWithReturn[ITERATOR$6] = function () {
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
      object[ITERATOR$6] = function () {
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

  var SPECIES$3 = wellKnownSymbol('species');

  // `SpeciesConstructor` abstract operation
  // https://tc39.github.io/ecma262/#sec-speciesconstructor
  var speciesConstructor = function (O, defaultConstructor) {
    var C = anObject(O).constructor;
    var S;
    return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction(S);
  };

  var engineIsIos = /(iphone|ipod|ipad).*applewebkit/i.test(engineUserAgent);

  var location = global_1.location;
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
    global_1.postMessage(id + '', location.protocol + '//' + location.host);
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
  var f$4 = function (C) {
    return new PromiseCapability(C);
  };

  var newPromiseCapability = {
  	f: f$4
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










  var SPECIES$4 = wellKnownSymbol('species');
  var PROMISE = 'Promise';
  var getInternalState$2 = internalState.get;
  var setInternalState$4 = internalState.set;
  var getInternalPromiseState = internalState.getterFor(PROMISE);
  var PromiseConstructor = nativePromiseConstructor;
  var TypeError$1 = global_1.TypeError;
  var document$2 = global_1.document;
  var process$4 = global_1.process;
  var $fetch$1 = getBuiltIn('fetch');
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

  var FORCED = isForced_1(PROMISE, function () {
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
    constructor[SPECIES$4] = FakePromise;
    return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
  });

  var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
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
  if (FORCED) {
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
      setInternalState$4(this, {
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

  _export({ global: true, wrap: true, forced: FORCED }, {
    Promise: PromiseConstructor
  });

  setToStringTag(PromiseConstructor, PROMISE, false, true);
  setSpecies(PROMISE);

  PromiseWrapper = getBuiltIn(PROMISE);

  // statics
  _export({ target: PROMISE, stat: true, forced: FORCED }, {
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

  getCjsExportFromNamespace(es_object_toString);

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

  var SPECIES$5 = wellKnownSymbol('species');

  // `ArraySpeciesCreate` abstract operation
  // https://tc39.github.io/ecma262/#sec-arrayspeciescreate
  var arraySpeciesCreate = function (originalArray, length) {
    var C;
    if (isArray(originalArray)) {
      C = originalArray.constructor;
      // cross-realm fallback
      if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
      else if (isObject(C)) {
        C = C[SPECIES$5];
        if (C === null) C = undefined;
      }
    } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
  };

  var push = [].push;

  // `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
  var createMethod$2 = function (TYPE) {
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
    forEach: createMethod$2(0),
    // `Array.prototype.map` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.map
    map: createMethod$2(1),
    // `Array.prototype.filter` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.filter
    filter: createMethod$2(2),
    // `Array.prototype.some` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.some
    some: createMethod$2(3),
    // `Array.prototype.every` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.every
    every: createMethod$2(4),
    // `Array.prototype.find` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.find
    find: createMethod$2(5),
    // `Array.prototype.findIndex` method
    // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
    findIndex: createMethod$2(6)
  };

  var arrayMethodIsStrict = function (METHOD_NAME, argument) {
    var method = [][METHOD_NAME];
    return !!method && fails(function () {
      // eslint-disable-next-line no-useless-call,no-throw-literal
      method.call(null, argument || function () { throw 1; }, 1);
    });
  };

  var $forEach = arrayIteration.forEach;



  var STRICT_METHOD = arrayMethodIsStrict('forEach');
  var USES_TO_LENGTH$1 = arrayMethodUsesToLength('forEach');

  // `Array.prototype.forEach` method implementation
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH$1) ? function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  } : [].forEach;

  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  _export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
    forEach: arrayForEach
  });

  var forEach = entryVirtual('Array').forEach;

  var forEach$1 = forEach;

  var ArrayPrototype$3 = Array.prototype;

  var DOMIterables = {
    DOMTokenList: true,
    NodeList: true
  };

  var forEach_1 = function (it) {
    var own = it.forEach;
    return it === ArrayPrototype$3 || (it instanceof Array && own === ArrayPrototype$3.forEach)
      // eslint-disable-next-line no-prototype-builtins
      || DOMIterables.hasOwnProperty(classof(it)) ? forEach$1 : own;
  };

  var forEach$2 = forEach_1;

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

  var FORCED$1 = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

  // `Array.prototype.concat` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.concat
  // with adding support of @@isConcatSpreadable and @@species
  _export({ target: 'Array', proto: true, forced: FORCED$1 }, {
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
  var f$5 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return objectKeysInternal(O, hiddenKeys$1);
  };

  var objectGetOwnPropertyNames = {
  	f: f$5
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
  var f$6 = function getOwnPropertyNames(it) {
    return windowNames && toString$1.call(it) == '[object Window]'
      ? getWindowNames(it)
      : nativeGetOwnPropertyNames(toIndexedObject(it));
  };

  var objectGetOwnPropertyNamesExternal = {
  	f: f$6
  };

  var f$7 = wellKnownSymbol;

  var wellKnownSymbolWrapped = {
  	f: f$7
  };

  var defineProperty$3 = objectDefineProperty.f;

  var defineWellKnownSymbol = function (NAME) {
    var Symbol = path.Symbol || (path.Symbol = {});
    if (!has(Symbol, NAME)) defineProperty$3(Symbol, NAME, {
      value: wellKnownSymbolWrapped.f(NAME)
    });
  };

  var $forEach$1 = arrayIteration.forEach;

  var HIDDEN = sharedKey('hidden');
  var SYMBOL = 'Symbol';
  var PROTOTYPE$1 = 'prototype';
  var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
  var setInternalState$5 = internalState.set;
  var getInternalState$3 = internalState.getterFor(SYMBOL);
  var ObjectPrototype$1 = Object[PROTOTYPE$1];
  var $Symbol = global_1.Symbol;
  var $stringify = getBuiltIn('JSON', 'stringify');
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

  var wrap = function (tag, description) {
    var symbol = AllSymbols[tag] = objectCreate($Symbol[PROTOTYPE$1]);
    setInternalState$5(symbol, {
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
      return wrap(tag, description);
    };

    redefine($Symbol[PROTOTYPE$1], 'toString', function toString() {
      return getInternalState$3(this).tag;
    });

    redefine($Symbol, 'withoutSetter', function (description) {
      return wrap(uid(description), description);
    });

    objectPropertyIsEnumerable.f = $propertyIsEnumerable;
    objectDefineProperty.f = $defineProperty;
    objectGetOwnPropertyDescriptor.f = $getOwnPropertyDescriptor;
    objectGetOwnPropertyNames.f = objectGetOwnPropertyNamesExternal.f = $getOwnPropertyNames;
    objectGetOwnPropertySymbols.f = $getOwnPropertySymbols;

    wellKnownSymbolWrapped.f = function (name) {
      return wrap(wellKnownSymbol(name), name);
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
  if ($stringify) {
    var FORCED_JSON_STRINGIFY = !nativeSymbol || fails(function () {
      var symbol = $Symbol();
      // MS Edge converts symbol values to JSON as {}
      return $stringify([symbol]) != '[null]'
        // WebKit converts symbol values to JSON as null
        || $stringify({ a: symbol }) != '{}'
        // V8 throws on boxed symbols
        || $stringify(Object(symbol)) != '{}';
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
        return $stringify.apply(null, args);
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

  // empty

  var es_symbol_description = /*#__PURE__*/Object.freeze({
    __proto__: null
  });

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

  getCjsExportFromNamespace(es_symbol_description);

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
              if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+slice$2(name).call(name, 1))) {
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

  var getIterator_1 = getIterator;

  var getIterator$1 = getIterator_1;

  // `Array.isArray` method
  // https://tc39.github.io/ecma262/#sec-array.isarray
  _export({ target: 'Array', stat: true }, {
    isArray: isArray
  });

  var isArray$1 = path.Array.isArray;

  var isArray$2 = isArray$1;

  var isArray$3 = isArray$2;

  var setInternalState$6 = internalState.set;
  var getInternalAggregateErrorState = internalState.getterFor('AggregateError');

  var $AggregateError = function AggregateError(errors, message) {
    var that = this;
    if (!(that instanceof $AggregateError)) return new $AggregateError(errors, message);
    if (objectSetPrototypeOf) {
      that = objectSetPrototypeOf(new Error(message), objectGetPrototypeOf(that));
    }
    var errorsArray = [];
    iterate_1(errors, errorsArray.push, errorsArray);
    if (descriptors) setInternalState$6(that, { errors: errorsArray, type: 'AggregateError' });
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

  var keys$1 = entryVirtual('Array').keys;

  var keys$2 = keys$1;

  var ArrayPrototype$4 = Array.prototype;

  var DOMIterables$1 = {
    DOMTokenList: true,
    NodeList: true
  };

  var keys_1 = function (it) {
    var own = it.keys;
    return it === ArrayPrototype$4 || (it instanceof Array && own === ArrayPrototype$4.keys)
      // eslint-disable-next-line no-prototype-builtins
      || DOMIterables$1.hasOwnProperty(classof(it)) ? keys$2 : own;
  };

  var keys$3 = keys_1;

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

  // `Set` constructor
  // https://tc39.github.io/ecma262/#sec-set-objects
  var es_set = collection('Set', function (init) {
    return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var set$2 = path.Set;

  var set$3 = set$2;

  var set$4 = set$3;

  var concat = entryVirtual('Array').concat;

  var ArrayPrototype$5 = Array.prototype;

  var concat_1 = function (it) {
    var own = it.concat;
    return it === ArrayPrototype$5 || (it instanceof Array && own === ArrayPrototype$5.concat) ? concat : own;
  };

  var concat$1 = concat_1;

  var concat$2 = concat$1;

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

  var ArrayPrototype$6 = Array.prototype;

  var map_1 = function (it) {
    var own = it.map;
    return it === ArrayPrototype$6 || (it instanceof Array && own === ArrayPrototype$6.map) ? map : own;
  };

  var map$1 = map_1;

  var map$2 = map$1;

  var slice$3 = [].slice;
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
    var partArgs = slice$3.call(arguments, 1);
    var boundFunction = function bound(/* args... */) {
      var args = partArgs.concat(slice$3.call(arguments));
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
  var FORCED$2 = NEW_TARGET_BUG || ARGS_BUG;

  _export({ target: 'Reflect', stat: true, forced: FORCED$2, sham: FORCED$2 }, {
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

  var setPrototypeOf$3 = setPrototypeOf;

  var setPrototypeOf$4 = setPrototypeOf$3;

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = setPrototypeOf$4 || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

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

  var $filter = arrayIteration.filter;



  var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('filter');
  // Edge 14- issue
  var USES_TO_LENGTH$3 = arrayMethodUsesToLength('filter');

  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$3 }, {
    filter: function filter(callbackfn /* , thisArg */) {
      return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var filter = entryVirtual('Array').filter;

  var ArrayPrototype$7 = Array.prototype;

  var filter_1 = function (it) {
    var own = it.filter;
    return it === ArrayPrototype$7 || (it instanceof Array && own === ArrayPrototype$7.filter) ? filter : own;
  };

  var filter$1 = filter_1;

  var filter$2 = filter$1;

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

  var getPrototypeOf$3 = getPrototypeOf;

  var getPrototypeOf$4 = getPrototypeOf$3;

  function _getPrototypeOf(o) {
    _getPrototypeOf = setPrototypeOf$4 ? getPrototypeOf$4 : function _getPrototypeOf(o) {
      return o.__proto__ || getPrototypeOf$4(o);
    };
    return _getPrototypeOf(o);
  }

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

  var create$3 = create;

  var create$4 = create$3;

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

  var CombineLogHandlers =
  /*#__PURE__*/
  function () {
    function CombineLogHandlers(logger) {
      _classCallCheck(this, CombineLogHandlers);

      for (var _len = arguments.length, logHandlers = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        logHandlers[_key - 1] = arguments[_key];
      }

      this.name = logHandlers[0].name;
      this.logHandlers = logHandlers;
      this.allowLogLevels = LogLevel.Any;
    }

    _createClass(CombineLogHandlers, [{
      key: "init",
      value: function init() {
        for (var i = 0, len = this.logHandlers.length; i < len; i++) {
          this.logHandlers[i].init();
        }
      }
    }, {
      key: "enqueueLog",
      value: function enqueueLog(logEvent) {
        for (var i = 0, len = this.logHandlers.length; i < len; i++) {
          this.logHandlers[i].enqueueLog(logEvent);
        }
      }
    }]);

    return CombineLogHandlers;
  }();

  var HAS_SPECIES_SUPPORT$3 = arrayMethodHasSpeciesSupport('splice');
  var USES_TO_LENGTH$4 = arrayMethodUsesToLength('splice', { ACCESSORS: true, 0: 0, 1: 2 });

  var max$2 = Math.max;
  var min$2 = Math.min;
  var MAX_SAFE_INTEGER$1 = 0x1FFFFFFFFFFFFF;
  var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

  // `Array.prototype.splice` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.splice
  // with adding support of @@species
  _export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$3 || !USES_TO_LENGTH$4 }, {
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
        actualDeleteCount = min$2(max$2(toInteger(deleteCount), 0), len - actualStart);
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

  var ArrayPrototype$8 = Array.prototype;

  var splice_1 = function (it) {
    var own = it.splice;
    return it === ArrayPrototype$8 || (it instanceof Array && own === ArrayPrototype$8.splice) ? splice : own;
  };

  var splice$1 = splice_1;

  var splice$2 = splice$1;

  var $some = arrayIteration.some;



  var STRICT_METHOD$1 = arrayMethodIsStrict('some');
  var USES_TO_LENGTH$5 = arrayMethodUsesToLength('some');

  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  _export({ target: 'Array', proto: true, forced: !STRICT_METHOD$1 || !USES_TO_LENGTH$5 }, {
    some: function some(callbackfn /* , thisArg */) {
      return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var some = entryVirtual('Array').some;

  var ArrayPrototype$9 = Array.prototype;

  var some_1 = function (it) {
    var own = it.some;
    return it === ArrayPrototype$9 || (it instanceof Array && own === ArrayPrototype$9.some) ? some : own;
  };

  var some$1 = some_1;

  var some$2 = some$1;

  // a string of all valid unicode whitespaces
  // eslint-disable-next-line max-len
  var whitespaces = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

  var whitespace = '[' + whitespaces + ']';
  var ltrim = RegExp('^' + whitespace + whitespace + '*');
  var rtrim = RegExp(whitespace + whitespace + '*$');

  // `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
  var createMethod$3 = function (TYPE) {
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
    start: createMethod$3(1),
    // `String.prototype.{ trimRight, trimEnd }` methods
    // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
    end: createMethod$3(2),
    // `String.prototype.trim` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.trim
    trim: createMethod$3(3)
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

  var StringPrototype = String.prototype;

  var trim_1 = function (it) {
    var own = it.trim;
    return typeof it === 'string' || it === StringPrototype
      || (it instanceof String && own === StringPrototype.trim) ? trim : own;
  };

  var trim$1 = trim_1;

  var trim$2 = trim$1;

  var slice$4 = [].slice;
  var MSIE = /MSIE .\./.test(engineUserAgent); // <- dirty ie9- check

  var wrap$1 = function (scheduler) {
    return function (handler, timeout /* , ...arguments */) {
      var boundArgs = arguments.length > 2;
      var args = boundArgs ? slice$4.call(arguments, 2) : undefined;
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
    setTimeout: wrap$1(global_1.setTimeout),
    // `setInterval` method
    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
    setInterval: wrap$1(global_1.setInterval)
  });

  var setTimeout$1 = path.setTimeout;

  var setTimeout$2 = setTimeout$1;

  var trim$3 = stringTrim.trim;


  var $parseInt = global_1.parseInt;
  var hex = /^[+-]?0[Xx]/;
  var FORCED$4 = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

  // `parseInt` method
  // https://tc39.github.io/ecma262/#sec-parseint-string-radix
  var numberParseInt = FORCED$4 ? function parseInt(string, radix) {
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


      if (typeof ArrayBuffer !== 'undefined' && !slice$2(ArrayBuffer.prototype)) {
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

        this._buff = i - 64 < length ? new Uint8Array(slice$2(_context = buff.buffer).call(_context, i - 64)) : new Uint8Array(0);
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

  var html$1 = getCjsExportFromNamespace(esm);

  /* tslint:disable:no-var-requires */
  // don't mix require and import/export; see: https://github.com/rollup/rollup/issues/1058#issuecomment-254187433

  var helpersCjs = {
    SparkMD5: sparkMd5,
    html: html$1
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
    } // tslint:disable-next-line:no-empty


    _createClass(LogHandler, [{
      key: "init",
      value: function init() {}
    }, {
      key: "canLog",
      value: function canLog(logEvent) {
        return !this.disabled && canDoAction(logEvent.handlersModes ? logEvent.handlersModes[this.name] || logEvent.handlersModes._all || ActionMode.Default : ActionMode.Default, this.allowLogLevels, logEvent.level);
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

  // `Object.assign` method
  // https://tc39.github.io/ecma262/#sec-object.assign
  _export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
    assign: objectAssign
  });

  var assign = path.Object.assign;

  var assign$1 = assign;

  var assign$2 = assign$1;

  function _extends() {
    _extends = assign$2 || function (target) {
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

  var $indexOf = arrayIncludes.indexOf;



  var nativeIndexOf = [].indexOf;

  var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
  var STRICT_METHOD$2 = arrayMethodIsStrict('indexOf');
  var USES_TO_LENGTH$6 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  _export({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$6 }, {
    indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
      return NEGATIVE_ZERO
        // convert -0 to +0
        ? nativeIndexOf.apply(this, arguments) || 0
        : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
    }
  });

  var indexOf$1 = entryVirtual('Array').indexOf;

  var ArrayPrototype$a = Array.prototype;

  var indexOf_1 = function (it) {
    var own = it.indexOf;
    return it === ArrayPrototype$a || (it instanceof Array && own === ArrayPrototype$a.indexOf) ? indexOf$1 : own;
  };

  var indexOf$2 = indexOf_1;

  var indexOf$3 = indexOf$2;

  var $stringify$1 = getBuiltIn('JSON', 'stringify');
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

  var FORCED$5 = fails(function () {
    return $stringify$1('\uDF06\uD834') !== '"\\udf06\\ud834"'
      || $stringify$1('\uDEAD') !== '"\\udead"';
  });

  if ($stringify$1) {
    // https://github.com/tc39/proposal-well-formed-stringify
    _export({ target: 'JSON', stat: true, forced: FORCED$5 }, {
      // eslint-disable-next-line no-unused-vars
      stringify: function stringify(it, replacer, space) {
        var result = $stringify$1.apply(null, arguments);
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

  var bind$4 = bind_1;

  var bind$5 = bind$4;

  var defineProperty$8 = defineProperty_1;

  var defineProperty$9 = defineProperty$8;

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

          executor(bind$5(_context = this.resolve).call(_context, this), bind$5(_context2 = this.reject).call(_context2, this));
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

              var index = indexOf$3(_subscribers).call(_subscribers, subscriber);

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
  var FAILS_ON_PRIMITIVES$2 = fails(function () { nativeIsFrozen(1); });

  // `Object.isFrozen` method
  // https://tc39.github.io/ecma262/#sec-object.isfrozen
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$2 }, {
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
        for (var _iterator = keys$3(_context = this._map).call(_context), _isArray = isArray$3(_iterator), _i2 = 0, _iterator = _isArray ? _iterator : getIterator$1(_iterator);;) {
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

  // `Map` constructor
  // https://tc39.github.io/ecma262/#sec-map-objects
  var es_map = collection('Map', function (init) {
    return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
  }, collectionStrong);

  var map$3 = path.Map;

  var map$4 = map$3;

  var map$5 = map$4;

  var onFreeze = internalMetadata.onFreeze;

  var nativeFreeze = Object.freeze;
  var FAILS_ON_PRIMITIVES$3 = fails(function () { nativeFreeze(1); });

  // `Object.freeze` method
  // https://tc39.github.io/ecma262/#sec-object.freeze
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$3, sham: !freezing }, {
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
      this.merge = bind$5(_context = this.merge).call(_context, this);
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

  registerMerger(map$5, {
    merger: {
      // tslint:disable-next-line:no-identical-functions
      canMerge: function canMerge(target, source) {
        return source.constructor === Object || source[toStringTag$2] === 'Map' || isArray$3(source) || isIterable$2(source);
      },
      merge: function merge(_merge6, base, older, newer, set, preferCloneOlder, preferCloneNewer, options) {
        return mergeMaps(function (target, source) {
          return createMergeMapWrapper(target, source, function (arrayOrIterable) {
            return fillMap(new map$5(), arrayOrIterable);
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
      this.serialize = bind$5(_context = this.serialize).call(_context, this);
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
      this.deSerialize = bind$5(_context2 = this.deSerialize).call(_context2, this);
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

  registerSerializer(map$5, {
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

  /* tslint:disable:no-shadowed-variable */
  var now;

  if (typeof performance !== 'undefined' && performance.now) {
    var _context;

    now = bind$5(_context = performance.now).call(_context, performance);
  } else {
    var start = process.hrtime();

    now = function now() {
      var end = process.hrtime(start);
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

  // `Date.now` method
  // https://tc39.github.io/ecma262/#sec-date.now
  _export({ target: 'Date', stat: true }, {
    now: function now() {
      return new Date().getTime();
    }
  });

  var now$1 = path.Date.now;

  var now$2 = now$1;

  var now$3 = now$2;

  var timingDefault = {
    now: now$3,
    setTimeout: typeof window === 'undefined' ? setTimeout$2 : bind$5(setTimeout$2).call(setTimeout$2, window),
    clearTimeout: typeof window === 'undefined' ? clearTimeout : bind$5(clearTimeout).call(clearTimeout, window)
  };

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

        var _set2 = setOptions ? bind$5(_setExt).call(_setExt, null, name, getValue, setValue, setOptions) : bind$5(_set).call(_set, null, name, getValue, setValue);

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
          setOnUpdate = setOptions ? bind$5(_setExt).call(_setExt, null, name, getValue, setValue, setOptions) : bind$5(_set).call(_set, null, name, getValue, setValue);
        }

        var setOnInit;

        if (factory) {
          var _setOptions = _extends({}, options && options.setOptions, {
            suppressPropertyChanged: true
          });

          setOnInit = _setOptions ? bind$5(_setExt).call(_setExt, null, name, getValue, setValue, _setOptions) : bind$5(_set).call(_set, null, name, getValue, setValue);
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

  // `Number.MAX_SAFE_INTEGER` constant
  // https://tc39.github.io/ecma262/#sec-number.max_safe_integer
  _export({ target: 'Number', stat: true }, {
    MAX_SAFE_INTEGER: 0x1FFFFFFFFFFFFF
  });

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
  var min$3 = Math.min;

  var CORRECT_IS_REGEXP_LOGIC = correctIsRegexpLogic('startsWith');

  // `String.prototype.startsWith` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.startswith
  _export({ target: 'String', proto: true, forced:  !CORRECT_IS_REGEXP_LOGIC }, {
    startsWith: function startsWith(searchString /* , position = 0 */) {
      var that = String(requireObjectCoercible(this));
      notARegexp(searchString);
      var index = toLength(min$3(arguments.length > 1 ? arguments[1] : undefined, that.length));
      var search = String(searchString);
      return nativeStartsWith
        ? nativeStartsWith.call(that, search, index)
        : that.slice(index, index + search.length) === search;
    }
  });

  var startsWith = entryVirtual('String').startsWith;

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

  var ANY = '*';

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
  // region subscribeMap


  function subscribeMap(keys, keyPredicate, object, immediateSubscribe, changeItem, propertiesPath, rule) {
    if (!object || object[toStringTag$2] !== 'Map' && !(object instanceof map$5)) {
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
          _this.subscribe = bind$5(subscribeObject).call(subscribeObject, null, propertyNames, propertyPredicate);
          break;

        case SubscribeObjectType.ValueProperty:
          _this.subType = type; // @ts-ignore

          _this.subscribe = bind$5(subscribeObjectValue).call(subscribeObjectValue, null, propertyNames);
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
        return indexOf$3(keys).call(keys, k) >= 0;
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


      _this2.subscribe = bind$5(subscribeMap).call(subscribeMap, null, keys, keyPredicate);
      return _this2;
    }

    return RuleSubscribeMap;
  }(RuleSubscribe); // endregion
   // endregion

  var RuleSubscribeObjectPropertyNames = bind$5(RuleSubscribeObject).call(RuleSubscribeObject, null, SubscribeObjectType.Property, null);

  var RuleSubscribeObjectValuePropertyNames = bind$5(RuleSubscribeObject).call(RuleSubscribeObject, null, SubscribeObjectType.ValueProperty, null);

  var RuleSubscribeMapKeys = bind$5(RuleSubscribeMap).call(RuleSubscribeMap, null, null); // const UNSUBSCRIBE_PROPERTY_PREFIX = Math.random().toString(36)
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

  var FAILS_ON_PRIMITIVES$4 = fails(function () { objectKeys(1); });

  // `Object.keys` method
  // https://tc39.github.io/ecma262/#sec-object.keys
  _export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES$4 }, {
    keys: function keys(it) {
      return objectKeys(toObject(it));
    }
  });

  var keys$4 = path.Object.keys;

  var keys$5 = keys$4;

  var keys$6 = keys$5;

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
      this._size = size || keys$6(this._array).length;
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
                _context.t0 = keys$3(regenerator).call(regenerator, _array);

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
                _context2.t0 = keys$3(regenerator).call(regenerator, _array);

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

  var ArrayPrototype$b = Array.prototype;

  var DOMIterables$2 = {
    DOMTokenList: true,
    NodeList: true
  };

  var entries_1 = function (it) {
    var own = it.entries;
    return it === ArrayPrototype$b || (it instanceof Array && own === ArrayPrototype$b.entries)
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
                _context2.t0 = keys$3(regenerator).call(regenerator, _array);

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
                _context3.t0 = keys$3(regenerator).call(regenerator, _array);

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
                _context4.t0 = keys$3(regenerator).call(regenerator, _array);

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
        return keys$6(this._array).length;
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

  var ArrayPrototype$c = Array.prototype;

  var DOMIterables$3 = {
    DOMTokenList: true,
    NodeList: true
  };

  var values_1 = function (it) {
    var own = it.values;
    return it === ArrayPrototype$c || (it instanceof Array && own === ArrayPrototype$c.values)
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

        return keys$3(_context3 = this._set).call(_context3);
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
      _this._map = map || new map$5();
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

        return keys$3(_context4 = this._map).call(_context4);
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

  var propertyIsEnumerable = objectPropertyIsEnumerable.f;

  // `Object.{ entries, values }` methods implementation
  var createMethod$4 = function (TO_ENTRIES) {
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
    entries: createMethod$4(true),
    // `Object.values` method
    // https://tc39.github.io/ecma262/#sec-object.values
    values: createMethod$4(false)
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
                _context2.t0 = keys$3(regenerator).call(regenerator, _object);

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
        return getIterator$1(keys$6(this._object));
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
        return keys$6(this._object).length;
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
        return getIterator$1(keys$6(this._object));
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
                _context.t0 = keys$3(regenerator).call(regenerator, _object);

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
        return keys$6(this._object).length;
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
  var STRICT_METHOD$3 = arrayMethodIsStrict('sort');

  var FORCED$6 = FAILS_ON_UNDEFINED || !FAILS_ON_NULL || !STRICT_METHOD$3;

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

  var _context$1;

  var randomWithoutSeed = bind$5(_context$1 = Math.random).call(_context$1, Math);

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

        if (parents && indexOf$3(parents).call(parents, obj) >= 0) {
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
        var handlersObject = {};

        for (var i = 0, len = handlers.length; i < len; i++) {
          var handler = handlers[i];

          if (handler) {
            handlersObject[handler.name] = handler;
            handler.init();
          }
        }

        this.handlers = handlersObject;
        this.filter = filter;
        this.appState = appState;
        this.interceptEval();
        var logEvent = {
          level: LogLevel.Info,
          messagesOrErrors: "Start App: " + appName + " v" + appVersion,
          handlersModes: {
            _all: ActionMode.Always
          }
        };
        this.log(logEvent);
      }
    }, {
      key: "interceptEval",
      value: function interceptEval() {
        var _this = this;

        var oldEval = globalScope.eval;
        delete globalScope.eval;

        globalScope.eval = function (str) {
          if (indexOf$3(str).call(str, 'async function') >= 0) {
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

        for (var key in handlers) {
          if (Object.prototype.hasOwnProperty.call(handlers, key)) {
            var handler = handlers[key];

            if (handler) {
              handler.enqueueLog(logEvent);
            }
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

          var index = indexOf$3(_context = _this2._subscribers).call(_context, subscriber);

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

  var _context$2, _context2, _context3, _context4, _context5;
  var consoleOrig = {
    debug: bind$5(_context$2 = console.debug).call(_context$2, console),
    info: bind$5(_context2 = console.info).call(_context2, console),
    log: bind$5(_context3 = console.log).call(_context3, console),
    warn: bind$5(_context4 = console.warn).call(_context4, console),
    error: bind$5(_context5 = console.error).call(_context5, console)
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

                  if (!(!logUrl || !logUrl.length)) {
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
                  if (statusCode === 429 || statusCode === 502 || statusCode === 504) {
                    console.log('Send log failed: Bad Connection');
                  } else if (!errorWasWrite) {
                    errorWasWrite = true;
                    selfError('Send log status code == ' + statusCode);
                  }

                  _context2.next = 26;
                  break;

                case 23:
                  _context2.prev = 23;
                  _context2.t0 = _context2["catch"](13);
                  console.log('Send log failed: Bad Connection'); // if (!errorWasWrite) {
                  // 	errorWasWrite = true
                  // 	selfError('Send log error', error)
                  // }

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

  var WriteToFileHandler =
  /*#__PURE__*/
  function (_LogHandler) {
    _inherits(WriteToFileHandler, _LogHandler);

    function WriteToFileHandler(logger, allowLogLevels, logFileName) {
      var _this;

      _classCallCheck(this, WriteToFileHandler);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(WriteToFileHandler).call(this, {
        name: 'writeToFile',
        logger: logger,
        allowLogLevels: allowLogLevels
      }));
      _this._logFileName = logFileName;
      return _this;
    }

    _createClass(WriteToFileHandler, [{
      key: "handleLog",
      value: function () {
        var _handleLog = _asyncToGenerator(
        /*#__PURE__*/
        regenerator.mark(function _callee(logEvents) {
          var remoteLogger, sendLogEvents;
          return regenerator.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  remoteLogger = typeof window !== 'undefined' ? window.remoteLogger : null;

                  if (remoteLogger) {
                    _context.next = 3;
                    break;
                  }

                  return _context.abrupt("return");

                case 3:
                  sendLogEvents = map$2(logEvents).call(logEvents, function (o) {
                    return {
                      level: o.level,
                      dateString: o.dateString,
                      appInfo: o.appInfo,
                      handlersModes: {
                        _all: ActionMode.Never,
                        writeToFile: ActionMode.Always
                      },
                      bodyString: o.bodyString
                    };
                  });
                  _context.next = 6;
                  return remoteLogger.writeToFile.apply(remoteLogger, sendLogEvents);

                case 6:
                case "end":
                  return _context.stop();
              }
            }
          }, _callee);
        }));

        function handleLog(_x) {
          return _handleLog.apply(this, arguments);
        }

        return handleLog;
      }()
    }, {
      key: "logFileName",
      get: function get() {
        return this._logFileName;
      },
      set: function set(value) {
        this._logFileName = value;
        console.log("logFileName = " + this._logFileName);

        if (typeof window !== 'undefined' && window.remoteLogger) {
          window.remoteLogger.setFileName(value);
        }
      }
    }]);

    return WriteToFileHandler;
  }(LogHandler);

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
        var _context,
            _this = this;

        var appName = _ref.appName,
            appVersion = _ref.appVersion,
            logUrls = _ref.logUrls,
            logFileName = _ref.logFileName,
            _ref$writeToFileLevel = _ref.writeToFileLevels,
            writeToFileLevels = _ref$writeToFileLevel === void 0 ? LogLevel.Any : _ref$writeToFileLevel,
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
          handlers: [new WriteToConsoleHandler(this, writeToConsoleLevels), logUrls && logUrls.length && _construct(CombineLogHandlers, concat$2(_context = [this]).call(_context, map$2(logUrls).call(logUrls, function (logUrl) {
            return new SendLogHandlerBrowser(_this, sendLogLevels, logUrl);
          }))), new EmitEventHandler(this, emitEventLevels), new WriteToFileHandler(this, writeToFileLevels, logFileName)],
          filter: filter,
          appState: appState
        });
      }
    }, {
      key: "logUnhandledErrors",
      value: function logUnhandledErrors() {
        var _this2 = this;

        var errorHandler = function errorHandler() {
          var _context2;

          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          _this2.error.apply(_this2, concat$2(_context2 = ['unhandledrejection']).call(_context2, map$2(args).call(args, function (arg) {
            return (typeof PromiseRejectionEvent !== 'undefined' ? arg instanceof PromiseRejectionEvent && arg.reason : arg.reason) || arg;
          })));
        };

        if (typeof globalScope !== 'undefined') {
          globalScope.addEventListener('unhandledrejection', errorHandler);
          globalScope.onunhandledrejection = errorHandler;

          globalScope.onerror = function () {
            var _context3;

            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            _this2.error.apply(_this2, concat$2(_context3 = ['unhandled error']).call(_context3, args));
          };
        }
      }
    }]);

    return LoggerBrowser;
  }(Logger);
  var logger = new LoggerBrowser();

  var _context$3;

  /* eslint-disable no-process-env */
  var base$1 = {
    appId: 'com.app-template',
    packageName: 'app-template',
    appName: 'App Template',
    appVersion: '0.0.1',
    description: 'App Template',
    logUrls: [// 'http://app-template.logger.com/log.php', // TODO
    ],
    installer: {
      electronVersion: '6.0.11',
      nodeVersion: '12.4.0'
    },
    sapper: {
      devServer: trim$2(_context$3 =  '').call(_context$3) === 'development'
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
    logUrls: base$1.logUrls,
    installer: base$1.installer,
    type: 'dev',
    dev: {
      devPage: true,
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

  try {
    logger.init({
      appName: dev.appName,
      appVersion: dev.appVersion,
      logUrls: dev.logUrls,
      logFileName: 'client.log',
      appState: _extends({}, dev),
      filter: function filter(logEvent) {
        if (logEvent.messagesOrErrors && logEvent.messagesOrErrors.length) {
          var first = logEvent.messagesOrErrors[0];

          if (first) {
            var _context;

            if (first.target && typeof first.target.url === 'string' && indexOf$3(_context = first.target.url).call(_context, '__sapper__') >= 0) {
              return false;
            }
          }
        }

        return true;
      }
    });
  } catch (ex) {
    console.log(ex);
    throw ex;
  }

}());
