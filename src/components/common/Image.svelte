<script>
	import {onMount, onDestroy} from 'svelte'

	export let attrs
	let img
	let hasError

	onMount(() => {
		const onerror = () => { hasError = true }
		const onload = () => { hasError = false }
		img.addEventListener("error", onerror)
		img.addEventListener("load", onload)
	})

	onDestroy(() => {
		if (img) {
			img.removeEventListener("error", onerror)
			img.removeEventListener("load", onload)
		}
	})
</script>

<span class:hasError>
	<img
		bind:this="{img}"
		...attrs
		on:error="{() => { hasError = true }}"
		on:load="{() => { hasError = false }}"
	/>
</span>

<style>
	.hasError {
		display: none;
	}
</style>