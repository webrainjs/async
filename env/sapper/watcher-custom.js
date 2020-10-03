const watcherExt = require('./watcher-ext')

module.exports.watch = function watch(opts) {
	return watcherExt.watch({
		watchFiles: [
			// 'src/styles/**/*.scss',
			'static/*',
		],
		live: true,
		...opts,
	})
}
