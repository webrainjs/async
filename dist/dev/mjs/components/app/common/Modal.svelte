<script>
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	function close() {
		dispatch('close')
	}
</script>

<div class="modal flex flex--align-center fill">
	<div class="modal__background fill blur" on:click="{close}"></div>
	<div class="modal__wrapper stretch-horizontal stretch-vertical">
		<div class="modal__content">
			<slot></slot>
		</div>
	</div>
</div>

<style-js>
	import templates from '../../../styles/helpers/templates';
	import colors from '../../../styles/app/templates/colors';
	import fonts from '../../../styles/app/templates/fonts';
	import borders from '../../../styles/app/templates/borders';
	import buttons from '../../../styles/global/templates/buttons';
	import constants from '../../../styles/app/templates/constants';

	module.exports = [
		require('../../../styles/app'),
		{
			'.modal': {
				'z-index': 1000,
				'padding-top': `1.7em`,
				position: `fixed`,
				'&__background': {

				},
				'&__wrapper': {
					...templates.contentCenter,
				},
				'&__content': {
					'text-align': `left`,
				},
			},
		},
	]
</style-js>
