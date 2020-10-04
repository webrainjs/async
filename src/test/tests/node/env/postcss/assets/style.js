import path from 'path'
const css = requireCss('./style.css')

const obj = {
	test1: 'test 1',
}

export default {
	css,
	test1: obj?.test1,
	...{
		test2: 'test 2',
	},
}
