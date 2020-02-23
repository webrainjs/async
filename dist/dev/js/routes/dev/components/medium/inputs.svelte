<script>

</script>

<div class="container">
<!--	<label class="input-text flex">-->
<!--		<input type="text" class="input-text__input flex__item&#45;&#45;fill font" placeholder="Place Holder" />-->
<!--	</label>-->

<!--	<label class="flex flex&#45;&#45;vertical">-->
<!--		<span class="font-large"><span class="text">First Name*:</span></span>-->
<!--		<div class="input-text flex">-->
<!--			<input type="text" class="input-text__input flex__item&#45;&#45;fill font" placeholder="Place Holder" />-->
<!--		</div>-->
<!--	</label>-->

<!--	<label class="input-select flex">-->
<!--		<select class="input-select__input flex__item&#45;&#45;fill font">-->
<!--			<option>Option 1</option>-->
<!--			<option>Option 2</option>-->
<!--			<option>Option 3</option>-->
<!--		</select>-->
<!--		<div class="input-select__icon-wrapper flex">-->
<!--			<div class="input-select__icon"></div>-->
<!--		</div>-->
<!--	</label>-->
<!--	-->
<!--	<Toggle type="checkbox" let:checked="{checked}">-->
<!--		<div class="flex">-->
<!--			<span class="font-large flex__item&#45;&#45;fill" style="padding-right: 1em;"><span class="text">First Name*:</span></span>-->
<!--			<span class="check-square flex__item&#45;&#45;fit" class:check-square&#45;&#45;checked="{checked}">-->
<!--				<span class="icon icon-check">&nbsp;</span>-->
<!--			</span>-->
<!--		</div>-->
<!--	</Toggle>-->
</div>

<style-js>
	import templates from '../../../../styles/helpers/templates';
	import fonts from '../../../../styles/app/templates/fonts';
	import borders from '../../../../styles/app/templates/borders';
	import texts from '../../../../styles/app/templates/texts';
	import buttons from '../../../../styles/app/templates/buttons';
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