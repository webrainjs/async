<script>
	import {getDisplayName} from "./common"

	export let key = null
	export let name = null
	export let object = void 0
	export let expanded = false
	let canExpand
	$: canExpand = object && (typeof object === 'object' || typeof object === 'function')

	$: name = getDisplayName(object)

	function isMap(object) {
		return object[Symbol.toStringTag] === 'Map'
	}

	function isIterable(object) {
		return typeof object[Symbol.iterator] === 'function'
	}

	let hiddenKeys = ['__meta', '__fields']

	function objectKeys(object) {
		const keys = []
		for(const key in object) {
			keys.push(key)
		}
		for (let i = 0, len = hiddenKeys.length; i < len; i++) {
			const key = hiddenKeys[i]
			if (key in object) {
				keys.push(key)
			}
		}
		return keys
	}

	function funcEntries(func) {
		const object = {}
		for(const key in func) {
			object[key] = func[key]
		}
		const description = object.description
		if (typeof description === 'object') {
			delete object.description
			Object.assign(object, description)
		}
		if (typeof object.propertiesPath === 'function') {
			object.propertiesPath = object.propertiesPath()
		}
		return Object.entries(object)
	}

</script>

<div class="object-tree flex flex--vertical">
	<div class="object-tree__header">
		<input type="checkbox" bind:checked="{expanded}" disabled="{!canExpand}"> <b>{key}</b>: {name}
	</div>
	<div class="object-tree__content flex flex--vertical">
		{#if expanded && canExpand}
			{#if typeof object === 'function'}
				{#each funcEntries(object) as [key, value]}
					<svelte:self object="{value}" {key} />
				{/each}
			{:else if isMap(object)}
				{#each Array.from(object) as [key, value]}
					<svelte:self object="{value}" {key} />
				{/each}
			{:else if isIterable(object) && !Array.isArray(object)}
				{#each Array.from(object) as value, key}
					<svelte:self object="{value}" {key} />
				{/each}
			{:else}
				{#each objectKeys(object) as key}
					<svelte:self object="{object[key]}" {key} />
				{/each}
			{/if}
		{/if}
	</div>
</div>

<style-js>
	import templates from '../../../styles/helpers/templates';

	module.exports = [
		{
			'.object-tree': {
				'&__header': {
					...templates.noWrap(),
				},
				'&__content': {
					'margin-left': `2em`,
				},
			},
		}
	]
</style-js>