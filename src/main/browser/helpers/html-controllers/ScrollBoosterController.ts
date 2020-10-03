// @ts-nocheck
// source: https://ilyashubin.github.io/scrollbooster/
// source: https://github.com/ilyashubin/scrollbooster

/* tslint:disable:no-empty */
import {HtmlController} from './HtmlController'

export interface IScrollBoosterProps {
	container,
	viewportMatches: (element) => boolean,
	handleMatches?: (element) => boolean,
	noDragMatches?: (element) => boolean,
	viewport?,
	handle?,
	content?,
	bounce?: boolean,
	friction?: number
	bounceForce?: number,
	textSelection?: boolean,
	onClick?: (data, event) => void,
	shouldScroll?: (data, event) => boolean,
	onUpdate?: (data) => void,
}

export class ScrollBoosterController extends HtmlController {
	private viewportMatches: (element) => boolean
	private handleMatches: (element) => boolean
	private noDragMatches: (element) => boolean

	private props: IScrollBoosterProps

	constructor(props: IScrollBoosterProps) {
		super(props.container)

		const defaults = {
			handleMatches: props.viewportMatches,
			bounce       : true,
			friction     : 0.05,
			bounceForce  : 0.1,
			textSelection: false,
			emulateScroll: false,
			onUpdate(data) {
				data.viewportElement.scrollLeft = data.position.x
				data.viewportElement.scrollTop = data.position.y
				// data.contentElement.style.transform = `translate(
				// 	${-data.position.x}px,
				// 	${-data.position.y}px
				// )`
				// and also metrics: data.viewport['width'|'height'] and data.cotent['width'|'height']
			},
			shouldScroll(data, event) {
				if (props.noDragMatches && props.noDragMatches(event.target)) {
					return false
				}

				return true
			},
			onClick(data, event) {
				if (props.noDragMatches && props.noDragMatches(event.target)) {
					event.preventDefault()
				}
			},
		}

		this.props = { ...defaults, ...props }

		this.position = { x: 0, y: 0 }
		this.velocity = { x: 0, y: 0 }
		this.friction = 1 - this.props.friction
		this.bounceForce = this.props.bounceForce

		this.isDragging = false
		this.dragStartPosition = { x: 0, y: 0 }
		this.dragOffsetPosition = { ...this.dragStartPosition }
		this.dragPosition = { ...this.position }

		this.isScrollEnabled = !!this.props.emulateScroll
		this.isScrolling = false
		this.scrollOffset = { x: 0, y: 0 }

		this.bounce = this.props.bounce
		this.textSelection = this.props.textSelection

		this.viewport = {
			width : 0,
			height: 0,
		}
		this.content = {
			width : 0,
			height: 0,
		}
		this.boundX = {
			from: 0,
			to  : 0,
		}
		this.boundY = {
			from: 0,
			to  : 0,
		}

		this.mode = {
			x : this.props.mode === 'x',
			y : this.props.mode === 'y',
			xy: this.props.mode !== 'x' && this.props.mode !== 'y',
		}

		this.isRunning = false
		this.rafID = null

		this.events = {}

		this.animate()
		this.handleEvents()
	}

	public updateViewport(viewport) {
		if (!viewport || !(viewport instanceof Element)) {
			console.error('"viewport" config property must be present and must be Element')
			return
		}

		if (this.props.viewport === viewport) {
			return
		}

		this.props.viewport = viewport
		this.props.handle = viewport
		this.props.content = viewport.children[0]

		if (!this.props.content) {
			console.error('Viewport does not have any content')
			return
		}

		this.updateMetrics()
	}

	/**
	 * Run update loop
	 */
	public run() {
		this.isRunning = true
		cancelAnimationFrame(this.rafID)
		this.rafID = requestAnimationFrame(() => this.animate())
	}

	public animate() {
		if (!this.isRunning) { return }
		this.update()
		this.notify()
		this.rafID = requestAnimationFrame(() => this.animate())
	}

	public update() {
		this.applyBoundForce()
		this.applyDragForce()
		this.applyScrollForce()

		this.velocity.x *= this.friction
		this.velocity.y *= this.friction

		if (!this.mode.y) {
			this.position.x += this.velocity.x
		}
		if (!this.mode.x) {
			this.position.y += this.velocity.y
		}

		// if bounce effect is disabled
		if (!this.bounce || this.isScrolling) {
			this.position.x = Math.max(Math.min(this.position.x, this.boundX.to), this.boundX.from)
			this.position.y = Math.max(Math.min(this.position.y, this.boundY.to), this.boundY.from)
		}

		// stop update loop if nothing moves
		if (
			!this.isDragging
			&& !this.isScrolling
			&& Math.abs(this.velocity.x) < 0.1
			&& Math.abs(this.velocity.y) < 0.1
		) {
			this.isRunning = false
		}
	}

	public applyForce(force) {
		this.velocity.x += force.x
		this.velocity.y += force.y
	}

	/**
	 * Apply force for bounce effect
	 */
	public applyBoundForce() {
		if (!this.bounce) { return }
		if (this.isDragging) { return }

		const pastLeft = this.position.x < this.boundX.from
		const pastRight = this.position.x > this.boundX.to
		const pastTop = this.position.y < this.boundY.from
		const pastBottom = this.position.y > this.boundY.to

		const resultForce = { x: 0, y: 0 }

		// scrolled past left of right viewport boundaries
		if (pastLeft || pastRight) {
			const bound = pastLeft ? this.boundX.from : this.boundX.to
			const distance = bound - this.position.x

			let force = distance * this.bounceForce
			const restX = this.position.x + (this.velocity.x + force) / (1 - this.friction)

			if (
				!((pastLeft && restX < this.boundX.from) || (pastRight && restX > this.boundX.to))
			) {
				force = distance * this.bounceForce - this.velocity.x
			}

			resultForce.x = force
		}

		// scrolled past top of bottom viewport boundaries
		if (pastTop || pastBottom) {
			const bound = pastTop ? this.boundY.from : this.boundY.to
			const distance = bound - this.position.y

			let force = distance * this.bounceForce
			const restY = this.position.y + (this.velocity.y + force) / (1 - this.friction)

			if (
				!((pastTop && restY < this.boundY.from) || (pastBottom && restY > this.boundY.to))
			) {
				force = distance * this.bounceForce - this.velocity.y
			}

			resultForce.y = force
		}

		this.applyForce(resultForce)
	}

	/**
	 * Apply force to move content while dragging with mouse/touch
	 */
	public applyDragForce() {
		if (!this.isDragging) { return }
		const dragVelocity = {
			x: this.dragPosition.x - this.position.x,
			y: this.dragPosition.y - this.position.y,
		}
		const dragForce = {
			x: dragVelocity.x - this.velocity.x,
			y: dragVelocity.y - this.velocity.y,
		}

		this.applyForce(dragForce)
	}

	/**
	 * Apply force to emulate mouse wheel
	 */
	public applyScrollForce() {
		if (!this.isScrolling) { return }

		const scrollForce = {
			x: this.scrollOffset.x - this.velocity.x,
			y: this.scrollOffset.y - this.velocity.y,
		}

		this.scrollOffset.x = 0
		this.scrollOffset.y = 0

		this.applyForce(scrollForce)
	}

	/**
	 * Manual position setting
	 */
	public setPosition(newPosition = {}) {
		this.velocity.x = 0
		this.velocity.y = 0

		this.position.x = -newPosition.x || 0
		this.position.y = -newPosition.y || 0

		this.run()
	}

	/**
	 * Get latest metrics and coordinates
	 */
	public getUpdate() {
		return {
			isRunning  : this.isRunning,
			isDragging : this.isDragging,
			isScrolling: this.isScrolling,
			position   : {
				x: -this.position.x,
				y: -this.position.y,
			},
			dragOffsetPosition: this.dragOffsetPosition,
			viewport          : { ...this.viewport },
			content           : { ...this.content },
			viewportElement   : this.props.viewport,
			contentElement    : this.props.content,
		}
	}

	public notify() {
		this.props.onUpdate(this.getUpdate())
	}

	public updateMetrics() {
		if (!this.props.viewport) {
			return
		}

		this.viewport.width = this.props.viewport.clientWidth
		this.viewport.height = this.props.viewport.clientHeight

		this.content.width = getFullWidth(this.props.content)
		this.content.height = getFullHeight(this.props.content)

		this.boundX.from = Math.min(-this.content.width + this.viewport.width, 0)
		this.boundY.from = Math.min(-this.content.height + this.viewport.height, 0)

		this.run()
	}

	public handleEvents() {
		const scroll = { x: 0, y: 0 }
		const mousedown = { x: 0, y: 0 }

		let isTouch = false

		const setDragPosition = event => {
			let pageX
			let pageY

			if (isTouch) {
				pageX = event.touches[0].pageX
				pageY = event.touches[0].pageY
			} else {
				pageX = event.pageX
				pageY = event.pageY
			}

			this.dragOffsetPosition.x = pageX - mousedown.x
			this.dragOffsetPosition.y = pageY - mousedown.y

			this.dragPosition.x = this.dragStartPosition.x + this.dragOffsetPosition.x
			this.dragPosition.y = this.dragStartPosition.y + this.dragOffsetPosition.y

			if (!isTouch) {
				event.preventDefault()
			}
		}

		this.events.pointerdown = event => {
			this.updateViewport(event.container)

			let pageX
			let pageY
			let clientX
			let clientY

			isTouch = !!(event.touches && event.touches[0])

			if (isTouch) {
				pageX = event.touches[0].pageX
				pageY = event.touches[0].pageY
				clientX = event.touches[0].clientX
				clientY = event.touches[0].clientY
			} else {
				pageX = event.pageX
				pageY = event.pageY
				clientX = event.clientX
				clientY = event.clientY
			}

			const vp = this.props.viewport
			const rect = vp.getBoundingClientRect()

			// click on vertical scrollbar
			if (clientX - rect.left >= vp.clientLeft + vp.clientWidth) {
				return
			}

			// click on horizontal scrollbar
			if (clientY - rect.top >= vp.clientTop + vp.clientHeight) {
				return
			}

			if (!this.props.shouldScroll(this.getUpdate(), event)) {
				return
			}

			// text selection enabled
			if (this.textSelection) {
				const clickedNode = textNodeFromPoint(event.target, clientX, clientY)
				if (clickedNode) {
					return
				}

				clearTextSelection()
			}

			this.isDragging = true

			if (scroll.x || scroll.y) {
				this.position.x = scroll.x
				this.position.y = scroll.y
				scroll.x = 0
				scroll.y = 0
			}
			mousedown.x = pageX
			mousedown.y = pageY
			this.dragStartPosition.x = this.position.x
			this.dragStartPosition.y = this.position.y

			setDragPosition(event)

			this.run()

			let removeEvents

			removeEvents = _event => {
				this.isDragging = false

				if (isTouch) {
					window.removeEventListener('touchmove', setDragPosition)
					window.removeEventListener('touchend', removeEvents)
				} else {
					window.removeEventListener('mousemove', setDragPosition)
					window.removeEventListener('mouseup', removeEvents)
				}
			}

			if (isTouch) {
				window.addEventListener('touchend', removeEvents)
				window.addEventListener('touchmove', setDragPosition)
			} else {
				window.addEventListener('mouseup', removeEvents)
				window.addEventListener('mousemove', setDragPosition)
			}
		}

		let scrollTimer = null
		this.events.wheel = event => {
			this.updateViewport(event.container)

			this.velocity.x = 0

			if (!this.isScrollEnabled) { return }
			this.isScrolling = true

			this.scrollOffset.x = -event.deltaX
			this.scrollOffset.y = -event.deltaY

			this.run()

			clearTimeout(scrollTimer)
			scrollTimer = setTimeout(() => {
				this.isScrolling = false
			}, 80)

			event.preventDefault()
		}

		this.events.scroll = event => {
			this.updateViewport(event.container)

			const sl = this.props.viewport.scrollLeft
			const st = this.props.viewport.scrollTop
			if (Math.abs(this.position.x + sl) > 3) {
				this.position.x = -sl
				this.velocity.x = 0
			}
			if (Math.abs(this.position.y + st) > 3) {
				this.position.y = -st
				this.velocity.y = 0
			}
			scroll.x = -this.props.viewport.scrollLeft
			scroll.y = -this.props.viewport.scrollTop
		}

		this.events.click = event => {
			this.updateViewport(event.container)
			this.props.onClick(this.getUpdate(), event)
		}

		this.events.resize = this.updateMetrics.bind(this)

		this.addEventListener(this.props.handleMatches, 'mousedown', this.events.pointerdown)
		this.addEventListener(this.props.handleMatches, 'touchstart', this.events.pointerdown)
		this.addEventListener(this.props.handleMatches, 'click', this.events.click)
		this.addEventListener(this.props.viewportMatches, 'wheel', this.events.wheel)
		this.addEventListener(this.props.viewportMatches, 'scroll', this.events.scroll)
		window.addEventListener('resize', this.events.resize, {
			passive: false,
		})
	}

	public destroy() {
		super.destroy()
		// this.props.handle.removeEventListener('mousedown', this.events.pointerdown)
		// this.props.handle.removeEventListener('touchstart', this.events.pointerdown)
		// this.props.handle.removeEventListener('click', this.events.click)
		// this.props.viewport.removeEventListener('wheel', this.events.wheel)
		// this.props.viewport.removeEventListener('scroll', this.events.scroll)
		window.removeEventListener('resize', this.events.resize)
	}
}

function getFullWidth(elem) {
	return Math.max(elem.offsetWidth, elem.scrollWidth)
}

function getFullHeight(elem) {
	return Math.max(elem.offsetHeight, elem.scrollHeight)
}

function textNodeFromPoint(element, x, y) {
	let node
	const nodes = element.childNodes
	const range = document.createRange()
	for (let i = 0; i < nodes.length; i++) {
		node = nodes[i]
		if (node.nodeType !== 3) { continue }
		range.selectNodeContents(node)
		const rect = range.getBoundingClientRect()
		if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
			return node
		}
	}
	return false
}

function clearTextSelection() {
	const sel = window.getSelection ? window.getSelection() : document.selection
	if (sel) {
		if (sel.removeAllRanges) {
			sel.removeAllRanges()
		} else if (sel.empty) {
			sel.empty()
		}
	}
}
