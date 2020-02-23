/* tslint:disable:no-conditional-assignment */
import { CalcObjectBuilder, calcPropertyFactory, connectorFactory, ObservableClass, resolvePath } from 'webrain';
import { getWindowController } from '../../main/browser/helpers/html-controllers/WindowController';
export class MainWindow extends ObservableClass {
  // public readonly brain: IBrain
  //
  // constructor(brain: IBrain) {
  // 	super()
  // 	this.brain = brain
  // }
  // region methods
  show() {
    const windowController = resolvePath(this)(o => o.windowController)();

    if (windowController) {
      windowController.show();
    }
  }

  minimize() {
    const windowController = resolvePath(this)(o => o.windowController)();

    if (windowController) {
      windowController.minimize();
    }
  } // endregion
  // region writable
  // endregion


}
new CalcObjectBuilder(MainWindow.prototype).writable('win').calc('windowController', connectorFactory({
  buildRule: c => c.connect('win', b => b.p('win'))
}), calcPropertyFactory({
  dependencies: d => d.invalidateOn(b => b.propertyAny()),

  calcFunc(state) {
    state.value = getWindowController(state.input.win);
  }

})).calcConnect('isVisible', b => b.p('windowController').p('isVisible')).calcConnect('isFocused', b => b.p('windowController').p('isFocused')); // .calc('lostFocusDate',
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