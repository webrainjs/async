<script>
	import {onMount} from 'svelte'

	let container

	onMount(() => {
		for (const element of container.children) {
			element.title = element.classList[0]
		}
	})
</script>

<div bind:this="{container}" class="container">
<!--	<span class="marker-count"><span class="text">99</span></span>-->
<!--	<span class="marker-indicator marker-indicator&#45;&#45;red"></span>-->
</div>

<style-js>
	import templates from '../../../../styles/helpers/templates';
	import fonts from '../../../../styles/app/templates/fonts';
	import borders from '../../../../styles/app/templates/borders';
	import texts from '../../../../styles/app/templates/texts';
	import buttons from '../../../../styles/global/templates/buttons';
	import colors from '../../../../styles/app/templates/colors';
	import constants from '../../../../styles/app/templates/constants';
	import Color from 'color';

	module.exports = [
	    require('../../../../styles/app'),
        {

		},
		{
			'.container': {
				'& > :global(*)': {
					margin: `0.2em`,
					'float': `left`,
				}
			},
		},
	]
</style-js>