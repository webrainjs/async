// from: https://stackoverflow.com/a/28458409/5221762
export function escapeHtml(text) {
	return text.replace(/[&<"']/g, m => {
		switch (m) {
			case '&':
				return '&amp;'
			case '<':
				return '&lt;'
			case '"':
				return '&quot;'
			default:
				return '&#039;'
		}
	})
}
