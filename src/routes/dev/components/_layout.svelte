<script>
	import {stores} from 'SAPPER_MODULE/app'
	const pageStore = stores()
	const page = pageStore && pageStore.page

	let paths = {
		'small/icons': { completed: true, background: `black`, layout: 'series' },
		'small/fonts': { completed: true, background: `black`, layout: 'series' },
		'small/font-families': { completed: true, background: `black`, layout: 'fill' },
		'small/buttons': { completed: true, background: `black`, layout: 'series' },
		'small/markers': { completed: true, background: `black`, layout: 'series' },
		'medium/dropdowns': { completed: true, background: `black`, layout: 'series' },
		'medium/inputs': { completed: true, background: `black`, layout: 'series' },
	}

	const rootPath = 'dev/components/'
	let currentPath
	page.subscribe(o => {
		currentPath = o.path.substring(rootPath.length + 1)
	})

	let options
	$: options = paths[currentPath] || {}
</script>

<div class="components flex font-base">
	<div class="components__menu flex__item--fit flex flex--vertical">
		{#each Object.entries(paths) as [path, options]}
			<a
				href="{rootPath}{path}"
				rel="{options && options.prefetch === false ? null : 'prefetch'}"
				class="components__menu-item button flex__item--fit flex flex--vertical"
				class:components__menu-item--selected="{currentPath === path}"
				class:components__menu-item--completed="{options && options.completed}"
				>
				{path}
			</a>
		{/each}
	</div>
	<div class="flex__item--fill flex flex--vertical">
		<div
			class="components__title flex__item--fit"
			class:components__title--completed="{options && options.completed}"
			>
			{currentPath || '/'}
		</div>
		{#if options.layout === 'series'}
			<div class="flex__item--fill position-relative scroll-vertical" style="background: {options.background || 'none'};">
				<div
					class="scroll-vertical__content flex overflow-visible"
					class:flex--vertical="{!options || !options.vertical}"
					>
					<div class="layout-{options.layout}__component">
						<slot></slot>
					</div>
				</div>
			</div>
		{:else if options.layout === 'design-horizontal'}
			<div class="flex__item--fill position-relative scroll-horizontal" style="background: {options.background || 'none'};">
				<div class="scroll-horizontal__content flex overflow-visible">
					<div class="components__design flex padding-right-base">
						{#each options.images || [`client/images/design/${currentPath}.png`] as image}
							<img src="{image}" class="design-image" alt="Design image"/>
						{/each}
					</div>
					<div class="components__component">
						<slot></slot>
					</div>
				</div>
			</div>
		{:else if options.layout === 'design-vertical'}
			<div class="flex__item--fill position-relative scroll-vertical" style="background: {options.background || 'none'};">
				<div class="scroll-vertical__content flex flex--vertical overflow-visible">
					<div class="components__component">
						<slot></slot>
					</div>
					<div class="components__design flex flex--vertical" style="padding-top: 1em;">
						{#each options.images || [`client/images/design/${currentPath}.png`] as image}
							<img src="{image}" class="design-image" alt="Design image"/>
						{/each}
					</div>
				</div>
			</div>
		{:else if options.layout === 'fill'}
			<div class="flex__item--fill position-relative" style="background: {options.background || 'none'};">
				<slot></slot>
			</div>
		{/if}
	</div>
</div>

<style-js>
	import templates from '../../../styles/helpers/templates';
	import {fonts} from '../../../styles/helpers/constants';

	module.exports = [
	    require('../../../styles/app'),
        {
        	'.scroll': {
				'&__content': {
					padding: `0.8em`,
					position: `absolute`,
				},
				'&-vertical': {
					'&__content': {
						padding: `0.5em`,
						position: `absolute`,
						left: 0,
						right: 0,
					},
				},
				'&-horizontal': {
					'&__content': {
						padding: `0.5em`,
						position: `absolute`,
						top: 0,
						bottom: 0,
					},
				},
			},
			'.components': {
				...templates.fill,
				'&__menu': {
					'border-right': `solid black 1.5px`,
					'z-index': `1000000`,
					'&-item': {
						margin: `0.1em`,
						padding: `0.1em`,

						'font-size': `140%`,
						'font-family': fonts.monospace,
						...templates.anchorColor({all: `black`}),

						'background-color': `#eeeeee`,
						'&--selected': {
							'background-color': `#cccccc`,
						},
						'&:hover': {
							'background-color': `#dddddd`,
						},
						'&--completed': {
							'font-weight': `bold`,
							...templates.anchorColor({all: `blue`}),
						},
					},
				},
				'&__title': {
					'border-bottom': `solid black 1.5px`,
					padding: `0.1em`,
					'font-family': fonts.monospace,
					'font-size': `140%`,
					color: `black`,
					'background-color': `#cccccc`,
					'z-index': `1000000`,
					'&--completed': {
						'font-weight': `bold`,
						color: `blue`,
					},
				},
				'&__content': {
					padding: `0.5em`,
					position: `absolute`,
				},
				'&__component': {
					width: `fit-content`,
				},
			},
		},
	]
</style-js>
