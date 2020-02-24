<script context="module">
	export class DropDownCalc {
		constructor({
			containerRect,
			controlRect,
			dropdownRect,
			marginWindow,
			marginControl,
			preferPositions,
			align,
		}) {
			this.containerRect = containerRect
			this.controlRect = controlRect
			this.dropdownRect = dropdownRect
			this.marginWindow = marginWindow
			this.marginControl = marginControl
			this.preferPositions = preferPositions
			this.align = align
		}

		alignX(containerX, containerWidth, controlX, controlWidth, dropdownWidth) {
			let x
			switch (this.align) {
				case 'start':
					x = controlX
					break;
				case 'end':
					x = controlX + controlWidth - dropdownWidth
					break;
				case 'center':
					x = controlX + (controlWidth - dropdownWidth) / 2
					break;
				default:
					throw new Error('Unknown align type: ' + this.align)
			}

			if (x + dropdownWidth > containerX + containerWidth - this.marginWindow) {
				x = containerX + containerWidth - this.marginWindow - dropdownWidth
			}

			if (x < this.marginWindow) {
				x = this.marginWindow
			}

			return x
		}

		calcCutSquare(containerRect, dropdownRect) {
			const dropdownSquare = dropdownRect.width * dropdownRect.height

			let left = dropdownRect.x
			let top = dropdownRect.y
			let right = dropdownRect.x + dropdownRect.width
			let bottom = dropdownRect.y + dropdownRect.height

			if (left < containerRect.x + this.marginWindow) {
				left = containerRect.x + this.marginWindow
			}
			if (top < containerRect.y + this.marginWindow) {
				top = containerRect.y + this.marginWindow
			}

			if (right > containerRect.x + containerRect.width - this.marginWindow) {
				right = containerRect.x + containerRect.width - this.marginWindow
			}
			if (bottom > containerRect.y + containerRect.height - this.marginWindow) {
				bottom = containerRect.y + containerRect.height - this.marginWindow
			}

			const dropdownSquareVisible = Math.max(0, right - left) * Math.max(0, bottom - top)

			return dropdownSquare - dropdownSquareVisible
		}

		placeTop(containerRect, controlRect, dropdownRect) {
			const y = controlRect.y - dropdownRect.height - this.marginControl
			return this.placeVertical(containerRect, controlRect, dropdownRect, y)
		}

		placeBottom(containerRect, controlRect, dropdownRect) {
			const y = controlRect.y + controlRect.height + this.marginControl
			return this.placeVertical(containerRect, controlRect, dropdownRect, y)
		}

		placeVertical(containerRect, controlRect, dropdownRect, y) {
			const x = this.alignX(containerRect.x, containerRect.width,
				controlRect.x, controlRect.width,
				dropdownRect.width)

			const cutSquare = this.calcCutSquare(containerRect, {
				x, y, width: dropdownRect.width, height: dropdownRect.height,
			})

			return {
				x,
				y,
				cutSquare,
			}
		}

		flipXY(rect) {
			return {
				...rect,
				x: rect.y,
				y: rect.x,
				width: rect.height,
				height: rect.width,
			}
		}

		placeLeft(containerRect, controlRect, dropdownRect) {
			return this.flipXY(this.placeTop(
				this.flipXY(containerRect),
				this.flipXY(controlRect),
				this.flipXY(dropdownRect),
			))
		}

		placeRight(containerRect, controlRect, dropdownRect) {
			return this.flipXY(this.placeBottom(
				this.flipXY(containerRect),
				this.flipXY(controlRect),
				this.flipXY(dropdownRect),
			))
		}

		place(position) {
			switch (position) {
				case 'left':
					return this.placeLeft(this.containerRect, this.controlRect, this.dropdownRect)
				case 'right':
					return this.placeRight(this.containerRect, this.controlRect, this.dropdownRect)
				case 'top':
					return this.placeTop(this.containerRect, this.controlRect, this.dropdownRect)
				case 'bottom':
					return this.placeBottom(this.containerRect, this.controlRect, this.dropdownRect)
					throw new Error('Unknown position type: ' + position)
			}
		}

		calcDropdownPosition() {
			const places = this.preferPositions.map(position => this.place(position))

			let preferPlace
			for (let i = 0; i < places.length; i++) {
				const place = places[i]
				if (i === 0 || place.cutSquare < preferPlace.cutSquare) {
					preferPlace = place
					if (preferPlace.cutSquare === 0) {
						break;
					}
				}
			}

			const left = preferPlace.x
			const top = preferPlace.y
			const maxWidth = this.containerRect.x + this.containerRect.width - this.marginWindow - left
			const maxHeight = this.containerRect.y + this.containerRect.height - this.marginWindow - top

			return {
				left,
				top,
				maxWidth,
				maxHeight,
			}
		}
	}
</script>

<script>
	import {onMount, onDestroy} from 'svelte'
	import Toggle from "../../common/Toggle.svelte";

	export let showed = false
	export let marginWindow = `1em`
	export let marginControl = `0.5em`
	export let preferPositions = [
		'bottom',
		'top',
		'left',
		'right',
	]
	export let align = 'start'
	export let isContentResizable = false

	let windowWidth
	let windowHeight

	let control
	let controlWidth
	let controlHeight

	let dropdown

	let dropdownLeft
	let dropdownTop
	let dropdownWidth
	let dropdownHeight
	let dropdownMaxWidth
	let dropdownMaxHeight

	$: updateDropdownPosition(
		windowWidth, windowHeight,
		controlWidth, controlHeight,
		dropdownWidth, dropdownHeight,
		dropdown,
	)

	function updateDropdownPosition(
		windowWidth, windowHeight,
		controlWidth, controlHeight,
		dropdownWidth, dropdownHeight,
		dropdown,
	) {
		if (!dropdown) {
			return
		}

		const containerRect = {
			x: 0, y: 0, width: windowWidth, height: windowHeight,
		}
		let controlRect = control.getBoundingClientRect()
		controlRect.x = controlRect.left
		controlRect.y = controlRect.top
		const dropdownRect = {
			x: 0, y: 0, width: dropdownWidth, height: dropdownHeight,
		}

		const oldMarginLeft = dropdown.style.marginLeft
		dropdown.style.marginLeft = marginWindow
		const marginWindowPx = parseInt(getComputedStyle(dropdown).marginLeft.replace('px', ''))
		dropdown.style.marginLeft = marginControl
		const marginControlPx = parseInt(getComputedStyle(dropdown).marginLeft.replace('px', ''))
		dropdown.style.marginLeft = oldMarginLeft

		const {
			left,
			top,
			maxWidth,
			maxHeight,
		} = new DropDownCalc({
			containerRect,
			controlRect,
			dropdownRect,
			marginWindow: marginWindowPx,
			marginControl: marginControlPx,
			preferPositions,
			align,
		})
		.calcDropdownPosition()

		dropdownLeft = left
		dropdownTop = top
		dropdownMaxWidth = maxWidth
		dropdownMaxHeight = maxHeight
	}

	function elementIsInDropdown(element) {
		if (!control) {
			return false
		}

		const toggleElement = control.parentElement
		do {
			if (element === dropdown || element === toggleElement) {
				return true
			}
			element = element.parentElement
		} while (element)

		return false
	}

	const clickListener = e => {
		if (elementIsInDropdown(e.target)) {
			return
		}
		showed = false
	}

	onMount(() => {
		if (isContentResizable) {
			setTimeout(() => {
				controlWidth = control.clientWidth
				controlHeight = control.clientHeight
			})
		}
	})
</script>

<svelte:window
	bind:innerWidth="{windowWidth}"
	bind:innerHeight="{windowHeight}"
	on:mousedown="{clickListener}"
	on:touchstart="{clickListener}"
	/>

<Toggle type="checkbox" bind:checked="{showed}">
	{#if isContentResizable}
		<span
			bind:this="{control}"
			class="control"
			bind:clientWidth={controlWidth}
			bind:clientHeight={controlHeight}
			>
			<slot name="control">
				<button style="margin: 0;">DropDown{showed ? ' showed' : ''}</button>
			</slot>
		</span>
	{:else}
		<span
			bind:this="{control}"
			class="control"
			>
			<slot name="control">
				<button style="margin: 0;">DropDown{showed ? ' showed' : ''}</button>
			</slot>
		</span>
	{/if}
</Toggle>
{#if showed}
	<div
		bind:this="{dropdown}"
		class="dropdown"
		bind:clientWidth={dropdownWidth}
		bind:clientHeight={dropdownHeight}
		style="
			left: {dropdownLeft == null ? 'auto' : dropdownLeft + 'px'};
			top: {dropdownTop == null ? 'auto' : dropdownTop + 'px'};
			max-width: {dropdownMaxWidth == null ? 'auto' : dropdownMaxWidth + 'px'};
			max-height: {dropdownMaxHeight == null ? 'auto' : dropdownMaxHeight + 'px'};
		"
		>
		<slot name="dropdown"></slot>
	</div>
{/if}

<style>
	.control {
		position: relative;
		pointer-events: none;
		overflow: hidden;
	}
	.dropdown {
		position: fixed;
		overflow: hidden;
		z-index: 100000;
	}
</style>