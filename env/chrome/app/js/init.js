function webviewController(webview) {
	window.addEventListener('message', function(e) {
		console.log(e.data)
		if (e.data === 'minimize') {
			chrome.app.window.current().minimize();
		}
	})

	webview.addEventListener('loadstop', e => {
		console.log('loadstop: ', e)
		e.target.contentWindow.postMessage('init', '*')
	})
}

webviewController(webview)
