export function createHtmlElementMatches({
	tagNames,
	classNames,
	selector,
}: {
	tagNames?: string | string[],
	classNames?: string | string[],
	selector?: string,
}) {
	return element => {
		if (tagNames) {
			if (typeof tagNames === 'string') {
				if (element.nodeName === tagNames) {
					return true
				}
			} else if (tagNames.indexOf(element.nodeName) >= 0) {
				return true
			}
		}

		if (classNames) {
			if (typeof classNames === 'string') {
				if (element.classList.contains(classNames)) {
					return true
				}
			} else if (classNames.some(className => element.classList.contains(className))) {
				return true
			}
		}

		if (selector && element.matches(selector)) {
			return true
		}

		return false
	}
}

export function getPatentElement(element, matchesFunc: (element) => boolean) {
	while (element && !matchesFunc(element)) {
		element = element.parentElement
	}

	return element
}

export function windowIsDestroyed(win: Window) {
	try {
		return !win || win.closed || !win.document
	} catch (ex) {
		return true
	}
}