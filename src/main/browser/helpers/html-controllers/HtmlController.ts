import {getPatentElement} from './helpers'

export class HtmlController {
	protected readonly _container
	private readonly _unsubscribers = []

	constructor(container) {
		this._container = container
	}

	public addEventListener(
		containerMatches: (element) => boolean,
		eventName: string,
		handler: (...args) => any,
		options?: any,
	) {
		const self = this
		function _handler() {
			let container
			if (containerMatches) {
				container = getPatentElement(arguments[0].target, containerMatches)
				if (!container) {
					return null
				}

				arguments[0].container = container
			} else {
				arguments[0].container = container = self._container
			}

			return handler.apply(container, arguments)
		}

		options = {
			passive: false,
			...options,
		}

		this._container.addEventListener(eventName, _handler, options)
		this._unsubscribers.push(() => {
			this._container.removeEventListener(eventName, _handler, options)
		})
	}

	public destroy() {
		const { _unsubscribers } = this
		for (let i = 0, len = _unsubscribers.length; i < len; i++) {
			_unsubscribers[i]()
		}
		this._unsubscribers.length = 0
	}
}

// this._container.addEventListener('click', function (event) {
// 	if (event.target.nodeName === 'BUTTON'
// 		|| event.target.nodeName === 'A'
// 		|| event.target.classList.contains('js-sound-click')
// 	) {
// 		sounds.click.play()
// 	}
// })
