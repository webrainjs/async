"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

exports.__esModule = true;
exports.isWebrainInternalObject = isWebrainInternalObject;
exports.webrainGraph = exports.WebrainGraph = exports.HighlightMode = void 0;

var _stringify = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/json/stringify"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/asyncToGenerator"));

var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/keys"));

var _regenerator = _interopRequireDefault(require("@babel/runtime-corejs3/regenerator"));

var _values = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/values"));

var _from = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/from"));

var _sort = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/sort"));

var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));

var _setTimeout2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/set-timeout"));

var _getIterator2 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/get-iterator"));

var _isArray4 = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/array/is-array"));

var _splice = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/splice"));

var _indexOf = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/index-of"));

var _concat = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/instance/concat"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/possibleConstructorReturn"));

var _getPrototypeOf3 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inherits"));

var _index = require("webrain/src/main/common/index.ts");

var _localStorage = require("../../../main/browser/helpers/localStorage");

var _common = require("./common");

var _Edge = require("./Edge");

var _Node = require("./Node");

var HighlightMode; // region helpers

exports.HighlightMode = HighlightMode;

(function (HighlightMode) {
  HighlightMode["All"] = "All";
  HighlightMode["LastActive"] = "LastActive";
  HighlightMode["CalcTimeSum"] = "CalcTimeSum";
  HighlightMode["CalcTimeAverage"] = "CalcTimeAverage";
  HighlightMode["Subscribers"] = "Subscribers";
  HighlightMode["SearchResults"] = "SearchResults";
})(HighlightMode || (exports.HighlightMode = HighlightMode = {}));

var calcNodeId = function calcNodeId(object, key, keyType) {
  if (object == null) {
    return null;
  }

  var objectId = (0, _index.getObjectUniqueId)(object);

  if (objectId == null) {
    return null; // throw new Error(`getObjectUniqueId(${object}) == null`)
  }

  var keyId = (0, _index.getObjectUniqueId)(key);

  if (keyId) {
    key = "{" + keyId + "}";
  }

  return "" + objectId; // TODO add keyType after finish webrain refactoring
};

var calcEdgeId = function calcEdgeId(fromId, toId, type, key, keyType) {
  var keyId = (0, _index.getObjectUniqueId)(key);

  if (keyId) {
    key = "{" + keyId + "}";
  }

  return fromId + "-" + toId + "-" + type + "-" + key; // TODO add keyType after finish webrain refactoring
}; // endregion
// region class WebrainGraph


var WebrainGraph =
/*#__PURE__*/
function (_ObservableClass) {
  (0, _inherits2.default)(WebrainGraph, _ObservableClass);

  function WebrainGraph() {
    var _getPrototypeOf2, _context;

    var _this;

    (0, _classCallCheck2.default)(this, WebrainGraph);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = (0, _possibleConstructorReturn2.default)(this, (_getPrototypeOf2 = (0, _getPrototypeOf3.default)(WebrainGraph)).call.apply(_getPrototypeOf2, (0, _concat.default)(_context = [this]).call(_context, args)));
    _this.objects = new _common.WebrainMap();
    _this.isEnabled = false;
    return _this;
  }

  (0, _createClass2.default)(WebrainGraph, [{
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
      var index = (0, _indexOf.default)(_context2 = objectInfo.nodes).call(_context2, node);

      if (index >= 0) {
        var _context3;

        (0, _splice.default)(_context3 = objectInfo.nodes).call(_context3, index, 1);
      }

      index = (0, _indexOf.default)(_context4 = objectInfo.edges).call(_context4, edge);

      if (index >= 0) {
        var _context5;

        (0, _splice.default)(_context5 = objectInfo.edges).call(_context5, index, 1);
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
      var nodeId = calcNodeId(object, key, keyType);

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

      var name = (0, _common.getDisplayName)(object);
      var node = this.nodes.get(nodeId);

      if (!node) {
        node = new _Node.Node({
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

      if (value !== _common.NoValue) {
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
      if (!(from instanceof _Node.Node) && keyType == null) {
        from.keyType = 0;
      }

      if (!(to instanceof _Node.Node) && to.keyType == null) {
        to.keyType = 0;
      }

      if (keyType == null) {
        keyType = 0;
      }

      if (from.object instanceof _index.CalcProperty) {
        from.key = null;
        from.keyType = null;
      }

      var fromId = from instanceof _Node.Node ? from.id : this.getNodeId(from);
      var toId = to instanceof _Node.Node ? to.id : this.getNodeId(to); // if (!fromId && toId) {
      // 	this.removeEdges({type, fromId, toId})
      // 	return
      // }

      if (fromId && toId) {
        if (!(from instanceof _Node.Node)) {
          from = this.setNode(from);
        }

        if (!(to instanceof _Node.Node)) {
          to = this.setNode(to);
        }

        var edgeId = calcEdgeId(fromId, toId, type, key, keyType);
        var edge = this.edges.get(edgeId);

        if (!edge) {
          edge = new _Edge.Edge({
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

        if (value !== _common.NoValue) {
          // tslint:disable-next-line:no-collapsible-if
          if (edge.value !== value || !(to instanceof _Node.Node) && to.valueChanged) {
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

      for (var _iterator = this.edges, _isArray = (0, _isArray4.default)(_iterator), _i = 0, _iterator = _isArray ? _iterator : (0, _getIterator2.default)(_iterator);;) {
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

      _index.Debugger.Instance.calculatedObservable.subscribe(function (e) {
        // console.log('calculatedObservable', e)
        (0, _setTimeout2.default)(function () {
          _this2.setNode({
            object: e.target,
            type: _Node.NodeType.CalcProperty,
            key: null,
            keyType: null,
            value: e.newValue,
            valueChanged: true
          });
        });
      }, 'WebrainGraph calculatedObservable');

      _index.Debugger.Instance.errorObservable.subscribe(function (e) {
        (0, _setTimeout2.default)(function () {
          _this2.setNode({
            object: e.target,
            type: _Node.NodeType.CalcProperty,
            key: null,
            keyType: null,
            value: _common.NoValue,
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


      _index.Debugger.Instance.deepSubscribeObservable.subscribe(function (e) {
        (0, _setTimeout2.default)(function () {
          var fromId;
          var toId;

          if (typeof e.target === 'function' && e.target.name === 'updateView') {
            e.oldIsLeaf = false;
            e.newIsLeaf = false;
          }

          var nodeType;
          var edgeType;

          if (e.target instanceof _index.CalcProperty) {
            edgeType = _Edge.EdgeType.Dependency; // nodeType = NodeType.CalcProperty
          } else if (e.target instanceof _index.Connector) {
            edgeType = _Edge.EdgeType.Connect;
            nodeType = _Node.NodeType.Connector;
          } else {
            edgeType = _Edge.EdgeType.DeepSubscribe;
          }

          if ((!e.oldIsLeaf || nodeType !== _Node.NodeType.Connector || typeof e.oldValue !== 'undefined') && (e.changeType & _index.ValueChangeType.Unsubscribe) !== 0) {
            fromId = _this2.getNodeId({
              object: e.parent,
              type: null,
              key: null,
              keyType: null,
              value: _common.NoValue
            });
            toId = _this2.getNodeId({
              object: e.oldIsLeaf ? e.target : e.oldValue,
              type: null,
              key: null,
              keyType: null,
              value: _common.NoValue
            });
          }

          if ((!e.newIsLeaf || nodeType !== _Node.NodeType.Connector || typeof e.newValue !== 'undefined') && (e.changeType & _index.ValueChangeType.Subscribe) !== 0) {
            _this2.setEdge({
              type: e.newIsLeaf ? edgeType : _Edge.EdgeType.DeepSubscribe,
              key: e.key,
              keyType: e.keyType,
              value: e.newValue,
              from: {
                object: e.parent,
                type: null,
                key: null,
                keyType: null,
                value: _common.NoValue
              },
              to: {
                object: e.newIsLeaf ? e.target : e.newValue,
                type: e.newIsLeaf ? nodeType : null,
                key: null,
                keyType: null,
                value: _common.NoValue
              }
            });
          }

          if (fromId && toId) {
            _this2.removeEdges({
              type: e.oldIsLeaf ? edgeType : _Edge.EdgeType.DeepSubscribe,
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
}(_index.ObservableClass); // see graphic: https://www.desmos.com/calculator/cdxbsjigvu


exports.WebrainGraph = WebrainGraph;
var opacityMin = 0.15;

function calcOpacityLastActive(itemUpdateId, currentUpdateId) {
  var delta = currentUpdateId - itemUpdateId;
  return Math.exp(-delta / 30) * (1 - opacityMin) + opacityMin;
}

var ln2 = Math.log(2);

function calcOpacityCalcTime(calcTime, halfOpacityForCalcTime) {
  return (1 - Math.exp(-calcTime * ln2 / halfOpacityForCalcTime)) * (1 - opacityMin) + opacityMin;
}

new _index.CalcObjectBuilder(WebrainGraph.prototype).writable('isEnabled').writable('highlightMode').writable('searchPattern', {
  setOptions: {
    afterChange: function afterChange(value) {
      if (value) {
        this.highlightMode = HighlightMode.SearchResults;
      }
    }
  }
}).readable('nodes', {
  factory: function factory() {
    return new _common.WebrainObservableMap(new _index.ObjectMap());
  }
}).readable('edges', {
  factory: function factory() {
    return new _common.WebrainObservableMap(new _index.ObjectMap());
  }
}).calc('visData', (0, _index.connectorFactory)({
  name: 'WebrainGraph.Connector.visData' + _common.WebrainGraphObjectsId,
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
}), (0, _index.calcPropertyFactory)({
  name: 'WebrainGraph.visData' + _common.WebrainGraphObjectsId,
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
  _regenerator.default.mark(function calcFunc(state) {
    var input, value, currentUpdateId, searchRegexp, _calcOpacity, nodeIdToGroupId, edgeIdToGroupId, calcNodeGroupId, _iterator2, _isArray2, _i2, _context6, _context7, _ref6, _item2, _groupId2, _group2, _iterator3, _isArray3, _i3, _context8, _context9, _ref7, _item3, groupIdFrom, groupIdTo, _groupId3, _group3, i, groupId, group, item, itemUpdateId, age, opacity, visData, _groupId, _group, _item, _itemUpdateId, _age, _opacity, _visData;

    return _regenerator.default.wrap(function calcFunc$(_context10) {
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


            currentUpdateId = _common.updateId[0];

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
                    if (searchRegexp.test(name + '') || searchRegexp.test((0, _common.getDisplayName)(val))) {
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

            _iterator2 = (0, _sort.default)(_context6 = (0, _from.default)((0, _values.default)(_context7 = input.nodes).call(_context7))).call(_context6, function (o1, o2) {
              return o1.updateId - o2.updateId;
            }), _isArray2 = (0, _isArray4.default)(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : (0, _getIterator2.default)(_iterator2);

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
            _iterator3 = (0, _sort.default)(_context8 = (0, _from.default)((0, _values.default)(_context9 = input.edges).call(_context9))).call(_context8, function (o1, o2) {
              return o1.updateId - o2.updateId;
            }), _isArray3 = (0, _isArray4.default)(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : (0, _getIterator2.default)(_iterator3);

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
            _context10.t0 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, value.groups.nodes);

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
            return (0, _index.resolvePath)(item)(function (o) {
              return o.updateId;
            })();

          case 57:
            itemUpdateId = _context10.sent;
            age = currentUpdateId - itemUpdateId;
            opacity = _calcOpacity(item.name, item.object, itemUpdateId, item.object instanceof _index.CalcProperty ? item.object.timeTotalStat : null);
            visData = item.getVisData({
              opacity: opacity,
              age: age
            });
            value.nodes[i++] = (0, _extends2.default)({}, visData, {
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
            _context10.t2 = (0, _keys.default)(_regenerator.default).call(_regenerator.default, value.groups.edges);

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
            return (0, _index.resolvePath)(_item)(function (o) {
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
            value.edges[i++] = (0, _extends2.default)({}, _visData, {
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
exports.webrainGraph = webrainGraph;

if (typeof window !== 'undefined') {
  storeWebrainGraph(webrainGraph);
} // region helpers


function storeWebrainGraph(_x) {
  return _storeWebrainGraph.apply(this, arguments);
}

function _storeWebrainGraph() {
  _storeWebrainGraph = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(object) {
    var storageKey, stateStr, state, saveState;
    return _regenerator.default.wrap(function _callee2$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            storageKey = 'webrainGraph';
            _context12.next = 3;
            return _localStorage.localStorageWrapper.getItem(storageKey);

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
              var _ref8 = (0, _asyncToGenerator2.default)(
              /*#__PURE__*/
              _regenerator.default.mark(function _callee() {
                return _regenerator.default.wrap(function _callee$(_context11) {
                  while (1) {
                    switch (_context11.prev = _context11.next) {
                      case 0:
                        _context11.next = 2;
                        return _localStorage.localStorageWrapper.setItem(storageKey, (0, _stringify.default)({
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

var webrainGraphClasses = [_Edge.Edge, _Node.Node, WebrainGraph];

function isWebrainInternalObject(object) {
  if (!object || typeof object !== 'object') {
    return false;
  }

  if (object instanceof _Node.Node || object instanceof _Edge.Edge || object instanceof WebrainGraph || object instanceof _common.WebrainMap || object instanceof _common.WebrainObservableMap || object instanceof _index.ConnectorState || object instanceof _index.CalcPropertyState // || object instanceof Connector
  ) {
      return true;
    }

  var name = object instanceof _index.CalcProperty && object.state.name || object instanceof _index.Connector && object.connectorState.name;

  if (name && (0, _indexOf.default)(name).call(name, _common.WebrainGraphObjectsId) >= 0) {
    return true;
  }

  if ((0, _indexOf.default)(webrainGraphClasses).call(webrainGraphClasses, object.constructor) >= 0) {
    return true;
  }

  return false;
} // endregion