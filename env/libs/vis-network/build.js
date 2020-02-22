const {buildLib} = require('../helpers')

// const fileOutput = path.resolve('static/polyfills/polyfill-custom.js')
// const fileOutput = path.resolve(__dirname, './bundle.js')

buildLib({
	fileInput : require.resolve('./all.js'),
	fileOutput: 'static/libs/vis-network.js',
	name      : 'vis',
})
	.then(() => {
		console.log('vis-network build completed')
	})
