export class TouchToMouse {
	constructor(container, actionsPrefix = '', fixedTarget = null) {
		const mouseDownName = `on${actionsPrefix}mousedown`
		const mouseMoveName = `on${actionsPrefix}mousemove`
		const mouseUpName = `on${actionsPrefix}mouseup`
		const mouseOutName = `on${actionsPrefix}mouseout`
		const mouseEnterName = `on${actionsPrefix}mouseenter`

		// bind touch
		addListenerWithCoord('touchstart', mouseDownName)
		addListenerWithCoord('touchmove', mouseMoveName)
		addListener('touchend', mouseUpName)

		// bind mouse
		addListenerWithCoord('mousedown', mouseDownName)
		addListenerWithCoord('mousemove', mouseMoveName)
		addListener('mouseup', mouseUpName)

		// prevent duplicate events
		preventEvents('mouseenter')
		preventEvents('mouseout')

		window.addEventListener('mouseup', function (e) {
			callAction(mouseUpName)
			e.stopPropagation()
			e.preventDefault()
			return false
		}, {bubbles: false})

		function preventEvents(eventType) {
			container.addEventListener(eventType, function (e) {
				e.stopPropagation()
				e.preventDefault()
				return false
			}, {bubbles: false})
		}

		function addListener(eventType, actionName) {
			container.addEventListener(eventType, function (e) {
				callAction(actionName)
				e.stopPropagation()
				e.preventDefault()
				return false
			}, {
				bubbles: false,
				passive: false,
			})
		}

		function addListenerWithCoord(eventType, actionName) {
			container.addEventListener(eventType, function (e) {
				const {touches} = e
				if (touches) {
					const touches0 = touches[0]
					callAction(actionName, touches0.pageX, touches0.pageY)
				} else {
					callAction(actionName, e.pageX, e.pageY)
				}
				e.stopPropagation()
				e.preventDefault()
				return false
			}, {
				bubbles: false,
				passive: false,
			})
		}

		let prevTarget = null
		let target
		let prevX = null
		let prevY = null
		let isVisiblePredicate
		let touched

		this.callAction = callAction
		function callAction(actionName, x, y) {
			if (!touched && actionName === mouseMoveName) {
				return
			}

			if (actionName === mouseUpName) {
				touched = false
				x = prevX
				y = prevY
				if (prevTarget && prevTarget[mouseOutName]) {
					prevTarget[mouseOutName](x, y)
				}
				target = prevTarget
				prevTarget = null
			} else {
				if (actionName === mouseDownName) {
					touched = true
				}

				if (!Number.isFinite(x) || !Number.isFinite(y)) {
					return
				}

				target = fixedTarget
				if (!target) {
					target = document.elementFromPoint(
						x - document.body.scrollLeft,
						y - document.body.scrollTop
					)

					while (true) {
						if (target == null) {
							return
						}

						if (isVisiblePredicate == null || isVisiblePredicate(target)) {
							break
						}

						target = target.parentNode
					}
				}

				if (target !== prevTarget) {
					if (prevTarget && prevTarget[mouseOutName]) {
						prevTarget[mouseOutName](x, y)
					}
					if (target[mouseEnterName]) {
						target[mouseEnterName](x, y)
					}
					if (target[mouseMoveName]) {
						target[mouseMoveName](x, y)
					}
				}

				prevX = x
				prevY = y
				prevTarget = target
			}

			if (target && target[actionName]) {
				target[actionName](x, y)
			}
		}

		Object.defineProperty(this, 'isVisiblePredicate', {
			get() {
				return isVisiblePredicate
			},
			set(value) {
				isVisiblePredicate = value
			},
			enumerable  : true,
			configurable: false
		})
	}

	static getRelativeCoord(relativeElement, globalCoord) {
		const rect = relativeElement.getBoundingClientRect()
		return {
			x: globalCoord.x - (rect.left + document.body.scrollLeft),
			y: globalCoord.y - (rect.top + document.body.scrollTop),
		}
	}
}

export default {
	TouchToMouse
}
