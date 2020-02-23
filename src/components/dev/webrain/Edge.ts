import {
	CalcObjectBuilder,
	calcPropertyFactory,
	connectorFactory,
	getObjectUniqueId,
	ObservableClass,
	ObservableObject,
	resolvePath,
	ValueKeyType,
} from 'webrain'
import {
	colorOpacity,
	deepMerge,
	getDisplayName,
	TObjectId,
	updateId,
	VALUE_HISTORY_MAX_SIZE,
	WebrainGraphObjectsId, WebrainObject,
} from './common'

export enum EdgeType {
	ObjectPart = 'ObjectPart',
	Connect = 'Connect',
	Dependency = 'Dependency',
	DeepSubscribe = 'DeepSubscribe',
}

const edgeStyles = {
	common: ({opacity}) => ({
		dashes: false,
		ifNull: {
			// dashes: true,
		},
		font: {
			color: colorOpacity('#000000', opacity),
		},
	}),
	[EdgeType.ObjectPart]: ({opacity}) => ({
		color: colorOpacity('#000000', opacity),
	}),
	[EdgeType.Connect]: ({opacity}) => ({
		color: colorOpacity('#0000ff', opacity),
	}),
	[EdgeType.Dependency]: ({opacity}) => ({
		color: colorOpacity('#df0000', opacity),
	}),
	[EdgeType.DeepSubscribe]: ({opacity}) => ({
		dashes: true,
		color: colorOpacity('#000000', opacity),
	}),
}

export class Edge extends ObservableClass {
	public readonly id: TObjectId
	public readonly fromId: TObjectId
	public readonly toId: TObjectId

	public readonly updateId: number
	public type: EdgeType
	public key: any
	public keyType: ValueKeyType

	public value: any
	public valueHistory: any[] = []
	public count: number

	constructor({
		id,
		type,
		fromId,
		toId,
		key,
		keyType,
	}: {
		id: TObjectId,
		type: EdgeType,
		fromId: TObjectId,
		toId: TObjectId,
		key: any,
		keyType: ValueKeyType,
	}) {
		super()
		this.id = id
		this.type = type
		this.fromId = fromId
		this.toId = toId
		this.key = key
		this.keyType = keyType
	}

	private _visData: any
	public getVisData({opacity, age}) {
		let value = this._visData

		if (!value) {
			this._visData = value = new WebrainObject()
			value.name = 'Edge.WebrainObject' + WebrainGraphObjectsId,
			value.id = this.id
			value.from = this.fromId
			value.to = this.toId
			value.arrows = {
				to: {
					enabled: true,
				},
			}
		}

		const keyStr = this.key
		const valueStr = this.value && getDisplayName(this.value)
		let label = this.key || ''
		// if (valueStr) {
		label += ' = ' + valueStr
		// }
		value.label = label

		if (this.type != null) {
			const common = edgeStyles.common({opacity})
			const specific = edgeStyles[this.type]({opacity})
			const style = deepMerge(
				{ fill: true },
				{},
				common,
				specific,
				this.value == null ? (common as any).ifNull : void 0,
				this.value == null ? (specific as any).ifNull : void 0,
			)

			for (const key in style) {
				if (Object.prototype.hasOwnProperty.call(style, key)) {
					value[key] = deepMerge({fill: false}, value[key], style[key])
				}
			}
		}

		return value
	}
}

new CalcObjectBuilder(Edge.prototype)
	.writable('count')
	.writable('value', {
		setOptions: {
			equalsFunc: () => false,
			afterChange(value) {
				this.valueHistory.push(value)
				if (this.valueHistory.length > VALUE_HISTORY_MAX_SIZE) {
					delete this.valueHistory[this.valueHistory.length - VALUE_HISTORY_MAX_SIZE - 1]
				}
			},
		},
	})
	.calc('updateId',
		o => o, // connect to self
		calcPropertyFactory({
			name: 'Edge.updateId' + WebrainGraphObjectsId,
			dependencies: d => d.invalidateOn(b => b.noAutoRules().propertyPredicate(p => p !== 'visData' && p !== 'updateId', '!visData && !updateId')),
			*calcFunc(state) {
				state.value = updateId[0]++
			},
		}),
	)
