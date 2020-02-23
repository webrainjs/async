<!--suppress PointlessBooleanExpressionJS -->
<script>
	import {onMount, onDestroy} from 'svelte'
	import {fullscreenStore} from "./fullscreenStore"
	import Toggle from "./Toggle.svelte"

	export let checked = false

	let fullscreen

	function onclick() {
		fullscreen && fullscreen.toggle()
	}

	let elem
	onMount(() => {
		fullscreen = fullscreenStore(elem)
		fullscreen && fullscreen.subscribe(o => { checked = o })
	})

	onDestroy(() => fullscreen && fullscreen.destroy())
</script>

<span bind:this="{elem}" style="display: none"></span>
{#if fullscreen}
	<Toggle checked="{checked}" on:click="{onclick}">
		<slot fullscreen={checked}></slot>
	</Toggle>
{/if}
