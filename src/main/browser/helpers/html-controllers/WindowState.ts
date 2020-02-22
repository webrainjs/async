import {
	CalcObjectBuilder,
	IObservable,
	ISubject,
	ObservableClass,
	Subject,
} from 'webrain/src/main/common/index.ts'
import {windowIsDestroyed} from './helpers'

export class WindowState extends ObservableClass {
	public win: Window
	public lastResizeTime: number
	public width: number
	public height: number
	public borderWidth: number
	public borderHeight: number

	constructor(win: Window) {
		super()

		this.win = win

		this.init()

		this.onResize = this.onResize.bind(this)
		this.onClose = this.onClose.bind(this)

		this.bind()
	}

	// region init

	private async init() {
		await this.waitLoad()
		this._init()
	}

	private _init() {
		if (!this.win) {
			return
		}

		if (typeof this.width === 'undefined') {
			this.width = this.win.outerWidth
		}
		if (typeof this.height === 'undefined') {
			this.height = this.win.outerHeight
		}
		this.borderWidth = this.win.outerWidth - this.win.innerWidth
		this.borderHeight = this.win.outerHeight - this.win.innerHeight
		console.log(`Window border size: ${this.borderWidth}, ${this.borderHeight}`)
	}

	private async _waitLoad() {
		await new Promise(resolve => {
			if (!this.win) {
				resolve()
				return
			}

			this.win.document.body.onload = resolve
			// this.win.addEventListener('load', resolve, false)
			// this.win.addEventListener('DOMContentLoaded', resolve, false)
			if (this.win.document.readyState === 'complete') {
				resolve()
			}
		})
		await new Promise(resolve => {
			if (!this.win) {
				resolve()
				return
			}

			this.win.addEventListener('resize', resolve, false)
			if (this.win.innerWidth !== 0
				&& this.win.innerHeight !== 0
				&& this.win.outerWidth !== 0
				&& this.win.outerHeight !== 0
			) {
				resolve()
			}
		})

		this._waitLoadTask = null
	}

	private _waitLoadTask
	public async waitLoad() {
		if (!this._waitLoadTask) {
			this._waitLoadTask = this._waitLoad()
		}
		return this._waitLoadTask
	}

	// endregion

	// region Resize

	private _resizeSubject: ISubject<any>

	public get resizeObservable(): IObservable<any> {
		let {_resizeSubject} = this
		if (!_resizeSubject) {
			this._resizeSubject = _resizeSubject = new Subject()
		}
		return _resizeSubject
	}

	private onResize(e) {
		const {_resizeSubject} = this
		if (_resizeSubject) {
			_resizeSubject.emit(e)
		}

		if (!this.win) {
			return
		}

		// fix unwanted auto resize, eg. after window.moveTo()
		if (this.lastResizeTime	&& Date.now() - this.lastResizeTime < 1000)
		{
			if (this.win.outerWidth !== this.width || this.win.outerHeight !== this.height) {
				this.win.resizeTo(this.width, this.height)
			}
		} else {
			this.width = this.win.outerWidth
			this.height = this.win.outerHeight
			this.lastResizeTime = Date.now()
		}
	}
	
	// endregion

	// region Close

	private _closeSubject: ISubject<any>

	public get closeObservable(): IObservable<any> {
		let {_closeSubject} = this
		if (!_closeSubject) {
			this._closeSubject = _closeSubject = new Subject()
		}
		return _closeSubject
	}

	private onClose() {
		console.log('Window closing')
		this.win = null
		const {_closeSubject} = this
		if (_closeSubject) {
			_closeSubject.emit(null)
		}
		console.log('Window closed')
	}
	
	// endregion

	// region methods

	public get isOpened() {
		const {win} = this
		if (windowIsDestroyed(win)) {
			return true
		} else {
			this.win = null
			if (win && win.close) {
				win.close()
			}
			return false
		}
	}

	public show() {
		if (this.isOpened) {
			if ((this.win as any).restore) {
				(this.win as any).restore()
			}
			this.win.focus()
		}
	}

	public minimize() {
		if (this.isOpened && (this.win as any).minimize) {
			(this.win as any).minimize()
		}
	}

	public close() {
		if (this.isOpened) {
			const {win} = this
			try {
				this.unbind()
				this.onClose()
			} finally {
				win.close()
			}
		}
	}

	// endregion

	// region writable

	public isVisible: boolean
	public isFocused: boolean

	// endregion

	public bind() {
		this.bindResize()
		this.win.addEventListener('beforeunload', this.onClose)
		this._setUnsubscriber('isVisible', bindVisibleChange(this.win, value => {
			this.isVisible = value
		}))
		this._setUnsubscriber('isFocused', bindFocusChange(this.win, value => {
			this.isFocused = value
		}))
	}

	public unbind() {
		this.unbindResize()
		this.win.removeEventListener('beforeunload', this.onClose)
		this._setUnsubscriber('isVisible', null)
		this._setUnsubscriber('isFocused', null)
	}

	public bindResize() {
		this.win.addEventListener('resize', this.onResize)
	}

	public unbindResize() {
		this.win.removeEventListener('resize', this.onResize)
	}

	public resizeToInner(width: number, height: number) {
		if (!this.isOpened) {
			return
		}

		return this.resizeToOuter(width + this.borderWidth, height + this.borderHeight)
	}

	public resizeToOuter(width: number, height: number) {
		if (!this.isOpened) {
			return
		}

		// chrome has window width/height limitation = 211/103px
		// see also: https://developer.mozilla.org/en-US/docs/Web/API/Window/open
		width = Math.max(211, width)
		height = Math.max(103, height)
		this.width = width
		this.height = height
		this.lastResizeTime = Date.now()
		return this.win.resizeTo(width, height)
	}
}

new CalcObjectBuilder(WindowState.prototype)
	.writable('isVisible')
	.writable('isFocused')

const WINDOW_STATE_PROPERTY_NAME = '13883806ede0481c92c41c2cda3d99c3'

export function getWindowState(window: Window): WindowState {
	if (!windowIsDestroyed(window)) {
		return null
	}

	let state: WindowState = window[WINDOW_STATE_PROPERTY_NAME]
	if (state == null) {
		Object.defineProperty(window, WINDOW_STATE_PROPERTY_NAME, {
			enumerable: false,
			configurable: false,
			writable: false,
			value: state = new WindowState(window),
		})
	}

	return state
}

// from: https://stackoverflow.com/a/1060034/5221762
function bindVisibleChange(window: Window, handler: (visible: boolean) => void) {
	/* tslint:disable:no-conditional-assignment */
	let hidden = 'hidden'
	let unsubscribe

	// Standards:
	if (hidden in window.document) {
		window.document.addEventListener('visibilitychange', onchange)
		unsubscribe = () => { window.document.removeEventListener('visibilitychange', onchange) }
	} else if ((hidden = 'mozHidden') in window.document) {
		window.document.addEventListener('mozvisibilitychange', onchange)
		unsubscribe = () => { window.document.removeEventListener('mozvisibilitychange', onchange) }
	} else if ((hidden = 'webkitHidden') in window.document) {
		window.document.addEventListener('webkitvisibilitychange', onchange)
		unsubscribe = () => { window.document.removeEventListener('webkitvisibilitychange', onchange) }
	} else if ((hidden = 'msHidden') in window.document) {
		window.document.addEventListener('msvisibilitychange', onchange)
		unsubscribe = () => { window.document.removeEventListener('msvisibilitychange', onchange) }
	} else if ('onfocusin' in window.document) {
		// IE 9 and lower:
		(window.document as any).onfocusin = (window.document as any).onfocusout = onchange
		unsubscribe = () => { (window.document as any).onfocusin = (window.document as any).onfocusout = null }
	} else {
		// All others:
		window.onpageshow = window.onpagehide = window.onfocus = window.onblur = onchange
		unsubscribe = () => { window.onpageshow = window.onpagehide = window.onfocus = window.onblur = null }
	}

	function onchange(evt) {
		const v = 'visible'
		const h = 'hidden'
		const evtMap = {
			focus: v,
			focusin: v,
			pageshow: v,
			blur: h,
			focusout: h,
			pagehide: h,
		}

		evt = evt || window.event
		if (evt.type in evtMap) {
			handler(evtMap[evt.type] === 'visible')
		} else {
			handler(!this[hidden])
		}
	}

	// set the initial state (but only if browser supports the Page Visibility API)
	if (window.document[hidden] !== undefined) {
		onchange({type: window.document[hidden] ? 'blur' : 'focus'})
	}

	return unsubscribe
}

function bindFocusChange(window: Window, handler: (focused: boolean) => void) {
	const onFocus = () => {
		handler(true)
	}
	const onBlur = () => {
		handler(false)
	}

	window.addEventListener('focus', onFocus)
	window.addEventListener('blur', onBlur)

	return () => {
		window.removeEventListener('focus', onFocus)
		window.removeEventListener('blur', onBlur)
	}
}
