/* tslint:disable:no-construct use-primitive-type */
import {objectToString} from '../../../../main/common/log/objectToString'

declare const describe: any
declare const it: any
declare const assert: any

describe('common > log > objectToString', function() {
	it('base', function() {
		const error: any = new Error('TestError')
		const arr: any = [1, error]
		const obj = {
			arr,
			date: new Date(),
			Number: new Number(123),
			Boolean: new Boolean(false),
			string: 'string',
			String: new String('String'),
		}
		arr.obj = obj
		error.obj = obj

		const str = objectToString(obj)
		// console.log(str)
	})
})
