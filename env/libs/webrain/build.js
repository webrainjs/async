const {buildLib} = require('../helpers')

// const fileOutput = path.resolve('static/polyfills/polyfill-custom.js')
// const fileOutput = path.resolve(__dirname, './bundle.js')

buildLib({
	fileInput : require.resolve('./all.js'),
	fileOutput: 'static/libs/webrain.js',
	name      : 'webrain',
})
	.then(() => {
		console.log('webrain build completed')
	})
