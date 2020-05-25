<!--<script context="module">-->
<!--	import {webrainGraph} from "./WebrainGraph"-->
<!--	import {WebrainGraphObjectsId} from "./common"-->
<!--	import {-->
<!--		deepSubscribe,-->
<!--		connectorFactory,-->
<!--		deepSubscriber,-->
<!--	} from 'webrain';-->

<!--	let data-->

<!--	if (typeof window !== 'undefined') {-->
<!--		// region init vis network-->

<!--		data = {-->
<!--			nodes: [],-->
<!--			edges: []-->
<!--		}-->

<!--		data.nodes = new vis.DataSet([-->
<!--			// {id: 1, label: 'Node 1'},-->
<!--			// {id: 2, label: 'Node 2'},-->
<!--			// {id: 3, label: 'Node 3'},-->
<!--			// {id: 4, label: 'Node 4'},-->
<!--			// {id: 5, label: 'Node 5'}-->
<!--		])-->

<!--		// create an array with edges-->
<!--		data.edges = new vis.DataSet([-->
<!--			// {from: 1, to: 3},-->
<!--			// {from: 1, to: 2},-->
<!--			// {from: 2, to: 4},-->
<!--			// {from: 2, to: 5},-->
<!--			// {from: 3, to: 3}-->
<!--		])-->

<!--		// endregion-->

<!--		// region bind webrain graph to vis-->

<!--		// docs: https://visjs.github.io/vis-network/docs/network/manipulation.html-->

<!--		// deepSubscribe({-->
<!--		// 	object: webrainGraph,-->
<!--		// 	ruleBuilder: b => b.p('nodes').collection().p('visData'),-->
<!--		// 	changeValue: (key, oldValue, newValue) => {-->
<!--		// 		if (oldValue) {-->
<!--		// 			data.nodes.remove(oldValue)-->
<!--		// 		}-->
<!--		//-->
<!--		// 		if (!newValue) {-->
<!--		// 			return-->
<!--		// 		}-->
<!--		//-->
<!--		// 		data.nodes.add(newValue)-->
<!--		// 		return newValue.propertyChanged.subscribe(() => {-->
<!--		// 			data.nodes.update(newValue)-->
<!--		// 		})-->
<!--		// 	},-->
<!--		// })-->
<!--		//-->
<!--		// deepSubscribe({-->
<!--		// 	object: webrainGraph,-->
<!--		// 	ruleBuilder: b => b.p('edges').collection().p('visData'),-->
<!--		// 	changeValue: (key, oldValue, newValue) => {-->
<!--		// 		if (oldValue) {-->
<!--		// 			data.edges.remove(oldValue)-->
<!--		// 		}-->
<!--		//-->
<!--		// 		if (!newValue) {-->
<!--		// 			return-->
<!--		// 		}-->
<!--		//-->
<!--		// 		data.edges.add(newValue)-->
<!--		// 		return newValue.propertyChanged.subscribe(() => {-->
<!--		// 			data.edges.update(newValue)-->
<!--		// 		})-->
<!--		// 	},-->
<!--		// })-->
<!--		deepSubscribe({-->
<!--			object: webrainGraph,-->
<!--			ruleBuilder: b => b.p('visData'),-->
<!--			changeValue: (key, oldValue, newValue) => {-->
<!--				const nodes = newValue && newValue.nodes-->
<!--				if (nodes) {-->
<!--					data.nodes.update(newValue.nodes)-->
<!--					const ids = data.nodes.getIds()-->
<!--					for (let i = 0, len = ids.length; i < len; i++) {-->
<!--						if (!newValue.groups.nodes[ids[i]]) {-->
<!--							data.nodes.remove(ids[i])-->
<!--						}-->
<!--					}-->
<!--				}-->

<!--				const edges = newValue && newValue.edges-->
<!--				if (edges) {-->
<!--					data.edges.update(edges)-->
<!--					const ids = data.edges.getIds()-->
<!--					for (let i = 0, len = ids.length; i < len; i++) {-->
<!--						if (!newValue.groups.edges[ids[i]]) {-->
<!--							data.edges.remove(ids[i])-->
<!--						}-->
<!--					}-->
<!--				}-->
<!--			},-->
<!--		})-->

<!--		// endregion-->
<!--	}-->


<!--	const createConnector = connectorFactory({-->
<!--		name: 'WebrainView' + WebrainGraphObjectsId,-->
<!--		build: c => c-->
<!--			.connectLazy('visData', b => b.f(o => o.visData))-->
<!--			.connectLazy('isEnabled', b => b.f(o => o.isEnabled, (o, v) => { o.isEnabled = v }))-->
<!--			.connectLazy('highlightMode', b => b.f(o => o.highlightMode, (o, v) => { o.highlightMode = v }))-->
<!--			.connectLazy('searchPattern', b => b.f(o => o.searchPattern, (o, v) => { o.searchPattern = v }))-->
<!--	})-->

<!--	const subscribe = deepSubscriber({-->
<!--		build: b => b.propertyAny(),-->
<!--	})-->
<!--</script>-->

<!--<script>-->
<!--	import {onMount, onDestroy} from 'svelte'-->
<!--	import TestView from './TestView.svelte'-->
<!--	import {objectToString} from "../../../main/common/log/objectToString";-->
<!--	import ObjectTree from "./ObjectTree.svelte";-->
<!--	import {getDisplayName} from "./common";-->
<!--	import {HighlightMode} from "./WebrainGraph";-->

<!--	let network-->
<!--	let container-->
<!--	let containerWrapper-->
<!--	let containerHeight-->
<!--	let containerWidth-->
<!--	let selected = {-->
<!--		-->
<!--	}-->

<!--	const connector = createConnector(webrainGraph)-->
<!--	// $: connector.connectorState.source = webrainGraph-->
<!--	onDestroy(subscribe(connector, function updateView() {-->
<!--		connector.connectorState.source = webrainGraph-->
<!--	}))-->

<!--	let options = {-->
<!--		// https://visjs.github.io/vis-network/docs/network/physics.html-->
<!--		physics: {-->
<!--			enabled: true,-->
<!--			forceAtlas2Based: {-->
<!--				gravitationalConstant: -50,-->
<!--				centralGravity: 0.01,-->
<!--				springLength: 100,-->
<!--				avoidOverlap: 0.5,-->
<!--			},-->
<!--			barnesHut: {-->
<!--				avoidOverlap: 0.5,-->
<!--			},-->
<!--			solver: 'barnesHut',-->
<!--		},-->
<!--	}-->

<!--	$: selected.node = selected.groupNodeId != null && connector.visData && connector.visData.groups.nodes[selected.groupNodeId] && connector.visData.groups.nodes[selected.groupNodeId][0]-->
<!--	$: selected.edge = selected.groupEdgeId != null && connector.visData && connector.visData.groups.edges[selected.groupEdgeId] && connector.visData.groups.edges[selected.groupEdgeId][0]-->
<!--	$: selected.class = selected.node ? 'Node' : (selected.edge && 'Edge')-->
<!--	$: selected.count = selected.edge && selected.edge.count-->
<!--	$: selected.element = selected.node || selected.edge-->
<!--	$: selected.id = selected.element && selected.element.id-->
<!--	$: selected.type = selected.element && selected.element.type-->
<!--	$: selected.value = selected.element && selected.element.value-->
<!--	$: selected.valueHistory = selected.element && selected.element.valueHistory-->
<!--	$: selected.key = selected.element && selected.element.key-->
<!--	$: selected.object = selected.node && selected.node.object-->
<!--	$: selected.error = selected.node && selected.node.error-->
<!--	$: selected.subscribers = selected.object && selected.object.propertyChanged-->
<!--		? selected.object.propertyChanged._subscribers-->
<!--		: null-->

<!--	$: updateOptions(options)-->
<!--	function updateOptions(options) {-->
<!--		if (network) {-->
<!--			network.setOptions(options)-->
<!--		}-->
<!--	}-->

<!--	function simulationPause() {-->
<!--		if (network) {-->
<!--			network.stopSimulation()-->
<!--		}-->
<!--	}-->

<!--	function stabilize() {-->
<!--		if (network) {-->
<!--			network.stabilize(1000)-->
<!--		}-->
<!--	}-->

<!--	onMount(() => {-->
<!--		setTimeout(() => {-->
<!--			containerWidth = containerWrapper.offsetWidth-->
<!--			containerHeight = containerWrapper.offsetHeight-->

<!--			network = new vis.Network(container, data, options)-->
<!--			// stabilize()-->
<!--			// options.physics.enabled = false-->

<!--			network.on("select", function (params) {-->
<!--				const nodeId = params && params.nodes && params.nodes.length && params.nodes[0]-->
<!--				const edgeId = params && params.edges && params.edges.length && params.edges[0]-->

<!--				selected.groupNodeId = nodeId-->
<!--				selected.groupEdgeId = edgeId-->
<!--				// selected.node = nodeId != null && webrainGraph.nodes.get(nodeId)-->
<!--				// selected.edge = edgeId != null && webrainGraph.edges.get(edgeId)-->
<!--			})-->
<!--		}, 100)-->
<!--	})-->
<!--</script>-->

<!--<div class="graph fill flex">-->
<!--	<div-->
<!--		bind:this="{containerWrapper}"-->
<!--		bind:offsetHeight="{containerHeight}"-->
<!--		bind:offsetWidth="{containerWidth}"-->
<!--		class="graph__view flex">-->

<!--		<div bind:this="{container}" class="fill"-->
<!--			style="height: {containerHeight}px; width: {containerWidth}px; ">-->

<!--		</div>-->
<!--	</div>-->
<!--	<div class="graph__controls flex flex&#45;&#45;vertical">-->
<!--		<label><input type="checkbox" bind:checked="{connector.isEnabled}">Enabled</label>-->
<!--		<label><input type="checkbox" bind:checked="{options.physics.enabled}">Physics</label>-->
<!--		<p>Highlight: </p>-->
<!--		<label><input type="radio" bind:group="{connector.highlightMode}" value="{HighlightMode.All}">All</label>-->
<!--		<label><input type="radio" bind:group="{connector.highlightMode}" value="{HighlightMode.LastActive}">Last active</label>-->
<!--		<label><input type="radio" bind:group="{connector.highlightMode}" value="{HighlightMode.CalcTimeSum}">Calc time sum</label>-->
<!--		<label><input type="radio" bind:group="{connector.highlightMode}" value="{HighlightMode.CalcTimeAverage}">Calc time average</label>-->
<!--		<label><input type="radio" bind:group="{connector.highlightMode}" value="{HighlightMode.Subscribers}">Subscribers</label>-->
<!--		<label><input type="radio" bind:group="{connector.highlightMode}" value="{HighlightMode.SearchResults}">Search</label>-->
<!--		<div class="graph__search">-->
<!--			<input class="graph__search-pattern" type="text" bind:value="{connector.searchPattern}"/>-->
<!--			<button class="graph__search-clear" on:click="{() => { connector.searchPattern = '' }}">x</button>-->
<!--		</div>-->
<!--		<button on:click="{simulationPause}">Pause simulation</button>-->
<!--		<button on:click="{stabilize}">Stabilize</button>-->
<!--		<div class="graph__controls-info flex__item&#45;&#45;fill">-->
<!--			<div class="graph__controls-info-content flex flex&#45;&#45;vertical">-->
<!--				<div>-->
<!--					{selected.class}.{selected.type}-->
<!--				</div>-->
<!--				{#if selected.error}-->
<!--					<ObjectTree object="{selected.error}" key="error" expanded={true} />-->
<!--				{/if}-->
<!--				<ObjectTree object="{selected.subscribers}" key="subscribers" expanded={false} />-->
<!--				<ObjectTree object="{selected.id}" key="id" expanded={false} />-->
<!--				<ObjectTree object="{selected.count}" key="count" expanded={false} />-->
<!--				<ObjectTree object="{selected.object}" key="object" expanded={false} />-->
<!--				<ObjectTree object="{selected.key}" key="key" expanded={true} />-->
<!--				<ObjectTree object="{selected.valueHistory}" key="valueHistory" expanded={true} />-->
<!--				<ObjectTree object="{selected.value}" key="value" expanded={true} />-->
<!--			</div>-->
<!--		</div>-->
<!--&lt;!&ndash;		<pre class="graph__controls__info flex__item&#45;&#45;fill">subscribers: {subscribersCount}&ndash;&gt;-->
<!--	</div>-->
<!--</div>-->

<!--<style-js>-->
<!--	import templates from '../../../styles/helpers/templates';-->

<!--	module.exports = [-->
<!--		{-->
<!--			'.graph': {-->
<!--				'&__view': {-->
<!--					flex: 3,-->
<!--					border: `1px solid lightgray`,-->
<!--				},-->
<!--				'&__controls': {-->
<!--					flex: 2,-->
<!--					'&-info': {-->
<!--						position: `relative`,-->
<!--						overflow: `scroll`,-->
<!--						'&-content': {-->
<!--							position: `absolute`,-->
<!--						},-->
<!--					},-->
<!--				},-->
<!--				'&__search': {-->
<!--					display: `flex`,-->
<!--					'&-pattern': {-->
<!--						flex: `auto`,-->
<!--						'flex-grow': `1`,-->
<!--						border: `solid 1px black`,-->
<!--					},-->
<!--					'&-clear': {-->
<!--						flex: `none`,-->
<!--						border: `solid 1px black`,-->
<!--					},-->
<!--				},-->
<!--			},-->
<!--		}-->
<!--	]-->
<!--</style-js>-->
