<script>
	import {onMount, onDestroy} from 'svelte'

	let container

	const fontFamilies = [
		'arial',
		'tahoma',
		'timesNewRoman',
		'sourceSansPro',
	]

</script>

<div bind:this="{container}" class="container">
	<div class="font-family font-family--multiline">
		<span class="font-family__base"><div class="text">Wgj base Wgj base Wgj base Wgj base Wgj base</div></span>
		<span class="font-family__base"><span class="text">Wgj-base Wgj-base Wgj-base Wgj-base Wgj-base</span></span>
		{#each fontFamilies as fontFamily}
			<span class="font-family__icon-inline icon-inline">&nbsp;</span>
			<span class="font-family__other font-family-{fontFamily}"><span class="text" title="{fontFamily}">Wgj {fontFamily} Wgj {fontFamily} Wgj {fontFamily} Wgj {fontFamily} Wgj {fontFamily}</span><span class="font-family__icon-inline icon-inline">&nbsp;</span></span>
			<span class="font-family__other font-family-{fontFamily}"><div class="text" title="{fontFamily}">Wgj-{fontFamily} Wgj-{fontFamily} Wgj-{fontFamily} Wgj-{fontFamily} Wgj-{fontFamily}</div><span class="font-family__icon-inline icon-inline">&nbsp;</span></span>
		{/each}
	</div>
	{#each fontFamilies as fontFamily}
		<div class="font-family">
			<div class="font-family__backgrounds">
				<div class="font-family__background"></div>
				<div class="font-family__background-2"></div>
			</div>
			<div class="font-family__content">
				<span class="font-family__base"><div class="text">Wgj</div></span>
<!--				<span class="font-family__icon icon-inline">&nbsp;</span>-->
				<span class="font-family__other font-family-{fontFamily}"><div class="text" title="{fontFamily}">Wgj</div><span class="font-family__icon-inline icon-inline">&nbsp;</span><span class="text" title="{fontFamily}">Wgj</span></span>
			</div>
		</div>
		<div class="font-family font-family--line-height-2">
			<div class="font-family__backgrounds">
				<div class="font-family__background"></div>
				<div class="font-family__background-2"></div>
			</div>
			<div class="font-family__content">
				<span class="font-family__base"><div class="text">Wgj</div></span>
<!--				<span class="font-family__icon icon-inline">&nbsp;</span>-->
				<span class="font-family__other font-family-{fontFamily}"><div class="text" title="{fontFamily}">Wgj</div><span class="font-family__icon-inline icon-inline">&nbsp;</span><span class="text" title="{fontFamily}">Wgj</span></span>
			</div>
		</div>
	{/each}
</div>

<style-js>
	import templates from '../../../../styles/helpers/templates';
	import fonts from '../../../../styles/app/templates/fonts';
	import colors from '../../../../styles/app/templates/colors';
	import constants from '../../../../styles/helpers/constants';

	const fontFamily = templates.fontFamily

	module.exports = [
	    require('../../../../styles/app'),
	    {
			'.text': {
				'background-color': `rgba(233,255,255,0.2)`,
			},
			'div.text': {
				'display': `inline-block`,
			},
			'.font-family': {
				'&-arial': {
					...templates.fonts.arial,
					// ...fontFamily({
					// 	family: 'Arial',
					// 	size: 0.948,
					// 	offsetY: 0.016,
					// }),
				},
				'&-tahoma': {
					...templates.fonts.tahoma,
					// ...fontFamily({
					// 	family: 'Tahoma',
					// 	size: 0.933,
					// 	offsetY: 0.016,
					// }),
				},
				'&-timesNewRoman': {
					...templates.fonts.timesNewRoman,
					// ...fontFamily({
					// 	family: 'Times New Roman',
					// 	size: 1,
					// 	offsetY: 0,
					// }),
				},
				'&-sourceSansPro': {
					...fonts.sourceSansPro,
					// ...fontFamily({
					// 	family: 'Source Sans Pro',
					// 	size: 1.035,
					// 	offsetY: 0.016,
					// }),
				},
			},
		},
        {
			'.container': {
				...templates.fill,
				'overflow': `auto`,
			},
			'.font-family': {
				'margin': '0.2em',
				'background-color': `gray`,
				position: `relative`,
				'white-space': `nowrap`,
				'font-size': `3000%`,
				height: `1.2em`,
				width: `100em`,
				'&__content': {
					position: `absolute`,
					top: `0.1em`,
					left: `0.1em`,
					width: `100em`,
					'background-color': `rgba(0,0,0,0.2)`,
				},
				'&__base, &__other, &__icon': {
					'line-height': 1,
					float: `left`,
				},
				'&__base': {
					'font-family': constants.fonts.base,
					...fontFamily({
						family: constants.fonts.base,
						size: 1,
						offsetY: 0,
					}),
					'background-color': `rgba(0,255,0,0.4)`,
				},
				'&__other': {
					'background-color': `rgba(0,0,255,0.4)`,
				},
				'&__icon, &__icon-inline': {
					'background-color': `rgba(255,255,0,0.4)`,
				},
				'&__backgrounds': {
					position: `absolute`,
					top: `0.1em`,
					height: `1em`,
					width: `100em`,
					'background-color': `white`,
				},
				'&__background': {
					...templates.fill,
					'background-color': `red`,

					top: `50%`,
					height: `1em`,
					'margin-top': `-0.5em`,
				},
				'&__background-2': {
					...templates.fill,
					'background-color': `yellow`,

					top: `50%`,
					height: `.68em`,
					'margin-top': `-.3264em`,
				},
				'&--line-height-2': {
					'margin-bottom': '0.4em',
					height: `2.4em`,
					'.font-family': {
						'&__base, &__other, &__icon': {
							'line-height': 2,
							float: `left`,
						},
						'&__content': {
							top: `0.2em`,
						},
						'&__backgrounds': {
							top: `0.2em`,
							height: `2em`,
						},
					},
				},
				'&--multiline': {
					width: '15em',
					height: 'auto',
					'font-size': `100%`,
					'white-space': `initial`,
					'div': {
						display: `inline-block`,
					},
					'span, div': {
						float: `none`,
					},
				},
			},
		},
	]
</style-js>