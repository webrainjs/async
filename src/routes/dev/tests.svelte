<svelte:head>
	<title>Page for tests</title>
</svelte:head>

<button on:click={playSound}>Play sound</button>
<h2>SVG Gradient</h2>
<div class="box">
	CSS:
	<div bind:this="{gradient}" class="ref-gradient" />
</div>
<div class="box">
	&lt;img /&gt;:
	<img src="client/images/tests/gradient.svg" alt="gradient" />
</div>
<div class="box">
	&lt;svg /&gt;:
	<svg
		version="1.1"
		id="Layer_1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		viewBox="0 0 390 270"
	>
		<linearGradient id="gradient1" x1="0" y1="0" x2="0.8" y2="0.8">
			<stop offset="0%"   style="stop-color: yellow" />
			<stop offset="100%" style="stop-color: blue" />
		</linearGradient>

		<linearGradient id="gradient2" x1="0.4" y1="0.4" x2="0.5" y2="0.5" spreadMethod="repeat">
			<stop offset="0%"   style="stop-color: yellow" />
			<stop offset="50%"  style="stop-color: blue" />
			<stop offset="100%" style="stop-color: yellow" />
		</linearGradient>

		<radialGradient id="gradient3" fx="0.7" fy="0.7" cx="0.5" cy="0.5" r="0.4">
			<stop offset="0%"   style="stop-color: yellow" />
			<stop offset="100%" style="stop-color: blue" />
		</radialGradient>

		<radialGradient id="gradient4" fx="0.5" fy="0.5" cx="0.6" cy="0.6" r="0.2" spreadMethod="repeat">
			<stop offset="0%"   style="stop-color: yellow" />
			<stop offset="50%"  style="stop-color: blue" />
			<stop offset="100%" style="stop-color: yellow" />
		</radialGradient>

		<rect x="10" y="10" width="180" height="120" style="fill:url(#gradient1)" />

		<rect x="210" y="10" width="180" height="120" style="fill:url(#gradient2)" />

		<rect x="10" y="150" width="180" height="120" style="fill:url(#gradient3)" />

		<rect x="210" y="150" width="180" height="120" style="fill:url(#gradient4)" />
	</svg>
</div>

<h2>Canvas</h2>
<div class="box">
	<canvas bind:this="{canvas}" class="fill"/>
</div>

<h2>Sounds</h2>
<div class="box">
	<audio>
		<!--<source src="client/sounds/click.mp3" type="audio/mp3">-->
		<source src="client/sounds/click.ogg" type="audio/ogg">
		<!-- fallback for non supporting browsers goes here -->
		<p>Your browser does not support HTML5 audio, but you can still
			<a href="client/sounds/click.mp3">download the music</a>.</p>
	</audio>
</div>

<script>
	import {onMount, onDestroy} from 'svelte'
	import {TouchToMouse} from '../../main/browser/helpers/touchMouse'
	import {Debugger} from 'webrain'
	import {audioQueue} from "../../main/browser/helpers/audio";

	let canvas
	let gradient

	onMount(() => {
		const context = canvas.getContext('2d')
		context.fillStyle = '#ffff00'
		context.strokeStyle = '#00ffff'

		canvas.onmousedown = () => {
			context.font = '30px Arial'
			context.fillText('Hello World', 10, 50)
		}

		canvas.onmouseup = () => {
			context.moveTo(0, 0)
			context.lineTo(200, 100)
			context.stroke()
		}
	})

	function playSound() {
		audioQueue.play('client/sounds/code-red-twice.mp3')
	}
</script>

<style-js>
	import templates from '../../styles/helpers/templates';

    module.exports = ({
        h2: {
            'padding-top': `1em`,
            clear: `both`,
        },
        '.box': {
            position: `relative`,
            border: `solid white 2px`,
            width: `200px`,
            height: `200px`,
            display: `block`,
            float: `left`,
        },
        '.box > *': {
            ...templates.fill,
            top: `1em`,
        },
        '.ref-gradient': {
            'background-image': `url(client/images/tests/gradient.svg)`,
            'background-size': `100% 100%`,
        },
    })
</style-js>