/* tslint:disable:no-conditional-assignment */
import {
	DependCalcObjectBuilder,
	noSubscribe,
	dependConnectorFactory,
	dependCalcPropertyFactory,
	dependCalcPropertyFactoryX,
	delay,
	IDeSerializeValue,
	ISerializable,
	ISerializedObject,
	ISerializeValue,
	IUnsubscribeOrVoid,
	ObservableClass,
	registerSerializable,
	resolvePath,
} from 'webrain'
import {getWindowController, WindowController} from '../../main/browser/helpers/html-controllers/WindowController'
import {IBrain} from '../contracts'

export class MainWindow extends ObservableClass {
	// public readonly brain: IBrain
	//
	// constructor(brain: IBrain) {
	// 	super()
	// 	this.brain = brain
	// }

	// region methods

	public show() {
		const windowController = resolvePath(this)(o => o.windowController)() as WindowController
		if (windowController) {
			windowController.show()
		}
	}

	public minimize() {
		const windowController = resolvePath(this)(o => o.windowController)() as WindowController
		if (windowController) {
			windowController.minimize()
		}
	}

	public hideOrMinimize() {
		const windowController = resolvePath(this)(o => o.windowController)() as WindowController
		if (windowController) {
			windowController.hideOrMinimize()
		}
	}

	// endregion

	// region writable

	public win: Window
	public isVisible: boolean
	public isFocused: boolean

	// endregion

	// region calculable

	public readonly lostFocusDate: Date
	public readonly windowController: WindowController

	// endregion
}

new DependCalcObjectBuilder(MainWindow.prototype)
	.writable('win')
	.nestedCalc('windowController',
		dependConnectorFactory({
			build: c => c
				.connectPath('win', b => b.f(o => o.win)),
		}),
		dependCalcPropertyFactoryX({
			*calcFunc() {
				const state = this
				const input = state._this.input
				let value = state.value

				return getWindowController(yield input.win)
			},
		}),
	)
	.connectPath('isVisible', b => b.f(o => o.windowController).f(o => o.isVisible))
	.connectPath('isFocused', b => b.f(o => o.windowController).f(o => o.isFocused))
	// .calc('lostFocusDate',
	// 	connectorFactory({
	// 		buildRule: c => c
	// 			.connect('isFocused', b => b.p('isFocused')),
	// 	}),
	// 	calcPropertyFactory({
	// 		dependencies: d => d.invalidateOn(b => b.propertyAny()),
	// 		calcFunc(state) {
	// 			if (state.input.isFocused) {
	// 				state.value = null
	// 			} else {
	// 				if (!state.value) {
	// 					state.value = new Date()
	// 				}
	// 			}
	// 		},
	// 	}),
	// )
