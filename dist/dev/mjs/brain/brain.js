import { CalcObjectBuilder, ObservableClass, registerSerializable } from 'webrain';
import { MainWindow } from './view/MainWindow';
export class Brain extends ObservableClass {
  // region readable
  // endregion
  // region writable
  // endregion
  // region calculable
  // endregion
  // region ISerializable
  serialize(serialize) {
    return {// auth: serialize(this.auth, { objectKeepUndefined: false }),
    };
  }

  deSerialize(deSerialize, serializedValue) {} // deSerialize(serializedValue.auth, null, {
  // 	valueFactory: () => this.auth,
  // })
  // endregion


}
Brain.uuid = '17a06236d0804f5eaf55dcad8e9a0628';
registerSerializable(Brain);
new CalcObjectBuilder(Brain.prototype).readable('mainWindow', {
  factory() {
    return new MainWindow();
  }

});