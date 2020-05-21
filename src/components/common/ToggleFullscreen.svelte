<!--suppress PointlessBooleanExpressionJS -->
<script>
	import {onMount, onDestroy} from 'svelte'
	import {fullscreenStore} from "./fullscreenStore"
	import Toggle from "./Toggle.svelte"

	export let checked = false
	export let flex = false

	let fullscreen

	let isClick
	function onclick() {
		if (fullscreen) {
			isClick = true
			checked = !checked
		}
	}

	$: fullscreen && updateFullscreen(checked)

	function updateFullscreen(checked) {
		if (checked && !isClick) {
			console.debug('Enter fullscreen can only be initiated by a user gesture')
			checked = false
		}
		isClick = false
		fullscreen.set(checked)
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
	<Toggle checked="{checked}" on:click="{onclick}" {flex}>
		<slot fullscreen={checked}></slot>
	</Toggle>
{/if}
