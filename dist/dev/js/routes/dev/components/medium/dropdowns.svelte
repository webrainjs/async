<script>
	import DropDown from "../../../../components/app/common/DropDown.svelte";
</script>

<div class="container">
<!--	<div class="dropdown dropdown&#45;&#45;primary flex flex&#45;&#45;vertical">-->
<!--		<button class="dropdown__button"><span><span class="text">Log Out</span></span></button>-->
<!--		<button class="dropdown__button"><span><span class="text">Log Out</span></span></button>-->
<!--		<button class="dropdown__button"><span><span class="text">Log Out</span></span></button>-->
<!--	</div>-->

<!--	<DropDown preferPositions="{['bottom', 'top', 'left', 'right']}" align="end" let:showed="{showed}">-->
<!--		<button slot="control" class="button-ellipsis"><span><span class="text">...</span></span></button>-->
<!--		<div slot="dropdown" class="dropdown dropdown&#45;&#45;table flex flex&#45;&#45;vertical" style="min-width: 16em;">-->
<!--			<button class="dropdown__button"><span><span class="text">Edit</span></span></button>-->
<!--			<button class="dropdown__button"><span><span class="text">Reset Password</span></span></button>-->
<!--			<button class="dropdown__button dropdown__button&#45;&#45;red"><span><span class="text">Delete</span></span></button>-->
<!--		</div>-->
<!--	</DropDown>-->
</div>

<style-js>
	// import templates from '../../../../styles/helpers/templates';
	// import fonts from '../../../../styles/app/templates/fonts';
	// import borders from '../../../../styles/app/templates/borders';
	// import texts from '../../../../styles/app/templates/texts';
	// import buttons from '../../../../styles/global/templates/buttons';
	// import colors from '../../../../styles/app/templates/colors';
	// import constants from '../../../../styles/app/templates/constants';
	// import Color from 'color';

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