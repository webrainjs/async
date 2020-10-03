<script>
	import {onMount} from 'svelte'
	import {get} from 'svelte/store'
	import {goto, stores} from 'SAPPER_MODULE/app'
	import ToggleFullscreen from "../common/ToggleFullscreen.svelte";
	import appConfig from 'APP_CONFIG_PATH'
	import WindowButtons from "./common/WindowButtons.svelte";
	import {getUserAgent} from '../../main/browser/helpers/system-info'
	import WindowButtonsMac from "./common/WindowButtonsMac.svelte";

	const pageStore = stores()
	const page = pageStore && pageStore.page

	export let win = null
	export let title = 'App'

	export let canHide = true
	export let canMinimize = true
	export let canMaximize = true
	export let canFullscreen = true
	export let canClose = true
	export let canDev = !!page

	export let hideOrMinimizeInsteadClose = false
	export let openWebrainWindow = null

	let maximized = false
	let fullscreen = false

	let _canHide
	let _canMinimize
	let _canMaximize
	let _canRestore
	let _canClose
	let _canDev

	$: _canHide = canHide && win && !!win.hide
	$: _canMinimize = canMinimize && win && !!win.minimize
	$: _canMaximize = !fullscreen && !maximized && canMaximize && win && !!win.maximize && !!win.restore
	$: _canRestore = !fullscreen && maximized && canMaximize && win && !!win.maximize && !!win.restore
	$: _canClose = canClose && win && !!win.close
	$: _canDev = canDev && appConfig.dev && appConfig.dev.devPage

	let osName

	onMount(() => {
		if (!win) {
			win = window
		}
		osName = getUserAgent().os.name
	})

	function showDev() {
	    if (_canDev) {
			const path = get(page).path
			if (path.startsWith('/dev/')) {
				goto('')
			} else {
				//console.debug('path = ', path)
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
	function _minimize() {
		win.minimize()
	}

	function minimize() {
		if (fullscreen && osName === 'Mac OS') {
			fullscreen = false
			setTimeout(_minimize, 700)
		} else {
			_minimize()
		}
	}

	function _hideOrMinimize() {
		if (win.hide || win.minimize) {
			(win.hide || win.minimize)()
		}
	}

	function hideOrMinimize() {
		if (fullscreen && osName === 'Mac OS') {
			fullscreen = false
			setTimeout(_hideOrMinimize, 700)
		} else {
			_hideOrMinimize()
		}
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
		if (hideOrMinimizeInsteadClose) {
			hideOrMinimize()
		} else {
			win.close()
		}
	}
</script>

<div class="window flex__item--fit flex flex--vertical fill">
    <div class="window__titlebar titlebar flex">
		{#if appConfig.type === 'dev' || osName === 'Mac OS' || osName === 'Linux'}
			<div class="titlebar__buttons flex__item--fit flex flex--align-center margin-left-half">
				<WindowButtonsMac
					canClose="{_canClose}"
					canDev="{_canDev}"
					canFullscreen="{canFullscreen}"
					canMaximize="{false}"
					canRestore="{false}"
					canMinimize="{_canMinimize}"

					bind:fullscreen="{fullscreen}"

					on:showDev="{showDev}"
					on:minimize="{minimize}"
					on:maximize="{maximize}"
					on:restore="{restore}"
					on:close="{close}"
				/>
			</div>
		{/if}
        <div class="titlebar__title flex__item--fill flex flex--align-center">
			<span class="text" debug_id="main-window__title">{title}</span>
        </div>
		{#if appConfig.type === 'dev' || osName === 'Windows' || osName !== 'Mac OS' && osName !== 'Linux'}
			<div class="titlebar__buttons flex__item--fit flex margin-right-half">
        	<WindowButtons
        		canClose="{_canClose}"
        		canDev="{_canDev}"
        		canFullscreen="{canFullscreen}"
        		canMaximize="{_canMaximize}"
        		canRestore="{_canRestore}"
        		canMinimize="{_canMinimize}"

        		bind:fullscreen="{fullscreen}"

				on:showDev="{showDev}"
				on:minimize="{minimize}"
				on:maximize="{maximize}"
				on:restore="{restore}"
				on:close="{close}"
        	/>
					</div>
            {/if}
    </div>
    <div class="window__content flex__item--fill flex">
        <slot></slot>
    </div>
</div>

<style-js>
	import templates from '../../styles/helpers/templates';
	import buttons from '../../styles/global/templates/buttons';
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
				height: titleBarHeight,
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
					'padding-bottom': `0.1em`,
					'padding-top': `0.1em`,
				},
			},
			'.button-dev': {
				'margin-right': `1em`,
			}
		}
	]
</style-js>
