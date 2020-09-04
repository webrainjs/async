<script>
	import {onMount} from 'svelte'

	let container

	onMount(() => {
		for(const element of container.children) {
			element.title = element.classList[1]
		}
	})
</script>

<div bind:this="{container}" class="container flex">
<!--	<span class="icon-inline icon-window-minimize">&nbsp;</span>-->
</div>

<style-js>
	import templates from '../../../../styles/helpers/templates';
	import colors from '../../../../styles/app/templates/colors';

	module.exports = [
	    require('../../../../styles/app'),
        {
			'.container': {
				'font-size': `200%`,
				'flex-wrap': `wrap`,
				'user-select': `none`,
				'& > :global(*)': {
					margin: `0.2em`,
				}
			},
		},
	]
</style-js>