<script context="module">
	import { connectorFactory } from 'webrain'
	import {TestObject} from "./TestObject";

	const createConnector = connectorFactory({
		name: 'TestView',
		buildRule: c => c
			.connectWritable('value1', b => b.p('value1'))
			.connectWritable('value2', b => b.p('value2'))
			.connect('sum', b => b.p('sum'))
			.connect('time', b => b.p('time'))
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
