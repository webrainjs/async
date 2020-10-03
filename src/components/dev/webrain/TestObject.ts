import {
	noSubscribe,
	connectorFactory,
	calcPropertyFactory,
	calcPropertyFactoryX,
	CalcObjectBuilder,
	ObservableClass,
} from 'webrain'

export class TestObject extends ObservableClass {
	public value1: number = 1
	public value2: number = 2
	public readonly sum: number
	public readonly time: Date
}

new CalcObjectBuilder(TestObject.prototype)
	.writable('value1')
	.writable('value2')
	.nestedCalc('sum',
		connectorFactory({
			build: c => c
				.connect('val1', b => b.f(o => o.value1))
				.connect('val2', b => b.f(o => o.value2)),
		}),
		calcPropertyFactoryX({
			*calcFunc() {
				const state = this
				const input = state._this.input
				let value = state.value

				return (yield input.val1) + (yield input.val2)
			},
		}),
	)
	.nestedCalc('time', null,
		calcPropertyFactoryX({
			calcFunc() {
				const state = this
				const input = state._this.input
				let value = state.value

				return new Date()
			},
			deferredOptions: {
				autoInvalidateInterval: 1000,
			},
		}),
	)
