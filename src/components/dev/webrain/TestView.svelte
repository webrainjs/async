<script context="module">
	import { dependConnectorFactory } from 'webrain'
	import {TestObject} from "./TestObject";

	const createConnector = dependConnectorFactory({
		name: 'TestView',
		build: c => c
			.connectLazy('value1', b => b.f(o => o.value1, (o, v) => { o.value1 = v }))
			.connectLazy('value2', b => b.f(o => o.value2, (o, v) => { o.value2 = v }))
			.connectLazy('sum', b => b.f(o => o.sum))
			.connectLazy('time', b => b.f(o => o.time))
	})

	const source = new TestObject()
</script>

<script>
	import {onDestroy} from "svelte";

	const connector = createConnector(source)
	$: connector.connectorState.source = source
	const unsubscribe = connector.propertyChanged.subscribe(() => {
		connector.connectorState.source = source
	})
</script>

<button on:click="{() => { connector.value1++; connector.connectorState.source = source; }}">
	change value1
</button>
<button on:click="{() => connector.value2++}">
	change value2
</button>
<pre>
value1: {connector.value1}
value2: {connector.value2}
sum: {connector.sum}
time: {connector.time}
</pre>
