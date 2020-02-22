import {
	CalcObjectBuilder,
	calcPropertyFactory,
	connectorFactory,
	ObservableClass,
} from 'webrain/src/main/common/index.ts'

export class TestObject extends ObservableClass {
	public value1: number = 1
	public value2: number = 2
	public readonly sum: number
	public readonly time: Date
}

new CalcObjectBuilder(TestObject.prototype)
	.writable('value1')
	.writable('value2')
	.calc('sum',
		connectorFactory({
			buildRule: c => c
				.connect('val1', b => b.p('value1'))
				.connect('val2', b => b.p('value2')),
		}),
		calcPropertyFactory({
			dependencies: d => d.invalidateOn(b => b.propertyAny()),
			calcFunc(state) {
				state.value = state.input.val1 + state.input.val2
			},
		}),
	)
	.calc('time', null,
		calcPropertyFactory({
			dependencies: d => d.invalidateOn(b => b.propertyAny()),
			calcFunc(state) {
				state.value = new Date()
			},
			calcOptions: {
				autoInvalidateInterval: 1000,
			},
		}),
	)
