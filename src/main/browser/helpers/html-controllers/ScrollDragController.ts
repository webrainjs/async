import {HtmlController} from './HtmlController'

export class ScrollDragController extends HtmlController {
	private _moved: boolean
	private _pushed
	private _scroller
	private _newScrollX
	private _newScrollY
	private _lastClientX
	private _lastClientY
	private _throttlePixels
	private readonly _scrollMatches
	private readonly _noDragMatches

	constructor({
		container,
		scrollMatches,
		noDragMatches,
		throttlePixels = 5,
	}: {
		container,
		scrollMatches: (element) => boolean,
		noDragMatches?: (element) => boolean,
		throttlePixels?: number,
	}) {
		super(container)

		this._throttlePixels = throttlePixels
		this._scrollMatches = scrollMatches
		this._noDragMatches = noDragMatches

		this.addEventListener(scrollMatches, 'mousedown', this.mousedown.bind(this))
		this.addEventListener(scrollMatches, 'mousemove', this.mousemove.bind(this))
		this.addEventListener(null, 'mouseup', this.mouseup.bind(this))
		this.addEventListener(null, 'click', this.click.bind(this))
	}

	private mousedown(event) {
		const scroll = event.container
		if (scroll && (!this._noDragMatches
			|| !this._noDragMatches(event.target)
			|| document.elementFromPoint(event.pageX, event.pageY) === scroll
		)) {
			this._pushed = 1
			this._moved = false
			this._lastClientX = event.clientX
			this._lastClientY = event.clientY

			// event.preventDefault()
		}
	}

	private mouseup(event) {
		this._pushed = 0
		if (this._moved) {
			event.preventDefault()
		}
	}

	private click(event) {
		if (this._moved) {
			event.preventDefault()
			this._moved = false
		}
	}

	private mousemove(event) {
		const scroll = event.container
		if (scroll && this._pushed
			&& (
				Math.abs(this._lastClientX - event.clientX) > this._throttlePixels
				|| Math.abs(this._lastClientY - event.clientY) > this._throttlePixels
			)
		) {
			this._moved = true
;(this._scroller = scroll._scroller || scroll).scrollLeft
				-= this._newScrollX = (-this._lastClientX + (this._lastClientX = event.clientX))
			this._scroller.scrollTop
				-= this._newScrollY = (-this._lastClientY + (this._lastClientY = event.clientY))
			if (scroll === document.body) {
				(this._scroller = document.documentElement).scrollLeft -= this._newScrollX
				this._scroller.scrollTop -= this._newScrollY
			}
		}
	}
}
