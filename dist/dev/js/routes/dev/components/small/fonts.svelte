<script>
	import {onMount, onDestroy} from 'svelte'

	let container
	let exampleText = 'example Text 137'

	const fonts = [
		'default',
	].sort()

	const setTitle = e => {
		var target = e.target || e.srcElement;
		var style = getComputedStyle(target)
		target.title = JSON.stringify({
			text: target.childNodes.length && Array.from(target.childNodes)
				.map(o => o.nodeName === '#text' ? o.nodeValue.trim() : '')
				.filter(o => o)
				.join(' ')
				.substring(0, 20),
			fontFamily: style.fontFamily,
			fontSize: style.fontSize,
			color: style.color,
			letterSpacing: style.letterSpacing,
			fontWeight: style.fontWeight,
			textDecoration: style.textDecoration,
		}, null, 4)
	}

	// helper:
	onMount(() => {
		// window.addEventListener('mouseover', listener, false)
		// onDestroy(() => {
		// 	window.removeEventListener('mouseover', listener, false)
		// })
	})

</script>

<div bind:this="{container}" class="container flex flex--vertical" on:mouseover="{setTitle}">
	<table class="fonts table-layout">
		{#each fonts as font}
			<tr class="table-layout__row">
				<td class="fonts__cell fonts__name table-layout__cell">
					<span class="fonts__prefix">font-</span>{font}
				</td>
				<td class="fonts__cell table-layout__cell">
					<span class="font-{font}">{exampleText}</span>
				</td>
			</tr>
		{/each}
	</table>
</div>

<style-js>
	import templates from '../../../../styles/helpers/templates';
	import fonts from '../../../../styles/app/templates/fonts';
	import colors from '../../../../styles/app/templates/colors';
	import constants from '../../../../styles/helpers/constants';

	module.exports = [
	    require('../../../../styles/app'),
        {
			'.container': {
				'& > div': {
					margin: `0.2em`,
				}
			},
			'.fonts': {
				'&__cell': {
					'padding-left': `0.5em`,
					'padding-right': `0.5em`,
					'padding-top': `0.2em`,
					'padding-bottom': `0.2em`,
				},
				'&__name': {
					'font-size': `16px`,
				},
				'&__prefix': {
					color: colors.base[12],
				},
			},
			'.font': {
				// '&-step': {
				// 	'&-name': {
				// 		'font-size': `180%`,
				// 		...fonts.teko,
				// 		'letter-spacing': `0.073em`,
				// 		'font-weight': `300`,
				// 		'text-transform': `uppercase`,
				// 	},
				// },
			},
		},
	]

	// TODO: round 'letter-spacing'
</style-js>