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
<!--	<button class="button-emphasis"><span><span class="text">Activate Alert</span></span></button>-->
<!--	<a href="." class="button-link"><span><span class="text">Click to minimize</span></span></a>-->
<!--	<button class="button-close button-close&#45;&#45;small flex">-->
<!--		<span class="button-close__icon icon&#45;&#45;gray ghost icon-block icon-window-close">&nbsp;</span>-->
<!--	</button>-->
<!--	<Toggle type="checkbox" let:checked="{checked}">-->
<!--		<span class="check-round" class:check-round&#45;&#45;checked="{checked}">-->
<!--			<span class="icon icon-check">&nbsp;</span>-->
<!--		</span>-->
<!--	</Toggle>-->
</div>

<style-js>
	import templates from '../../../../styles/helpers/templates';
	import fonts from '../../../../styles/app/templates/fonts';
	import borders from '../../../../styles/app/templates/borders';
	import buttons from '../../../../styles/app/templates/buttons';
	import colors from '../../../../styles/app/templates/colors';
	import constants from '../../../../styles/app/templates/constants';

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
		}
	]
</style-js>