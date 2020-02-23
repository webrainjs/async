import {
	CalcObjectBuilder,
	CalcProperty,
	calcPropertyFactory,
	CalcPropertyState,
	CalcStat,
	Connector,
	connectorFactory,
	ConnectorState,
	Debugger,
	getObjectUniqueId,
	ObjectMap,
	ObservableClass,
	ObservableMap,
	resolvePath,
	ValueChangeType,
	ValueKeyType,
} from 'webrain'
import {localStorageWrapper} from '../../../main/browser/helpers/localStorage'
import {
	getDisplayName,
	NoValue,
	TObjectId,
	updateId,
	WebrainGraphObjectsId,
	WebrainMap,
	WebrainObservableMap,
} from './common'
import {Edge, EdgeType} from './Edge'
import {Node, NodeType} from './Node'

interface ObjectEvent {
	object: any,
	type: NodeType,
	key: any,
	keyType: ValueKeyType,
	value?: any,
	valueChanged?: boolean,
	error?: Error,
}

export enum HighlightMode {
	All = 'All',
	LastActive = 'LastActive',
	CalcTimeSum = 'CalcTimeSum',
	CalcTimeAverage = 'CalcTimeAverage',
	Subscribers = 'Subscribers',
	SearchResults = 'SearchResults',
}

// region helpers

const calcNodeId = (object, key, keyType) => {
	if (object == null) {
		return null
	}

	const objectId = getObjectUniqueId(object)

	if (objectId == null) {
		return null
		// throw new Error(`getObjectUniqueId(${object}) == null`)
	}

	const keyId = getObjectUniqueId(key)
	if (keyId) {
		key = `{${keyId}}`
	}
	return `${objectId}` // TODO add keyType after finish webrain refactoring
}

const calcEdgeId = (fromId, toId, type, key, keyType) => {
	const keyId = getObjectUniqueId(key)
	if (keyId) {
		key = `{${keyId}}`
	}
	return `${fromId}-${toId}-${type}-${key}` // TODO add keyType after finish webrain refactoring
}

// endregion

// region class WebrainGraph

interface IObjectInfo {
	nodes: Node[],
	edges: Edge[],
}

export class WebrainGraph extends ObservableClass {
	public nodes: ObservableMap<TObjectId, Node>
	public edges: ObservableMap<TObjectId, Edge>
	public objects: Map<any, IObjectInfo> = new WebrainMap()
	public isEnabled: boolean = false
	public highlightMode: HighlightMode
	public searchPattern: string
	public readonly visData: any

	private getObjectInfo(object: any): IObjectInfo {
		let objectInfo = this.objects.get(object)
		if (!objectInfo) {
			objectInfo = {
				nodes: [],
				edges: [],
			}
			this.objects.set(object, objectInfo)
		}
		return objectInfo
	}

	private addObjectInfo(object: any, node: Node, edge: Edge): IObjectInfo {
		const objectInfo = this.getObjectInfo(object)
		if (node) {
			objectInfo.nodes.push(node)
		}
		if (edge) {
			objectInfo.edges.push(edge)
		}

		return objectInfo
	}

	private removeObjectInfo(object: any, node: Node, edge: Edge) {
		if (!this.objects.has(object)) {
			return
		}

		const objectInfo = this.objects.get(object)

		let index = objectInfo.nodes.indexOf(node)
		if (index >= 0) {
			objectInfo.nodes.splice(index, 1)
		}

		index = objectInfo.edges.indexOf(edge)
		if (index >= 0) {
			objectInfo.edges.splice(index, 1)
		}

		if (!objectInfo.nodes.length && !objectInfo.edges.length) {
			this.objects.delete(object)
		}
	}

	public getNodeId({
		object,
		type,
		key,
		keyType,
		value,
		valueChanged,
		error,
	}: ObjectEvent): TObjectId {
		if (object == null || object instanceof Date || isWebrainInternalObject(object)) {
			return null
		}

		key = null
		keyType = null

		const nodeId = calcNodeId(object, key, keyType)
		if (nodeId == null) {
			return
		}

		return nodeId
	}

	public setNode({
		object,
		type,
		key,
		keyType,
		value,
		valueChanged,
		error,
	}: ObjectEvent): Node {
		const nodeId = this.getNodeId({
			object,
			type,
			key,
			keyType,
			value,
			valueChanged,
			error,
		})

		if (nodeId == null) {
			return
		}

		const name = getDisplayName(object)

		let node = this.nodes.get(nodeId)
		if (!node) {
			node = new Node({
				id: nodeId,
				object,
				key,
				keyType,
			})
			node.name = name
			this.nodes.set(nodeId, node)
			// this.addObjectInfo(object, node, null)

			if (object
				&& object.propertyChanged
			) {
				let unsubscribed
				const unsubscribe = object.propertyChanged.hasSubscribersObservable
					.subscribe(hasSubscribers => {
						if (!hasSubscribers) {
							// this.nodes.delete(nodeId)
							// this.removeEdges({nodeId})
							// this.removeObjectInfo(object, node, null)
							if (unsubscribe) {
								unsubscribed = true
								unsubscribe()
							}
						}
					}, 'Node object.hasSubscribersObservable')
				if (unsubscribed) {
					unsubscribe()
					return null
				}
			}
		}
		node.name = name
		if (type != null) {
			node.type = type
		}
		if (error != null) {
			node.error = error
		}
		if (value !== NoValue) {
			// const oldObjectInfo = getObjectUniqueId(node.value) && this.objects.get(node.value)
			// const newObjectInfo = getObjectUniqueId(value) && this.objects.get(value)

			if (node.value !== value || valueChanged) {
				node.value = value
			}

			// if (oldObjectInfo) {
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

		return node
	}
	
	public setEdge({
		type,
		key,
		keyType,
		value,
		from,
		to,
	}: {
		type: EdgeType,
		key: any,
		keyType: ValueKeyType,
		value: any,
		from: ObjectEvent | Node,
		to: ObjectEvent | Node,
	}) {
		// TODO: remove this after webrain refactoring will finish
		if (!(from instanceof Node) && keyType == null) {
			from.keyType = 0
		}
		if (!(to instanceof Node) && to.keyType == null) {
			to.keyType = 0
		}
		if (keyType == null) {
			keyType = 0
		}

		if (from.object instanceof CalcProperty) {
			from.key = null
			from.keyType = null
		}

		const fromId = from instanceof Node ? from.id : this.getNodeId(from)
		const toId = to instanceof Node ? to.id : this.getNodeId(to)

		// if (!fromId && toId) {
		// 	this.removeEdges({type, fromId, toId})
		// 	return
		// }
	
		if (fromId && toId) {
			if (!(from instanceof Node)) {
				from = this.setNode(from)
			}
			if (!(to instanceof Node)) {
				to = this.setNode(to)
			}

			const edgeId = calcEdgeId(fromId, toId, type,
				key,
				keyType,
			)
			let edge = this.edges.get(edgeId)
			if (!edge) {
				edge = new Edge({
					id: edgeId,
					type,
					fromId,
					toId,
					key,
					keyType,
				})
				this.edges.set(edgeId, edge);
				(from as Node).edgesCountOut++
				(to as Node).edgesCountIn++
			}

			edge.count = (edge.count || 0) + 1

			if (value !== NoValue) {
				// tslint:disable-next-line:no-collapsible-if
				if (edge.value !== value || (!(to instanceof Node) && to.valueChanged)) {
					edge.value = value
				}
			}
		}
	}

	public removeEdges({
		type,
		key,
		keyType,
		fromId,
		toId,
		nodeId,
	}: {
		type?: EdgeType,
		key?: any,
		keyType?: ValueKeyType,
		fromId?: TObjectId,
		toId?: TObjectId,
		nodeId?: TObjectId,
	}) {
		// TODO: remove this after webrain refactoring will finish
		if (keyType == null) {
			keyType = 0
		}

		// remove edge
		const removeEntries = []
		for (const entry of this.edges) {
			const [id, edge] = entry

			if (type != null && edge.type !== type) {
				continue
			}

			if (key != null && keyType != null && (edge.key !== key || edge.keyType !== keyType)) {
				continue
			}

			if (nodeId == null || edge.fromId !== nodeId && edge.toId !== nodeId) {
				if (fromId == null || toId == null) {
					if ((fromId == null || edge.fromId !== fromId) && (toId == null || edge.toId !== toId)) {
						continue
					}
				} else if (edge.fromId !== fromId || edge.toId !== toId) {
					continue
				}
			}

			if (edge.count == null || --edge.count <= 0) {
				removeEntries.push(entry)
			}
		}

		for (let i = 0, len = removeEntries.length; i < len; i++) {
			const [id, edge] = removeEntries[i]
			this.edges.delete(id)
			const from = this.nodes.get(edge.fromId)
			const to = this.nodes.get(edge.toId)
			from.edgesCountOut--
			to.edgesCountIn--
			if (from.edgesCount <= 0) {
				this.nodes.delete(from.id)
			}
			if (to.edgesCount <= 0) {
				this.nodes.delete(to.id)
			}
		}
	}

	private _initialized: boolean

	public init() {
		if (this._initialized) {
			return
		}
		this._initialized = true

		if (typeof window === 'undefined') {
			return
		}

		if (!this.isEnabled) {
			return
		}

		Debugger.Instance.calculatedObservable.subscribe(e => {
			// console.log('calculatedObservable', e)
			setTimeout(() => {
				this.setNode({
					object: e.target,
					type: NodeType.CalcProperty,
					key: null,
					keyType: null,
					value: e.newValue,
					valueChanged: true,
				})
			})
		}, 'WebrainGraph calculatedObservable')

		Debugger.Instance.errorObservable.subscribe(e => {
			setTimeout(() => {
				this.setNode({
					object: e.target,
					type: NodeType.CalcProperty,
					key: null,
					keyType: null,
					value: NoValue,
					error: e.error,
				})
			})
			console.error('Debugger Error', e)
		}, 'WebrainGraph errorObservable')

		// Debugger.Instance.connectorObservable.subscribe(e => {
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

		Debugger.Instance.deepSubscribeObservable.subscribe(e => {
			setTimeout(() => {
				let fromId
				let toId

				if (typeof e.target === 'function' && e.target.name === 'updateView') {
					e.oldIsLeaf = false
					e.newIsLeaf = false
				}

				let nodeType: NodeType
				let edgeType: EdgeType
				if (e.target instanceof CalcProperty) {
					edgeType = EdgeType.Dependency
					// nodeType = NodeType.CalcProperty
				} else if (e.target instanceof Connector) {
					edgeType = EdgeType.Connect
					nodeType = NodeType.Connector
				} else {
					edgeType = EdgeType.DeepSubscribe
				}

				if ((!e.oldIsLeaf || nodeType !== NodeType.Connector || typeof e.oldValue !== 'undefined') &&
					(e.changeType & ValueChangeType.Unsubscribe) !== 0
				) {
					fromId = this.getNodeId({
						object: e.parent,
						type: null,
						key: null,
						keyType: null,
						value: NoValue,
					})

					toId = this.getNodeId({
						object: e.oldIsLeaf ? e.target : e.oldValue,
						type: null,
						key: null,
						keyType: null,
						value: NoValue,
					})
				}

				if ((!e.newIsLeaf || nodeType !== NodeType.Connector || typeof e.newValue !== 'undefined') &&
					(e.changeType & ValueChangeType.Subscribe) !== 0
				) {
					this.setEdge({
						type: e.newIsLeaf ? edgeType : EdgeType.DeepSubscribe,
						key: e.key,
						keyType: e.keyType,
						value: e.newValue,
						from: {
							object: e.parent,
							type: null,
							key: null,
							keyType: null,
							value: NoValue,
						},
						to: {
							object: e.newIsLeaf ? e.target : e.newValue,
							type: e.newIsLeaf ? nodeType : null,
							key: null,
							keyType: null,
							value: NoValue,
						},
					})
				}

				if (fromId && toId) {
					this.removeEdges({
						type: e.oldIsLeaf ? edgeType : EdgeType.DeepSubscribe,
						key: e.key,
						keyType: e.keyType,
						fromId,
						toId,
					})
				}
				// console.log('deepSubscribeObservable', e)
			})
		}, 'WebrainGraph deepSubscribeObservable')

		// Debugger.Instance.deepSubscribeLastValueObservable.subscribe(e => {
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
}

// see graphic: https://www.desmos.com/calculator/cdxbsjigvu
const opacityMin = 0.15
function calcOpacityLastActive(itemUpdateId, currentUpdateId) {
	const delta = currentUpdateId - itemUpdateId
	return Math.exp(- delta / 30) * (1 - opacityMin) + opacityMin
}

const ln2 = Math.log(2)
function calcOpacityCalcTime(calcTime, halfOpacityForCalcTime) {
	return (1 - Math.exp(- calcTime * ln2 / halfOpacityForCalcTime)) * (1 - opacityMin) + opacityMin
}

new CalcObjectBuilder(WebrainGraph.prototype)
	.writable('isEnabled')
	.writable('highlightMode')
	.writable('searchPattern', {
		setOptions: {
			afterChange(value) {
				if (value) {
					this.highlightMode = HighlightMode.SearchResults
				}
			},
		},
	})
	.readable('nodes', {
		factory: () => new WebrainObservableMap<TObjectId, Node>(new ObjectMap<Node>()),
	})
	.readable('edges', {
		factory: () => new WebrainObservableMap<TObjectId, Edge>(new ObjectMap<Edge>()),
	})
	.calc('visData',
		connectorFactory({
			name: 'WebrainGraph.Connector.visData' + WebrainGraphObjectsId,
			buildRule: c => c
				.connect('nodes', b => b.p('nodes'))
				.connect('edges', b => b.p('edges'))
				.connect('highlightMode', b => b.p('highlightMode'))
				.connect('searchPattern', b => b.p('searchPattern')),
		}),
		calcPropertyFactory({
			name: 'WebrainGraph.visData' + WebrainGraphObjectsId,
			dependencies: d => d.invalidateOn(b => b
				.any(
					b2 => b2.p('highlightMode', 'searchPattern'),
					b2 => b2
						.p('nodes', 'edges')
						.collection()
						.p('updateId'),
				),
			), // invalidate on change self
			*calcFunc(state) {
				const {input} = state
				let {value} = state

				if (!value) {
					value = {
						nodes: [],
						edges: [],
					}
				}

				// let minUpdateId = (state as any).minUpdateId || 0
				// let maxUpdateId = minUpdateId
				const currentUpdateId = updateId[0]

				let searchRegexp
				try {
					searchRegexp = state.input.searchPattern && new RegExp(state.input.searchPattern, 'ig')
				} catch (ex) {
					console.log(ex)
				}

				const _calcOpacity = (name, val, itemUpdateId, calcStat: CalcStat) => {
					switch (input.highlightMode) {
						case HighlightMode.CalcTimeSum:
							return calcStat == null
								? opacityMin
								: calcOpacityCalcTime(calcStat.sum, 1000)
						case HighlightMode.CalcTimeAverage:
							return calcStat == null
								? opacityMin
								: calcOpacityCalcTime(calcStat.average, 20)
						case HighlightMode.Subscribers:
							return val != null
								&& val.propertyChanged
								&& val.propertyChanged._subscribers
								&& val.propertyChanged._subscribers.length
								? calcOpacityCalcTime(val.propertyChanged._subscribers.length, 2)
								: opacityMin
						case HighlightMode.LastActive:
							return calcOpacityLastActive(itemUpdateId, currentUpdateId)
						case HighlightMode.SearchResults:
							if (searchRegexp) {
								if (searchRegexp.test(name + '') || searchRegexp.test(getDisplayName(val))) {
									return 1
								} else {
									return opacityMin
								}
							}
							break
						default:
							return 1
					}
				}

				// region groups

				value.groups = {
					nodes: { },
					edges: { },
				}

				const nodeIdToGroupId = {}
				const edgeIdToGroupId = {}

				const calcNodeGroupId = node => {
					return node.object.constructor.name
				}

				for (const item of Array.from(input.nodes.values()).sort((o1, o2) => o1.updateId - o2.updateId)) {
					const groupId = calcNodeGroupId(item)
					nodeIdToGroupId[item.id] = groupId
					let group = value.groups.nodes[groupId]
					if (!group) {
						value.groups.nodes[groupId] = group = [item]
					} else {
						group.push(item)
					}
				}

				for (const item of Array.from(input.edges.values()).sort((o1, o2) => o1.updateId - o2.updateId)) {
					const groupIdFrom = nodeIdToGroupId[item.fromId]
					const groupIdTo = nodeIdToGroupId[item.toId]
					const groupId = `${groupIdFrom}-${groupIdTo}`
					edgeIdToGroupId[item.id] = groupId
					let group = value.groups.edges[groupId]
					if (!group) {
						value.groups.edges[groupId] = group = [item]
					} else {
						group.push(item)
					}
				}

				// endregion

				// region nodes

				let i = 0
				for (const groupId in value.groups.nodes) {
					if (Object.prototype.hasOwnProperty.call(value.groups.nodes, groupId)) {
						const group = value.groups.nodes[groupId]
						const item = group[0]
						const itemUpdateId = yield resolvePath(item)(o => o.updateId)()
						const age = currentUpdateId - itemUpdateId
						const opacity = _calcOpacity(
							item.name,
							item.object,
							itemUpdateId,
							item.object instanceof CalcProperty
								? item.object.timeTotalStat
								: null,
						)
						const visData = item.getVisData({opacity, age})
						value.nodes[i++] = {
							...visData,
							id: groupId,
						}

						// if (node.updateId > minUpdateId) {
						// 	if (node.updateId > maxUpdateId) {
						// 		maxUpdateId = node.updateId
						// 	}
						// 	value.nodes[i++] = node
						// }
					}
				}
				value.nodes.length = i

				// endregion

				// region edges

				i = 0
				for (const groupId in value.groups.edges) {
					if (Object.prototype.hasOwnProperty.call(value.groups.edges, groupId)) {
						const group = value.groups.edges[groupId]
						const item = group[0]
						const itemUpdateId = yield resolvePath(item)(o => o.updateId)()
						const age = currentUpdateId - itemUpdateId
						const opacity = _calcOpacity(item.key, item.value, itemUpdateId, null)
						const visData = item.getVisData({opacity, age})
						value.edges[i++] = {
							...visData,
							id: groupId,
							from: nodeIdToGroupId[item.fromId],
							to: nodeIdToGroupId[item.toId],
						}
					}
				}
				value.edges.length = i

				// endregion

				// (state as any).minUpdateId = maxUpdateId + 1

				// console.log('webrain update count = ' + (value.nodes.length + value.edges.length))
				// console.log('webrain update: ', value)

				state.value = value

				return true
			},
			calcOptions: {
				throttleTime: 500,
				maxThrottleTime: 2000,
				minTimeBetweenCalc: 1000,
			},
		}),
	)

// endregion

export const webrainGraph = new WebrainGraph()
if (typeof window !== 'undefined') {
	storeWebrainGraph(webrainGraph)
}

// region helpers

async function storeWebrainGraph(object: WebrainGraph) {
	const storageKey = 'webrainGraph'
	const stateStr: string = await localStorageWrapper.getItem(storageKey)
	const state: any = stateStr && JSON.parse(stateStr)
	if (state) {
		// object.isEnabled = state.isEnabled
		object.highlightMode = state.highlightMode
		object.searchPattern = state.searchPattern
	}
	const saveState = async () => {
		await localStorageWrapper.setItem(storageKey, JSON.stringify({
			// isEnabled: object.isEnabled,
			highlightMode: object.highlightMode,
			searchPattern: object.searchPattern,
		}))
	}
	object.propertyChanged.subscribe(saveState, 'storeWebrainGraph')
}

const webrainGraphClasses = [Edge, Node, WebrainGraph]
export function isWebrainInternalObject(object) {
	if (!object || typeof object !== 'object') {
		return false
	}

	if (object instanceof Node
		|| object instanceof Edge
		|| object instanceof WebrainGraph
		|| object instanceof WebrainMap
		|| object instanceof WebrainObservableMap
		|| object instanceof ConnectorState
		|| object instanceof CalcPropertyState
		// || object instanceof Connector
	) {
		return true
	}

	const name = object instanceof CalcProperty && object.state.name
		|| object instanceof Connector && object.connectorState.name

	if (name && name.indexOf(WebrainGraphObjectsId) >= 0) {
		return true
	}

	if (webrainGraphClasses.indexOf(object.constructor) >= 0) {
		return true
	}

	return false
}

// endregion
