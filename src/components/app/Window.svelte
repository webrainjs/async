<script>
	import {onMount} from 'svelte'
	import {get} from 'svelte/store'
	import {goto, stores} from 'SAPPER_MODULE/app'
	import ToggleFullscreen from "../common/ToggleFullscreen.svelte";
	import appConfig from 'APP_CONFIG_PATH'

	const pageStore = stores()
	const page = pageStore && pageStore.page

	export let win = null
	export let title = 'App'

	export let canMinimize = true
	export let canMaximize = true
	export let canFullscreen = true
	export let canClose = true
	export let canDev = !!page

	export let minimizeInsteadClose = false
	export let openWebrainWindow = null

	let maximized = false
	let fullscreen = false

	let _canMinimize
	let _canMaximize
	let _canClose
	let _canDev

	$: _canMinimize = canMinimize && win && !!win.minimize
	$: _canMaximize = canMaximize && win && !!win.maximize && !!win.restore
	$: _canClose = canClose && win && !!win.close
	$: _canMinimize = canMinimize && win && !!win.minimize
	$: _canDev = canDev && appConfig.dev

	onMount(() => {
		if (!win) {
			win = window
		}
	})

	function showDev() {
	    if (_canDev) {
			const path = get(page).path
			if (path.startsWith('/dev/')) {
				goto('')
			} else {
				//console.log('path = ', path)
				goto('dev')
			}
		}
	}

	function _showWebrain() {
	    if (_canDev && openWebrainWindow) {
			openWebrainWindow()
		}
	}

	//see: https://stackoverflow.com/a/31174463/5221762
	function minimize() {
		win.minimize()
	}

	function maximize() {
		win.maximize()
	    maximized = true
	}

	function restore() {
		win.restore()
		maximized = false
	}

	function close() {
		if (minimizeInsteadClose) {
			minimize()
		} else {
			win.close()
		}
	}
</script>

<div class="window flex__item--fit flex flex--vertical fill">
    <div class="window__titlebar titlebar flex">
        <div class="titlebar__title flex__item--fill flex flex--align-center">
			<span class="text">{title}</span>
        </div>
        <div class="titlebar__buttons flex__item--fit flex">
            <!-- href needed for sapper export -->
            <a href="dev" class="titlebar__button button-dev flex"
            	on:click|preventDefault="{showDev}"
            	class:collapsed="{!_canDev}">
				<span class="text">&lt;/&gt;</span>
            </a>
            {#if canFullscreen}
				<ToggleFullscreen bind:checked={fullscreen} let:fullscreen={fullscreen}>
					<div class="titlebar__button flex" title="{fullscreen ? 'Exit' : 'Enter'} full screen (F11)">
						<span class="titlebar__button__icon ghost icon-inline icon-window-fullscreen-{fullscreen ? 'exit' : 'enter'}">&nbsp;</span>
					</div>
				</ToggleFullscreen>
            {/if}
            <button class="titlebar__button flex" on:click="{minimize}" class:collapsed="{!_canMinimize}">
                <span class="titlebar__button__icon ghost icon-inline icon-window-minimize">&nbsp;</span>
            </button>
            <button class="titlebar__button flex" on:click="{maximize}" class:collapsed="{fullscreen || !_canMaximize || maximized}">
                <span class="titlebar__button__icon ghost icon-inline icon-window-maximize">&nbsp;</span>
            </button>
            <button class="titlebar__button flex" on:click="{restore}" class:collapsed="{fullscreen || !_canMaximize || !maximized}">
                <span class="titlebar__button__icon ghost icon-inline icon-window-restore">&nbsp;</span>
            </button>
            <button class="titlebar__button flex" on:click="{close}" class:collapsed="{!_canClose}">
                <span class="titlebar__button__icon ghost icon-inline icon-window-close">&nbsp;</span>
            </button>
        </div>
    </div>
    <div class="window__content flex__item--fill flex">
        <slot></slot>
    </div>
</div>

<style-js>
	import templates from '../../styles/helpers/templates';
	import buttons from '../../styles/app/templates/buttons';
	import colors from '../../styles/app/templates/colors';

	const titleBarHeight = `1.5em`

	module.exports = [
		require('../../styles/app'),
		{
			'.window': {
				'&__titlebar': {},
				'&__content': {},
			},
			'.titlebar': {
				'font-size': `160%`,
				'z-index': 10000,
				'background-color': colors.base[7],
				'&__title': {
					...templates.noWrap(),
					'padding-left': `0.5em`,
					'padding-bottom': `0.1em`,
					'padding-top': `0.1em`,
					'-webkit-app-region': `drag`,
					'user-select': `none`,

					'font-weight': `bold`,
					'color': colors.base[14],
				},
				'&__buttons': {
					'padding-right': `0.5em`,
					'padding-bottom': `0.1em`,
					'padding-top': `0.1em`,
				},
				'&__button': [
					buttons.withText({
						colorText: colors.base[14]
					}),
					{
						'height': titleBarHeight,
						'width': `auto`,
					}
				],
			},
			'.button-dev': {
				'margin-right': `1em`,
			}
		}
	]
</style-js>