<script>
	import {onMount, onDestroy} from 'svelte'
	import Window from '../../components/app/Window.svelte'
	import Nav from '../../components/dev/Nav.svelte'
	import {ScrollDragController} from "../../main/browser/helpers/html-controllers/ScrollDragController"
	import {createHtmlElementMatches} from "../../main/browser/helpers/html-controllers/helpers"

	export let segment

	let container
	let scrollDragController

	onMount(() => {
		scrollDragController = new ScrollDragController({
			container,
			scrollMatches: createHtmlElementMatches({
				classNames: 'js-scroll-drag',
			}),
			noDragMatches: createHtmlElementMatches({
				tagNames: 'SELECT',
				classNames: 'js-scroll-nodrag',
			}),
			throttlePixels: 5,
		})
	})

	onDestroy(() => scrollDragController && scrollDragController.destroy())
</script>

<main bind:this="{container}" class="fill">
	<Window
		title="Dev"
		hideOrMinimizeInsteadClose={true}
		>
        <div class="fill flex flex--vertical" style="background: white;">
        	<div class="nav flex__item--fit scroll-horizontal scrollbar--collapsed">
				<div class="scroll__content">
					<Nav {segment} />
				</div>
			</div>
        	<div class="flex__item--fill scroll-vertical">
				<slot></slot>
			</div>
		</div>
	</Window>
</main>

<style-js>
	import templates from '../../styles/helpers/templates';

	module.exports = [{
		'.nav': {
			height: `4.2em`,
			'font-size': `12px`,
		},
		main: {
			'font-size': `10px`,
		},
		'.main': {

		},
	}]
</style-js>
