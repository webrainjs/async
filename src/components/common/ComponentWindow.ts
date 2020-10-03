import {WindowController, WindowControllerFactory} from '../../main/browser/helpers/html-controllers/WindowController'

export class ComponentWindow {
	private readonly _windowControllerFactory: WindowControllerFactory
	private readonly _componentClass: new () => any
	private readonly _options: any
	private _props: any

	// resizable=no is not worked in browsers because: https://stackoverflow.com/a/15481333/5221762
	constructor({
		windowControllerFactory,
		componentClass,
		options,
		props,
	}: {
		windowControllerFactory: WindowControllerFactory,
		componentClass: new () => any,
		options?: any,
		props?: any,
	}) {
		this._windowControllerFactory = windowControllerFactory
		this._componentClass = componentClass
		this._options = options
		this._props = props
		this._windowControllerFactory.loadObservable.subscribe(async windowController => {
			const destroy = await this.attachComponent({
				windowController,
				componentClass: this._componentClass,
				options       : {
					...this._options,
					props: this._props,
				},
			})
			if (destroy) {
				windowController.closeObservable.subscribe(destroy)
			}
		})
	}

	public get windowController() {
		return this._windowControllerFactory.windowController
	}

	private _component

	// async needed for bypass slows down performance on electron
	// eslint-disable-next-line require-await
	private async attachComponent({
		windowController,
		componentClass,
		options,
	}: {
		windowController: WindowController,
		componentClass: new (...args: any[]) => any,
		options: any,
	}) {
		// eslint-disable-next-line new-cap
		const component = new componentClass({
			...options,
			target: (windowController.win as any).container,
			props : {
				win: windowController.win,
				...options && options.props,
			},
		})

		this._component = component

		return () => {
			if (this._component === component) {
				this._component = null
			}
			if (windowController.isDestroyed) {
				return
			}
			component.$destroy()
		}
	}

	public setProps(props: any) {
		this._props = props
		if (this._component) {
			this._component.$set(this._props)
		}
	}

	public close() {
		this._windowControllerFactory.close()
	}
}
