function webviewController(webview) {
	window.addEventListener('message', function(e) {
		console.debug(e.data)
		if (e.data === 'minimize') {
			chrome.app.window.current().minimize();
		}
	})

	webview.addEventListener('loadstop', e => {
		console.debug('loadstop: ', e)
		e.target.contentWindow.postMessage('init', '*')
	})
}

webviewController(webview)
