<script>
	import Webrain from "../dev/webrain/Webrain.svelte"
	import Window from "./Window.svelte"

	export let win
</script>

<Window title="Webrain" canDev={false} {win}>
	<Webrain/>
</Window>

<style-js>

</style-js>
