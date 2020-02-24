export function timeToString(time) {
	if (time == null) {
		return '--:--:--'
	}
	let negative
	if (time < 0) {
		negative = true
		time = -time
	}
	time = (time / 1000) | 0
	const sec = time % 60
	time = (time / 60) | 0
	const min = time % 60
	time = (time / 60) | 0
	const hour = time

	return (negative ? '-' : '') + `${
		hour
	}:${
		min.toString().padStart(2, '0')
	}:${
		sec.toString().padStart(2, '0')
	}`
}

export function dateTimeToString(date: Date) {
	if (!date) {
		return '--/--/---- --:--:-- --'
	}

	return [
		((date.getMonth() + 1) + '').padStart(2, '0'), '/',
		(date.getDate() + '').padStart(2, '0'), '/',
		date.getFullYear(), ' ',
		(((date.getHours() + 11) % 12 + 1) + '').padStart(2, '0'), ':',
		(date.getMinutes() + '').padStart(2, '0'), ':',
		(date.getSeconds() + '').padStart(2, '0'), ' ',
		date.getHours() > 12 ? 'PM' : 'AM',
	].join('')
}

export function timeOfDayToString(date: Date) {
	if (!date) {
		return '--:--:-- --'
	}

	return [
		(((date.getHours() + 11) % 12 + 1) + '').padStart(2, '0'), ':',
		(date.getMinutes() + '').padStart(2, '0'), ':',
		(date.getSeconds() + '').padStart(2, '0'), ' ',
		date.getHours() > 12 ? 'PM' : 'AM',
	].join('')
}

export function dateToString(date: Date) {
	if (!date) {
		return '--/--/----'
	}

	return [
		((date.getMonth() + 1) + '').padStart(2, '0'), '/',
		(date.getDate() + '').padStart(2, '0'), '/',
		date.getFullYear(), ' ',
	].join('')
}

export function getElapsedTime(date, now?: number) {
	if (!date) {
		return null
	}

	return (now || Date.now()) - date.getTime()
}

// Experimental, not worked yet
const contextPropName = 'afd7447c140f4e38bd2fb6e853784f5f'
export function runInContext<T>(win, func: (...args: any[]) => T, ...args): T {
	win[contextPropName] = {
		func,
		args,
	}
	const result = win.eval(`(function() {
		try {
			return { result: window['${contextPropName}'].func.apply(null, window['${contextPropName}'].args)
		}
		} catch (error) {
			return { error }
		}
	})()`)
	if (result.error) {
		throw result.error
	}
	return result.result
}

export function dateTimeToIdString(date: Date) {
	if (!date) {
		return null
	}

	return [
		date.getFullYear(), '_',
		((date.getMonth() + 1) + '').padStart(2, '0'), '_',
		(date.getDate() + '').padStart(2, '0'), '_',
		(date.getHours() + '').padStart(2, '0'), '_',
		(date.getMinutes() + '').padStart(2, '0'), '_',
		(date.getSeconds() + '').padStart(2, '0'),
	].join('')
}

export function nameToIdString(name) {
	if (!name) {
		return ''
	}

	return name.toLowerCase().replace(/\W+/g, '_')
}

// from: https://stackoverflow.com/a/28458409/5221762
function escapeHtml(text) {
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
