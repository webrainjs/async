import { CalcObjectBuilder, calcPropertyFactory, ObservableClass, PropertyChangedObject } from 'webrain';
import { colorOpacity, deepMerge, updateId, VALUE_HISTORY_MAX_SIZE, WebrainGraphObjectsId, WebrainObject } from './common';
export let NodeType;

(function (NodeType) {
  NodeType["Unknown"] = "Unknown";
  NodeType["Object"] = "Object";
  NodeType["ObservableClass"] = "ObservableClass";
  NodeType["Connector"] = "Connector";
  NodeType["CalcProperty"] = "CalcProperty";
})(NodeType || (NodeType = {}));

const nodeStyles = {
  common: ({
    opacity
  }) => ({
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
  }),
  [NodeType.Unknown]: ({
    opacity
  }) => ({
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
  }),
  [NodeType.Object]: ({
    opacity
  }) => ({
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
  }),
  [NodeType.ObservableClass]: ({
    opacity
  }) => ({
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
  }),
  [NodeType.Connector]: ({
    opacity
  }) => ({
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
  }),
  [NodeType.CalcProperty]: ({
    opacity
  }) => ({
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
  })
};
export class Node extends ObservableClass {
  get edgesCount() {
    return this.edgesCountIn + this.edgesCountOut;
  }

  constructor({
    id,
    object,
    key,
    keyType
  }) {
    super();
    this.valueHistory = [];
    this.edgesCountIn = 0;
    this.edgesCountOut = 0;
    this.id = id;
    this.object = object;
    this.key = key;
    this.keyType = keyType;

    if (object instanceof PropertyChangedObject) {
      this.type = NodeType.ObservableClass;
    } else if (object && object.constructor === Object) {
      this.type = NodeType.Object;
    } else {
      this.type = NodeType.Unknown;
    }
  }

  getVisData({
    opacity,
    age
  }) {
    let value = this._visData;

    if (!value) {
      this._visData = value = new WebrainObject();
      value.name = 'Node.WebrainObject' + WebrainGraphObjectsId;
      value.id = this.id;
      value.title = this.id;
    }

    let label = this.name;

    if (this.key != null) {
      label += '.' + this.key;
    }

    value.label = label + '\r\n' + age;

    if (this.type != null) {
      const common = nodeStyles.common({
        opacity
      });
      const specific = nodeStyles[this.type]({
        opacity
      });
      const style = deepMerge({
        fill: true
      }, {}, common, specific, this.error ? common.error : void 0, this.error ? specific.error : void 0);

      for (const key in style) {
        if (Object.prototype.hasOwnProperty.call(style, key)) {
          value[key] = deepMerge({
            fill: false
          }, value[key], style[key]);
        }
      }
    }

    return value;
  }

}
new CalcObjectBuilder(Node.prototype).writable('name').writable('type').writable('value', {
  setOptions: {
    equalsFunc: () => false,

    afterChange(oldValue, newValue) {
      this.valueHistory.push(newValue);

      if (this.valueHistory.length > VALUE_HISTORY_MAX_SIZE) {
        delete this.valueHistory[this.valueHistory.length - VALUE_HISTORY_MAX_SIZE - 1];
      }
    }

  }
}).writable('error').calc('updateId', o => o, // connect to self
calcPropertyFactory({
  name: 'Node.updateId' + WebrainGraphObjectsId,
  dependencies: d => d.invalidateOn(b => b.noAutoRules().propertyPredicate(p => p !== 'visData' && p !== 'updateId', '!visData && !updateId')),

  calcFunc(state) {
    state.value = updateId[0]++;
  }

}));