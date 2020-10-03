import constants from '../../app/templates/constants'
import templates from '../../helpers/templates'

function space({
	type,
	side,
	size,
}) {
	const result = {}
	result[`${type}-${side}`] = size
	return result
}

function spaces({
	type,
	name,
	size,
}) {
	const result = []

	result.push([0, `.${type}-all-${name}`, {
		...space({type, side: 'left', size}),
		...space({type, side: 'right', size}),
		...space({type, side: 'top', size}),
		...space({type, side: 'bottom', size}),
	}])

	result.push([1, `.${type}-left-right-${name}`, {
		...space({type, side: 'left', size}),
		...space({type, side: 'right', size}),
	}])

	result.push([2, `.${type}-top-bottom-${name}`, {
		...space({type, side: 'top', size}),
		...space({type, side: 'bottom', size}),
	}])

	result.push([3, `.${type}-left-${name}`, space({type, side: 'left', size})])
	result.push([4, `.${type}-right-${name}`, space({type, side: 'right', size})])
	result.push([5, `.${type}-top-${name}`, space({type, side: 'top', size})])
	result.push([6, `.${type}-bottom-${name}`, space({type, side: 'bottom', size})])

	return result
}

const rules = [
	...spaces({type: 'padding', name: 'double', size: constants.space.double}),
	...spaces({type: 'padding', name: 'base', size: constants.space.base}),
	...spaces({type: 'padding', name: 'half', size: constants.space.half}),
	...spaces({type: 'padding', name: 'quarter', size: constants.space.quarter}),
	...spaces({type: 'padding', name: 'zero', size: 0}),
	...spaces({type: 'margin', name: 'double', size: constants.space.double}),
	...spaces({type: 'margin', name: 'base', size: constants.space.base}),
	...spaces({type: 'margin', name: 'half', size: constants.space.half}),
	...spaces({type: 'margin', name: 'quarter', size: constants.space.quarter}),
	...spaces({type: 'margin', name: 'zero', size: 0}),
]
	.map((o, i) => {
		o.push(i)
		return o
	})
	.sort((o1, o2) => {
		let i
		if ((i = o1[0] - o2[0]) !== 0) {
			return i
		}
		return o1[3] - o2[3]
	})
	.reduce((a, o) => {
		a[o[1]] = o[2]
		return a
	}, {})

module.exports = [
	templates.important(rules),
]
